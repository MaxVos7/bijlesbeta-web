import { z } from 'zod'

/**
 * The contact form, and the short callback form in the amber closing block.
 *
 * There is no contact endpoint on the Laravel side — the portal has no route,
 * no model and no notification for a contact request, and bijlesbeta.nl's own
 * contact form is a Gravity Forms notification and nothing more. So the mail
 * to the office *is* the delivery here, not a fallback; the forward is
 * attempted anyway so this starts working the moment that endpoint exists.
 */
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

  const handoff = await forwardToLaravel(event, '/api/website/contact', payload)

  const { officeEmail } = useRuntimeConfig(event)

  const delivered = await sendOfficeCopy(event, {
    to: officeEmail,
    kind: `Contact — ${payload.subject}`,
    from: { name: payload.name, email: payload.email },
    outcome: handoff.ok
      ? { ok: true }
      : { ok: false, reason: handoff.reason },
    rows: [
      ['Naam', payload.name],
      ['E-mailadres', payload.email],
      ['Telefoonnummer', payload.phone],
      ['Onderwerp', payload.subject],
      ['Bericht', payload.message],
    ],
  })

  requireDelivery(handoff, delivered)

  return { ok: true }
})
