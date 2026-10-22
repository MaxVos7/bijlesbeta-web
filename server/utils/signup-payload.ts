/**
 * The wizard's answers, and how they map onto `register-external-full`.
 *
 * Shared by the two routes that post that shape: `/api/aanmelden`, the
 * finished form, and `/api/aanmelding-concept`, which saves it after every
 * step. Both must send the portal the same thing for the same answer, or the
 * draft an admin converts would not match the registration the visitor would
 * have made.
 */

/** What the wizard holds, minus the honeypot and the consent box. */
export type SignupAnswers = {
  lessonKind: string
  lessonKindNote: string
  weeklyHours: string
  totalHours: string
  availability: string
  location: string
  locationNote: string
  school: string
  schoolYear: string
  level: string
  levelOther: string
  subjects: string[]
  subjectOther: string
  studentFirstName: string
  studentPhone: string
  contactMethod: string
  contactFirstName: string
  contactLastName: string
  email: string
  postalCode: string
  houseNumber: string
  street: string
  city: string
  cityCode: string
  municipalityCode: string
  addressNote: string
  contactPhone: string
  heardAbout: string
}

export const LOCATIONS: Record<string, string> = {
  at_home: 'Thuis',
  library: 'Openbare locaties (zoals een bieb)',
  at_school: 'Op school',
  online: 'Online',
  anders: 'Anders',
}

/** Falls back to the raw value, so an unmapped code is shown rather than hidden. */
export function answerLabel(map: Record<string, string>, value: string): string {
  return value ? map[value] ?? value : ''
}

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
export function signupPayload(v: SignupAnswers) {
  const notes = [
    // The label, not the code. `location_indication` is an editable field on
    // the portal's person page, so an admin was reading `at_home` off a form
    // meant for the visitor's own words.
    answerLabel(LOCATIONS, v.location),
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


/**
 * Which answers each `register-external-full` key is made from.
 *
 * A draft is saved after every step, carrying only the answers from the steps
 * the visitor has cleared. Running those through `signupPayload` alone would
 * fill every question not yet asked with a blank, and the portal merges what
 * it is sent over what it holds — so a blank for the e-mail, say, would wipe
 * the address the proefles block had already saved. A key is therefore only
 * sent when at least one answer it is made from is part of the request.
 *
 * Several keys are made from more than one answer (`location_indication` is
 * six of them), so this is the one place that has to change if `signupPayload`
 * starts reading a new answer.
 */
const PAYLOAD_SOURCES: Record<string, (keyof SignupAnswers)[]> = {
  student_first_name: ['studentFirstName'],
  student_phone_number: ['studentPhone'],
  student_level: ['level'],
  student_subjects_1: ['subjects'],
  student_year: ['schoolYear'],
  student_school: ['location', 'school'],
  student_interval_type: ['lessonKind'],
  student_weekly_amount_indication: ['lessonKind', 'weeklyHours'],
  student_incidental_amount_indication: ['lessonKind', 'totalHours'],
  location_indication: [
    'location', 'locationNote', 'contactMethod', 'level', 'levelOther',
    'subjectOther', 'lessonKind', 'lessonKindNote',
  ],
  date_time_indication: ['availability'],
  account_name: ['contactFirstName', 'contactLastName'],
  account_email: ['email'],
  account_phone_number: ['contactPhone'],
  account_postcode: ['postalCode'],
  account_housenumber: ['houseNumber'],
  account_address_comment: ['addressNote'],
  account_known_via: ['heardAbout'],
}

/**
 * The part of `signupPayload` a partial set of answers settles.
 *
 * Unanswered questions are filled with blanks only to run the mapping; the
 * keys that came from them are then left out. See `PAYLOAD_SOURCES`.
 */
export function draftPayload(answers: Partial<SignupAnswers>) {
  const blank = Object.fromEntries(
    (Object.keys(PAYLOAD_SOURCES) as string[]).flatMap(key =>
      PAYLOAD_SOURCES[key]!.map(source => [source, source === 'subjects' ? [] : '']),
    ),
  ) as unknown as SignupAnswers

  // Every answer `signupPayload` reads is listed above, so the blanks cover
  // all of them; the real answers go on top.
  const payload = signupPayload({ ...blank, ...answers })
  const given = new Set(Object.keys(answers))

  return Object.fromEntries(
    Object.entries(payload).filter(([key]) =>
      PAYLOAD_SOURCES[key]?.some(source => given.has(source)),
    ),
  )
}
