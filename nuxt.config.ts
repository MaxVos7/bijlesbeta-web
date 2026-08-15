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
        Google Consent Mode v2 defaults, matching bijlesbeta.nl exactly: every
        storage denied except the two a site can't function without, and a
        500ms window for the visitor's stored choice to arrive before tags act.

        This has to run before Tag Manager, which is why it sits here as inline
        head script rather than in the analytics plugin — the defaults are
        worthless if a tag has already read them. `useCookieConsent` only ever
        sends `update`s on top of this.
      */
      script: [
        {
          innerHTML:
            'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}'
            + "gtag('consent','default',{"
            + "'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied',"
            + "'analytics_storage':'denied','functionality_storage':'granted',"
            + "'personalization_storage':'denied','security_storage':'granted',"
            + "'wait_for_update':500});",
          tagPosition: 'head',
          // Ahead of the Tag Manager loader, which sits at 20.
          tagPriority: 10,
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Open+Sans:wght@400;600;700&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    // Server-only. Set via NUXT_LARAVEL_API_URL / NUXT_LARAVEL_API_TOKEN.
    laravelApiUrl: '',
    laravelApiToken: '',
    // The portal's external-registration endpoints, which authenticate with a
    // shared secret rather than a bearer token. Set via NUXT_PORTAL_API_URL /
    // NUXT_PORTAL_SECRET_KEY — never commit the key.
    portalApiUrl: '',
    portalSecretKey: '',
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

  // 301s from the WordPress URLs this app replaces. See `redirects.ts`.
  routeRules: legacyRedirects,

  nitro: {
    compressPublicAssets: true,
  },
})
