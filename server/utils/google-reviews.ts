import type { GoogleReviews, Review } from '#shared/utils/reviews'

/**
 * The Google reviews behind the rating line and the review carousel.
 *
 *   GET https://places.googleapis.com/v1/places/<place id>?languageCode=nl
 *   X-Goog-Api-Key:   <NUXT_GOOGLE_PLACES_API_KEY>
 *   X-Goog-FieldMask: rating,userRatingCount,reviews
 *
 * That is Place Details of the Places API (New). `userRatingCount` is every
 * rating the place has, wordless ones included, which is the number the "20+
 * Reviews" line is about; `reviews` is at most five, chosen and ordered by
 * Google, which is what the carousel turns.
 *
 * Configure with NUXT_GOOGLE_PLACES_API_KEY + NUXT_GOOGLE_PLACE_ID. With
 * either unset nothing is called and `/api/reviews` answers `{ google: null }`,
 * so the site falls back to the transcribed reviews in `app/data/site.ts` and
 * looks exactly as it does today. `node scripts/find-place-id.mjs` resolves the
 * place id from a name.
 *
 * Nothing in here throws at its caller, for the same reason the PDOK proxy
 * doesn't: a hero rating line is not worth a 500.
 *
 * ## Why the cache is here rather than in a route rule
 *
 * Every page with a `RatingLine` on it — which is most of them — reads this
 * during SSR, and Place Details with `reviews` in the mask is billed per
 * request. So the answer is held in memory and re-fetched every six hours,
 * which is four calls a day whatever the traffic. It is deliberately *not* a
 * `routeRules` `swr`/`isr` entry: those cache the rendered HTML, and no route
 * rendering the site chrome may take one — the consent defaults in
 * `app/plugins/consent.ts` make that HTML vary per visitor. See CLAUDE.md.
 *
 * Memory, not `defineCachedFunction`'s storage: the deploy has no writable
 * filesystem at runtime, and there is exactly one Node process behind nginx.
 * A restart re-fetches, which is what `warmGoogleReviews()` does at boot so
 * the first visitor after a deploy never waits for Google.
 *
 * Stale data is served while the refresh runs and kept if the refresh fails —
 * an outage or a spent quota at Google leaves the reviews on the page rather
 * than swapping them for the fallback set mid-afternoon.
 */

const PLACE_DETAILS_URL = 'https://places.googleapis.com/v1/places'

/** Only what is rendered: the mask is what the request is billed for. */
const FIELD_MASK = 'rating,userRatingCount,reviews'

const REQUEST_TIMEOUT = 5_000

/** How long an answer is served without asking Google again. */
const FRESH_FOR = 6 * 60 * 60 * 1000

/**
 * How long a *failure* is served for. Short, so a transient error heals
 * within the visit, but not so short that a hard failure (a revoked key, a
 * spent quota) means a call on every render.
 */
const RETRY_AFTER_FAILURE = 5 * 60 * 1000

/** The Place Details response, as far as the field mask asks for it. */
type PlaceDetails = {
  rating?: number
  userRatingCount?: number
  reviews?: {
    name?: string
    rating?: number
    text?: { text?: string, languageCode?: string }
    originalText?: { text?: string, languageCode?: string }
    relativePublishTimeDescription?: string
    authorAttribution?: { displayName?: string, uri?: string, photoUri?: string }
  }[]
}

const state: {
  data: GoogleReviews | null
  /** When `data` stops being served without a refresh behind it. */
  staleAt: number
  /** The refresh in flight, so concurrent renders make one request, not ten. */
  refresh: Promise<void> | null
  fetchedAt: number | null
  lastError: string | null
} = { data: null, staleAt: 0, refresh: null, fetchedAt: null, lastError: null }

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Google's review onto ours.
 *
 * `text` is the review in the language we asked for, which for a Dutch review
 * is the review itself; `originalText` is the fallback for the ones Google
 * did not translate. A review with no words is dropped — it counts towards
 * `userRatingCount` and so is already represented in the number beside the
 * stars, but there is nothing to put in a quote card.
 *
 * The content is passed through unedited and in Google's own order. Picking
 * out the flattering ones, or rewriting them, is not ours to do: the terms
 * that come with the data say to show it as given.
 */
function mapReviews(details: PlaceDetails): Review[] {
  return (details.reviews ?? []).flatMap((review, index): Review[] => {
    const body = text(review.text?.text) || text(review.originalText?.text)
    const author = text(review.authorAttribution?.displayName)
    if (!body || !author) return []

    const stars = Number(review.rating)

    return [{
      id: text(review.name) || `${author}-${index}`,
      rating: Number.isFinite(stars) ? Math.min(5, Math.max(0, stars)) : 5,
      body,
      author,
      affiliation: text(review.relativePublishTimeDescription) || undefined,
      authorUrl: text(review.authorAttribution?.uri) || undefined,
    }]
  })
}

/** The credentials, or nothing. Coerced: Nitro's `destr` numbers a digit-only env value. */
function placeConfig(): { key: string, placeId: string } | null {
  const config = useRuntimeConfig()
  const key = String(config.googlePlacesApiKey ?? '')
  const placeId = String(config.googlePlaceId ?? '')
  return key && placeId ? { key, placeId } : null
}

async function refresh(): Promise<void> {
  const config = placeConfig()
  if (!config) return

  try {
    const details = await $fetch<PlaceDetails>(
      `${PLACE_DETAILS_URL}/${encodeURIComponent(config.placeId)}`,
      {
        headers: {
          'X-Goog-Api-Key': config.key,
          'X-Goog-FieldMask': FIELD_MASK,
        },
        // Dutch reviews back for a Dutch site; Google translates the rest.
        query: { languageCode: 'nl', regionCode: 'NL' },
        timeout: REQUEST_TIMEOUT,
      },
    )

    const stars = Number(details.rating)
    const total = Number(details.userRatingCount)
    const reviews = mapReviews(details)

    /*
      A 200 that carries no rating is treated as a failure rather than written
      to the cache: it means the field mask was answered with nothing (a place
      id that no longer resolves, a key without Places enabled), and caching
      that for six hours would hide a misconfiguration behind an unchanged
      page.
    */
    if (!Number.isFinite(stars) || !Number.isFinite(total) || total <= 0) {
      throw new Error('Place Details returned no rating for this place id')
    }

    state.data = { stars, total, reviews }
    state.staleAt = Date.now() + FRESH_FOR
    state.fetchedAt = Date.now()
    state.lastError = null
  } catch (error) {
    /*
      The previous answer is kept and goes on being served; only the retry
      window moves. `data` is left null on a cold failure, which is what makes
      `/api/reviews` fall back to the transcribed reviews.
    */
    state.staleAt = Date.now() + RETRY_AFTER_FAILURE
    state.lastError = error instanceof Error ? error.message : String(error)
    console.warn('[reviews] Google Place Details lookup failed', error)
  }
}

/** One refresh at a time, whatever the number of concurrent renders. */
function startRefresh(): Promise<void> {
  if (!state.refresh) {
    state.refresh = refresh().finally(() => {
      state.refresh = null
    })
  }
  return state.refresh
}

/**
 * The reviews, or `null` while there are none to show.
 *
 * Fresh data is returned as-is; stale data is returned *and* a refresh is
 * started behind it, so only the very first caller after a restart waits on
 * Google — and `warmGoogleReviews()` means that is usually the boot, not a
 * visitor.
 */
export async function googleReviews(): Promise<GoogleReviews | null> {
  if (!placeConfig()) return null

  if (Date.now() < state.staleAt) {
    return state.data
  }

  const pending = startRefresh()
  if (state.data) return state.data

  await pending
  return state.data
}

/** Called from `server/plugins/google-reviews.ts` at startup. Never rejects. */
export function warmGoogleReviews(): void {
  if (!placeConfig()) return
  void startRefresh()
}

/** For `/api/_diagnose`: the outcome, never the key. */
export function googleReviewsStatus() {
  return {
    configured: Boolean(placeConfig()),
    lastFetchedAt: state.fetchedAt ? new Date(state.fetchedAt).toISOString() : null,
    reviewsHeld: state.data?.reviews.length ?? 0,
    ratingHeld: state.data ? `${state.data.stars} (${state.data.total} ratings)` : null,
    lastError: state.lastError,
  }
}
