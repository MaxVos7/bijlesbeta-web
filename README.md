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
  components/             SiteHeader, SiteFooter, PageHero, FaqList, forms
  data/site.ts            Nav, contact details, pricing plans, FAQ copy
  data/kennisbank.ts      Kennisbank articles (typed, no CMS)
  layouts/default.vue     Header + main + footer shell
  pages/                  File-based routes
  error.vue               404 / error page
server/
  api/contact.post.ts     Validates + forwards contact form
  api/aanmelden.post.ts   Validates + forwards signup form
  utils/laravel.ts        Forwarding + honeypot helpers
```

### Routes

`/` · `/over-ons` · `/tarieven` · `/kennisbank` · `/kennisbank/[slug]` ·
`/werken-bij` · `/contact` · `/aanmelden`

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

- Laravel endpoints for contact + signup, and pointing `NUXT_LARAVEL_API_URL` at them
- Visual design — a dedicated design session will work through `main.css` and the components
- Real logo, favicon, and OG images (currently the default Nuxt favicon)
- Docent profiles on `/over-ons` (currently a placeholder with a `TODO`)
- Sitemap generation (`robots.txt` already references `/sitemap.xml`)
- Analytics, and redirects from the old URL structure
