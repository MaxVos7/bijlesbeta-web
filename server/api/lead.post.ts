import { z } from 'zod'

/**
 * The short "Gratis proefles" block in the amber closing panel.
 *
 * This is **not** a contact form, and it used to be treated as one: it posted
 * to `register-external-contact`, filed a `ContactRequest` and thanked the
 * visitor. That dropped both halves of what bijlesbeta.nl actually does with
 * it. Gravity Forms form 1, "Gratis proefles kort":
 *
 *   - notifies `{admin_email}` with `{all_fields}` on every submission, and
 *   - **redirects** to `/aanmelden/?naam=…&telefoon=…&e-mailadres=…`, where
 *     the long form is prefilled from those three parameters.
 *
 * The redirect is the point — the block is the top of the funnel, not the end
 * of it — and the mail is the safety net for the visitor who never finishes
 * the wizard. The redirect itself lives in `LeadForm.vue`; this route is the
 * mail. See "The proefles block" in CLAUDE.md.
 *
 * Nothing is sent to the portal from here. A lead is not a contact request,
 * and `register-external-contact` would fire `CONTACT_REQUEST_TO_SENDER` at
 * somebody we are in the middle of sending to the aanmeldformulier — a
 * confirmation for a conversation they didn't start. The real submission is
 * the wizard's, a minute later.
 */
/*
  `LEAD_RULES` in `shared/utils/form-rules.ts`, which `LeadForm` checks
  against before it posts. Live form 1 requires the name and the phone number
  and leaves the e-mail optional, which is the opposite of what this form used
  to enforce; the number is what the office follows up on, so it is the one
  that matters. `page` mirrors form 1's hidden page field.

  The e-mail is where this route lost leads. It was
  `.email().optional().or(z.literal('')).default('')`, and the literal is
  matched against the *untrimmed* input, so a field holding a single space —
  or any typo, since `LeadForm` never checked the address at all — 422'd the
  whole request. Nobody saw it: the visitor is redirected to the wizard either
  way and the POST's result is deliberately ignored, so the safety-net mail
  simply never arrived. A blank e-mail is now blank, and a filled one is
  checked in the form first.
*/
const schema = z.object(ruleFields(LEAD_RULES))

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

  const { website, ...lead } = body.data

  // Silently accept honeypot hits so bots get no signal.
  if (isSpam({ website })) return { ok: true as const }

  // Normalised the same way the other two forms do it, so the number the
  // office reads is the number that would go to the portal — and so the one
  // handed to `/aanmelden` in the query string is already in the shape that
  // form will accept. `null` can't happen: `LeadForm` checks first.
  const phone = normalisePhone(lead.phone) ?? lead.phone

  const delivered = await sendLeadCopy(event, {
    to: useRuntimeConfig(event).officeEmail,
    from: { name: lead.name, email: lead.email },
    rows: [
      ['Naam', lead.name],
      ['Telefoonnummer', phone],
      ['E-mailadres', lead.email],
      ['Pagina', lead.page],
    ],
  })

  /*
    Reported, but never acted on by the caller: `LeadForm` sends the visitor
    to `/aanmelden` either way. Stopping them at the door over a mail that
    didn't leave would cost the submission this whole block exists to get,
    and their details are in the URL regardless. The failure is in the log.
  */
  return { ok: true as const, delivered }
})
