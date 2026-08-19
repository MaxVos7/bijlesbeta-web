import type { H3Event } from 'h3'

/**
 * The one mail this app sends to a *visitor* rather than to the office.
 *
 * It is deliberately the only one. The portal owns transactional mail to the
 * visitor everywhere it has something to say — the password-set link on a
 * signup, the confirmation on an application — from database-backed templates
 * with a notification log behind them, and duplicating that would mean two
 * "bedankt" mails for one submission.
 *
 * Contact is the exception, because the portal has no contact request at all:
 * no route, no model, no notification. So without this, somebody who writes in
 * through the form hears nothing back until a person replies by hand.
 *
 * Two things it deliberately does not do:
 *
 * - **It does not quote the visitor's own message back.** Any form that mails
 *   attacker-supplied text to an attacker-supplied address is a spam relay;
 *   keeping the body fixed means the worst case is a stranger receiving one
 *   short, honest sentence from us. The name is the only thing that varies,
 *   it is capped, and the mail is plain text so there is no markup to inject.
 * - **It is only sent once the submission actually reached somebody.** If the
 *   hand-off and the office copy both failed, the visitor is told to call, and
 *   promising them we will be in touch would be a lie.
 */

/** The whole of the copy, so changing the wording is a one-place edit. */
const SUBJECT = 'Bedankt voor je bericht!'

/** Long enough for any real name, short enough to keep a greeting a greeting. */
const MAX_NAME = 60

function body(name: string): string {
  const greeting = name ? `Hoi ${name},` : 'Hoi,'

  return [
    greeting,
    '',
    'Bedankt voor je bericht! We zullen binnenkort contact met je opnemen.',
    '',
    'Met vriendelijke groet,',
    'Bijles Bèta',
    '',
    '085 820 1900',
    'contact@bijlesbeta.nl',
  ].join('\n')
}

/**
 * Sends the visitor their confirmation. Never throws, and the caller ignores
 * the result: this is a courtesy on top of a submission that has already been
 * delivered, so a bounced confirmation must not turn a success into an error
 * on the visitor's screen. `sendMail` logs whatever went wrong.
 */
export async function sendContactConfirmation(
  event: H3Event,
  visitor: { name: string, email: string },
): Promise<void> {
  if (!visitor.email) return

  // First name only — "Hoi Max," reads better than "Hoi Max Vos," — and
  // truncated, so a junk "name" can't run away with the greeting.
  const firstName = visitor.name.trim().split(/\s+/)[0]?.slice(0, MAX_NAME) ?? ''

  await sendMail(event, {
    to: visitor.email,
    subject: SUBJECT,
    text: body(firstName),
  })
}
