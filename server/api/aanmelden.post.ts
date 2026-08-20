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

  const { website, ...answers } = body.data

  // Silently accept honeypot hits so bots get no signal.
  if (isSpam({ website })) {
    // `as const`, or `ok` widens to boolean and the result stops being a
    // discriminated union the forms can branch on.
    return { ok: true as const }
  }

  const handoff = await postToPortal(
    event,
    '/register-external-full',
    signupPayload(answers),
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

type Answers = Omit<z.infer<typeof schema>, 'website'>

/**
 * Maps the wizard's answers onto `register-external-full`, which is the same
 * body the Gravity Forms webhook posts today — see the webhook's field list on
 * bijlesbeta.nl, and `RegisteredUserController::storeExternalFull` for what it
 * does with each key.
 *
 * Two shapes matter. `student_subjects_1` is a comma-separated list of numeric
 * subject ids, not names; the controller reads the first non-empty of the
 * three `_1.._3` keys, so only `_1` is sent. And the hours question arrives on
 * one of two mutually exclusive keys depending on the lesson kind — weekly as
 * a `basis`/`standard`/`premium` band, anything else as a plain count.
 *
 * Four answers the wizard asks for still have no field on the endpoint: the
 * preferred contact method, and the "Anders, namelijk…" wording behind lesson
 * kind, level and subject. They are appended to `location_indication` under
 * labels rather than dropped — it is the only free-text key with no length cap,
 * and it already carries the visitor's own notes about how the lessons should
 * work. They do not belong in `account_known_via`, which means "how did you
 * hear about us", so that key carries only the answer to that question.
 *
 * The school used to be squeezed in there too. It has its own column on the
 * portal and its own field on the endpoint now, so it is sent properly and the
 * office sees it where the admin person form shows it.
 *
 * The right fix is for the endpoint to grow fields for them, or for the wizard
 * to stop asking; see the note in CLAUDE.md.
 *
 * `street`, `city` and the two PDOK codes are deliberately not sent — the
 * portal re-derives the address from postcode and house number in its own job.
 */
function signupPayload(v: Answers) {
  const notes = [
    // The label, not the code. `location_indication` is an editable field on
    // the portal's person page, so an admin was reading `at_home` off a form
    // meant for the visitor's own words.
    label(LOCATIONS, v.location),
    v.location === 'anders' && v.locationNote && `Toelichting: ${v.locationNote}`,
    v.contactMethod && `Contact via: ${v.contactMethod}`,
    v.level === 'different' && v.levelOther && `Niveau: ${v.levelOther}`,
    v.subjectOther && `Ander vak: ${v.subjectOther}`,
    v.lessonKind === 'different' && v.lessonKindNote && `Soort bijles: ${v.lessonKindNote}`,
  ].filter(Boolean)

  return portalPayload({
    student_first_name: v.studentFirstName,
    student_phone_number: normalisePhone(v.studentPhone) ?? v.studentPhone,
    student_level: levelId(v.level),
    student_subjects_1: subjectIds(v.subjects),
    student_year: v.schoolYear,
    /*
      A real field on the endpoint since `register-external-full` learned about
      `receiver_information.school`. Guarded on the answer it belongs to: the
      question is only asked when the lessons happen at school, and switching
      away from that answer used to leave a stale school name in the payload.
    */
    student_school: v.location === 'at_school' ? v.school : '',

    student_interval_type: v.lessonKind,
    // Only one of these two is ever asked, and the portal prefers the band.
    student_weekly_amount_indication: v.lessonKind === 'weekly' ? v.weeklyHours : '',
    student_incidental_amount_indication: v.lessonKind === 'weekly' ? '' : v.totalHours,

    location_indication: notes.join(' — '),
    date_time_indication: v.availability,

    account_name: `${v.contactFirstName} ${v.contactLastName}`.trim(),
    account_email: v.email,
    account_phone_number: v.contactPhone ? normalisePhone(v.contactPhone) ?? v.contactPhone : '',
    account_postcode: v.postalCode,
    account_housenumber: v.houseNumber,
    account_address_comment: v.addressNote,
    account_known_via: v.heardAbout,
  })
}

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
const LOCATIONS: Record<string, string> = {
  at_home: 'Thuis',
  library: 'Openbare locaties (zoals een bieb)',
  at_school: 'Op school',
  online: 'Online',
  anders: 'Anders',
}
const LEVELS: Record<string, string> = {
  1: 'vmbo',
  2: 'havo',
  3: 'vwo',
  4: 'basisschool',
  5: 'hbo',
  different: 'Anders',
}

/** Falls back to the raw value, so an unmapped code is shown rather than hidden. */
function label(map: Record<string, string>, value: string): string {
  return value ? map[value] ?? value : ''
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
    ['Soort bijles', label(LESSON_KINDS, v.lessonKind)],
    ['Toelichting bijles', v.lessonKindNote],
    ['Aantal uur', v.lessonKind === 'weekly'
      ? label(WEEKLY_HOURS, v.weeklyHours)
      : label(TOTAL_HOURS, v.totalHours)],
    ['Beschikbaarheid', v.availability],
    ['Locatie', label(LOCATIONS, v.location)],
    ['Toelichting locatie', v.locationNote],
    ['School', v.school],

    ['Schooljaar', v.schoolYear],
    ['Niveau', label(LEVELS, v.level)],
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
