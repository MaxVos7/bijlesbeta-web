# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

The public marketing site for Bijles Bèta, a tutoring company in Groningen
(wiskunde, natuurkunde, scheikunde). It replaces the front end of the older
Laravel app that lives at `../bijlesbeta`.

Nuxt 4 (Vue 3, SSR) + Tailwind CSS v4. No database.

## Node version

**Node 22 is required.** The shell's default is Node 16 via Herd, which cannot
run Nuxt 4. Prefix commands with:

```bash
export PATH="$HOME/Library/Application Support/Herd/config/nvm/versions/node/v22.13.1/bin:$PATH"
```

## Before saying a change works

```bash
npm run typecheck
npm run build
```

Both must pass. There is no test suite yet.

## Conventions

- **Content is data, not markup.** User-facing copy belongs in `app/data/site.ts`
  or `app/data/kennisbank.ts`. Don't inline new body copy into templates.
- **Colours come from tokens.** Use `brand-*` / `accent-*` utilities, which read
  from the `@theme` block in `app/assets/css/main.css`. Never hard-code a hex
  value or reach for `blue-600` directly.
- **Shared primitives are `@utility`, not `@layer components`.** Tailwind v4
  cannot `@apply` a class declared in `@layer components`. If a shared class
  needs to be composable, declare it with `@utility`.
- **Dutch, informal `je`/`jij`.** All user-facing text is Dutch. Code, comments
  and commit messages are English.
- **No database.** Anything needing persistence goes to the Laravel app via
  `server/utils/laravel.ts`.

## Forms

`server/api/contact.post.ts` and `server/api/aanmelden.post.ts` validate with
zod, silently accept honeypot hits, and forward to Laravel. When
`NUXT_LARAVEL_API_URL` is unset they log in dev and return 503 in production —
that 503 is intentional. Do not make them silently succeed.

The matching Laravel endpoints have not been built yet.

The signup wizard is data-driven: `app/data/signup.ts` defines the steps and
returns each step's fields as a function of the answers so far, mirroring the
Gravity Form's conditional logic. Change questions, options and rules there, not
in `SignupForm.vue`. `server/api/adres.get.ts` is a read-only PDOK proxy for the
postcode lookup — it stores nothing and never throws at its caller.

## Design work

The design is applied to `/`, `/over-ons`, `/tarieven`, `/aanmelden`,
`/contact`, `/werken-bij`, `/bijles-[vak]-[stad]`, `/docenten/[slug]`,
`/examentraining` and the shared chrome, from a Claude Design handoff.
`app/assets/css/main.css` carries the real palette — an amber brand on cream
and sand grounds, with a warm `ink-*` ramp, Plus Jakarta Sans for headings and
Open Sans for body copy. The tokens are no longer placeholders.

A second handoff (`Tarieven.dc.html`) pulled the tokens to bijlesbeta.nl
parity, so a few things are now deliberate and shouldn't drift back:

- **One amber.** `brand-500` and `accent-500` are both `#ffbb00`; the live site
  runs no separate accent. `brand-600` (`#f0b000`) is the hover.
- **Two radii.** Controls round on 4px (`field`, `btn`), surfaces on 8px
  (`panel`, `tile`, `card`). All five names survive so components didn't have
  to change, but they resolve onto those two values — don't reintroduce
  one-off `rounded-[11px]`-style overrides.
- **Three inks at the dark end.** `ink-900` (`#1d1d1b`) is the deep ink and is
  for grounds and rules only — the dark bands, the inverted package, the 1.5px
  underline beneath text links. Body copy and headings sit on `ink-800`
  (`#333`), which is what `<body>` sets; `ink-850` (`#222`) is the package
  descriptions and nothing else. Reach for `text-ink-800`, never
  `text-ink-900`.
- **`parchment` (`#f5f3e9`)** is the page ground on `<body>` and the fill of
  the highlighted package — a hair warmer than `sand`, and not interchangeable
  with it.
- **The kicker is `accent-500` at 18px**, matching the live site exactly. That
  amber on cream is ~1.6:1, well under WCAG AA, and it is a deliberate call:
  parity was chosen over contrast because the kicker is decorative and always
  repeats above a heading that carries the same meaning in full ink. Don't
  "fix" it back to `brand-700` without raising it first.
- **`btn` is 15px/700 Plus Jakarta Sans, 14px/20px padding, 12px gap, and an
  11px line-height.** The odd leading is the live site's and is what makes the
  button 39px tall rather than 50px — the label's leading sets the height, not
  the padding. It only works because `btn` is `whitespace-nowrap`; if a button
  ever needs to wrap, give that one an explicit leading rather than removing
  this.

### The header

`SiteHeader` is a literal reconstruction of the live site's Elementor header
and is measured against it, not designed. Three things follow from that and
should not be "tidied":

- **Its breakpoints are Elementor's, not Tailwind's** — mobile ≤767, tablet
  768–1024, desktop ≥1025. `md:` covers the tablet floor; the desktop floor is
  the `desk:` breakpoint added to `@theme`, because `lg:` starts a pixel early.
  `desk` is declared in rem (`64.0625rem`) deliberately: a px value, or a bare
  `min-[1025px]:` variant, sorts ahead of `sm` in the generated stylesheet and
  then loses every conflict with `md:`.
- **The three columns run on percentage widths** — 20/53/25 on desktop,
  14/64/19 on tablet, 30/43/13 on mobile, with the actions column reordered
  ahead of the menu toggle below 768px. Those percentages are what put the nav
  and the CTA where they sit; content-width layout gets it visibly wrong.
- **The strip around the bar has no ground of its own.** The bar floats on the
  page's own band and the page scrolls behind it, so the strip must stay clear
  rather than repainting `cream` a shade off `parchment`. `headerGround: 'ink'`
  is the one override, for a page whose hero opens on the dark band.

The card is 12px, `shadow-header`, 16px/24px padding, and the CTA is the
Elementor button rather than `btn`: 15/13/12px by breakpoint with its own
padding, and it inverts to `ink-900` on hover instead of stepping to
`brand-600`.

Nav items are `ink-900`, going amber on hover *and* on the current page — the
live rule groups `:hover`, `:focus` and `.elementor-item-active` onto the one
accent colour, so `active-class` is part of the parity, not decoration.

### Checking against bijlesbeta.nl

Don't measure from screenshots — the live site's real values are readable
straight from its Elementor kit. The homepage's is
`bijlesbeta.nl/wp-content/uploads/elementor/css/post-14.css`, and the global
palette is in `post-6.css`:

    primary / text  #1D1D1B      accent     #FFBB00
    secondary       #FFFFFF      2afe360    #1D1D1B8C  (= our `ink-600`)
    5227cc2         #1D1D1B1A    8a029d9    #F5F3E9    (= `parchment`)

Two traps when diffing this way. The live site marks kickers up as `<h2>` and
the section title as `<h3>` (an Elementor quirk) while we use `<p>` + `<h2>`,
so a headings-only query reports our kickers as missing when they aren't —
ours is the better outline and shouldn't change. And `.nl` has no single body
size: the hero paragraph is 16px, card body copy is 15px/28px.

Our slugs don't match theirs, so the page you want is rarely at the path you'd
guess. `elementor-page-<id>` in a page's HTML gives you its post id:

| ours | bijlesbeta.nl | post |
|---|---|---|
| `/` | `/` | 14 |
| `/aanmelden` | `/aanmelden/` | 103 |
| `/contact` | `/contact/` | 46 |
| `/over-ons` | `/over-ons/` | 239 |
| `/tarieven` | `/tarieven/` | 44 |
| `/werken-bij` | `/werken-bij/` | 45 |
| `/het-bedrijf` | `/het-bedrijf/` | 1567 |
| `/zo-werkt-het` | `/zo-werkt-het/` | 42 |
| `/examentraining` | `/examentraining-groningen/` | 2180 |
| `/kennisbank` | `/kennisbank/` | 204 |
| `/kennisbank/[slug]` | `/kennisbank/<cat>/<slug>/` | 169 |
| `/docenten/[slug]` | `/kennisbank/docenten/<slug>/` | 827 |
| `/privacy` | `/privacy-statement/` | 1897 |
| `/bijles-[vak]-[stad]` | `/bijles-<vak>-<stad>/` | 2247 |

The docenten and kennisbank article pages are posts, not pages, so they're in
`post-sitemap.xml` rather than `page-sitemap.xml`.

### Redirects

`redirects.ts` holds 301s from the WordPress URLs to this app's routes, wired
into `routeRules` in `nuxt.config.ts`. Only changed paths are listed — the
landings, `/over-ons`, `/tarieven` and the rest keep their slugs, as do all 28
docenten. What moves is `/examentraining-groningen`, `/privacy-statement`, the
whole `/kennisbank/docenten/**` subtree, and every kennisbank article (WordPress
nests those under a category segment we don't use; ten were shortened too).

Each path is registered with *and* without its trailing slash — the live URLs
all carry one and Nitro matches the two separately. If you add a kennisbank
article that existed on WordPress, add its old path here as well.

Two live pages deliberately have no redirect: `/aanmelden-test/` is a WordPress
scratch page, and `/excel-training-groningen/` is a real service this app
doesn't cover. Pointing it at an unrelated page would be worse than the 404 —
give it a page or leave it.

### The type scale

Every live page runs the same five steps, and none of them exceed 32px:

    page H1        32px / 44px   (26px below 768px; 42px on kennisbank posts)
    section title  28px / 44px
    sub-heading    22px / 44px   (27px on a few inner pages)
    card heading   19px / 26px
    card title     19px / 20px   (the tight one, subject cards)
    body           15px / 28px   (hero paragraphs 16px / 28px)
    kicker         18-19px       (15px for the small eyebrows)

Our headings stay fluid — `clamp()` with the floor and vw slope intact — but
no ceiling may exceed the step above. Before this pass there were 28 distinct
clamp sizes topping out at 50px; keep new headings on the existing sizes
rather than inventing a 29th.

The content column is **1100px** (`container-page`, and the `max-w-[1100px]`
on the pages that don't use it), which is the `--content-width` the live
containers actually set. A few live bands run 1200px or 1368px; 1100 is the
one the body copy sits in.

The live site steps type at 767px and nowhere else, so Tailwind's `md` lines
up with it exactly. Only two things actually take that step: the page H1
(32px → 26px) and the four icon-box feature cards in `FeatureGrid` (19px →
16px). Subject-card titles and section titles hold one size at every width —
don't add breakpoints they don't have.

`/contact` puts its hero and its form panel in one sand band and sets its FAQ
heading beside the accordion, so it uses neither `PageHero` nor `FaqSection`.
Its form is `ContactForm` in its `panel` variant, with the name split in two,
no phone field, placeholders instead of labels and required privacy consent.

`/werken-bij` opens on a dark `ink-900` hero band rather than the usual cream
one, so `SiteHeader` reads a `headerGround` route meta (set via
`definePageMeta`) to darken the sticky strip instead of leaving it clear —
see `app/types/route-meta.d.ts`. `RatingLine` has a matching `inverse` tone
for use on that band. The application form is its own `ApplicationForm`
component, not a `ContactForm` variant, since it collects a different shape
of answers; it still posts through `/api/contact` with a fixed subject.

`/bijles-[vak]-[stad]` is one template rendered per subject-and-city pair —
add a city by adding a data entry in `app/data/landings.ts`, not a new page
file. Its hero also opens on a dark photographic band, so it mounts
`SiteHeader` itself with the `transparent` prop instead of going through the
`default` layout; see `app/layouts/landing.vue`.

`/examentraining` is a one-off exam bootcamp page (`app/data/site.ts`'s
`examentraining` object), separate from the ongoing weekly bijles. Two
components picked up small optional props to support it rather than forking
them: `RatingLine` takes a `label` override (the hero reads "7 jaar ervaring"
instead of "Uitstekend") and `FaqList` takes an `items` override (this page's
own 3 questions instead of the sitewide `faqs`). Its 4 feature-card icons are
placeholders (dashed box + generic image glyph) — the design handoff left
these as empty image slots with no artwork; drop real icon graphics into
`app/pages/examentraining.vue` when they exist. Its promo-video block is
wired up (click reveals the embed area) but has no video yet either — set
`YOUTUBE_URL` at the top of that page once there's a real link. All CTAs and
the FAQ's "Neem contact op!" point at `#aanmelden` on the same page (plain
`<a href>`, matching the pattern in `tarieven.vue`/`werken-bij.vue`), not the
`/contact` route.

`/kennisbank` had no design to work from and still uses the scaffold's
`slate-*` greys. When restyling it, replace `slate-*` with `ink-*` / `line-*`
and take grounds from `cream` / `sand` / `mist` / `ivory` — don't introduce a
second neutral scale. Keep preferring token and utility changes over
rewriting page markup.

Sections shared across pages are components, not copy-paste: `TrialCta` (the
amber closing block, with its own short form), `FaqSection`, `StatsBand`,
`ReviewCarousel`, `TutorCard`, `CheckList` and `RatingLine`.

Watch flex children that hold an `auto-fit` grid — they need `min-w-0` or the
grid refuses to shrink and the page overflows on a phone. Check new pages at
360px wide.

## Deployment

Laravel Forge, as a Node SSR daemon behind an nginx proxy. See README.md for the
full setup. Consequences for code: no filesystem writes at runtime, and
environment variables must be declared in `runtimeConfig` in `nuxt.config.ts` to
be readable.
