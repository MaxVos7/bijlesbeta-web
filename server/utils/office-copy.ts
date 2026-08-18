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
 * Ends the request with an error only when the submission reached nobody.
 *
 * This is the whole of the new contract. The portal refusing a submission is
 * no longer the visitor's problem: if the office has the answers, the
 * submission exists and somebody will act on it, so the visitor is told it
 * arrived — because it did. Only when both the hand-off and the copy failed is
 * there genuinely nothing left, and then they are told to call rather than
 * being thanked for something that vanished.
 */
export function requireDelivery(
  handoff: { ok: boolean },
  delivered: boolean,
  message = 'We konden je bericht niet versturen. Bel of mail ons even, dan pakken we het direct op.',
): void {
  if (handoff.ok || delivered) return

  throw createError({
    statusCode: 502,
    statusMessage: 'Submission could not be delivered',
    data: { message },
  })
}
