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
    },
  },

  // 301s from the WordPress URLs this app replaces. See `redirects.ts`.
  routeRules: legacyRedirects,

  nitro: {
    compressPublicAssets: true,
  },
})
