import { rating as staticRating, reviews as staticReviews } from '~/data/site'
import {
  formatReviewCount,
  type Review,
  type ReviewSummary,
  type ReviewsResponse,
} from '#shared/utils/reviews'

/**
 * The reviews and the rating line, live from Google where possible.
 *
 * `/api/reviews` answers with Google's own rating, its rating count and up to
 * five reviews; with the lookup unconfigured or failing it answers
 * `{ google: null }` and this falls back to the transcribed reviews in
 * `app/data/site.ts`, which is what the site showed before. Both halves render
 * through the same components, so there is no second layout to keep alive.
 *
 * One thing deliberately does *not* come from Google: the bold `Uitstekend`
 * label. It is the live site's own word, `/zo-werkt-het` uses it as a meta
 * description, and a label computed from the score would change what Google
 * indexes the day an average moves — see the SEO note in CLAUDE.md. The stars
 * and the count beside it are live.
 *
 * Fetched once per page load rather than per component: both `RatingLine` and
 * `ReviewCarousel` call this, and the shared key plus `getCachedData` mean one
 * request, reused on client-side navigation.
 */
export function useReviews() {
  const { data } = useFetch<ReviewsResponse>('/api/reviews', {
    key: 'google-reviews',
    // The route cannot fail, but a network hiccup on a client-side navigation
    // can — and a hero must render regardless of what Google had to say.
    default: (): ReviewsResponse => ({ google: null }),
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  })

  const summary = computed<ReviewSummary>(() => {
    const google = data.value?.google
    if (!google) return staticRating

    return {
      label: staticRating.label,
      stars: google.stars,
      count: formatReviewCount(google.total),
    }
  })

  /** Google's reviews, if there are any to show. */
  const fromGoogle = computed<Review[]>(() => data.value?.google?.reviews ?? [])

  /** Whether what `reviews` holds came from Google. */
  const live = computed(() => fromGoogle.value.length > 0)

  const reviews = computed<Review[]>(() =>
    live.value ? fromGoogle.value : staticReviews,
  )

  return { summary, reviews, live }
}
