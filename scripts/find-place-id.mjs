/*
  What is our Google place id?

  `NUXT_GOOGLE_PLACE_ID` is the one thing the reviews lookup needs that isn't
  a credential, and it is not visible anywhere in the Google Business Profile
  UI. This asks Places Text Search for it by name.

  Run it from the repository root with Node 22, with the API key in the
  environment — `--env-file` because Node does not read `.env` on its own:

      node --env-file=.env scripts/find-place-id.mjs
      node --env-file=.env scripts/find-place-id.mjs "Bijles Bèta Groningen"

  It prints every candidate with its address and rating count, so the right
  one is recognisable. Put its id in `.env` as NUXT_GOOGLE_PLACE_ID and in
  Forge's Environment tab.

  This is billed as one Text Search request (Essentials), and it is meant to
  be run about once — the place id of a business does not change.
*/

const SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText'

const key = process.env.NUXT_GOOGLE_PLACES_API_KEY

if (!key) {
  console.error(
    'NUXT_GOOGLE_PLACES_API_KEY is not set.\n'
    + 'Run this as `node --env-file=.env scripts/find-place-id.mjs` from the repository root.',
  )
  process.exit(1)
}

const query = process.argv[2] ?? 'Bijles Bèta Groningen'

const response = await fetch(SEARCH_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': key,
    'X-Goog-FieldMask':
      'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount',
  },
  body: JSON.stringify({ textQuery: query, languageCode: 'nl', regionCode: 'NL' }),
})

const body = await response.json()

if (!response.ok) {
  // Google's own error text names the cause: an API that isn't enabled on the
  // project, a key restricted to HTTP referrers, a billing account that isn't.
  console.error(`Places Text Search answered ${response.status}:`)
  console.error(JSON.stringify(body, null, 2))
  process.exit(1)
}

const places = body.places ?? []

if (!places.length) {
  console.log(`No place matched "${query}". Try the name as it reads on Google Maps.`)
  process.exit(0)
}

console.log(`${places.length} match${places.length === 1 ? '' : 'es'} for "${query}":\n`)

for (const place of places) {
  const name = place.displayName?.text ?? '(no name)'
  const rating = place.rating ? `${place.rating} uit ${place.userRatingCount ?? 0} ratings` : 'no ratings'
  console.log(`  ${name} — ${place.formattedAddress ?? 'no address'}`)
  console.log(`  ${rating}`)
  console.log(`  NUXT_GOOGLE_PLACE_ID=${place.id}\n`)
}
