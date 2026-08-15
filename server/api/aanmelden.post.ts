import { z } from 'zod'

/**
 * Signup payload, matching the Gravity Form "Aanmeldformulier" that currently
 * runs on bijlesbeta.nl. See `app/data/signup.ts` for the Gravity Forms field
 * id behind each key.
 *
 * Fields that the wizard only reveals conditionally are optional here — the
 * client decides which ones apply, and rejecting a submission because an
 * unasked question is blank would strand the visitor.
 */
const optional = (max: number) => z.string().trim().max(max).optional().default('')

const schema = z.object({
  // Step 1 — Bijles
  lessonKind: z.string().trim().min(1).max(40),
  lessonKindNote: optional(2000),
  weeklyHours: optional(40),
  totalHours: optional(40),
  availability: z.string().trim().min(1).max(500),
  location: z.string().trim().min(1).max(40),
  locationNote: optional(500),
  school: optional(200),

  // Step 2 — Vak en niveau
  schoolYear: z.string().trim().min(1).max(20),
  level: z.string().trim().min(1).max(40),
  levelOther: optional(120),
  subjects: z.array(z.string().trim().max(60)).min(1).max(10),
  subjectOther: optional(200),

  // Step 3 — Kennismaking en proefles
  studentFirstName: z.string().trim().min(1).max(120),
  studentPhone: z.string().trim().min(1).max(40),
  contactMethod: z.string().trim().min(1).max(60),

  // Step 4 — Factuurgegevens
  contactFirstName: z.string().trim().min(1).max(120),
  contactLastName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  postalCode: z.string().trim().min(1).max(20),
  houseNumber: z.string().trim().min(1).max(20),
  street: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(120),
  // Filled by the PDOK lookup, not by the visitor — absent if it didn't resolve.
  cityCode: optional(10),
  municipalityCode: optional(10),
  addressNote: optional(500),
  contactPhone: optional(40),
  heardAbout: z.string().trim().min(1).max(200),

  consent: z.literal(true),

  website: z.string().max(200).optional().default(''),
})

export default defineEventHandler(async (event) => {
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
    return { ok: true }
  }

  await postToPortal(event, '/register-external-full', signupPayload(answers))

  return { ok: true }
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
 * Five answers the wizard asks for have no field on the endpoint at all: the
 * school name, the preferred contact method, and the "Anders, namelijk…"
 * wording behind lesson kind, level and subject. They are appended to
 * `location_indication` under labels rather than dropped — it is the only
 * free-text key with no length cap, and it already carries the visitor's own
 * notes about how the lessons should work. They do not belong in
 * `account_known_via`, which means "how did you hear about us", so that key
 * carries only the answer to that question.
 *
 * The right fix is for the endpoint to grow fields for them, or for the wizard
 * to stop asking; see the note in CLAUDE.md.
 *
 * `street`, `city` and the two PDOK codes are deliberately not sent — the
 * portal re-derives the address from postcode and house number in its own job.
 */
function signupPayload(v: Answers) {
  const notes = [
    v.location,
    v.location === 'anders' && v.locationNote && `Toelichting: ${v.locationNote}`,
    v.school && `School: ${v.school}`,
    v.contactMethod && `Contact via: ${v.contactMethod}`,
    v.level === 'different' && v.levelOther && `Niveau: ${v.levelOther}`,
    v.subjectOther && `Ander vak: ${v.subjectOther}`,
    v.lessonKind === 'different' && v.lessonKindNote && `Soort bijles: ${v.lessonKindNote}`,
  ].filter(Boolean)

  return compact({
    student_first_name: v.studentFirstName,
    student_phone_number: v.studentPhone,
    student_level: levelId(v.level),
    student_subjects_1: subjectIds(v.subjects),
    student_year: v.schoolYear,

    student_interval_type: v.lessonKind,
    // Only one of these two is ever asked, and the portal prefers the band.
    student_weekly_amount_indication: v.lessonKind === 'weekly' ? v.weeklyHours : '',
    student_incidental_amount_indication: v.lessonKind === 'weekly' ? '' : v.totalHours,

    location_indication: notes.join(' — '),
    date_time_indication: v.availability,

    account_name: `${v.contactFirstName} ${v.contactLastName}`.trim(),
    account_email: v.email,
    account_phone_number: v.contactPhone,
    account_postcode: v.postalCode,
    account_housenumber: v.houseNumber,
    account_address_comment: v.addressNote,
    account_known_via: v.heardAbout,
  })
}
