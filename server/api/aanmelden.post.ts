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

  const { website, ...payload } = body.data

  // Silently accept honeypot hits so bots get no signal.
  if (isSpam({ website })) {
    return { ok: true }
  }

  await forwardToLaravel(event, '/api/website/aanmelden', payload)

  return { ok: true }
})
