import type { H3Event } from 'h3'

/**
 * Everything `/mijn/` pages ask of Laravel, forwarded with the visitor's
 * token. `/api/mijn/lessons?page=2` becomes `<portal>/api/lessons?page=2`.
 *
 * Only the routes below get through. The API has more than these pages use,
 * and a forwarder that took any path would make this site a second door into
 * all of it. A page that needs another endpoint adds it here.
 */
const ID = '\\d+'

/** Invoice ids are Moneybird's digits or Stripe's `in_…`. */
const PDF = /^invoices\/[A-Za-z0-9_]+\/pdf$/

const ROUTES: Array<[method: string, pattern: RegExp]> = [
  ['GET', /^me$/],
  ['GET', /^account$/],
  ['POST', /^account\/password$/],

  ['GET', /^lessons$/],
  ['POST', /^lessons$/],
  ['GET', /^lessons\/options$/],
  ['GET', new RegExp(`^lessons/${ID}$`)],
  ['PATCH', new RegExp(`^lessons/${ID}$`)],
  ['DELETE', new RegExp(`^lessons/${ID}$`)],

  ['GET', /^students$/],

  ['GET', /^connection-requests$/],
  ['GET', new RegExp(`^connection-requests/${ID}$`)],
  ['POST', new RegExp(`^connection-requests/${ID}/(accept|reject)$`)],

  ['GET', /^close-month\/options$/],
  ['POST', /^close-month$/],

  ['GET', /^dashboard$/],
  ['GET', /^children$/],
  ['GET', new RegExp(`^children/${ID}$`)],

  ['GET', /^subscription$/],
  ['POST', /^subscription$/],
  ['POST', /^subscription\/loose-lessons$/],
  ['POST', new RegExp(`^subscriptions/${ID}/(confirm|reject|cancel|change)$`)],

  ['GET', /^invoices$/],
  ['GET', PDF],
]

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') ?? ''

  if (!ROUTES.some(([method, pattern]) => method === event.method && pattern.test(path))) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  assertSameOrigin(event)

  const token = getMijnToken(event)

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }

  if (PDF.test(path)) return forwardPdf(event, path, token)

  const hasBody = !['GET', 'HEAD', 'DELETE'].includes(event.method)

  const { status, data } = await callLaravel(event, path, {
    method: event.method,
    query: getQuery(event),
    body: hasBody ? await readBody(event) : undefined,
    token,
  })

  // A revoked or unknown token: drop the cookie so the next page load starts
  // at the login form instead of failing the same way again.
  if (status === 401) clearMijnToken(event)

  setResponseStatus(event, status)
  setHeader(event, 'cache-control', 'no-store')

  return data
})

/**
 * An invoice PDF isn't JSON: Laravel either streams it (Moneybird
 * attachments) or redirects to the billing provider's own PDF URL. The bytes
 * are passed on as they are, and a redirect is handed to the browser rather
 * than followed here.
 */
async function forwardPdf(event: H3Event, path: string, token: string) {
  const response = await callLaravelRaw(event, path, token)

  const location = response.headers.get('location')
  if (response.status >= 300 && response.status < 400 && location) {
    return sendRedirect(event, location, 302)
  }

  if (response.status === 401) clearMijnToken(event)

  if (!response.ok) {
    throw createError({ statusCode: response.status === 401 ? 401 : 404, statusMessage: 'PDF not available' })
  }

  setHeader(event, 'content-type', response.headers.get('content-type') ?? 'application/pdf')
  setHeader(event, 'content-disposition', response.headers.get('content-disposition') ?? 'inline')
  setHeader(event, 'cache-control', 'no-store')

  return Buffer.from(await response.arrayBuffer())
}
