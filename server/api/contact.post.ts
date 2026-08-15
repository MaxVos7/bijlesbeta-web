import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).optional().default(''),
  subject: z.string().trim().max(120).optional().default('Algemene vraag'),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional().default(''),
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

  const { website, ...payload } = body.data

  // Silently accept honeypot hits so bots get no signal.
  if (isSpam({ website })) {
    return { ok: true }
  }

  await forwardToLaravel(event, '/api/website/contact', payload)

  return { ok: true }
})
