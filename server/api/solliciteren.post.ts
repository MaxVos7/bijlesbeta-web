import { z } from 'zod'

/**
 * Docent applications, posted to the portal's `register-external-applicant` —
 * the endpoint the Gravity Forms "Sollicitatieformulier" webhook uses today.
 *
 * This one takes multipart rather than JSON, because the CV travels with it.
 * The portal's `resume_url` is required and is handed to a job that fetches it
 * over HTTP, so the file has to be somewhere public before the application is
 * posted: the CV is uploaded first, and the application is only sent once that
 * returns a URL. An applicant is never recorded without the CV they attached.
 */

/** Matches the portal's own rules, so a submission it would reject fails here. */
const schema = z.object({
  firstName: z.string().trim().min(1).max(255),
  lastName: z.string().trim().min(1).max(255),
  phone: z.string().trim().min(1).max(40),
  email: z.string().trim().email().max(255),
  subjects: z.array(z.string().trim().max(60)).min(1).max(10),
  study: z.string().trim().min(1).max(255),
  motivation: z.string().trim().min(10).max(5000),
  postalCode: z.string().trim().min(1).max(10),
  houseNumber: z.string().trim().min(1).max(10),
  heardFrom: z.string().trim().max(255).optional().default(''),
  privacy: z.literal(true),
  website: z.string().max(200).optional().default(''),
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
    return { ok: true }
  }

  if (!cv) invalid('Voeg je CV toe om te solliciteren.')
  if (cv.data.length > MAX_CV_BYTES) invalid('Je CV is te groot. Gebruik een bestand van maximaal 10 MB.')
  if (!ALLOWED_CV_TYPES.includes(cv.type)) invalid('Gebruik een pdf- of Word-bestand voor je CV.')

  const resumeUrl = await uploadResume(event, cv)

  await postToPortal(
    event,
    '/register-external-applicant',
    compact({
      first_name: v.firstName,
      last_name: v.lastName,
      phone_number: v.phone,
      email: v.email,
      subjects: subjectIds(v.subjects),
      study: v.study,
      motivation: v.motivation,
      // Absent only when the portal isn't configured, which is dev-only — the
      // upload throws rather than returning nothing in every other case.
      resume_url: resumeUrl ?? '',
      postcode: v.postalCode,
      housenumber: v.houseNumber,
      known_via: v.heardFrom,
    }),
  )

  return { ok: true }
})
