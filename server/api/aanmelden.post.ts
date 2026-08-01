import { z } from 'zod'

const schema = z.object({
  studentName: z.string().trim().min(1).max(120),
  contactName: z.string().trim().max(120).optional().default(''),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(1).max(40),
  subjects: z.array(z.string().trim().max(60)).min(1).max(10),
  level: z.string().trim().min(1).max(60),
  year: z.string().trim().max(60).optional().default(''),
  lessonType: z.enum(['thuis', 'online', 'geen-voorkeur']).default('geen-voorkeur'),
  postalCode: z.string().trim().max(20).optional().default(''),
  notes: z.string().trim().max(5000).optional().default(''),
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
