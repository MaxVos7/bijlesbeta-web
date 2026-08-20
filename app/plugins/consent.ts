/**
 * Google Consent Mode v2 defaults, inline in <head> ahead of everything that
 * reads them — `tagPriority: 10`, against the Tag Manager loader's 20.
 * `app/plugins/gtm.ts` is the other half; the file names put this one first.
 *
 * The values are bijlesbeta.nl's: every storage denied except the two a site
 * can't function without, and a 500ms window for a visitor's choice to arrive
 * before tags act.
 *
 * **A stored choice is baked into the defaults rather than sent as an update.**
 * The cookie is on the request, so by the time this renders we already know
 * what a returning visitor picked, and writing it into `default` is the only
 * way it can be true before the first tag runs. `useCookieConsent().restore()`
 * used to carry that alone, from `onMounted` — which is after hydration, and
 * `wait_for_update` gives Tag Manager 500ms. On a slow phone the container is
 * long past that by the time Vue picks up, so the visitor was counted as
 * denied on the page they actually came to read. `wait_for_update` is dropped
 * in that case for the same reason: with the answer already in hand there is
 * nothing pending to hold the tags for.
 *
 * `restore()` still runs, and still matters — it is what pushes the
 * `cookie_consent_update` event the live container triggers its GA4 tag on.
 * What it no longer has to do is win a race.
 *
 * This makes the rendered HTML depend on the request's cookie, so these pages
 * must not be cached across visitors: don't put an `swr`/`isr` rule on a route
 * that renders the site chrome, or one visitor's consent is served to another.
 *
 * Universal rather than server-only, deliberately. The tag renders identically
 * on both sides, so hydration matches it and leaves the already-executed
 * script alone; a `.server` plugin would leave the client head with a tag it
 * doesn't know, which unhead is entitled to tear out.
 */
import type { ConsentLevel } from '~/composables/useCookieConsent'
import { COOKIE_NAME, SIGNALS, isLevel } from '~/composables/useCookieConsent'

export default defineNuxtPlugin(() => {
  /*
    Read only — the banner owns writing this. No `maxAge` here on purpose:
    touching it would re-issue the cookie on every render and quietly extend
    the 180 days `useCookieConsent` sets.
  */
  const stored = useCookie<ConsentLevel | null>(COOKIE_NAME, { default: () => null })
  const level = isLevel(stored.value) ? stored.value : null

  const defaults: Record<string, string | number> = {
    // No stored choice means deny everything, which is exactly the `deny` row.
    ...SIGNALS[level ?? 'deny'],
    functionality_storage: 'granted',
    security_storage: 'granted',
    // Only worth waiting for an update that is actually coming.
    ...(level ? {} : { wait_for_update: 500 }),
  }

  useHead({
    script: [
      {
        tagPriority: 10,
        innerHTML:
          'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}'
          + `gtag('consent','default',${JSON.stringify(defaults)});`,
        tagPosition: 'head',
      },
    ],
  })
})
