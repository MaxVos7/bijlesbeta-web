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

With `NUXT_PORTAL_API_URL` empty, form submissions are logged to the console
instead of being sent anywhere — so the forms stay testable locally.

## Scripts

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Dev server with HMR                           |
| `npm run build`     | Production build into `.output/`               |
| `npm run preview`   | Serve the production build locally             |
| `npm run typecheck` | `vue-tsc` over the whole project               |

One-off helper: `node --env-file=.env scripts/find-place-id.mjs` prints the
Google place id for `NUXT_GOOGLE_PLACE_ID`.

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
  api/reviews.get.ts      Google reviews + rating count, cached in memory
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

## Forms → the portal

All three form routes validate with zod, drop honeypot submissions silently,
then POST to the portal (`mijn.bijlesbeta.nl`) behind an `X-Secret-Key` header:

| Nuxt route            | Portal endpoint                  |
| --------------------- | -------------------------------- |
| `/api/contact`        | `/register-external-contact`     |
| `/api/aanmelden`      | `/register-external-full`        |
| `/api/solliciteren`   | `/register-external-applicant` + `/upload-external-resume` |

(`/api/adres` is not part of this — it reads from PDOK and stores nothing.)

**Nothing in the hand-off throws.** Every submission is also mailed to the
office, so a portal that is down, unconfigured, or refusing a field costs a log
line rather than a lead; the visitor only sees an error when the hand-off *and*
that mail both failed. `/contact` is the exception that sends the office copy
only on failure, because the portal's own admin notification for a contact
request already carries the whole message. See "Forms" and "The office copy" in
`CLAUDE.md` before changing any of this.

`GET /api/_diagnose?key=<NUXT_DIAGNOSE_KEY>` reports which variables the running
process can see and what the SMTP server says when we connect. It 404s while
that key is unset.

## Reviews

The rating line under every hero and the review carousel read `/api/reviews`,
which fetches Place Details from the Google Places API (New) — the average, the
rating count and up to five reviews — and holds the answer in memory for six
hours. Stale data is served while a refresh runs and kept if the refresh fails,
so a Google outage doesn't blank the reviews mid-afternoon.

With `NUXT_GOOGLE_PLACES_API_KEY` or `NUXT_GOOGLE_PLACE_ID` empty, nothing is
called and the site shows the reviews transcribed in `app/data/site.ts`, which
is what it showed before this existed. Both sets render through the same
components. `/api/_diagnose` reports what the lookup last did.

## Environment variables

See `.env.example`. On Forge these go in the site's **Environment** tab.

| Variable                 | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| `NUXT_PUBLIC_SITE_URL`   | Canonical base URL                             |
| `NUXT_PUBLIC_PORTAL_URL` | Link target for the "Inloggen" button          |
| `NUXT_PORTAL_API_URL`    | Base URL of the portal receiving all three forms |
| `NUXT_PORTAL_SECRET_KEY` | Shared secret for those endpoints              |
| `NUXT_MAIL_*`            | SMTP for the office copy — see `.env.example`  |
| `NUXT_OFFICE_EMAIL`      | Where contact + signup copies land             |
| `NUXT_APPLICATIONS_EMAIL`| Where application copies land                  |
| `NUXT_GOOGLE_PLACES_API_KEY` | Places (New) key for the live reviews; empty calls nothing |
| `NUXT_GOOGLE_PLACE_ID`   | Which place those reviews are of              |
| `NUXT_DIAGNOSE_KEY`      | Unlocks `/api/_diagnose`; leave empty in normal operation |
| `NUXT_PUBLIC_GTM_ID`     | Tag Manager container; empty loads nothing     |
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

Forge runs the app under **PM2**, not Supervisor — a JS site has no entry under
Processes → Background processes, and the start command lives in the ecosystem
file the deploy script writes:

```bash
$CREATE_RELEASE()

cd $FORGE_RELEASE_DIRECTORY

npm ci || npm install
npm run build

$ACTIVATE_RELEASE()

# PM2 config, rewritten every deploy so changes here take effect...
mkdir -p /home/forge/.pm2-conf
cat <<'EOF' > /home/forge/.pm2-conf/site-XXXXXXX.json
{
    name: "site-XXXXXXX",
    cwd: "/home/forge/bijlesbeta.nl/current",
    script: "./.output/server/index.mjs",
    node_args: "--env-file=/home/forge/bijlesbeta.nl/.env",
    instances: "max",
    exec_mode: "cluster",
    port: "3000",
}
EOF

# Start or restart the PM2 process from that config...
pm2 startOrRestart /home/forge/.pm2-conf/site-XXXXXXX.json --update-env
pm2 save
```

Three things there are the result of getting them wrong first, and should not be
tidied back:

- **`node_args: "--env-file=..."` is what gets the environment into the
  process.** Nitro does not read `.env` itself in production, and Forge's
  generated config passes no node arguments — so without this the app runs with
  *no* configuration at all: no portal URL, no SMTP, and forms that silently
  reach nobody.
- **The path must be absolute.** Node reads the env file during bootstrap,
  before PM2 applies the app's `cwd`, so a relative `--env-file=.env` resolves
  against the PM2 daemon's own directory, fails, and puts the app in a crash
  loop that takes the site down.
- **`pm2 startOrRestart <file>`, not `pm2 reload <name>`.** Reloading by name
  uses PM2's stored config and never re-reads the JSON, so config changes appear
  to do nothing. Forge's generated script also guards the file with
  `if [ ! -f ... ]`, which means it is written once and never updated — drop the
  guard.

Check `PORT` in the Environment tab before the first deploy with this. Until the
env file loads, Nitro defaults to 3000 and nginx proxies there; the moment it
loads, whatever `PORT` says takes effect.

**4. Environment**

Settings → Environment writes `.env` for the site; the deploy script links it
into each release. Nothing reads it unless step 3 is in place.

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
