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
`/docenten/[slug]` and the shared chrome, from a Claude Design handoff.
`app/assets/css/main.css` carries the real palette — an amber brand on cream and
sand grounds, with a warm `ink-*` ramp and Archivo as the typeface. The tokens
are no longer placeholders.

`/contact`, `/werken-bij` and `/kennisbank` had no design to work from and still
use the scaffold's `slate-*` greys. When restyling them, replace `slate-*` with
`ink-*` / `line-*` and take grounds from `cream` / `sand` / `mist` / `ivory` —
don't introduce a second neutral scale. Keep preferring token and utility changes
over rewriting page markup.

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
