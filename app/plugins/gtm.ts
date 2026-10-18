/**
 * Loads Google Tag Manager, as bijlesbeta.nl does — the container itself is
 * loaded unconditionally and Consent Mode decides what its tags may do. The
 * defaults are already in <head> (see `nuxt.config.ts`), so by the time this
 * runs, storage is denied until the visitor says otherwise.
 *
 * Nothing loads while `NUXT_PUBLIC_GTM_ID` is unset, which keeps staging out of
 * the live property. There is no analytics fallback if it is unset — that is
 * the point.
 *
 * Universal rather than client-only, so the loader is rendered into the SSR
 * head and runs on parse like it does on bijlesbeta.nl. As a client plugin it
 * only appeared at hydration, which delays every pageview by however long the
 * bundle takes. `tagPriority` keeps it behind the consent defaults; without it
 * the two are ordered by whichever registered first, and defaults that land
 * after the container are defaults nothing reads.
 */
export default defineNuxtPlugin(() => {
  const { gtmId } = useRuntimeConfig().public

  if (!gtmId) return

  // Not on the logged-in pages: they show students' names and lessons, and
  // the container's tags have no business near either. A visitor who
  // navigates there from a marketing page keeps the container that page
  // already loaded; one who lands on `/mijn/` directly never gets it.
  if (useRequestURL().pathname.startsWith('/mijn')) return

  useHead({
    script: [
      {
        tagPriority: 20,
        // The standard loader, with the dataLayer already created in <head>.
        innerHTML:
          '(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});'
          + 'var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";'
          + 'j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;'
          + `f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","${gtmId}");`,
        tagPosition: 'head',
      },
    ],
  })
})
