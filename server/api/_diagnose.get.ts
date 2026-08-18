import nodemailer from 'nodemailer'

/**
 * Says why a form hand-off is failing, without SSH.
 *
 * The Forge daemon logs to supervisor, which is awkward to reach and was not
 * available when the office copy first went live: the contact form failed, the
 * origin's 502 was replaced by Cloudflare's own page on the way out, and there
 * was no way to tell an unset variable from a wrong password. This endpoint is
 * the answer to "what is actually wrong", and it is meant to be curl'd from a
 * laptop.
 *
 *   GET /api/_diagnose?key=<NUXT_DIAGNOSE_KEY>
 *
 * It **404s unless `NUXT_DIAGNOSE_KEY` is set**, so it does not exist at all
 * on a deploy that hasn't opted in — and that 404 is itself the first useful
 * signal: if you set the key in Forge and still get one, the environment is
 * not reaching the Node process, which is the failure this was written for.
 * (The daemon needs `node --env-file=.env`; Nitro does not read `.env` on its
 * own. See README.)
 *
 * It reports whether each value is *present*, never what it is. The one thing
 * it echoes back is the SMTP server's own error text, which names the problem
 * — authentication failed, connection refused, self-signed certificate — and
 * carries no credential of ours.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const key = config.diagnoseKey

  // Not configured means not present. No hint that the route exists.
  if (!key) throw createError({ statusCode: 404, statusMessage: 'Not Found' })

  if (getQuery(event).key !== key) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const set = (value: unknown) => (typeof value === 'string' && value !== '' ? 'set' : 'MISSING')

  const env = {
    NUXT_MAIL_HOST: set(config.mailHost),
    NUXT_MAIL_PORT: config.mailPort || 'MISSING',
    NUXT_MAIL_USER: set(config.mailUser),
    NUXT_MAIL_PASSWORD: set(config.mailPassword),
    NUXT_MAIL_FROM: config.mailFrom || 'MISSING',
    NUXT_OFFICE_EMAIL: config.officeEmail || 'MISSING',
    NUXT_APPLICATIONS_EMAIL: config.applicationsEmail || 'MISSING',
    NUXT_PORTAL_API_URL: set(config.portalApiUrl),
    NUXT_PORTAL_SECRET_KEY: set(config.portalSecretKey),
    NUXT_LARAVEL_API_URL: set(config.laravelApiUrl),
  }

  /*
    `verify()` opens a connection, speaks EHLO and authenticates, then hangs
    up — the same handshake a real send makes, so it fails in the same way and
    for the same reason, without posting a message to anybody.
  */
  let smtp: { ok: boolean, detail: string }

  if (!config.mailHost) {
    smtp = { ok: false, detail: 'NUXT_MAIL_HOST is not set, so no mail is sent at all' }
  }
  else {
    const port = Number(config.mailPort) || 587
    try {
      await nodemailer
        .createTransport({
          host: config.mailHost,
          port,
          secure: port === 465,
          auth: config.mailUser
            ? { user: config.mailUser, pass: config.mailPassword }
            : undefined,
          connectionTimeout: 8_000,
          greetingTimeout: 8_000,
          socketTimeout: 10_000,
        })
        .verify()

      smtp = { ok: true, detail: `connected to ${config.mailHost}:${port} and authenticated` }
    }
    catch (error: any) {
      smtp = {
        ok: false,
        // The server's own words. `code` separates "wrong password" (EAUTH)
        // from "nothing listening" (ESOCKET) from "it never answered" (ETIMEDOUT).
        detail: `${error?.code ?? 'error'}: ${error?.response ?? error?.message ?? String(error)}`,
      }
    }
  }

  setHeader(event, 'cache-control', 'no-store')

  return {
    env,
    smtp,
    /*
      Contact has no endpoint on the portal at all, so for that form the office
      copy is the only delivery there is: no working SMTP means no working
      contact form, however healthy the portal is.
    */
    note: smtp.ok
      ? 'Mail works. A failing form is then the portal hand-off, and the office copy will say so.'
      : 'Mail does not work. /contact has no other delivery route, so it will fail until this is fixed.',
  }
})
