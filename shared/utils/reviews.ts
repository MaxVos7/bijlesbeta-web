/**
 * The shape of a review, and the two ways it is written for a reader.
 *
 * It lives in `shared/` for the same reason `phone.ts` does: both halves have
 * to agree on it. The server maps Google's Place Details response onto this
 * type, `app/data/site.ts` carries the transcribed reviews in it as the
 * fallback, and the components render one without knowing which they were
 * handed.
 */

export type Review = {
  /** Stars this reviewer gave, 1-5. */
  rating: number
  /** Stable key. Google's review resource name; the author on a static one. */
  id: string
  /**
   * The bold lead above the quote. Google reviews have no title field — only
   * the transcribed ones carry one, so the card renders it conditionally.
   */
  title?: string
  body: string
  author: string
  /**
   * The line under the name: the reviewer's role on a transcribed review
   * ("Ouder van een middelbare scholier"), and Google's own
   * `relativePublishTimeDescription` ("3 maanden geleden") on a live one.
   */
  affiliation?: string
  /**
   * The reviewer's Google profile. Present on live reviews only, and rendered
   * as a link on the name — attribution is a condition of using the API's
   * content, not decoration.
   */
  authorUrl?: string
}

/** The `Uitstekend ★★★★★ 20+ Reviews` line, already written out. */
export type ReviewSummary = {
  /**
   * The bold lead. Deliberately *not* derived from the score: "Uitstekend" is
   * the live site's own label and is picked up as a meta description on
   * `/zo-werkt-het` — see the SEO note in CLAUDE.md.
   */
  label: string
  /** Average score, 0-5. `StarRating` fills fractions. */
  stars: number
  /** The tail, e.g. `20+ Reviews` or `34 Reviews`. */
  count: string
}

/** What Google knows about the place, mapped onto our own shape. */
export type GoogleReviews = {
  /** Average over every rating, not only the reviews returned. */
  stars: number
  /** `userRatingCount` — every rating, including the wordless ones. */
  total: number
  /** At most five, in Google's own order. See `server/utils/google-reviews.ts`. */
  reviews: Review[]
}

/**
 * What `/api/reviews` answers.
 *
 * `null` means the lookup is unconfigured, still cold or failing, and the
 * caller should show the transcribed reviews instead. It is never an error:
 * a rating line that can't reach Google still has to render.
 */
export type ReviewsResponse = { google: GoogleReviews | null }

/**
 * `4.8` -> `4,8`, `5` -> `5`.
 *
 * The screen-reader sentence beside the stars reads this out, and it is Dutch
 * copy like everything else on the page, so it takes a decimal comma.
 */
export function formatStars(value: number): string {
  return (Math.round(value * 10) / 10).toString().replace('.', ',')
}

/** The tail of the rating line, matching the live site's `20+ Reviews`. */
export function formatReviewCount(total: number): string {
  return `${total} ${total === 1 ? 'Review' : 'Reviews'}`
}
