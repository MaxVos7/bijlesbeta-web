/**
 * Sets a page's title and description once, and fans them out to Open Graph
 * and Twitter.
 *
 * `useSeoMeta` doesn't derive `og:title` from `title`, so calling it directly
 * leaves every page without a social preview — which is what happened here.
 * Pages call this instead, and only repeat themselves when a share card should
 * legitimately differ from the search result.
 *
 * The canonical, `og:url`, `og:type` and the card type are sitewide and live in
 * `app/plugins/seo.ts`.
 *
 * `title` is passed through `titleTemplate`, so give it the page's own words
 * without the brand — `Tarieven`, not `Bijles Bèta | Tarieven`.
 */
export function useSeo(meta: {
  title: string | (() => string)
  description: string | (() => string)
  /** Absolute or root-relative; falls back to the sitewide share image. */
  image?: string
  /** `article` on kennisbank posts, so the og type matches the content. */
  type?: 'website' | 'article'
  /**
   * Skips `titleTemplate`, for the handful of pages whose live title doesn't
   * end in " - Bijles Bèta" — the homepage, Examentraining, Excel training,
   * Het bedrijf and the Utrecht landing. Pass the whole title in that case.
   */
  absoluteTitle?: boolean
}) {
  const { siteUrl } = useRuntimeConfig().public

  const title = computed(() => (typeof meta.title === 'function' ? meta.title() : meta.title))
  const description = computed(() =>
    typeof meta.description === 'function' ? meta.description() : meta.description,
  )

  const image = computed(() => {
    const src = meta.image ?? '/img/team-collage.webp'
    return src.startsWith('http') ? src : `${String(siteUrl).replace(/\/$/, '')}${src}`
  })

  if (meta.absoluteTitle) useHead({ titleTemplate: '%s' })

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogImage: () => image.value,
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value,
    ...(meta.type ? { ogType: meta.type } : {}),
  })
}
