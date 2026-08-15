/**
 * Canonicalises every page URL onto its trailing-slash form.
 *
 * bijlesbeta.nl serves `/over-ons/`, and every URL Google has indexed for this
 * domain carries the slash. Matching that shape means the whole existing index
 * and every inbound link stays valid at cutover with no redirect hop at all.
 *
 * Without this the app answered 200 on *both* forms, which is duplicate
 * content: the same page reachable at two URLs, with nothing telling Google
 * which one counts.
 *
 * Only page requests are rewritten. API routes, build assets and anything with
 * a file extension are left alone — `/favicon.ico/` is not a thing.
 */
const SKIP_PREFIXES = ['/api/', '/_nuxt/', '/_ipx/', '/__nuxt', '/_scripts/']

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const { pathname, search } = url

  if (pathname === '/' || pathname.endsWith('/')) return
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return

  // A dot in the last segment means a file, not a page.
  const last = pathname.slice(pathname.lastIndexOf('/') + 1)
  if (last.includes('.')) return

  return sendRedirect(event, `${pathname}/${search}`, 301)
})
