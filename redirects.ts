/**
 * Permanent redirects from the WordPress URLs bijlesbeta.nl serves today onto
 * this app's routes, so inbound links and accumulated ranking survive cutover.
 *
 * Only paths that actually change are listed. Most don't: every
 * `/bijles-<vak>-<stad>` landing, `/over-ons`, `/tarieven`, `/contact`,
 * `/werken-bij`, `/het-bedrijf`, `/zo-werkt-het`, `/aanmelden` and
 * `/algemene-voorwaarden` keep their slug, and all 28 docenten keep theirs.
 *
 * Verified against the live site's sitemaps, not guessed — see the
 * "Checking against bijlesbeta.nl" section in CLAUDE.md.
 */

/** Pages whose slug changed. */
const pages: Record<string, string> = {
  '/examentraining-groningen': '/examentraining',
  '/privacy-statement': '/privacy',
}

/**
 * Kennisbank posts. WordPress nests them under a category segment
 * (`/kennisbank/<categorie>/<slug>/`) that this app doesn't use, so every
 * article moves even when its slug is unchanged. Ten were also shortened;
 * those are paired by article title, not by guessing at the slug.
 */
const articles: Record<string, string> = {
  // Slug unchanged — only the category segment is dropped.
  'havo-5/rekenen-met-procenten': 'rekenen-met-procenten',
  'natuurkunde/elektromagnetisch-spectrum': 'elektromagnetisch-spectrum',
  'natuurkunde/radioactief-verval': 'radioactief-verval',
  'natuurkunde/snelheid-en-versnelling': 'snelheid-en-versnelling',
  'scheikunde/molberekeningen': 'molberekeningen',
  'scheikunde/ph-berekeningen': 'ph-berekeningen',
  'scheikunde/reactievergelijkingen': 'reactievergelijkingen',
  'wiskunde/technieken-voor-differentieren': 'technieken-voor-differentieren',

  // Shortened as well as un-nested.
  'examenstof/statistiek-werken-met-de-effectgrootte': 'effectgrootte',
  'examenstof/statistiek-werken-met-de-kruistabel': 'kruistabel',
  'examenstof/substitutie-eerst-denken-dan-doen': 'substitutie',
  'havo-5/exponentiele-verbanden-wat-gebeurt-er-als-de-tijd-verandert':
    'exponentiele-verbanden',
  'havo-5/lineaire-verbanden-waar-het-misgaat-op-de-toets': 'lineaire-verbanden',
  'natuurkunde/de-drie-wetten-van-netwon-stap-voor-stap': 'wetten-van-newton',
  'natuurkunde/het-periodiek-systeem-verdiepende-vragen-en-uitwerkingen':
    'periodiek-systeem',
  'natuurkunde/oefenvraag-halveringstijd-terug-naar-tsjernobyl-hoe-lang-blijft-jodium-131-gevaarlijk':
    'halveringstijd-tsjernobyl',
  'scheikunde/zouten-molecuulformules-en-oplosreacties': 'zouten',
  'wiskunde/afgeleide-functies-wat-betekent-dat-eigenlijk': 'afgeleide-functies',
}

type Redirect = { redirect: { to: string, statusCode: 301 } }

/**
 * Targets carry the trailing slash, which is this site's canonical form.
 * Pointing at the bare path instead would send every legacy URL through two
 * hops — the rule, then `server/middleware/trailing-slash.ts`.
 */
function permanent(to: string): Redirect {
  // A `**` target already carries whatever the source had, slash included.
  const needsSlash = !to.endsWith('/') && !to.endsWith('**')
  return { redirect: { to: needsSlash ? `${to}/` : to, statusCode: 301 } }
}

/**
 * Route rules for `nuxt.config.ts`.
 *
 * Each path is registered with and without its trailing slash — the live URLs
 * all carry one, and Nitro matches the two separately.
 */
export const legacyRedirects: Record<string, Redirect> = Object.fromEntries(
  Object.entries({
    ...pages,
    // Docenten are a kennisbank category on the live site. All 28 slugs are
    // unchanged, so the whole subtree forwards as a wildcard.
    '/kennisbank/docenten/**': '/docenten/**',
    ...Object.fromEntries(
      Object.entries(articles).map(([from, slug]) => [
        `/kennisbank/${from}`,
        `/kennisbank/${slug}`,
      ]),
    ),
  }).flatMap(([from, to]) =>
    from.endsWith('/**')
      ? [[from, permanent(to)]]
      : [
          [from, permanent(to)],
          [`${from}/`, permanent(to)],
        ],
  ),
)
