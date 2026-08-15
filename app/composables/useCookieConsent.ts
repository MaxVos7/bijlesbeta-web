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

const COOKIE_NAME = 'cookie_consent'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180

/** Google Consent Mode signals per level. Mirrors the live site's map. */
const SIGNALS: Record<ConsentLevel, Record<string, 'granted' | 'denied'>> = {
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

function isLevel(value: unknown): value is ConsentLevel {
  return value === 'deny' || value === 'analytics' || value === 'accept'
}

function push(...args: unknown[]) {
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer ?? []
  w.dataLayer.push(args)
}

/** Clears every cookie the visitor hasn't consented to, on both host forms. */
function purge() {
  for (const entry of document.cookie.split(';')) {
    const name = entry.split('=')[0]?.trim()
    if (!name || KEEP.some((keep) => name.startsWith(keep))) continue

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

  const level = computed<ConsentLevel | null>(() => (isLevel(stored.value) ? stored.value : null))

  /** Open unless a valid choice is already stored. Reopened via `reopen()`. */
  const open = useState('cookie-consent-open', () => level.value === null)

  /** Sends the update to Consent Mode and tells Tag Manager what changed. */
  function apply(next: ConsentLevel) {
    push('consent', 'update', SIGNALS[next])

    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer ?? []
    w.dataLayer.push({ event: 'cookie_consent_update', cookie_consent_level: next })

    if (next !== 'accept') purge()
  }

  function choose(next: ConsentLevel) {
    stored.value = next
    apply(next)
    open.value = false
  }

  /** Re-applies a stored choice on load, so tags see it before they fire. */
  function restore() {
    if (level.value) apply(level.value)
  }

  function reopen() {
    open.value = true
  }

  return { level, open, choose, reopen, restore }
}
