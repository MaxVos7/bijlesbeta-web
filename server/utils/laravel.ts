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
  const config = useRuntimeConfig(event)

  // Coerced: see the note in `portal.ts` — `destr` numifies all-digit values.
  const laravelApiUrl = String(config.laravelApiUrl ?? '')
  const laravelApiToken = String(config.laravelApiToken ?? '')

  if (!laravelApiUrl) {
    if (import.meta.dev) {
      console.info(`[form] ${path} (NUXT_LARAVEL_API_URL not set, not forwarded)`, payload)
      return { ok: true, forwarded: false }
    }

    return { ok: false, reason: 'er is geen koppeling met het portaal geconfigureerd' }
  }

  try {
    /*
      `$fetch.raw` with the status checked by hand, rather than letting ofetch
      decide. Two things it gets wrong here, and both report a delivery that
      never happened:

      - It follows redirects. `/api/website/contact` does not exist on the
        Laravel side, so the POST is redirected to the login page, which
        answers 200 with HTML — and a resolved promise meant `ok: true`. The
        visitor was thanked for a message nobody received.
      - `redirect: 'manual'` alone does not fix it: ofetch resolves the 302
        rather than throwing, so the status has to be inspected either way.

      A hand-off has succeeded when it answered 2xx and nothing else.
    */
    const response = await $fetch.raw(path, {
      baseURL: laravelApiUrl,
      method: 'POST',
      body: payload,
      headers: {
        Accept: 'application/json',
        ...(laravelApiToken ? { Authorization: `Bearer ${laravelApiToken}` } : {}),
      },
      timeout: 10_000,
      redirect: 'manual',
      ignoreResponseError: true,
    })

    if (response.status < 200 || response.status >= 300) {
      console.error(`[form] forwarding ${path} to Laravel failed`, {
        status: response.status,
        location: response.headers.get('location'),
      })

      return {
        ok: false,
        reason: response.status >= 300 && response.status < 400
          ? `het portaal stuurde ons door naar ${response.headers.get('location') ?? 'een andere pagina'} — de endpoint bestaat daar niet`
          : `het portaal antwoordde met een fout (${response.status})`,
      }
    }

    return { ok: true, forwarded: true }
  }
  catch (error: any) {
    console.error(`[form] forwarding ${path} to Laravel failed`, error)

    return {
      ok: false,
      reason: `het portaal was niet bereikbaar (${error?.message ?? 'onbekende fout'})`,
    }
  }
}

/** Rejects honeypot hits with the same shape as a successful submit. */
export function isSpam(payload: { website?: unknown }) {
  return typeof payload.website === 'string' && payload.website.trim().length > 0
}
