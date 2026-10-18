import type { H3Event } from 'h3'

/**
 * The server half of `/mijn/`: the logged-in part of the site, which runs on
 * the Laravel app's JSON API — the same `/api/...` routes the mobile app uses.
 *
 * The browser never holds the API token. Login stores it in an httpOnly
 * cookie on this domain, and every call from `/mijn/` pages goes through
 * `/api/mijn/...` here, which swaps the cookie for an `Authorization: Bearer`
 * header. So a script injected into the page has no token to steal, and
 * Laravel needs no CORS or session-cookie setup for this site.
 *
 * Unlike `portal.ts`, these calls are made *for* a visitor and throw like any
 * request would: a 422 is the visitor's own validation error and is passed
 * through unchanged, so the page can put it next to the field it belongs to.
 */

/** httpOnly: never readable from the page. */
export const MIJN_COOKIE = 'bb_mijn'

/**
 * Thirty days, renewed on every login. The token itself does not expire on
 * the Laravel side, so this is what logs an idle visitor out.
 */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export function setMijnToken(event: H3Event, token: string) {
  setCookie(event, MIJN_COOKIE, token, {
    httpOnly: true,
    // Off in dev only because `nuxt dev` serves plain http.
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
}

export function getMijnToken(event: H3Event) {
  return getCookie(event, MIJN_COOKIE) || null
}

export function clearMijnToken(event: H3Event) {
  deleteCookie(event, MIJN_COOKIE, { path: '/' })
}

/**
 * The Laravel app's base URL, e.g. `https://mijn.bijlesbeta.nl`. The same
 * NUXT_PORTAL_API_URL the forms post to, without the secret key — these calls
 * authenticate as the visitor, not as this site.
 */
function apiBase(event: H3Event) {
  const url = String(useRuntimeConfig(event).portalApiUrl ?? '').replace(/\/$/, '')

  if (!url) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Portal not configured',
      data: { message: 'Inloggen is op dit moment niet beschikbaar.' },
    })
  }

  return url
}

/**
 * The visitor's IP, so Laravel's login throttle counts per visitor rather
 * than per this server. Laravel only believes it from an address listed in
 * its TRUSTED_PROXIES. Read the same way `rateLimit` reads it: nginx in front
 * of this process sets the header.
 */
function clientIp(event: H3Event) {
  return getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || getRequestHeader(event, 'x-real-ip')
    || event.node.req.socket.remoteAddress
    || ''
}

type ApiResponse = { status: number, data: any }

const UNAVAILABLE = 'Er ging iets mis. Probeer het over een paar minuten opnieuw.'

function laravelHeaders(event: H3Event, token?: string | null) {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const ip = clientIp(event)
  if (ip) headers['X-Forwarded-For'] = ip
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

/**
 * One call to `<portal>/api/<path>`. A 4xx comes back to the caller to pass
 * on; a 5xx or an unreachable Laravel throws a 502 with a generic message, so
 * an exception page (with a stack trace, on a debug deploy) never reaches the
 * browser.
 */
export async function callLaravel(
  event: H3Event,
  path: string,
  options: { method?: string, body?: unknown, query?: Record<string, any>, token?: string | null } = {},
): Promise<ApiResponse> {
  const headers = laravelHeaders(event, options.token)
  const url = `${apiBase(event)}/api/${path}`
  const label = `[mijn] ${options.method ?? 'GET'} /api/${path}`

  let response
  try {
    response = await $fetch.raw(url, {
      method: (options.method ?? 'GET') as any,
      headers,
      body: options.body as any,
      query: options.query,
      ignoreResponseError: true,
    })
  }
  catch (error: any) {
    console.error(`${label} failed`, error?.message ?? error)
    throw createError({ statusCode: 502, statusMessage: 'Portal unreachable', data: { message: UNAVAILABLE } })
  }

  if (response.status >= 500) {
    console.error(`${label} answered ${response.status}`, (response._data as any)?.message ?? '')
    throw createError({ statusCode: 502, statusMessage: 'Portal error', data: { message: UNAVAILABLE } })
  }

  return { status: response.status, data: response._data ?? null }
}

/**
 * A GET whose answer is not JSON — an invoice PDF. The response comes back
 * untouched and a redirect is not followed, so the caller can hand it to the
 * browser. Same error rule as `callLaravel`: a 5xx or no answer is a 502.
 */
export async function callLaravelRaw(event: H3Event, path: string, token: string): Promise<Response> {
  const label = `[mijn] GET /api/${path}`

  let response: Response
  try {
    response = await fetch(`${apiBase(event)}/api/${path}`, {
      headers: laravelHeaders(event, token),
      redirect: 'manual',
    })
  }
  catch (error: any) {
    console.error(`${label} failed`, error?.message ?? error)
    throw createError({ statusCode: 502, statusMessage: 'Portal unreachable', data: { message: UNAVAILABLE } })
  }

  if (response.status >= 500) {
    console.error(`${label} answered ${response.status}`)
    throw createError({ statusCode: 502, statusMessage: 'Portal error', data: { message: UNAVAILABLE } })
  }

  return response
}

/**
 * Refuses a state-changing request that did not come from a page on this
 * site. The cookie is SameSite=Lax, which already keeps it off cross-site
 * POSTs in every current browser; this is the second lock, for the ones that
 * don't.
 */
export function assertSameOrigin(event: H3Event) {
  if (event.method === 'GET' || event.method === 'HEAD') return

  const origin = getRequestHeader(event, 'origin')
  const host = getRequestHost(event, { xForwardedHost: true })

  let originHost = ''
  try {
    originHost = origin ? new URL(origin).host : ''
  }
  catch {
    // A malformed Origin is no origin.
  }

  if (!originHost || originHost !== host) {
    throw createError({ statusCode: 403, statusMessage: 'Cross-origin request refused' })
  }
}
