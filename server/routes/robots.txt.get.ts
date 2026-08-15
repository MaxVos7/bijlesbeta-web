/**
 * robots.txt, decided at request time rather than shipped as a static file.
 *
 * The static one allowed every crawler and pointed at the *WordPress*
 * sitemap, which meant the staging deploy was fully indexable and advertising
 * the live site's URLs. Staging competing with the site it is meant to replace
 * is the one thing that actively costs search position during a migration.
 *
 * The rule is the host, not the environment: only the canonical domain in
 * `NUXT_PUBLIC_SITE_URL` may be crawled. Any other host — the Forge staging
 * domain, a preview, an IP — is refused in full. That fails safe: a
 * misconfigured deploy is invisible to Google rather than accidentally public.
 */
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const canonicalHost = (() => {
    try {
      return new URL(String(siteUrl)).host
    }
    catch {
      return ''
    }
  })()

  const host = getRequestHost(event, { xForwardedHost: true })
  const isCanonical = Boolean(canonicalHost) && host === canonicalHost

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  if (!isCanonical) {
    return `# Not the canonical host (${host}) — nothing here should be indexed.\nUser-agent: *\nDisallow: /\n`
  }

  return `User-agent: *
Allow: /

# The form endpoints have nothing to index and cost crawl budget.
Disallow: /api/

Sitemap: ${String(siteUrl).replace(/\/$/, '')}/sitemap.xml
`
})
