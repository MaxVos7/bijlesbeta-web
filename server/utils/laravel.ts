import type { H3Event } from 'h3'

/**
 * Forwards a public form submission to the existing Laravel application, which
 * owns mail delivery and lead storage. This app deliberately holds no database.
 *
 * Configure with NUXT_LARAVEL_API_URL (+ NUXT_LARAVEL_API_TOKEN). Until that is
 * set, submissions are logged in development so the forms stay testable, and
 * rejected in production so a broken hand-off is never silently swallowed.
 */
export async function forwardToLaravel(
  event: H3Event,
  path: string,
  payload: Record<string, unknown>,
) {
  const { laravelApiUrl, laravelApiToken } = useRuntimeConfig(event)

  if (!laravelApiUrl) {
    if (import.meta.dev) {
      console.info(`[form] ${path} (NUXT_LARAVEL_API_URL not set, not forwarded)`, payload)
      return { ok: true, forwarded: false }
    }

    throw createError({
      statusCode: 503,
      statusMessage: 'Form endpoint not configured',
      data: {
        message:
          'Het formulier is tijdelijk niet beschikbaar. Bel of mail ons, dan helpen we je direct.',
      },
    })
  }

  try {
    await $fetch(path, {
      baseURL: laravelApiUrl,
      method: 'POST',
      body: payload,
      headers: {
        Accept: 'application/json',
        ...(laravelApiToken ? { Authorization: `Bearer ${laravelApiToken}` } : {}),
      },
      timeout: 10_000,
    })

    return { ok: true, forwarded: true }
  } catch (error) {
    console.error(`[form] forwarding ${path} to Laravel failed`, error)

    throw createError({
      statusCode: 502,
      statusMessage: 'Upstream request failed',
      data: {
        message:
          'We konden je bericht niet versturen. Probeer het zo nog eens, of bel ons even.',
      },
    })
  }
}

/** Rejects honeypot hits with the same shape as a successful submit. */
export function isSpam(payload: { website?: unknown }) {
  return typeof payload.website === 'string' && payload.website.trim().length > 0
}
