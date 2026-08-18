import type { H3Event } from 'h3'
import nodemailer, { type Transporter } from 'nodemailer'

/**
 * Outgoing mail, used for one thing only: sending the office its own copy of
 * every form submission.
 *
 * This is not a second notification channel competing with the portal. The
 * portal owns the transactional mail to the visitor — the password-set link on
 * a signup, the confirmation on an application — and it does that better than
 * this app could, from database-backed templates with a notification log and a
 * queue behind them. What it does *not* do is put the answers anywhere the
 * office can read them without opening the portal: its admin notifications
 * interpolate only the params the listener passes, which is a name and an
 * account for a signup and nothing at all for an application.
 *
 * So this copy carries the whole submission, and it carries it whether or not
 * the portal accepted it. That is the point: bijlesbeta.nl's Gravity Forms
 * mailed the office regardless of what its webhook did, and losing that at
 * cutover would mean a portal outage — or a single field the portal refuses —
 * silently costing a lead.
 *
 * SMTP rather than a provider's HTTP API because the portal is on SMTP too
 * (`MAIL_MAILER=smtp`), so this reuses one set of credentials and one warmed
 * sending domain instead of introducing a second.
 *
 * Configure with NUXT_MAIL_HOST / NUXT_MAIL_PORT / NUXT_MAIL_USER /
 * NUXT_MAIL_PASSWORD. Unset, it logs in development so the forms stay testable
 * and reports "not sent" in production, which is what makes the caller keep
 * the visitor's own error path rather than claim a delivery that never left.
 */

/** One attachment; only ever the CV on an application. */
export type MailAttachment = {
  filename: string
  content: Uint8Array
  contentType: string
}

export type MailMessage = {
  to: string
  subject: string
  text: string
  /** The visitor's address, so the office can answer by hitting reply. */
  replyTo?: string
  attachments?: MailAttachment[]
}

/**
 * The transport is built once and kept, so a burst of submissions reuses one
 * pooled connection instead of opening an SMTP session per request.
 */
let transport: Transporter | null = null
let transportKey = ''

function getTransport(config: {
  host: string
  port: number
  user: string
  password: string
}): Transporter {
  const key = `${config.host}:${config.port}:${config.user}`

  if (transport && transportKey === key) return transport

  transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    // 465 is implicit TLS; everything else starts plain and upgrades.
    secure: config.port === 465,
    auth: config.user ? { user: config.user, pass: config.password } : undefined,
    pool: true,
    maxConnections: 2,
    /*
      This send sits inside the visitor's own request, after a portal call that
      may already have spent its own timeout. These caps keep the worst case to
      a few seconds rather than however long the socket wants to hang.
    */
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 10_000,
  })
  transportKey = key

  return transport
}

/**
 * Sends a message, and never throws.
 *
 * Mail is the safety net under the portal hand-off, so a failure here must not
 * become the visitor's problem on a submission the portal already accepted.
 * The caller gets a boolean and decides what that means; every failure is
 * logged with enough detail to find the submission in the process log, which
 * on Forge is the last copy of it that exists.
 */
export async function sendMail(event: H3Event, message: MailMessage): Promise<boolean> {
  const { mailHost, mailPort, mailUser, mailPassword, mailFrom } = useRuntimeConfig(event)

  if (!mailHost) {
    if (import.meta.dev) {
      console.info(
        `[mail] ${message.subject} -> ${message.to} (NUXT_MAIL_HOST not set, not sent)\n${message.text}`,
      )
      return true
    }

    console.error('[mail] NUXT_MAIL_HOST is not set — the office copy was not sent', {
      to: message.to,
      subject: message.subject,
    })
    return false
  }

  try {
    await getTransport({
      host: mailHost,
      port: Number(mailPort) || 587,
      user: mailUser,
      password: mailPassword,
    }).sendMail({
      from: mailFrom || mailUser,
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      attachments: message.attachments?.map((attachment) => ({
        filename: attachment.filename,
        // Nodemailer takes a Buffer or a string; h3 hands back a Buffer, which
        // is a Uint8Array at runtime.
        content: Buffer.from(attachment.content),
        contentType: attachment.contentType,
      })),
    })

    return true
  }
  catch (error) {
    // Logged in full: if this is the copy that was meant to survive a portal
    // outage, the log line is what is left of the submission.
    console.error('[mail] sending the office copy failed', {
      to: message.to,
      subject: message.subject,
      error,
    })
    return false
  }
}
