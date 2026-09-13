/**
 * The loaded PostHog instance, or `null`.
 *
 * This exists so that `useAnalytics()` can reach the SDK without importing it.
 * `app/plugins/posthog.client.ts` pulls `posthog-js` in through a dynamic
 * `import()` — roughly 250 KB that would otherwise sit in the entry chunk and
 * be downloaded by every visitor on every page, including now, while the key
 * is still empty everywhere and nothing is captured at all. A static import
 * anywhere in the graph, `useAnalytics.ts` included, would pull it straight
 * back in and undo that, which is why the composable goes through here.
 *
 * `import type` is erased at compile time and costs nothing at runtime.
 *
 * "Not loaded" is an ordinary state, not a failure: it is what every server
 * render sees, what an unconfigured deploy sees, and what a visitor sees for
 * the few hundred milliseconds before the chunk arrives. Events raised in that
 * window are queued and replayed rather than dropped — see `withPosthog`.
 */
import type { PostHog } from 'posthog-js'

let instance: PostHog | null = null

/**
 * Work handed in before the SDK arrived, replayed in order once it has.
 *
 * Without this the dynamic import silently loses the earliest events on every
 * full page load, and it loses exactly the ones that matter most:
 * `aanmelding_gestart` fires from `onMounted`, which on a cold load of
 * `/aanmelden/` runs well before a 250 KB chunk has been fetched and parsed.
 * Measured with a headless browser — the event was reliably present after a
 * client-side navigation from the proefles block and reliably absent when the
 * wizard was opened directly, which is the more common way in. A funnel whose
 * first step is missing for most of its entries is worse than no funnel.
 *
 * Replaying rather than dropping costs a few hundred milliseconds of accuracy
 * on the event's timestamp, which no funnel here is sensitive to. Ordering is
 * preserved, which they are.
 *
 * Bounded, because a page that never loads PostHog — no consent, blocked
 * chunk, offline — must not grow an unbounded array. Fifty is far more than
 * any real session sends before the SDK lands; past that, dropping is right.
 */
const pending: ((posthog: PostHog) => void)[] = []
const PENDING_MAX = 50

/** Called once, by the plugin, after `init()` returns. */
export function setPosthogInstance(posthog: PostHog) {
  instance = posthog

  // Spliced out first, so anything one of these queues in turn goes straight
  // through rather than back onto a list we are still walking.
  for (const run of pending.splice(0)) {
    try {
      run(posthog)
    }
    catch { /* one bad replay must not stop the rest */ }
  }
}

/**
 * Runs `fn` with the SDK — now if it is here, later if it isn't, never if it
 * never arrives.
 *
 * Note that "later" still respects consent: a replayed capture goes into an
 * instance that is opted out until the banner says otherwise, and PostHog
 * drops it there. Queuing is not a way around the gate.
 */
export function withPosthog(fn: (posthog: PostHog) => void) {
  if (instance) {
    fn(instance)
    return
  }
  if (pending.length < PENDING_MAX) pending.push(fn)
}

/** The instance, or `null` when there is nothing to send to. */
export function getPosthogInstance(): PostHog | null {
  return instance
}
