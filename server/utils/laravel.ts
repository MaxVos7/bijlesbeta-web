import type { H3Event } from 'h3'

/**
 * Forwards a public form submission to the existing Laravel application, which
 * owns mail delivery and lead storage. This app deliberately holds no database.
 *
 * Configure with NUXT_LARAVEL_API_URL (+ NUXT_LARAVEL_API_TOKEN).
 *
 * **The contact endpoint does not exist on the Laravel side yet.** Until it
 * does, this reports every contact submission as un-forwarded and the office
 * copy is the delivery — which is what bijlesbeta.nl does today anyway, where
 * the contact form is a Gravity Forms notification and nothing more. Nothing
 * here throws: a submission that can't be forwarded must still reach somebody.
 */
export async function forwardToLaravel(
  event: H3Event,
  path: string,
  payload: Record<string, unknown>,
): Promise<{ ok: true, forwarded: boolean } | { ok: false, reason: string }> {
  const { laravelApiUrl, laravelApiToken } = useRuntimeConfig(event)

  if (!laravelApiUrl) {
    if (import.meta.dev) {
      console.info(`[form] ${path} (NUXT_LARAVEL_API_URL not set, not forwarded)`, payload)
      return { ok: true, forwarded: false }
    }

    return { ok: false, reason: 'er is geen koppeling met het portaal geconfigureerd' }
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
  }
  catch (error: any) {
    console.error(`[form] forwarding ${path} to Laravel failed`, error)

    const status = error?.status ?? error?.statusCode
    return {
      ok: false,
      reason: status
        ? `het portaal antwoordde met een fout (${status})`
        : `het portaal was niet bereikbaar (${error?.message ?? 'onbekende fout'})`,
    }
  }
}

/** Rejects honeypot hits with the same shape as a successful submit. */
export function isSpam(payload: { website?: unknown }) {
  return typeof payload.website === 'string' && payload.website.trim().length > 0
}
