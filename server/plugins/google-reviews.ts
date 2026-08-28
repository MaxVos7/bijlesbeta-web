/**
 * Fetches the Google reviews once at startup.
 *
 * The cache in `server/utils/google-reviews.ts` lives in the process, so a
 * deploy or a daemon restart empties it. Without this the first visitor after
 * one of those waits on Google's round trip inside their own render; with it,
 * that cost is paid at boot, before nginx sends anything this way.
 *
 * A no-op when NUXT_GOOGLE_PLACES_API_KEY / NUXT_GOOGLE_PLACE_ID are unset,
 * and it never rejects — a failure here leaves the site on the transcribed
 * reviews and retries on the first request.
 */
export default defineNitroPlugin(() => {
  warmGoogleReviews()
})
