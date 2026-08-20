import type { H3Event } from 'h3'
import type { MailAttachment } from './mail'

/**
 * The office's own copy of a form submission.
 *
 * Every submission produces one, whether or not the portal took it, because
 * the copy is the only place the answers exist outside the portal's database —
 * and because a submission the portal refuses is exactly the one somebody has
 * to act on by hand.
 *
 * The outcome is stamped at the top rather than implied by whether the mail
 * arrived, so a full inbox reads as a work queue: everything marked
 * `NIET VERWERKT` needs entering in the portal, everything else is already
 * there.
 */

/** What the portal did with the submission, in the words the office needs. */
export type PortalOutcome
  = { ok: true }
    | { ok: false, reason: string }

const HANDLED = 'VERWERKT — staat in het portaal, je hoeft niets te doen.'
const UNHANDLED
  = 'NIET VERWERKT — dit is NIET in het portaal aangekomen. Neem contact op met '
    + 'de aanmelder en voer de gegevens hieronder handmatig in.'

/** A labelled answer. Empty values are dropped rather than printed blank. */
export type Row = [label: string, value: unknown]

function formatRows(rows: Row[]): string {
  return rows
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([label, value]) => {
      const text = Array.isArray(value) ? value.join(', ') : String(value)
      // Multi-line answers (a motivation, an availability note) are indented
      // under their label so the list stays readable in a plain-text client.
      return text.includes('\n')
        ? `${label}:\n${text.split('\n').map((line) => `  ${line}`).join('\n')}`
        : `${label}: ${text}`
    })
    .join('\n')
}

/**
 * Sends the office copy and reports whether it left.
 *
 * The return value is what the route uses to decide what the visitor is told:
 * a submission the portal refused but that reached the office is a submission
 * we still have, and saying otherwise sends the visitor away for good.
 */
export async function sendOfficeCopy(
  event: H3Event,
  options: {
    /** Which mailbox this kind of submission belongs in. */
    to: string
    /** The kind of form, e.g. `Aanmelding`. Leads the subject line. */
    kind: string
    /** Who sent it, for the subject line and the reply-to. */
    from: { name: string, email: string }
    outcome: PortalOutcome
    rows: Row[]
    attachments?: MailAttachment[]
  },
): Promise<boolean> {
  const { to, kind, from, outcome, rows, attachments } = options

  const subject = outcome.ok
    ? `${kind}: ${from.name}`
    : `[NIET VERWERKT] ${kind}: ${from.name}`

  const body = [
    outcome.ok ? HANDLED : UNHANDLED,
    outcome.ok ? '' : `Reden: ${outcome.reason}`,
    '',
    '─'.repeat(48),
    '',
    formatRows(rows),
    '',
    '─'.repeat(48),
    'Verstuurd via het formulier op bijlesbeta.nl.',
  ]
    .filter((line) => line !== null)
    .join('\n')

  return sendMail(event, {
    to,
    subject,
    text: body,
    replyTo: from.email || undefined,
    attachments,
  })
}

/**
 * The short proefles block's mail to the office.
 *
 * Deliberately *not* a `sendOfficeCopy` with a failure outcome, though it
 * looks like one. That mail's banner tells the office a submission is missing
 * from the portal and has to be entered by hand; this one is a lead that is
 * on its way to `/aanmelden` under its own steam, and most of them arrive
 * there a minute later as a real registration. Stamping it `NIET VERWERKT`
 * would put work in the queue that nobody needs to do.
 *
 * It exists because the other half of the block — the redirect — only pays off
 * if the visitor finishes the wizard. This is the copy for the ones who don't:
 * a name and a phone number is enough to follow up on, and without it that
 * visitor is simply lost. Gravity Forms form 1 sends exactly this and nothing
 * else, from a `{all_fields}` notification to `{admin_email}`.
 */
export async function sendLeadCopy(
  event: H3Event,
  options: {
    to: string
    /** Who sent it, for the subject line and the reply-to. */
    from: { name: string, email: string }
    rows: Row[]
  },
): Promise<boolean> {
  const { to, from, rows } = options

  const body = [
    'NIEUWE LEAD via het proefles-blok. Deze persoon is doorgestuurd naar het',
    'aanmeldformulier — als daar niets binnenkomt, bel of app deze gegevens na.',
    '',
    '─'.repeat(48),
    '',
    formatRows(rows),
    '',
    '─'.repeat(48),
    'Verstuurd via het formulier op bijlesbeta.nl.',
  ].join('\n')

  return sendMail(event, {
    to,
    subject: `Gratis proefles: ${from.name}`,
    text: body,
    replyTo: from.email || undefined,
  })
}

/** What the route answers with. Always HTTP 200 — see `deliveryResult`. */
export type DeliveryResult = { ok: true } | { ok: false, message: string }

/**
 * Reports whether the submission reached anybody.
 *
 * This is the whole of the contract. The portal refusing a submission is not
 * the visitor's problem: if the office has the answers, the submission exists
 * and somebody will act on it, so the visitor is told it arrived — because it
 * did. Only when the hand-off *and* the copy both failed is there nothing
 * left, and then they are told to call rather than thanked for something that
 * vanished.
 *
 * **It answers 200 with `ok: false` rather than throwing a 502**, which is not
 * squeamishness about status codes. Cloudflare sits in front of this site and
 * replaces an origin 502 with its own branded error page, so the Dutch
 * sentence telling the visitor to call was being thrown away and the form fell
 * back to a generic "er ging iets mis". The one moment we most need to reach
 * the visitor is the one a gateway error is most likely to swallow. A 4xx from
 * zod validation is passed through untouched and still throws.
 */
export function deliveryResult(
  handoff: { ok: boolean },
  delivered: boolean,
  message = 'We konden je bericht niet versturen. Bel of mail ons even, dan pakken we het direct op.',
): DeliveryResult {
  if (handoff.ok || delivered) return { ok: true }

  return { ok: false, message }
}
