import { z } from 'zod'
import type { Row } from '../utils/office-copy'

/**
 * Docent applications, posted to the portal's `register-external-applicant` —
 * the endpoint the Gravity Forms "Sollicitatieformulier" webhook uses today.
 *
 * This one takes multipart rather than JSON, because the CV travels with it.
 * The portal's `resume_url` is required and is handed to a job that fetches it
 * over HTTP, so the file has to be somewhere public before the application is
 * posted: the CV is uploaded first, and the application is only sent once that
 * returns a URL. An applicant is never recorded without the CV they attached.
 *
 * If either step fails, the application is not lost with it — the office gets
 * the answers *and the CV as an attachment*, which at that moment is the only
 * copy of the file in existence. That is the one thing this route must never
 * get wrong: somebody's CV cannot be asked for twice.
 */

/**
 * Matches the portal's own rules, so a submission it would refuse fails here.
 *
 * The rules are `APPLICATION_RULES` in `shared/utils/form-rules.ts`, which
 * `ApplicationForm` checks against before it posts — this route used to spell
 * them out a second time, and the two halves drifted: the form checked the
 * phone number and nothing else's length, so a long motivation or a mistyped
 * e-mail cost the applicant everything they had typed, CV included.
 */
const schema = z.object({
  ...ruleFields(APPLICATION_RULES),
  subjects: ruleList(APPLICATION_SUBJECTS_RULE),
  privacy: z.literal(true),
})

/** What the portal's resume job can actually read back. */
const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_CV_BYTES = 10 * 1024 * 1024

function invalid(message: string): never {
  throw createError({ statusCode: 422, statusMessage: 'Validation failed', data: { message } })
}

export default defineEventHandler(async (event) => {
  rateLimit(event)

  const parts = await readMultipartFormData(event)

  if (!parts?.length) {
    invalid('Controleer de ingevulde gegevens en probeer het opnieuw.')
  }

  // `subjects` repeats once per checked box; everything else appears once.
  const fields: Record<string, unknown> = { subjects: [] as string[] }
  let cv: { data: Uint8Array, filename: string, type: string } | undefined

  for (const part of parts) {
    if (part.name === 'cv' && part.filename) {
      cv = { data: part.data, filename: part.filename, type: part.type ?? 'application/octet-stream' }
      continue
    }
    if (!part.name || part.filename) continue

    const value = part.data.toString('utf8')
    if (part.name === 'subjects') (fields.subjects as string[]).push(value)
    else if (part.name === 'privacy') fields.privacy = value === 'true'
    else fields[part.name] = value
  }

  const body = schema.safeParse(fields)

  if (!body.success) {
    invalid('Controleer de ingevulde gegevens en probeer het opnieuw.')
  }

  const { website, ...v } = body.data

  // Silently accept honeypot hits so bots get no signal.
  if (isSpam({ website })) {
    // `as const`, or `ok` widens to boolean and the result stops being a
    // discriminated union the forms can branch on.
    return { ok: true as const }
  }

  if (!cv) invalid('Voeg je CV toe om te solliciteren.')
  if (cv.data.length > MAX_CV_BYTES) invalid('Je CV is te groot. Gebruik een bestand van maximaal 10 MB.')
  if (!ALLOWED_CV_TYPES.includes(cv.type)) invalid('Gebruik een pdf- of Word-bestand voor je CV.')

  /*
    The upload and the application are two calls to a portal that may be down
    for both. Neither ends the request any more: whatever happened, the office
    gets the application with the CV attached, and the applicant is told it
    arrived unless it reached nobody at all.
  */
  const upload = await uploadResume(event, cv)

  const handoff = upload.ok
    ? await postToPortal(
        event,
        '/register-external-applicant',
        portalPayload({
          first_name: v.firstName,
          last_name: v.lastName,
          phone_number: normalisePhone(v.phone) ?? v.phone,
          email: v.email,
          subjects: subjectIds(v.subjects),
          study: v.study,
          motivation: v.motivation,
          // Absent only when the portal isn't configured, which is dev-only —
          // the upload reports a failure rather than a null url otherwise.
          resume_url: upload.url ?? '',
          postcode: v.postalCode,
          housenumber: v.houseNumber,
          known_via: v.heardFrom,
        }),
      )
    : upload

  const { applicationsEmail } = useRuntimeConfig(event)

  const delivered = await sendOfficeCopy(event, {
    to: applicationsEmail,
    kind: 'Sollicitatie',
    from: { name: `${v.firstName} ${v.lastName}`.trim(), email: v.email },
    outcome: handoff.ok ? { ok: true } : { ok: false, reason: handoff.reason },
    rows: [
      ['Naam', `${v.firstName} ${v.lastName}`.trim()],
      ['E-mailadres', v.email],
      ['Telefoonnummer', normalisePhone(v.phone) ?? v.phone],
      ['Postcode en huisnummer', `${v.postalCode} ${v.houseNumber}`.trim()],
      ['Vakken', v.subjects],
      ['Studie', v.study],
      ['Motivatie', v.motivation],
      ['Ken ons van', v.heardFrom],
      ['CV', cv.filename],
    ] satisfies Row[],
    /*
      Always attached, not only on a failure. The portal keeps the staged
      upload for seven days and deletes it once the queue has fetched it, so
      the mail is the office's own lasting copy — and if the upload failed, it
      is the only one.
    */
    attachments: [{ filename: cv.filename, content: cv.data, contentType: cv.type }],
  })

  return deliveryResult(handoff, delivered,
    'We konden je sollicitatie niet versturen. Mail je CV en motivatie naar ons, dan pakken we het direct op.',
  )
})
