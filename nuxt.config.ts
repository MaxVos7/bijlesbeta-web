import tailwindcss from '@tailwindcss/vite'
import { legacyRedirects } from './redirects'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'nl' },
      // Brand last, as on bijlesbeta.nl.
      titleTemplate: '%s - Bijles Bèta',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#ffc107' },
      ],
      /*
        Google Consent Mode v2 defaults are *not* here any more. They have to
        carry a returning visitor's stored choice, which is only knowable from
        the request, so they render from `app/plugins/consent.ts` instead —
        still inline in <head>, still at `tagPriority: 10`, still ahead of the
        Tag Manager loader at 20. Read the note in that file before moving them
        back: a default that lands after the container is a default nothing
        reads, and one that ignores the cookie under-counts every return visit.
      */
      link: [
        /*
          Three icons, which is the smallest set that covers everything:
          the .ico (16/32/48) for browsers that ignore SVG icons and for the
          bare /favicon.ico request some clients make regardless of markup,
          the SVG for everything modern — it scales and lifts the deep ink to
          parchment on a dark tab strip — and a 180px PNG for iOS, which
          composites transparency onto black and so gets its own opaque tile.
        */
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        /*
          The two families are self-hosted — the `@font-face` block at the top
          of `app/assets/css/main.css` has the reasoning, and the two
          `preconnect` hints at fonts.googleapis.com and fonts.gstatic.com went
          with the stylesheet they were warming up for.

          Only the `latin` files are preloaded. They are needed for every page
          of a Dutch site, and they are discovered late otherwise: the browser
          has to fetch and parse the CSS before it learns a font exists.
          `latin-ext` is deliberately absent — it sits behind its own
          unicode-range and most pages never ask for it, so preloading it would
          buy 50 KB of nothing.

          `crossorigin` is required even though these are same-origin: font
          fetches are made in CORS mode, and a preload without it is a second,
          unused request rather than a warm cache entry.
        */
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/plus-jakarta-sans-latin.woff2',
          crossorigin: '',
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/open-sans-latin.woff2',
          crossorigin: '',
        },
      ],
    },
  },

  runtimeConfig: {
    // The portal's external-registration endpoints, which all three forms post
    // to. They authenticate with a shared secret rather than a bearer token.
    // Set via NUXT_PORTAL_API_URL / NUXT_PORTAL_SECRET_KEY — never commit the key.
    portalApiUrl: '',
    portalSecretKey: '',
    /*
      SMTP for the office copy of every form submission. The portal owns the
      mail to the visitor; this is the copy that survives the portal being
      down, or refusing a field. Set via NUXT_MAIL_HOST / NUXT_MAIL_PORT /
      NUXT_MAIL_USER / NUXT_MAIL_PASSWORD / NUXT_MAIL_FROM — reuse the
      portal's own SMTP credentials so there is one sending domain, not two.

      Unset, nothing is sent and the forms fall back to telling the visitor to
      call: with no portal and no mail there is nowhere for a submission to go,
      and claiming otherwise would lose it.
    */
    mailHost: '',
    mailPort: '587',
    mailUser: '',
    mailPassword: '',
    mailFrom: 'Bijles Beta <contact@bijlesbeta.nl>',
    /*
      Where the copies land. Sollicitaties go to the separate mailbox the live
      site names beside that form; everything else to the contact address.
    */
    officeEmail: 'contact@bijlesbeta.nl',
    applicationsEmail: 'info@bijlesbeta.nl',
    /*
      Google Places (New), behind `/api/reviews`: the review carousel and the
      `Uitstekend ★★★★★ 34 Reviews` line under every hero.

      Set via NUXT_GOOGLE_PLACES_API_KEY / NUXT_GOOGLE_PLACE_ID. Empty by
      default and nothing is called at all — the site then shows the reviews
      transcribed in `app/data/site.ts`, which is what it showed before this
      existed. The key is a server credential precisely so it can be restricted
      to this server's IP and to the Places API; it is never sent to the
      browser, which is why it is not under `public`.

      `node scripts/find-place-id.mjs "<name>"` resolves the place id.
    */
    googlePlacesApiKey: '',
    googlePlaceId: '',
    /*
      Unlocks `GET /api/_diagnose?key=…`, which reports which variables the
      process can actually see and what the SMTP server says when we connect.
      Empty by default, and the route 404s without it — so it does not exist on
      a deploy that hasn't opted in. Unset it once a deploy is healthy.
    */
    diagnoseKey: '',
    public: {
      siteUrl: 'https://bijlesbeta.nl',
      portalUrl: 'https://mijn.bijlesbeta.nl',
      /*
        Google Tag Manager container. Empty by default on purpose: nothing is
        loaded until it is set, so staging doesn't report into the live
        property. bijlesbeta.nl runs GTM-MJCC44HR — reuse it only once this
        site is the one serving that domain.
      */
      gtmId: '',
    },
  },

  /*
    Internal links carry the trailing slash too, so a crawler never follows an
    in-page link into a redirect. `server/middleware/trailing-slash.ts` is what
    enforces it for anything arriving from outside.
  */
  experimental: {
    defaults: { nuxtLink: { trailingSlash: 'append' } },
  },

  routeRules: {
    // 301s from the WordPress URLs this app replaces. See `redirects.ts`.
    ...legacyRedirects,

    /*
      Everything in `public/` is served by Nitro, which sends an `ETag` and a
      `Last-Modified` and no `Cache-Control` at all — so a returning visitor
      revalidates every image individually before anything paints. Ten round
      trips on the homepage, more on the landings. The hashed `/_nuxt/` assets
      already get a year and `immutable` from Nitro itself; this is the gap
      beside them.

      Thirty days rather than the year `/_nuxt/` takes, because these filenames
      carry no content hash. A year of `immutable` would mean a swapped
      photograph never reaching anyone who had already seen the old one, with
      no way to push it — and these are marketing photographs, which do get
      swapped. Thirty days bounds that: no request at all for a month, then it
      self-heals. Going longer means adopting a rename-on-change rule for
      `public/img`, which is a decision, not a tuning.
    */
    '/img/**': { headers: { 'cache-control': 'public, max-age=2592000, immutable' } },
    '/logo.svg': { headers: { 'cache-control': 'public, max-age=2592000, immutable' } },
    '/favicon.svg': { headers: { 'cache-control': 'public, max-age=2592000, immutable' } },
    '/favicon.ico': { headers: { 'cache-control': 'public, max-age=2592000, immutable' } },
    '/apple-touch-icon.png': { headers: { 'cache-control': 'public, max-age=2592000, immutable' } },

    /*
      The fonts take the full year the images don't. A typeface is not
      content: these files change when the family changes, and that means a new
      filename, so there is no stale-photograph problem to bound here.
    */
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  nitro: {
    compressPublicAssets: true,
  },
})
