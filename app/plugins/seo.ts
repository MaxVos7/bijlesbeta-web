/**
 * The head tags every page needs and none of them set individually: a
 * canonical URL, Open Graph and a Twitter card.
 *
 * Canonicals matter more than usual here. This app replaces a WordPress site
 * whose every indexed URL carries a trailing slash, and both forms resolve, so
 * without an explicit canonical Google is free to pick either — or to treat
 * them as two pages with the same content. The canonical always names the
 * trailing-slash form, which is what `server/middleware/trailing-slash.ts`
 * redirects to and what bijlesbeta.nl has always served.
 *
 * Per-page `useSeoMeta` calls still win: this runs first and only fills in
 * what a page hasn't said for itself.
 */
export default defineNuxtPlugin(() => {
  const route = useRoute()
  const { siteUrl } = useRuntimeConfig().public

  /** Absolute, query-free and trailing-slashed — one page, one URL. */
  const canonical = computed(() => {
    const path = route.path.endsWith('/') ? route.path : `${route.path}/`
    return `${String(siteUrl).replace(/\/$/, '')}${path}`
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    meta: [
      { property: 'og:url', content: canonical },
      { property: 'og:site_name', content: 'Bijles Bèta' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'nl_NL' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  })

  // The organisation and site nodes belong on every page, the way Rank Math
  // emits them on the live site.
  useOrganisationJsonLd()
  useWebsiteJsonLd()
})
