/**
 * Cookie consent, reproducing bijlesbeta.nl's own implementation.
 *
 * The live site hand-rolls this rather than running a plugin, on Google
 * Consent Mode v2: everything is denied by default before Tag Manager loads,
 * and the visitor's choice arrives as a `consent` update. The defaults are set
 * in `nuxt.config.ts` so they land in <head> ahead of anything that reads them;
 * this composable only ever sends updates.
 *
 * Three levels, as on the live banner:
 *
 *   deny       nothing but what the site needs to function
 *   analytics  analytics only, no advertising or personalisation
 *   accept     everything
 *
 * The choice is remembered for 180 days in a `cookie_consent` cookie, which is
 * the same name and lifetime the live site uses — a visitor who already chose
 * on bijlesbeta.nl keeps that choice when these pages replace it.
 */

export type ConsentLevel = 'deny' | 'analytics' | 'accept'

export const COOKIE_NAME = 'cookie_consent'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 180

/** Google Consent Mode signals per level. Mirrors the live site's map. */
export const SIGNALS: Record<ConsentLevel, Record<string, 'granted' | 'denied'>> = {
  accept: {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
    personalization_storage: 'granted',
  },
  analytics: {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
    personalization_storage: 'denied',
  },
  deny: {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    personalization_storage: 'denied',
  },
}

/**
 * Cookies that survive a downgrade. Everything else is cleared when the
 * visitor picks anything short of `accept`, so a choice made after Tag Manager
 * has already set `_ga` actually takes effect rather than only stopping future
 * writes.
 */
const KEEP = [COOKIE_NAME]

/**
 * Kept as well once the visitor has granted `analytics`.
 *
 * PostHog's own cookie is analytics storage, and `analytics` is the level that
 * grants exactly that — so wiping it here would be purging something the
 * visitor just consented to. It matters because `purge()` runs on every level
 * short of `accept`, `analytics` included: without this, choosing "alleen
 * analytics" deleted `ph_…` a tick before `app/plugins/posthog.client.ts`
 * opted in, and every such visitor started a new session on every page.
 *
 * `deny` still clears it, which is the whole point of the purge.
 */
const KEEP_WITH_ANALYTICS = ['ph_']

export function isLevel(value: unknown): value is ConsentLevel {
  return value === 'deny' || value === 'analytics' || value === 'accept'
}

/**
 * Sends a gtag command, through the global `gtag` the consent-defaults script
 * puts in <head>.
 *
 * It must not be `dataLayer.push([...])`. Tag Manager recognises a gtag
 * command only when the pushed value is an `arguments` object — its dispatch
 * tests `Object.prototype.toString.call(v) === '[object Arguments]'`, and a
 * real Array fails it. An array instead falls into the legacy
 * call-a-global-by-name branch, which tries `window.consent(...)`, throws, and
 * swallows the error. That is silent: the banner looks like it worked, the
 * cookie is written, and Consent Mode never hears about it, so
 * `analytics_storage` stays denied for everybody who pressed accept and GA4
 * runs on cookieless pings. It was written that way once; don't write it back.
 */
function push(...args: unknown[]) {
  const w = window as unknown as {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
  w.dataLayer = w.dataLayer ?? []

  if (typeof w.gtag === 'function') {
    w.gtag(...args)
    return
  }

  // The head script hasn't run — do what it does. `arguments` is still bound
  // in a function declaration, rest parameter and all; an arrow function here
  // would not have one.
  w.dataLayer.push(arguments)
}

/** Clears every cookie the visitor hasn't consented to, on both host forms. */
function purge(level: ConsentLevel) {
  const keep = level === 'analytics' ? [...KEEP, ...KEEP_WITH_ANALYTICS] : KEEP

  for (const entry of document.cookie.split(';')) {
    const name = entry.split('=')[0]?.trim()
    if (!name || keep.some((prefix) => name.startsWith(prefix))) continue

    const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/'
    document.cookie = `${name}=;${expiry}`
    document.cookie = `${name}=;${expiry};domain=.${location.hostname}`
  }
}

export function useCookieConsent() {
  /*
    Read on the server as well as the client, so a returning visitor's page is
    rendered with the banner already absent. The live site shows the banner
    first and hides it once its script has run, which flashes; there is no
    reason to reproduce that.
  */
  const stored = useCookie<ConsentLevel | null>(COOKIE_NAME, {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: true,
    // The cookie is read by client script too, so it can't be httpOnly.
    default: () => null,
  })

  /*
    The one channel anything outside the banner listens on.

    It exists because `useCookie` is not shared: Nuxt builds a fresh ref per
    call (`cookieRef` in its own `useCookie`), so the ref the banner writes to
    and the ref a plugin reads from are two different objects. A watcher
    registered anywhere but inside the banner's own component therefore never
    fires, and the thing waiting on consent — `app/plugins/posthog.client.ts`
    — would sit opted out for the whole visit while the cookie says otherwise.
    Nuxt's `BroadcastChannel`/`cookieStore` sync is for *other tabs* and is
    browser-dependent; it is not something to hang consent on.

    `useState` is keyed, so every caller gets the same ref, and it is
    serialised into the payload — the value is already correct at hydration
    rather than one tick late. `stored` stays the source of truth on disk;
    this mirrors it in memory, and `choose()` writes both.
  */
  const current = useState<ConsentLevel | null>(
    'cookie-consent-level',
    () => (isLevel(stored.value) ? stored.value : null),
  )

  const level = computed<ConsentLevel | null>(() => current.value)

  /** Open unless a valid choice is already stored. Reopened via `reopen()`. */
  const open = useState('cookie-consent-open', () => level.value === null)

  /** Sends the update to Consent Mode and tells Tag Manager what changed. */
  function apply(next: ConsentLevel) {
    push('consent', 'update', SIGNALS[next])

    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer ?? []
    w.dataLayer.push({ event: 'cookie_consent_update', cookie_consent_level: next })

    if (next !== 'accept') purge(next)
  }

  function choose(next: ConsentLevel) {
    stored.value = next
    // Both, always: the cookie is what a later request reads, `current` is
    // what everything in this document reacts to. See the note on `current`.
    current.value = next
    apply(next)
    open.value = false
  }

  /**
   * Re-asserts a stored choice on load. The defaults rendered by
   * `app/plugins/consent.ts` already carry it, so this no longer races
   * `wait_for_update` to be the first thing Consent Mode hears — but it is
   * still what pushes the `cookie_consent_update` event, which is the trigger
   * the live container fires its GA4 and PostHog tags on. Removing it stops
   * analytics for every returning visitor.
   */
  function restore() {
    if (level.value) apply(level.value)
  }

  function reopen() {
    open.value = true
  }

  return { level, open, choose, reopen, restore }
}
