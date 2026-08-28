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
 * Every answer distinguishes itself, because the first version returned 404
 * both when the route wasn't deployed and when the key wasn't set, which are
 * different problems with the same fix-finding cost:
 *
 *   404 (the site's own page) the build is older than this route — deploy
 *   503                       deployed, but NUXT_DIAGNOSE_KEY is not visible
 *                             to the process: the daemon has not been
 *                             restarted since `.env` changed, or it is not
 *                             started with `node --env-file=.env` (Nitro does
 *                             not read `.env` on its own — see README)
 *   401                       deployed and configured; wrong key
 *   200                       the report
 *
 * It reports whether each value is *present*, never what it is. The one thing
 * it echoes back is the SMTP server's own error text, which names the problem
 * — authentication failed, connection refused, self-signed certificate — and
 * carries no credential of ours.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const key = config.diagnoseKey

  /*
    A 503 rather than a 404, so that reaching this at all proves the build is
    current and narrows the problem to the environment. It names no variable
    values and lists nothing — an unauthenticated caller learns only that the
    route exists and is switched off.
  */
  if (!key) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Diagnostics not enabled',
      data: {
        message:
          'NUXT_DIAGNOSE_KEY is not set in this process. The route is deployed, so the '
          + 'environment is what is missing: restart the daemon after changing .env, and '
          + 'check it runs `node --env-file=.env` — Nitro does not read .env by itself.',
      },
    })
  }

  /*
    Compared as strings on purpose. Nitro parses env overrides with `destr`, so
    NUXT_DIAGNOSE_KEY=123 arrives as the *number* 123 while the query string is
    always "123" — and a strict !== rejected the correct key.
  */
  if (String(getQuery(event).key ?? '') !== String(key)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
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
    NUXT_GOOGLE_PLACES_API_KEY: set(config.googlePlacesApiKey),
    NUXT_GOOGLE_PLACE_ID: set(config.googlePlaceId),
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
      What the Google reviews lookup is doing. `lastError` is Google's own
      words — an unenabled API, a referrer-restricted key, a place id that no
      longer resolves all say so there — and it carries no credential of ours.
      `reviewsHeld: 0` with no error means the lookup is simply unconfigured
      and the site is showing the transcribed reviews.
    */
    reviews: googleReviewsStatus(),
    /*
      Contact has no endpoint on the portal at all, so for that form the office
      copy is the only delivery there is: no working SMTP means no working
      contact form, however healthy the portal is.
    */
    note: smtp.ok
      ? 'Mail works. A failing form is then the portal hand-off, and the office copy will say so.'
      : 'Mail does not work. Every form still works while the portal takes it, but a submission '
        + 'the portal refuses would reach nobody.',
  }
})
