# bijlesbeta-web

Public marketing site for **Bijles Bèta** — the replacement for the current
bijlesbeta.nl front end. Built with Nuxt 4 and Tailwind CSS v4, deployed as a
Node SSR app on Laravel Forge.

The student/teacher portal (`mijn.bijlesbeta.nl`) stays in the existing Laravel
app. This project holds **no database**: contact and signup submissions are
forwarded to Laravel over HTTP.

## Requirements

- Node 22 (see `.nvmrc`) — Nuxt 4 does not run on Node 16
- npm 10+

Herd ships several Node versions. If `node -v` shows 16, switch first:

```bash
export PATH="$HOME/Library/Application Support/Herd/config/nvm/versions/node/v22.13.1/bin:$PATH"
```

## Getting started

```bash
npm install
cp .env.example .env
npm run dev            # http://localhost:3000
```

With `NUXT_LARAVEL_API_URL` empty, form submissions are logged to the console
instead of being sent anywhere — so the forms stay testable locally.

## Scripts

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Dev server with HMR                           |
| `npm run build`     | Production build into `.output/`               |
| `npm run preview`   | Serve the production build locally             |
| `npm run typecheck` | `vue-tsc` over the whole project               |

## Project layout

```
app/
  assets/css/main.css     Design tokens (@theme) + shared utilities (@utility)
  components/             SiteHeader, SiteFooter, PageHero, FaqList, StatsBand, forms
  data/site.ts            Nav, contact details, pricing plans, FAQ copy, stats, reviews
  data/signup.ts          Aanmeld wizard: steps, fields, options, conditional logic
  data/kennisbank.ts      Kennisbank articles (typed, no CMS)
  layouts/default.vue     Header + main + footer shell
  pages/                  File-based routes
  error.vue               404 / error page
server/
  api/contact.post.ts     Validates + forwards contact form
  api/aanmelden.post.ts   Validates + forwards signup form
  api/adres.get.ts        Postcode → street/city/codes, proxied to PDOK
  utils/laravel.ts        Forwarding + honeypot helpers
```

### The aanmeld wizard

`/aanmelden` is a four-step wizard ported from the Gravity Form
"Aanmeldformulier" that runs on the current site. `app/data/signup.ts` holds the
whole form as data — each step's fields are a function of the answers so far,
which is how Gravity Forms' conditional logic is reproduced. `SignupForm.vue`
only renders what that module returns, so changing a question, an option or a
rule is a data edit rather than a template one. Each key carries its Gravity
Forms field id in a comment for mapping the payload downstream.

Street and city are filled from a postcode lookup (`/api/adres`, proxied to the
public PDOK Locatieserver), which also supplies the two codes Gravity Forms
keeps hidden — `woonplaatscode` and `gemeentecode`. Those decide whether an
at-home lesson falls inside gemeente Groningen, which drives the travel-cost and
out-of-region warnings on the last step. The lookup is best-effort: if it fails,
the visitor types street and city themselves and the warnings simply stay
hidden.

### Routes

`/` · `/over-ons` · `/tarieven` · `/kennisbank` · `/kennisbank/[slug]` ·
`/werken-bij` · `/contact` · `/aanmelden` · `/docenten/[slug]`

`/docenten/[slug]` renders one tutor from `app/data/tutors.ts`; an unknown slug
404s. There is no `/docenten` index — `/over-ons#team` is the listing.

### Content

Copy lives in `app/data/site.ts` and `app/data/kennisbank.ts`, not inline in
templates. That way layouts can be redesigned without retyping text, and
contact details change in exactly one place.

The kennisbank is a typed TypeScript module rather than a CMS — zero extra
dependencies. If it grows past ~20 articles, or non-developers need to edit it,
swap in `@nuxt/content`; the page components only depend on the `Article` type.

### Styling

`app/assets/css/main.css` is the single styling entry point:

- `@theme` block — colour scale, fonts, spacing. **Change brand colours here**,
  not in components.
- `@utility` blocks — `btn`, `btn-primary`, `btn-secondary`, `container-page`,
  `section`, `field-input`, etc. Pages reference these, so restyling a button
  everywhere is a one-place edit.

Note: in Tailwind v4 a class you want to `@apply` must be declared with
`@utility`, not inside `@layer components`.

## Forms → Laravel

Both form endpoints validate with zod, drop honeypot submissions silently, then
POST to the Laravel app:

| Nuxt route          | Laravel endpoint          |
| ------------------- | ------------------------- |
| `/api/contact`      | `/api/website/contact`    |
| `/api/aanmelden`    | `/api/website/aanmelden`  |

(`/api/adres` is not part of this — it reads from PDOK and stores nothing.)

**These Laravel endpoints do not exist yet** — they need to be added to the
`bijlesbeta` app (or the paths in `server/api/*.post.ts` pointed at whatever
they end up being called). Until `NUXT_LARAVEL_API_URL` is configured, the
endpoints return a 503 with a Dutch message telling visitors to call instead —
deliberately loud rather than silently discarding leads.

## Environment variables

See `.env.example`. On Forge these go in the site's **Environment** tab.

| Variable                 | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| `NUXT_PUBLIC_SITE_URL`   | Canonical base URL                             |
| `NUXT_PUBLIC_PORTAL_URL` | Link target for the "Inloggen" button          |
| `NUXT_LARAVEL_API_URL`   | Base URL of the Laravel app receiving forms    |
| `NUXT_LARAVEL_API_TOKEN` | Optional bearer token for those requests       |
| `PORT`                   | Port the Node server listens on                |

## Deploying on Laravel Forge

Nuxt runs here as an SSR Node process behind nginx — not as static files.

**1. Create the site**

Project type **Static HTML / Nuxt.js / Next.js**, then install the repository
`MaxVos7/bijlesbeta-web`, branch `main`.

**2. Make sure the server has Node 22**

Forge's default Node may be older. Check with `node -v` over SSH and install 22
if needed.

**3. Deploy script**

```bash
cd /home/forge/bijlesbeta.nl
git pull origin $FORGE_SITE_BRANCH
npm ci
npm run build
sudo -S supervisorctl restart daemon-XXXXXX:*
```

Replace `daemon-XXXXXX` with the supervisor name of the daemon from step 4
(visible under the daemon in Forge, or via `sudo supervisorctl status`).

**4. Daemon**

Add a daemon on the server:

- **Command:** `node --env-file=.env .output/server/index.mjs`
- **Directory:** `/home/forge/bijlesbeta.nl`
- **User:** `forge`

`--env-file` is what gets the environment into the process — Nitro does not read
`.env` itself in production. Make sure `.env` exists on the server with at least
`PORT` and `NUXT_LARAVEL_API_URL`.

**5. Nginx**

Edit the site's nginx configuration and proxy to the Node process:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

**6. SSL** via Forge's Let's Encrypt integration.

### Static alternative

If the SSR process turns out to be more operational overhead than it's worth,
`npm run generate` produces a fully static site in `.output/public` that Forge
can serve directly with no daemon. The trade-off: the form endpoints disappear,
so the forms would have to post to Laravel directly (and CORS gets involved).

## Still to do

- **`/algemene-voorwaarden` and `/privacy` do not exist yet** — the footer and
  the signup consent checkbox both link to them, so those links 404 today. The
  consent link is the urgent one.
- Laravel endpoints for contact + signup, and pointing `NUXT_LARAVEL_API_URL` at
  them. The signup payload now matches the Gravity Form's field set — see
  `server/api/aanmelden.post.ts` for its shape.
- Spam protection on signup is the honeypot only. The Gravity Form also runs
  Cloudflare Turnstile; adding it here needs a site key and a secret.
- `/contact`, `/werken-bij` and `/kennisbank` have no design in the handoff, so
  they still use the scaffold's slate greys. They wear the new header, footer and
  type, but their page bodies want the same treatment as the rest.
- Several photos are stand-ins. The design left three image slots empty (the
  "Ons verhaal" photo, the Tarieven blackboard shot and the Over ons teamuitje
  banner); those reuse `studenten.png` and `persoonlijk.png` for now. The
  portrait in the trial-lesson block is still hotlinked from bijlesbeta.nl.
- Tutor photos load from `mijn.bijlesbeta.nl`. If that host is ever locked down
  or the portal moves, the team grid goes blank — worth copying them locally.
- Archivo loads from Google Fonts. For a Dutch site, self-hosting the woff2 is
  the safer call on privacy grounds and removes a third-party render dependency.
- Real favicon and OG images (the logo itself is now in `public/logo.svg`)
- Docent profiles on `/over-ons` (currently a placeholder with a `TODO`)
- Sitemap generation (`robots.txt` already references `/sitemap.xml`)
- Analytics, and redirects from the old URL structure
