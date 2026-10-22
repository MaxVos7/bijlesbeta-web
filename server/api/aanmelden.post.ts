import { z } from 'zod'
import type { Row } from '../utils/office-copy'

/**
 * Signup payload, matching the Gravity Form "Aanmeldformulier" that currently
 * runs on bijlesbeta.nl. See `app/data/signup.ts` for the Gravity Forms field
 * id behind each key.
 *
 * The rules themselves are `SIGNUP_RULES` in `shared/utils/form-rules.ts`,
 * where the wizard reads them too — every length and shape here is the
 * portal's, and the two halves must not disagree about them. This route no
 * longer spells them out a second time; `ruleFields` turns the table into the
 * schema it used to be written out as.
 *
 * Fields that the wizard only reveals conditionally are optional there — the
 * client decides which ones apply, and rejecting a submission because an
 * unasked question is blank would strand the visitor.
 */
const schema = z.object({
  ...ruleFields(SIGNUP_RULES),
  subjects: ruleList(SIGNUP_SUBJECTS_RULE),
  consent: z.literal(true),
  // The draft this submission finishes, when the wizard saved one along the
  // way. Not a question, so not in `SIGNUP_RULES`.
  draftToken: z.string().max(64).optional(),
})

export default defineEventHandler(async (event) => {
  rateLimit(event)

  const body = await readValidatedBody(event, schema.safeParse)

  if (!body.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { message: 'Controleer de ingevulde gegevens en probeer het opnieuw.' },
    })
  }

  const { website, draftToken, ...answers } = body.data

  // Silently accept honeypot hits so bots get no signal.
  if (isSpam({ website })) {
    // `as const`, or `ok` widens to boolean and the result stops being a
    // discriminated union the forms can branch on.
    return { ok: true as const }
  }

  const handoff = await postToPortal(
    event,
    '/register-external-full',
    { ...signupPayload(answers), draft_token: draftToken ?? null },
  )

  const { officeEmail } = useRuntimeConfig(event)

  const delivered = await sendOfficeCopy(event, {
    to: officeEmail,
    kind: 'Aanmelding',
    from: {
      name: `${answers.contactFirstName} ${answers.contactLastName}`.trim(),
      email: answers.email,
    },
    outcome: handoff.ok ? { ok: true } : { ok: false, reason: handoff.reason },
    rows: signupRows(answers),
  })

  return deliveryResult(handoff, delivered,
    'We konden je aanmelding niet versturen. Bel of app ons even, dan plannen we je proefles direct in.',
  )
})

type Answers = SignupAnswers

/*
  Readable versions of the wizard's coded answers, for the office copy only.

  The codes are the portal's own enum values, which is why they are worth
  translating: `premium`, `at_school` and a bare `2` for havo tell whoever
  reads the mail nothing. The wording matches the option labels in
  `app/data/signup.ts` — if a question's options change there, change them
  here too, or the copy quietly describes an answer nobody was offered.
*/
const LESSON_KINDS: Record<string, string> = {
  weekly: 'Wekelijks bijles',
  incidental: 'Af en toe bijles (bijvoorbeeld voor toetsen of examens)',
  different: 'Anders',
}
const WEEKLY_HOURS: Record<string, string> = {
  basis: '1 uur per week',
  standard: '2 uur per week',
  premium: 'Meer dan 2 uur per week',
}
const TOTAL_HOURS: Record<string, string> = {
  1: '1 uur',
  2: 'tussen de 2 en 5 uur',
  3: 'meer dan 5 uur',
}
const LEVELS: Record<string, string> = {
  1: 'vmbo',
  2: 'havo',
  3: 'vwo',
  4: 'basisschool',
  5: 'hbo',
  different: 'Anders',
}

/**
 * The whole submission, in the order the wizard asks for it.
 *
 * This is deliberately more than the portal gets. `street` and `city` are here
 * even though the portal re-derives them, and so are the five answers that
 * have no field on the endpoint and travel squeezed into `location_indication`
 * — in the office copy they get their own lines. If the portal refused the
 * submission, this list is what somebody re-keys from.
 */
function signupRows(v: Answers): Row[] {
  return [
    ['Soort bijles', answerLabel(LESSON_KINDS, v.lessonKind)],
    ['Toelichting bijles', v.lessonKindNote],
    ['Aantal uur', v.lessonKind === 'weekly'
      ? answerLabel(WEEKLY_HOURS, v.weeklyHours)
      : answerLabel(TOTAL_HOURS, v.totalHours)],
    ['Beschikbaarheid', v.availability],
    ['Locatie', answerLabel(LOCATIONS, v.location)],
    ['Toelichting locatie', v.locationNote],
    ['School', v.school],

    ['Schooljaar', v.schoolYear],
    ['Niveau', answerLabel(LEVELS, v.level)],
    ['Ander niveau', v.levelOther],
    ['Bijlesvakken', v.subjects],
    ['Ander vak', v.subjectOther],

    ['Voornaam leerling', v.studentFirstName],
    ['Telefoonnummer leerling', normalisePhone(v.studentPhone) ?? v.studentPhone],
    ['Contact opnemen via', v.contactMethod],

    ['Contactpersoon', `${v.contactFirstName} ${v.contactLastName}`.trim()],
    ['E-mailadres', v.email],
    ['Telefoonnummer contactpersoon', v.contactPhone
      ? normalisePhone(v.contactPhone) ?? v.contactPhone
      : ''],
    ['Adres', [v.street, v.houseNumber].filter(Boolean).join(' ')],
    ['Postcode en plaats', [v.postalCode, v.city].filter(Boolean).join(' ')],
    ['Toelichting adres', v.addressNote],
    ['Ken ons van', v.heardAbout],
  ]
}
