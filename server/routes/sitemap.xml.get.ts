import { articles } from '~/data/kennisbank'
import { landings, landingPath } from '~/data/landings'
import { tutors } from '~/data/tutors'

/**
 * The sitemap, built from the same data the pages render from, so it can't
 * drift out of sync with what actually exists.
 *
 * Served at `/sitemap.xml`, which is where `robots.txt` points. bijlesbeta.nl
 * publishes a sitemap index split by post type; a single file is well within
 * the 50,000-URL limit here and gives Google one thing to fetch.
 *
 * Every URL carries the trailing slash, matching the canonical form — a
 * sitemap that lists the redirecting form wastes crawl budget and muddies
 * which URL is authoritative.
 */

/** Pages with no data behind them. Keep in step with `app/pages`. */
const STATIC_PATHS = [
  '/',
  '/over-ons',
  '/het-bedrijf',
  '/zo-werkt-het',
  '/tarieven',
  '/aanmelden',
  '/contact',
  '/werken-bij',
  '/examentraining',
  '/excel-training-groningen',
  '/kennisbank',
  '/privacy',
  '/algemene-voorwaarden',
]

/**
 * `/aanmelden` is the conversion page and `/` the entry point, so they lead;
 * the legal pages exist to be linked, not found. Google treats priority as a
 * weak hint at best, but a flat file says nothing at all.
 */
function priorityFor(path: string) {
  if (path === '/') return '1.0'
  if (path === '/privacy' || path === '/algemene-voorwaarden') return '0.3'
  if (path.startsWith('/kennisbank/') || path.startsWith('/docenten/')) return '0.6'
  return '0.8'
}

export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const origin = String(siteUrl).replace(/\/$/, '')

  const paths = [
    ...STATIC_PATHS,
    ...landings.map((landing) => landingPath(landing.slug)),
    ...articles.map((article) => `/kennisbank/${article.slug}`),
    ...tutors.map((tutor) => `/docenten/${tutor.slug}`),
  ]

  const urls = paths
    .map((path) => {
      const loc = `${origin}${path.endsWith('/') ? path : `${path}/`}`
      return `  <url><loc>${loc}</loc><priority>${priorityFor(path)}</priority></url>`
    })
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
})
