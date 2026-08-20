import { z } from 'zod'

/**
 * The contact form, and the short callback form in the amber closing block.
 *
 * Posts to the portal's `register-external-contact`, alongside the other two
 * forms and behind the same `X-Secret-Key`. The portal stores the request,
 * mails the office the whole message and confirms receipt to the sender, all
 * from templates the office can edit — so this app sends the visitor nothing.
 * Everything it used to do here is gone: the bearer-token forward to an
 * endpoint that never existed, and the confirmation mail it sent itself.
 */
const schema = z.object({
  // `CONTACT_RULES` in `shared/utils/form-rules.ts`, which `ContactForm`
  // checks the visitor's answers against before it posts them.
  ...ruleFields(CONTACT_RULES),
  // The one field the visitor doesn't fill in — it comes from the component's
  // `subject` prop — so a missing one is the general enquiry, not a blank.
  subject: ruleField(CONTACT_RULES.subject).default('Algemene vraag'),
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
    // `as const`, or `ok` widens to boolean and the result stops being a
    // discriminated union the forms can branch on.
    return { ok: true as const }
  }

  const handoff = await postToPortal(event, '/register-external-contact', compact(payload))

  /*
    The office copy is now the fallback it was always meant to be, rather than
    the delivery. `CONTACT_REQUEST_TO_ADMIN` carries the whole message, so on
    success this would be a duplicate of a better mail — while a submission the
    portal did not take still has to reach somebody.

    `/aanmelden` and `/solliciteren` keep sending it on every submission,
    because the portal's admin notifications for those carry a name and nothing
    else. See "The office copy" in CLAUDE.md.
  */
  const delivered = handoff.ok
    ? false
    : await sendOfficeCopy(event, {
        to: useRuntimeConfig(event).officeEmail,
        kind: `Contact — ${payload.subject}`,
        from: { name: payload.name, email: payload.email },
        outcome: { ok: false, reason: handoff.reason },
        rows: [
          ['Naam', payload.name],
          ['E-mailadres', payload.email],
          ['Telefoonnummer', payload.phone],
          ['Onderwerp', payload.subject],
          ['Bericht', payload.message],
        ],
      })

  return deliveryResult(handoff, delivered)
})
