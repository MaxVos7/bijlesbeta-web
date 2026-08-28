import type { ReviewsResponse } from '#shared/utils/reviews'

/**
 * The Google reviews, for the rating line and the carousel.
 *
 * Read-only, public and cheap: the answer is held in memory for six hours by
 * `server/utils/google-reviews.ts`, so this is a property read on all but four
 * requests a day. It never fails — `{ google: null }` is the honest answer
 * when the lookup is unconfigured, still cold or erroring, and the components
 * then render the transcribed reviews from `app/data/site.ts` instead.
 *
 * Proxied rather than called from the browser because the Places key is a
 * server credential: in the page it would be readable by anyone and billable
 * by anyone. It also keeps one cache in front of Google instead of one per
 * visitor.
 */
export default defineEventHandler(async (event): Promise<ReviewsResponse> => {
  const google = await googleReviews()

  /*
    Five minutes in the browser, so a client-side navigation between two pages
    with a rating line doesn't ask again. `no-store` while there is nothing to
    show, so a deploy that is still being configured recovers on the next
    request rather than at the end of a cache window.
  */
  setResponseHeader(
    event,
    'cache-control',
    google ? 'public, max-age=300' : 'no-store',
  )

  return { google }
})
