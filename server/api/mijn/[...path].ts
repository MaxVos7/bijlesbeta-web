/**
 * Everything `/mijn/` pages ask of Laravel, forwarded with the visitor's
 * token. `/api/mijn/lessons?page=2` becomes `<portal>/api/lessons?page=2`.
 *
 * Only the routes below get through. The API has more than these pages use,
 * and a forwarder that took any path would make this site a second door into
 * all of it. A page that needs another endpoint adds it here.
 */
const ID = '\\d+'

const ROUTES: Array<[method: string, pattern: RegExp]> = [
  ['GET', /^me$/],

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
