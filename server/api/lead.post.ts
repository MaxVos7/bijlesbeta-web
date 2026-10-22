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
 *   - **redirects** to `/aanmelden/`, where the long form is prefilled with
 *     the name, phone number and e-mail (live passed them in the query
 *     string; we don't — see `useLeadHandoff`).
 *
 * The redirect is the point — the block is the top of the funnel, not the end
 * of it — and the mail is the safety net for the visitor who never finishes
 * the wizard. The redirect itself lives in `LeadForm.vue`; this route is the
 * mail. See "The proefles block" in CLAUDE.md.
 *
 * No registration is made from here. A lead is not a contact request, and
 * `register-external-contact` would fire `CONTACT_REQUEST_TO_SENDER` at
 * somebody we are in the middle of sending to the aanmeldformulier — a
 * confirmation for a conversation they didn't start. The real submission is
 * the wizard's, a minute later.
 *
 * What does go to the portal is a *draft* (`/external-signup-draft`): step 0
 * of the aanmelding, which the wizard then keeps adding to after every step
 * under the token this route hands back. A draft is not an account — nothing
 * is mailed and no student exists until the form is finished or an admin
 * converts it. See "Drafts" in CLAUDE.md.
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
const schema = z.object({
  ...ruleFields(LEAD_RULES),
  // The draft this lead belongs to, when the visitor has submitted one before.
  // Not a visitor-facing answer, so not in `LEAD_RULES`.
  token: z.string().max(64).optional(),
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

  const { website, token, ...lead } = body.data

  // Silently accept honeypot hits so bots get no signal.
  if (isSpam({ website })) return { ok: true as const, token: null }

  // Normalised the same way the other two forms do it, so the number the
  // office reads is the number that would go to the portal — and so the one
  // handed to `/aanmelden` in the query string is already in the shape that
  // form will accept. `null` can't happen: `LeadForm` checks first.
  const phone = normalisePhone(lead.phone) ?? lead.phone

  /*
    Two independent hand-offs, in parallel and neither waiting on the other:
    the draft in the portal, where the office can see this person and turn them
    into a registration, and the mail, which is the safety net for when the
    portal can't be reached. Either one failing leaves the other standing.

    What the lead gives is mapped onto the keys the wizard will send later, so
    the draft the wizard keeps filling in is this one: the name is the contact
    person's, and the number goes where the wizard seeds it (`studentPhone`).
  */
  const [saved, delivered] = await Promise.all([
    postToPortal(event, '/external-signup-draft', {
      token,
      step: 0,
      step_name: 'proefles',
      source: lead.page,
      account_name: lead.name,
      student_phone_number: phone,
      ...(lead.email ? { account_email: lead.email } : {}),
    }),
    sendLeadCopy(event, {
      to: useRuntimeConfig(event).officeEmail,
      from: { name: lead.name, email: lead.email },
      rows: [
        ['Naam', lead.name],
        ['Telefoonnummer', phone],
        ['E-mailadres', lead.email],
        ['Pagina', lead.page],
      ],
    }),
  ])

  /*
    One line per hand-off, on success as well as on failure.

    `mail.ts` already logs when a send fails, but a failure-only log has no
    denominator: you can see that three mails didn't leave and not whether
    that was three out of four or three out of four hundred. This is the other
    half, and it is what makes the ratio readable — count these against the
    `proefles_aangevraagd` events in PostHog, which fire on every hand-off
    whether or not the mail left.

    That gap is real and is the price of not awaiting the POST: the visitor is
    redirected to the wizard regardless, so a failed lead mail is invisible
    from the browser and from PostHog alike. This log is the only place it
    surfaces.

    Nothing identifying goes in it — no name, no number, no address. The page
    is enough to tell which block is failing.
  */
  console.info('[lead] proefles hand-off', { delivered, draft: saved.ok, page: lead.page })

  /*
    Reported, but never acted on by the caller: `LeadForm` sends the visitor
    to `/aanmelden` either way. Stopping them at the door over a mail that
    didn't leave would cost the submission this whole block exists to get,
    and their details are in the URL regardless. The failure is in the log.
  */
  return {
    ok: true as const,
    delivered,
    // Handed back so the wizard can carry on filling in the same draft.
    token: saved.ok && typeof saved.data?.token === 'string' ? saved.data.token : null,
  }
})
