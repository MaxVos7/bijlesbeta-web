/**
 * PostHog: the one place the SDK is initialised and the one place consent is
 * translated into an opt-in. Nothing else in the app imports `posthog-js` —
 * everything goes through `useAnalytics()`, which reads the instance this
 * plugin publishes to `app/utils/posthog-client.ts`.
 *
 * Client-only, deliberately. There is no server-side capture here: every event
 * this site sends is a thing a visitor did in the browser, and a `.client`
 * plugin means the SSR render carries no analytics code at all.
 *
 * It loads after `consent.ts` because Nuxt orders plugins by filename and
 * `consent` sorts ahead of `posthog` — which matters, since this reads the
 * consent state that plugin's cookie feeds.
 *
 * **Nothing here may throw.** An ad blocker, a missing key, a browser with
 * storage disabled: each of those has to end in a silent no-op, not a broken
 * page. Analytics is the least important thing on this site and must behave
 * like it. Every entry point is wrapped; see `useAnalytics.ts` for the other
 * half of that.
 *
 * A note on what an ad blocker can and cannot do here. `posthog-js` is
 * bundled rather than fetched from PostHog's CDN, so the usual block — a
 * request to a known analytics host — does not apply to the library itself;
 * what blockers refuse are the calls to `eu.i.posthog.com`, and posthog-js
 * swallows those itself. A blocked visitor is therefore absent from the data
 * rather than broken. The real fix is a reverse proxy on our own domain, which
 * is an nginx change on Forge, not a code change.
 *
 * The one thing that *can* fail is the dynamic import below: some lists match
 * on chunk filenames, and Vite may well name this one after the package. That
 * ends in the `catch` and changes nothing else.
 */
import type { PostHog } from 'posthog-js'

/**
 * Which deploy an event came from, registered as a super property so it rides
 * along on everything without any call site having to remember it.
 *
 * Read off the hostname rather than an environment variable on purpose. A
 * variable is one more thing to set on a new deploy, and the failure mode when
 * it is forgotten is the worst one available: staging traffic silently
 * labelled `productie`, mixed into the numbers somebody is about to make a
 * decision on. The hostname cannot be forgotten.
 *
 * `bijlesbeta.on-forge.com` is the Forge staging domain; anything unrecognised
 * is treated as staging too, since the only two things we can positively
 * identify are the live domain and a local machine.
 */
function omgeving(hostname: string): 'productie' | 'staging' | 'lokaal' {
  if (hostname === 'bijlesbeta.nl' || hostname === 'www.bijlesbeta.nl') return 'productie'
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
    return 'lokaal'
  }
  return 'staging'
}

export default defineNuxtPlugin(() => {
  const { posthogKey, posthogApiHost, posthogUiHost } = useRuntimeConfig().public

  // No key, no PostHog — and no error either. This is the state the repo ships
  // in, and the state every environment stays in until the GTM tag is removed.
  // Because the import below is dynamic, this also means the SDK is never
  // downloaded at all on an unconfigured deploy.
  if (!posthogKey) return

  /*
    Read here, synchronously, and not inside the `then` below.

    `useCookieConsent()` calls `useState` and `useCookie`, both of which need
    the Nuxt instance, and that is only reliably available before the first
    await. Capturing the ref now and watching it later works because a `watch`
    on an existing ref needs no context of its own.
  */
  const { level } = useCookieConsent()

  /*
    Deliberately not awaited, and the plugin is deliberately not `async`.

    Nuxt holds hydration until every async plugin resolves, so awaiting this
    would put a ~250 KB analytics download in front of the page becoming
    interactive — on a site that measures its own Core Web Vitals. Instead the
    plugin returns immediately and PostHog wires itself up whenever the chunk
    lands. Anything that happens before then is simply not captured.
  */
  import('posthog-js')
    .then(({ default: posthog }) => start(posthog))
    .catch(() => {
      // Chunk blocked or offline. Nothing to do and nothing to report: the
      // rest of the app has no idea PostHog exists.
    })

  /** The whole configuration, in one place. */
  function init(posthog: PostHog) {
    posthog.init(String(posthogKey), {
      api_host: String(posthogApiHost),
      ui_host: String(posthogUiHost),

      /*
        Turns on `capture_pageview: 'history_change'`, which is what makes SPA
        navigation register. Nuxt runs vue-router in history mode — Nuxt has no
        hash-mode option and none is configured — so `pushState` is what a
        route change does here and PostHog hears every one of them. There is
        deliberately no `router.afterEach` hook: two sources of `$pageview`
        would double-count every navigation.
      */
      defaults: '2025-05-24',

      /*
        No person profile until somebody is actually identified. Nothing in
        this app identifies anyone today — there is no login and no user state
        — so in practice every event is anonymous, which is both cheaper and
        the honest description of what this site knows about its visitors.
        See `identificeer()` in `useAnalytics.ts`.
      */
      person_profiles: 'identified_only',

      /*
        Consent gate. Opted out until `useCookieConsent` says otherwise, which
        means the first page of a first visit captures nothing at all — not a
        pageview, not a replay — rather than capturing and hoping to clean up
        after. The watcher below is the only thing that lifts it.
      */
      opt_out_capturing_by_default: true,

      /*
        And no browser storage either until then.

        This one is easy to miss and was: `opt_out_capturing_by_default` alone
        only stops *events*, while the SDK still writes its
        `ph_<token>_posthog` cookie the moment it initialises. That is a
        non-essential cookie placed before the visitor has answered the banner,
        which is the exact thing the banner exists to prevent — and it is
        visible in devtools on a first visit, so it is not a theoretical
        problem. Verified with a headless browser: without this the cookie is
        there before a button is pressed, with it there is nothing until
        consent. `opt_in_capturing()` lifts both together.
      */
      opt_out_persistence_by_default: true,

      /*
        Off, and not just because the GTM tag had it off. Autocapture on a
        marketing site is mostly noise — every nav link, every accordion — and
        it is the easiest way to send PII without meaning to, because it
        captures the text of what was clicked. The six events this site sends
        are written down on purpose. The two `tel:`/`wa.me` events exist
        precisely because autocapture is not there to catch them.
      */
      autocapture: false,
      rageclick: true,

      /*
        Session replay. The project has replay switched on and its masking
        config left null, which means it falls back to the SDK defaults — so
        the masking is set here instead, where it is visible in code and cannot
        change under us from the PostHog UI.

        `maskAllInputs` is what keeps every value a visitor types out of the
        recording: the wizard, the contact panel, the sollicitatieformulier.
        `ph-no-capture` blocks an element outright (rrweb replaces it with a
        placeholder), and that class is on every block that renders personal
        data. `ph-mask` masks text without blocking layout, for anything that
        needs to keep its shape.
      */
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
        blockClass: 'ph-no-capture',
        maskTextClass: 'ph-mask',
        maskTextSelector: '[data-ph-mask]',
      },

      /*
        Console output stays out of replays. On a form page the console is
        exactly where a validation message naming a visitor's e-mail address
        would end up, and a recording is not the place to keep that. This
        overrides the project's own `capture_console_log_opt_in`, which is
        currently on.
      */
      enable_recording_console_log: false,

      /*
        Strips advertising click ids (gclid, fbclid and the rest) out of the
        captured URL. They are per-person identifiers, and nothing here reads
        them; UTM parameters are untouched, so attribution still works.
      */
      mask_personal_data_properties: true,

      /*
        Off. This app *is* bijlesbeta.nl once it replaces WordPress — it is not
        a subdomain under it. The only sibling host is mijn.bijlesbeta.nl, the
        Laravel portal, which runs no PostHog; widening the cookie to
        `.bijlesbeta.nl` would buy nothing and send it somewhere it is not
        read. Turn this on only if the portal is ever instrumented too.
      */
      cross_subdomain_cookie: false,

      /*
        Nothing that opens a UI of its own. Surveys are not enabled on the
        project, and the toolbar has no business loading on a visitor's page.
      */
      disable_surveys: true,

      /*
        `omgeving` on every event, stamped on the way out.

        This started as `register()`, which is the obvious mechanism and the
        wrong one here. A super property lives in persistence, and persistence
        stays shut until `opt_in_capturing()` — so a `register()` at init
        writes nowhere, and a `register()` after the opt-in is already too late
        for the `$opt_in` and `$pageview` that `opt_in_capturing()` itself
        fires. Measured, not assumed: with `register()` the first `$pageview`
        of every session arrived with `omgeving: undefined`, which is exactly
        the page a visitor actually landed on.

        `before_send` runs for every event with no ordering to get wrong, and
        it survives `reset()`. It must never throw — an exception here would
        take the event with it — hence the guard.
      */
      before_send: (event) => {
        try {
          if (event) {
            event.properties = {
              ...event.properties,
              omgeving: omgeving(window.location.hostname),
            }
          }
        }
        catch { /* send it unstamped rather than not at all */ }
        return event
      },
    })
  }

  /**
   * Everything that has to happen once the SDK is actually here: initialise,
   * publish the instance, then start honouring consent — in that order,
   * because the watcher's first run calls straight into the instance.
   */
  function start(posthog: PostHog) {
    try {
      init(posthog)
    }
    catch {
      // A failed init leaves nothing published, so `useAnalytics` finds `null`
      // and every event becomes a no-op. The page carries on regardless.
      return
    }

    setPosthogInstance(posthog)

    /*
      Consent, from the existing mechanism rather than a second one.

      `level` was read synchronously above and comes off the shared `useState`
      inside `useCookieConsent` — a plain `useCookie` ref would not do, because
      Nuxt hands every caller its own and a watcher here would never hear the
      banner. `immediate` covers the returning visitor whose choice is already
      in the cookie at load, and it is also what applies a choice made in the
      window between the plugin running and this chunk arriving; later firings
      are the banner being used, including "Beheer cookies" in the footer.

      `analytics` and `accept` both grant analytics storage — that is what
      `SIGNALS` says on the Google side, and PostHog is analytics storage.
    */
    watch(level, (next) => {
      try {
        if (next === 'analytics' || next === 'accept') {
          // Nothing to register alongside this: `omgeving` is stamped by
          // `before_send`, which needs no opt-in and no persistence.
          posthog.opt_in_capturing()
          return
        }

        /*
          Withdrawal, or a first-time visitor who pressed weigeren.

          `opt_out_capturing()` first and `reset()` second, in that order and
          not the other way round: `reset()` clears the stored consent
          decision, and with `opt_out_capturing_by_default` the state it clears
          *to* is opted out. Doing it after the opt-out therefore keeps us
          opted out and also drops the distinct id, the session and anything
          cached under it — which is the point of a withdrawal. Done in the
          other order around an opt-in it would silently stop capturing
          instead, which is the trap the SDK's own documentation calls out.
        */
        posthog.opt_out_capturing()
        posthog.reset()
      }
      catch {
        // Storage disabled, blocked SDK, anything else — never the visitor's
        // problem. Worst case we stay opted out, which is the safe direction.
      }
    }, { immediate: true })
  }
})
