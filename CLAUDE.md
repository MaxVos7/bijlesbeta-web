# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

The public marketing site for Bijles Bèta, a tutoring company in Groningen
(wiskunde, natuurkunde, scheikunde). It replaces the front end of the older
Laravel app that lives at `../bijlesbeta`.

Nuxt 4 (Vue 3, SSR) + Tailwind CSS v4. No database. hoi 

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

All three form routes validate with zod, silently accept honeypot hits, and
forward to the Laravel side. A fourth, `/api/lead`, is the odd one out: it
mails the office and posts nothing to the portal — see "The proefles block"
below for why.

**Nothing in the hand-off throws any more, and a failed hand-off is no longer
the visitor's problem.** Every submission is also mailed to the office, and the
route only returns an error when *both* the hand-off and that mail failed — see
"The office copy" below. Read that before changing any of the three routes: the
old contract, where an unconfigured or unreachable portal returned 503/502 and
the submission was lost with it, is what this replaced.

All three post through `server/utils/portal.ts` to the portal's external
endpoints, authenticating with an `X-Secret-Key` header (`NUXT_PORTAL_API_URL`
+ `NUXT_PORTAL_SECRET_KEY`). `/aanmelden` and `/solliciteren` use the same
endpoints the Gravity Forms webhooks on bijlesbeta.nl use today — see
`RegisteredUserController::storeExternalFull` / `storeExternalApplicant` in
`../bijlesbeta`. `/contact` posts to `register-external-contact`, which was
built for this app (`ExternalContactController` + the `ContactRequest` model);
there is no second credential and no bearer token anywhere any more.

**The rules live in `shared/utils/form-rules.ts`, once, and neither half may
restate them.** A table per form (`SIGNUP_RULES`, `CONTACT_RULES`,
`APPLICATION_RULES`, `LEAD_RULES`) gives each field its required-ness, its
lengths and its shape. `server/utils/schema.ts` turns a table into the zod
schema the route parses with, and the component checks the visitor's answers
against the same table — over the body it is about to post, not over whichever
questions are on screen — so a submit that the endpoint would refuse cannot be
reached. `SIGNUP_MAX` and the `maxlength` on every control are read off the
same table, and `app/data/signup.ts` carries two one-line type assertions that
fail the build if a wizard question has no rule or a rule no question.

This exists because the two halves drifted, repeatedly and silently, and every
drift cost a real submission: an e-mail the form accepted and zod refused, name
and message fields with no cap on the client, a `LeadForm` that never checked
an address at all — and a `schoolYear` that left the wizard as the number `4`
rather than `"4"`, because `v-model` on an `<input type="number">` casts and
`SignupValues` typing it as a string could not see it. That is also why the
wizard binds its text inputs by hand rather than with `v-model`, and why its
payload is built through an explicit `String()`. Validation belongs in front of
the button; the endpoint's 422 is the backstop for callers that aren't ours.

`node scripts/check-form-rules.mjs` walks every field of every form over a
corpus of awkward values and reports any case where the form and its endpoint
disagree — 2905 pairs, currently none. Run it after touching a rule table or
the zod bridge, which is the one place a rule could still be mistranslated.

**An address the portal already knows is no longer refused.** Both
`register-external-full` and `register-external-applicant` used to answer 422
on an email they recognised — any email at all on the applicant one — so the
registration of everybody who had ever filled in one of our forms was thrown
away and mailed to the office as `NIET VERWERKT` to be typed in by hand: the
parent who signed a child up and now wants to tutor, the docent signing up a
family member, the applicant applying twice. There was nothing for the visitor
to correct and no way to resubmit it differently. Both endpoints now hang the
new person off the account that exists; only a staff account is still refused.
Don't build anything here on the old behaviour returning.

Things the portal's contract forces, which look arbitrary otherwise:

- **Every key goes out on every submission, blanks included** — that is what
  `portalPayload` is for, and it is why it must not go back to dropping empty
  values the way the old `compact` did. The endpoints read several keys
  straight out of `$validator->validated()` with no `??` behind them
  (`account_phone_number` at `RegisteredUserController:228`, `known_via` in
  the applicant branch), so a key we leave out is an undefined array index,
  which Laravel's error handler turns into a 500. A blank one is harmless:
  the portal runs `ConvertEmptyStringsToNull`, so `''` arrives as null, every
  `nullable` rule passes and the key still exists. The Gravity Forms webhook
  posts the whole form every time, which is why the live site never hit this
  and we did — a visitor who left the optional contactpersoon phone number
  blank got a 500 and an aanmelding that lived only in the office copy.

- **Subjects and levels travel as numeric ids, not names.** The id maps live in
  `server/utils/portal.ts` and come from the portal's `SubjectsSeeder` and
  `LevelsSeeder`. The endpoints take `subjects` as a comma-separated id list
  and *silently discard* anything non-numeric, so a label missing from the map
  is dropped without an error and the submission still succeeds — add new
  subjects to both sides. The two split maths are keyed twice for this reason:
  the wizard says `Wiskunde A`/`Wiskunde B` and `/werken-bij` says the portal's
  own `Wiskunde A/C`/`Wiskunde B/D` (the live site's labels on that form), and
  for a while the second pair matched nothing, so an applicant who ticked only
  those was recorded with no subjects at all.
- **`student_subjects_1` is the only subject key we send.** The controller
  reads the first non-empty of `_1.._3`, so the other two are noise.
- **The hours question splits across two mutually exclusive keys**:
  `student_weekly_amount_indication` as a `basis`/`standard`/`premium` band for
  weekly lessons, `student_incidental_amount_indication` as a plain count
  otherwise.
- **`student_year` runs 1 to 6**, because the portal validates
  `integer|min:1|max:6` and rejects the whole submission outside it. The live
  Gravity Form allows 8, so a 7 or 8 fails silently on bijlesbeta.nl today;
  `SIGNUP_RULES` caps it at 1–6, so the wizard and the endpoint both do and
  the visitor is told first.
- **Phone numbers must be `0612345678` or `+31612345678`.** The portal's
  `PhoneNumber` rule takes nothing else — not `06 12 34 56 78`, not
  `06-12345678` — and refuses the entire submission for it. `normalisePhone`
  in `shared/utils/phone.ts` is the one definition of that shape: both forms
  check it before the visitor can move on, and both routes normalise on the
  way out. It lives in `shared/` precisely so the two halves can't drift.
- **Three fields are capped tighter than they look.** `account_postcode` and
  `account_housenumber` are `max:10` and `account_address_comment` is
  `max:255` on the portal, so `SIGNUP_RULES` matches those rather than the
  wizard's own generous limits — and the `maxlength` on the control follows,
  since it is read off the same rule.
- **Five wizard answers have no field on the endpoint** — school, contact
  method, and the "Anders, namelijk…" wording behind lesson kind, level and
  subject. They are appended to `location_indication` under labels, which is
  the only uncapped free-text key. They are deliberately *not* put in
  `account_known_via`, which means "how did you hear about us". The real fix is
  fields on the endpoint, or fewer questions.
- **`street`, `city` and the two PDOK codes are not sent.** The portal
  re-derives the address from postcode and house number in its own job.

The CV on `/solliciteren` is a real upload: `register-external-applicant`
requires `resume_url` and hands it to a job that does a plain `Http::get`, so
the file must be publicly fetchable before the application is posted. The route
uploads first and only posts the application once that returns a URL — an
applicant is never recorded without the CV they attached. The endpoint exists
now (`ExternalResumeController` + `StagedResumeStorage` in `../bijlesbeta`):

    POST /upload-external-resume
    X-Secret-Key: <the same shared key>
    multipart/form-data, one `file` part (pdf/doc/docx, ≤10 MB)
    201 -> { "url": "https://…" }   a signed URL, good for seven days

If the upload fails the application is not posted — the portal requires
`resume_url` — but the file is still in memory at that point, so it goes out as
an attachment on the office copy instead. That is then the only copy of it in
existence, which is why neither step may end the request: you cannot ask
somebody for their CV twice.

### The proefles block

The amber closing panel's short form (`LeadForm`, inside `TrialCta`, and again
in the landings' hero) is **not a contact form**, though it looks like one and
was built as one to begin with. On bijlesbeta.nl it is Gravity Forms form 1,
"Gratis proefles kort", and it does two things:

- its confirmation is a **redirect**, not a message —
  `/aanmelden/?naam={Naam:1}&telefoon={Telefoon:4}&e-mailadres={E-mailadres:3}`,
  where the long form prefills from those three parameters; and
- it notifies `{admin_email}` with `{all_fields}` on every submission,
  including a hidden field naming the page the block was on.

The redirect is the point. The block asks for the three answers a visitor is
most likely to abandon the wizard over, then hands them to the wizard with
those already filled in — it is the top of the funnel, not the end of it. The
mail is the safety net for the ones who still don't finish: a name and a phone
number is enough to ring back, and without it that visitor is simply lost.
Both halves have to stay, and neither may block the other.

Our version, and what shouldn't be undone:

- **`/api/lead`, not `/api/contact`.** Nothing goes to the portal from here. A
  lead is not a `ContactRequest`, and `register-external-contact` would fire
  `CONTACT_REQUEST_TO_SENDER` at somebody we are in the middle of sending to
  the aanmeldformulier — a confirmation for a conversation they didn't start —
  and would file every completed signup twice. The real submission is the
  wizard's, a minute later. Live form 1 has one notification and no sender
  mail; this matches it.
- **The mail is not an office *copy*.** `sendLeadCopy` is deliberately separate
  from `sendOfficeCopy`, whose banner tells the office a submission is missing
  from the portal and must be entered by hand. Most leads land in the portal
  by themselves a minute later; stamping them `NIET VERWERKT` would fill the
  work queue with work nobody has to do.
- **The POST is not awaited and cannot stop the redirect.** The visitor's next
  step is the wizard; a mail that didn't leave is our problem, and their
  answers travel in the URL either way.
- **Name and phone are required, e-mail is not.** That is the reverse of what
  this form asked for at first, and it is live form 1's own rule
  (`gfield_contains_required` on fields 1 and 4, not on 3). The number is what
  the office rings when somebody drops out, so it is the field that must not
  be missing. The number is normalised through `shared/utils/phone.ts` before
  it goes in the query string, so the wizard accepts what it is handed.
- **The query parameter names are bijlesbeta.nl's**, not ours — `naam`,
  `telefoon`, `e-mailadres`, hyphen and all. Keeping them means a link built
  against the live site prefills here too. `SignupForm` reads them once at
  setup, not in a watcher: it seeds the form, it doesn't own it.

Live also runs a Cloudflare Turnstile on this form (`field_1_7`). We have the
honeypot and the per-IP rate limit instead.

### The office copy

Every submission is mailed to the office, whether or not the portal took it.
`server/utils/mail.ts` sends it and `server/utils/office-copy.ts` builds it.

This is not a second notification channel competing with the portal, and it
should not become one. The portal owns the transactional mail to the *visitor*
— the password-set link on a signup, the confirmation on an application — and
it does that far better than this app could, from database-backed templates
with a notification log and a queue behind them. Do not send the visitor mail
from here.

The portal now owns the contact confirmation too, from
`CONTACT_REQUEST_TO_SENDER`. This app briefly sent that itself, when contact had
nowhere else to go; it does not any more, and it should not start again.

What the portal does not do is put the answers anywhere the office can read
without opening it. `SendUserRegisteredNotification` interpolates only the
params the listener passes, and `makeReplaceArray` can substitute nothing else:
`STUDENT_REGISTERED_TO_ADMIN` gets a first name, a last name and an account
name, and `JOB_APPLICATION_CREATED_TO_ADMIN` gets none at all. bijlesbeta.nl's
Gravity Forms notification carried the whole form, so without this copy the
cutover would quietly take that away.

The reasoning that shaped it, so it isn't undone by halves:

- **It is sent on every submission of `/aanmelden` and `/solliciteren`, not
  only on a failure.** That way it does not depend on classifying a failure
  correctly, and the office gets the answers in the ordinary case too. The
  outcome is stamped at the top — `VERWERKT` or `NIET VERWERKT` with the
  reason — so an inbox reads as a work queue rather than a pile of duplicates.
- **`/contact` is the exception: it sends the copy only on a failure.** The
  portal's `CONTACT_REQUEST_TO_ADMIN` already carries the whole message, so on
  success this would duplicate a better mail. The other two have no such
  notification, which is the entire reason the copy exists.
- **The likely loss is not an outage.** It is the portal being up and saying
  no: a phone number with a space in it, a school year of 0, an applicant whose
  email already exists. `describe()` in `portal.ts` turns those into a sentence
  naming the fields, because "something went wrong" is not something anybody
  can act on.
- **`requireDelivery` is the whole contract.** A submission that reached the
  office exists, so the visitor is told it arrived — because it did. Only when
  the hand-off *and* the copy both failed is there nothing left, and then they
  are told to call rather than thanked for something that vanished. Do not
  restore the old behaviour of erroring whenever the portal refused.
- **The CV is always attached**, not only on a failure. The portal's staged
  copy is deleted once the queue has fetched it, so the mail is the office's
  own lasting copy — and if the upload failed, the only one.
- **SMTP, reusing the portal's own credentials** (`NUXT_MAIL_*`), so there is
  one sending domain and one set of SPF/DKIM records rather than two. Unset,
  nothing is sent: dev logs the copy, production reports it as not sent, and
  with no portal *and* no mail the visitor is honestly told to call.
- **The label maps in `aanmelden.post.ts` mirror `app/data/signup.ts`.** They
  translate the portal's codes — `premium`, `at_school`, a bare `2` for havo —
  into what the visitor actually chose. If a question's options change, change
  them in both places or the copy describes an answer nobody was offered.

`shared/utils/phone.ts` is shared between the forms and the routes for the same
reason: the two halves must not disagree about what the portal will accept.

The signup wizard is data-driven: `app/data/signup.ts` defines the steps and
returns each step's fields as a function of the answers so far, mirroring the
Gravity Form's conditional logic. Change questions, options and rules there, not
in `SignupForm.vue`. `server/api/adres.get.ts` is a read-only PDOK proxy for the
postcode lookup — it stores nothing and never throws at its caller.

## SEO and the WordPress cutover

This app replaces bijlesbeta.nl, which is still WordPress. The whole search
index for that domain was built by the old site, so the rule is: change what
Google sees as little as possible.

- **URLs carry a trailing slash.** Every indexed URL has one, so
  `/over-ons/` is canonical and `server/middleware/trailing-slash.ts` 301s the
  bare form to it. Internal `NuxtLink`s append it too, and `redirects.ts`
  targets carry it, so nothing resolves in more than one hop. Before this,
  both forms answered 200 with no canonical — duplicate content.
- **Titles are the live site's, verbatim.** They are a direct ranking and
  click-through signal, so the cutover changes none of them. Twenty of
  twenty-five are `<page> - Bijles Bèta`, which is what `titleTemplate`
  produces; five set `absoluteTitle` because their live title doesn't follow
  it. Check a page against the live one before rewording its title.
- **Descriptions are the live ones except two.** `/zo-werkt-het` and
  `/aanmelden` had Rank Math fallbacks rather than written copy — one of them
  was literally the rating label "Uitstekend" — so ours are kept there.
- **`useSeo()`, not `useSeoMeta()`.** It fans title and description out to
  Open Graph and Twitter, which `useSeoMeta` does not do on its own.
- **`robots.txt` keys off the request host**, not an environment flag: only
  `NUXT_PUBLIC_SITE_URL`'s host is crawlable, everything else gets
  `Disallow: /`. A misconfigured deploy is invisible rather than competing
  with the live site.
- **The sitemap is generated from the same data the pages render from**, so it
  can't list a URL that doesn't exist. If you add a page with no data behind
  it, add it to `STATIC_PATHS` in `server/routes/sitemap.xml.get.ts`.
- **JSON-LD is emitted where the content lives** — `FaqSection` emits its own
  `FAQPage` rather than each page doing it, so markup can never describe
  questions that aren't rendered.

Before cutover, re-run the inventory check: every URL in the live sitemaps
plus the 28 docenten profiles must return 200 in at most one hop. The last run
was 77/78, the exception being `/aanmelden-test/`, a WordPress scratch page
that is deliberately dropped.

## Analytics and cookie consent

Reproduced from bijlesbeta.nl, which hand-rolls this rather than running a
consent plugin. Three pieces, and the order between them is the whole point:

1. **Consent Mode v2 defaults**, inline in `<head>` from
   `app/plugins/consent.ts`. Everything denied except `functionality_storage`
   and `security_storage`, with `wait_for_update: 500` — the live site's
   values, and what a first-time visitor gets. **A returning visitor's stored
   choice is baked into the `default` call instead**, from the request's
   cookie, and `wait_for_update` is dropped with it: there is nothing pending
   to hold the tags for. That is why this is a plugin rather than static
   `app.head` config, and it is the reason no route that renders the site
   chrome may take an `swr`/`isr` rule — the HTML now varies per visitor.
2. **Google Tag Manager**, loaded by `app/plugins/gtm.ts` at `tagPriority: 20`
   so it always lands *after* the defaults at 10. Defaults that render after
   the container are defaults nothing reads, and nothing about the page would
   look wrong — check the order in the rendered `<head>` if you touch either.
3. **The banner** (`CookieBanner`), which only ever sends `consent` *updates*.

**A gtag command goes out through `window.gtag`, never as
`dataLayer.push([...])`.** Tag Manager accepts a command only when the pushed
value is an `arguments` object — its dispatch tests
`toString.call(v) === '[object Arguments]'`, and an Array fails it, falling
into a legacy branch that tries `window.consent(...)`, throws, and swallows
the error. `push()` in `useCookieConsent` was an array for a while and the
failure was completely silent: the banner animated away, the cookie was
written, and Consent Mode never heard a thing, so `analytics_storage` stayed
denied for everybody who pressed *Alles accepteren* and GA4 ran on cookieless
pings. Nothing in the UI can show you this — read the rendered `dataLayer`.

`restore()` looks redundant now that the defaults carry the stored choice and
must not be removed: the `cookie_consent_update` event it pushes is the only
trigger the live container fires its GA4 and PostHog tags on.

The container is `NUXT_PUBLIC_GTM_ID`, **empty by default**. Nothing loads at
all until it is set, so staging never reports into the live property. The live
container is `GTM-MJCC44HR`; set it only on the domain that should own that
data. There is deliberately no fallback when it is unset.

`useCookieConsent` holds the three levels the live banner offers — `deny`,
`analytics`, `accept` — and stores the choice in a `cookie_consent` cookie for
180 days. The name and lifetime match bijlesbeta.nl's, so a visitor who already
chose there keeps that choice when these pages replace it. Picking anything
short of `accept` also purges non-allowlisted cookies, so a downgrade clears
`_ga` rather than only stopping future writes.

Two deliberate departures from the live implementation:

- **The banner is rendered from the cookie during SSR**, so a returning visitor
  never sees it. The live site always renders it and hides it once its script
  runs, which flashes.
- **It is mounted in `app.vue`**, not in `default.vue`, so it also covers the
  `bare` layout (`/aanmelden`) and `landing`. A consent banner that skips pages
  is worse than none.

The footer's "Beheer cookies" is the only way back to it once a choice is
stored — it is a `<button>` calling `reopen()`, not a link, so `.fb-manage`
styles the button element.

## Design work

The design is applied to `/`, `/over-ons`, `/tarieven`, `/aanmelden`,
`/contact`, `/werken-bij`, `/zo-werkt-het`, `/bijles-[vak]-[stad]`,
`/docenten/[slug]`, `/examentraining`, `/het-bedrijf` and the shared chrome,
from a Claude Design handoff.
`app/assets/css/main.css` carries the real palette — an amber brand on linen
and sand grounds, with a warm `ink-*` ramp, Plus Jakarta Sans for headings and
Open Sans for body copy. The tokens are no longer placeholders.

A second handoff (`Tarieven.dc.html`) pulled the tokens to bijlesbeta.nl
parity, so a few things are now deliberate and shouldn't drift back:

- **One amber.** `brand-500` and `accent-500` are both `#ffbb00`; the live site
  runs no separate accent. `brand-600` (`#f0b000`) is the hover. The one
  exception is `--color-star` (`#fec700`), which the original design does run
  separately — see the design section below.
- **Three radii.** Controls round on 4px (`field`, `btn`), surfaces on 8px
  (`panel`, `tile`, `card`), and the large blocks on 12px (`block`): the
  header card, the amber closing panel, the `Zo werkt het` photograph and the
  kennisbank's cards (see the kennisbank note below). The
  five 4/8px names survive so components didn't have to change, but they
  resolve onto those two values — don't reintroduce one-off
  `rounded-[11px]`-style overrides.
- **Headings and copy both sit on `ink-800`.** This is the one place the site
  knowingly departs from parity: bijlesbeta.nl sets its heading widgets in
  `#1d1d1b`, and we keep `#333`, which is also what `<body>` sets — so most
  copy needs no colour class at all. It has been raised and decided twice;
  don't "correct" it to `ink-900` from a measurement. `ink-900` stays for
  grounds and rules only — the dark bands, the inverted package, the 1.5px
  underline beneath text links. `ink-850` (`#222`) is the package
  descriptions and the FAQ heading, and nothing else. Reach for
  `text-ink-800`, never `text-ink-900`.
- **`line-ink` (`#1d1d1b1a`) is the rule colour.** Cards, tiles and package
  borders on the live site are all the deep ink at 10%, not an opaque warm
  grey. The opaque `line-*` steps stay for hairlines that have to hold a tone
  of their own.
- **`parchment` (`#f5f3e9`)** is the page ground on `<body>` and the fill of
  the highlighted package — a hair warmer than `sand`, and not interchangeable
  with it.
- **Secondary copy is not automatically muted.** `ink-700` (the ink at 55%) is
  the hero paragraph, the closing block's body line and the card footnotes —
  but the section intros under `Eerlijk geprijsd` and `Bijles Bèta in cijfers`
  are 16px/28px in *full* ink on the live site, not a muted 15px. Check before
  reaching for `text-ink-700`.
- **Two greens.** `success-500` (`#26cb7c`) is the checkmark glyph; `mint`
  (`#00b67a`) is the darker one the savings pill sets both its label and its
  10% tint in. They are not interchangeable.
- **The kicker is `accent-500` at 18px** with a 1:1 leading, matching the live
  site exactly (the packages band runs its own 19px). That
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
- **`btn-lg` is the in-page CTA**, at 20px/24px padding: the hero, the four
  packages, `Zo werkt het` and the closing block all use it. It measures 54px
  rather than 51px because the trailing arrow is the tallest thing in the row.
  That arrow must be `<BtnArrow />` — a 15×14 SVG — and never a `→` character,
  which brings a 28px line box with it and grows the button to 68px.

### The original design, and what was measured back onto it

bijlesbeta.nl was itself built from a set of Figma boards — Home, Wiskunde,
Over ons and Contact each in a 1920 and a 480 version, plus the kennisbank
overview and article in both. Those boards are the authority above the live
site for anything the live site didn't deliberately change, and they run a far
tighter system than either: **8 colours, 2 shadows, 3 radii.**

Two cautions when reading them. The boards are not internally perfect —
`#F6F4EA` turns up six times as a two-point-off slip of `linen` (which appears
70 times), and the two newest mobile boards give the header card a
`4px 4px 10px` offset shadow where every other board uses the flat
`0 4px 34px`. Take the value that repeats, not the one you happened to open.
And the *page* type scale holds 32px/44px from 1920 down to 480 on the Home
board, but the kennisbank article H1 measures ~34px on a 46px line and steps
down on its mobile board, so "the scale never steps" is true of the marketing
pages and not of the article template.

What was already taken from them:

- **Two shadows, and that's the scale.** `shadow-panel`
  (`0 4px 34px black/10`) under the header bar, the cards, the tiles and the
  form panels; `shadow-float` (`0 4px 14px black/20`) under anything that
  overlaps the band behind it. Nothing else. Before this pass there were
  twelve, nine of them arbitrary `shadow-[…]` literals, four of them amber
  glows under buttons — no button in any board carries a shadow.
- **Cards have no hover state.** Not the feature cards, tutor cards, package
  cards, article cards or step cards. The lift-and-shadow on hover was ours,
  not the design's. Where a card links somewhere, the design's own affordance
  is the small arrow chip on `TutorCard` — a 4px linen square that reads as a
  control — not a moving surface.
- **Three grounds, not six.** `linen`, `parchment`, `sand`. `cream`, `mist`
  and `ivory` appeared in no board and are gone; all nineteen call sites
  resolved onto `linen`, which is the most-used ground in the design. `sand`
  was corrected from `#f5f1e8` to the design's `#f5f1e5`.
- **`--color-star` (`#fec700`) is the rating stars, and only those.** 80 star
  glyphs across the boards, never the `#ffbb00` sitting beside them in the
  same hero. It is deliberately not folded into `accent-500`, which carries
  focus rings, radio and checkbox fills and the footer accent across some
  thirty call sites. `StarRating` renders it and supports a half star; the
  boards show 4.5, though `rating.stars` stays at the real figure.
- **`danger` is `#cb2626`** — the exact channel reversal of `success-500`
  (`#26cb7c`). The comparison table's check and cross are a designed pair.
- **Hairlines are the ink at 10%** (`line-ink`). The opaque `line-200/300`
  survive only for rules that sit on white and have to hold their own tone —
  the comparison table's row dividers, whose design value is a neutral
  `#e8e8e8`. `line-100` and `line-400` are gone.
- **`CtaNote` is the reassurance line under a primary CTA.** In the design it
  sits under *every* one — hero, all four packages, both forms, the closing
  block — as a 12px two-tone line, bold lead and muted tail. It used to be
  written out at six call sites in two sizes and five colours.

What the design says and the **WordPress build overruled** — these are open
decisions, not bugs, and our recreation currently follows Elementor because
the SEO mandate says to:

- **Card grids are always wider than the 1100px prose column.** 1368px
  (x=276→1644) on Home, Over ons and the Wiskunde landing; 1296px
  (x=312→1608) on the kennisbank overview. Gutters are 12px on the 4-up and
  3-up rows and 24px on the kennisbank grids, and the article board is
  internally inconsistent — its header card starts at 312 and its related
  grid at 276. So there is no single card band to copy; the rule that does
  hold is that 1100 is the prose and closing-CTA width and no card grid uses
  it. The live build agrees with the boards on this — its card bands run the
  kit's 1400 — so this is no longer a place the two disagree; see the band
  table in the type-scale section.
- **The marketing pages' type scale doesn't step at mobile.** Measured off the
  480px Home board: H1 32px on a 44px line, hero paragraph 16/28, rating 15px
  — identical to 1920. Our H1 → 26px and feature-card title → 16px below
  768px are the live site's steps, not the designer's. (The kennisbank
  article is the exception — see the caution above.)
- **The mobile gutter is 36px**, with the header card inset 12px and nested
  content at 60px. Our `clamp(16px,4vw,40px)` only reaches 36px at a 900px
  viewport.
- **Feature cards go two-up at 480px.** `auto-fit,minmax(230px,1fr)` needs
  472px of content box and gets 448, so ours drop to one column.
- **Form fields are 52px on a 4px radius**, and the contact panel carries
  `shadow-panel`. Ours are the live Gravity Forms controls' 42px and flat —
  see the `field-input-lg` note above, which explains why 42 is right for
  parity.

The kennisbank boards mostly confirm what was already measured off
`post-204.css` and `post-169.css` — 12px card surfaces, a 176px cover crop on
the 4px control radius inset by the card's own 12px, amber outline tag pills
over the photograph, the filter chip row, the wide featured tile, and the
reading-time-plus-word-count meta line are all there and all already built.
Three things differ:

- **Every kennisbank board carries a breadcrumb** and the site has none.
  `‹ Home / Blogs` on the overview, `‹ Blogs / Alle artikelen / <title>` on the
  article, with the first crumb in full ink and the rest muted. On mobile it
  scrolls rather than wraps. Adding it would change what Google sees, so it is
  a decision, not a cleanup — but a `BreadcrumbList` is one of the few
  additions that is unambiguously good for search.
- **The article's cover photo is flush to its header card**, not inset. The
  card is a 12px `linen` surface with a 200px cover bleeding to its top and
  side edges, and only the tags, title, author and meta row are padded. The
  overview cards keep the 12px inset — the two are deliberately different.
- **The TOC panel truncates.** It ends in a `Toon meer ⌄` control, its items
  are marked with `›` rather than numbered, and the active entry is amber,
  bold *and* underlined. Ours numbers them and colours the active one only.

Two signature image treatments from the boards are **not built yet**: photos
masked into the logo's bracket shape with an offset ghost outline of the same
bracket behind them (the Wiskunde board's "De stelling van wie?" band), and
portraits in squircle blobs on a `linen` fill with a white border and
`shadow-float`, clustered around the logo mark. Both are one SVG `clipPath`
plus a shadow. They are the strongest brand signal in the design and the site
currently uses plain 8px crops everywhere instead.

Unrelated to this pass but found during it: **the homepage overflows
horizontally at 360px** — the header row and the hero both clip. It reproduces
on `main` without any of these changes, so it predates them.

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
  rather than repainting `linen` a shade off `parchment`. `headerGround: 'ink'`
  is the one override, for a page whose hero opens on the dark band.

The card is 12px, `shadow-panel`, 16px/24px padding, and the CTA is the
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

**The 44px leading is not decorative.** Every step from 22px up is set on a
flat 44px line, which is what holds the vertical rhythm between a heading and
the copy under it. A `leading-[1.1]` or `leading-snug` on a heading collapses
it by 8–10px and the whole band creeps upward. `/tarieven` was measured back
onto this: the page H1, the section titles and the FAQ heading all carry an
explicit `leading-[44px]`.

**Not every section title is 28px.** `Eerlijk geprijsd` is, but `Zo werkt
het`, `Bijles Bèta in cijfers` and `Moeilijke vragen bestaan niet!` are all
32px on the live pages. Measure the one you're touching rather than assuming
the step.

**The default band is 1400px, and 1100 is a per-*band* exception.** This was
read wrong once and the mistake spread across most of the site, so read the
mechanism before touching a width. Elementor's `frontend.min.css` declares

    .e-con { --content-width: min(100%, var(--container-max-width, 1140px)); }

on **every** container, and the kit (`post-6.css`) sets
`--container-max-width: 1400px`. Because that custom property is re-declared
on each `.e-con`, it does *not* inherit down: a band is 1400px unless it names
its own width. `post-14`, `-44`, `-46`, `-239`, `-42` and `-1567` do each
declare `--content-width: 1100px` — but only on **one** element apiece, and in
every case that element is the page's hero. Everything below the hero runs the
full 1400. Before assuming a band is 1100, grep the page CSS for its own
element id; if it isn't there, the band is 1400.

The narrow widths that do exist live in the shared template stylesheets rather
than in the page's own, which is why grepping only `post-<page>.css` misses
them. The full set:

| band | id | width | ours |
|---|---|---|---|
| hero | per page | 1100 (1200 on `/werken-bij` and the landings) | page file |
| packages grid | `5d48e98b` | 1368 live, **1026** here — a later `Tarieven.dc.html` handoff cut Losse lessen from a fourth card to 3 packages and narrowed the band so the cards keep their live width | `PricingSection` |
| stats | `125bf870` | 900 | `StatsBand` |
| closing CTA | `73f40b97` | 1100 | `TrialCta` |
| reviews | `2efc0a89` | 1000 | the band that mounts `ReviewCarousel` |
| team block | `3b507aa8` | 1180 | `/` and the landings |
| FAQ block | `b8fc3e6` | 728 | `FaqSection` |
| comparison cards | `4121888b` | 800, 600 at 768–1024 | `ComparisonTable` |
| home story | `af0e6c4` | 1100 | `/` |
| landing intro | `aeeb51e` | 1100 | `/bijles-[vak]-[stad]` |
| `/werken-bij` apply | `dd3e9f4` | 1200 | `/werken-bij` |
| everything else | — | **1400** | — |

Band gutters are 40px, tapering to 16px on a phone
(`px-[clamp(16px,4vw,40px)]`).

`container-page` still caps at 1100 and is now only right for a hero or a
prose column — don't reach for it on a card band.

The padding sits *outside* that cap, which is what makes the nesting work:
Elementor puts `--padding-left/right` on the outer `.e-con` and caps
`.e-con-inner` at `--content-width`, so a band's own 40px gutter never eats
into its 1400, and a container nested inside one starts from the parent's
inner width instead.

**`/tarieven`'s bands are separated by 80px spacer strips, not by section
padding** — that is how the live page is built, and it is what lets the hero
photograph (700px tall, flush to the top of the hero) hang past the bottom of
its own band. The hero is `relative z-10` for exactly that reason; without it
the white bands that follow paint over the picture. `StatsBand` is the
exception: it carries its own 80px on both edges, so pages mount it directly
against its neighbours.

The live site steps type at 767px and nowhere else, so Tailwind's `md` lines
up with it exactly. Only two things actually take that step: the page H1
(32px → 26px) and the four icon-box feature cards in `FeatureGrid` (19px →
16px). Subject-card titles and section titles hold one size at every width —
don't add breakpoints they don't have.

`/contact` puts its hero and its form panel in one band and sets its FAQ
heading beside the accordion, so it uses neither `PageHero` nor `FaqSection`.
Its form is `ContactForm` in its `panel` variant, with the name split in two,
no phone field, placeholders instead of labels and required privacy consent.

It is measured against `post-46.css` rather than designed, so these are the
live page's numbers and shouldn't be tidied:

- **The hero band has no ground of its own.** It sits on the page's
  `parchment`, not on `sand` — the live container is transparent. White only
  starts 43px below the hero, and the FAQ band opens on 84px of it. `StatsBand`
  closes the page on its own 80px, so the FAQ carries no bottom padding.
- **The hero splits 50/50 on a 63px gutter**; the FAQ splits 40/60 on a zero
  gutter, with the accordion inset 24px inside its own column.
- **This page runs a 19px kicker**, not the sitewide 18px, and the form panel
  runs the small 15px one. The H1 is the usual 32px/44px and holds that size at
  every width — `post-46.css` has no 767px step for it. The FAQ heading is the
  27px sub-heading, and the panel title the 22px one, both on the 44px line.
- **The hero paragraph is 14px/21px in `ink-700`** — the one place a hero
  paragraph is not 16px — while the opening hours and the address beside it are
  16px/24px in full ink, on two equal columns with the rule hung off the right
  edge of the first.
- **The contact rows are 32px flat amber glyphs**, no disc behind them, on a
  17px/600 label. The live artwork is Font Awesome's `whatsapp` and `envelope`;
  ours are equivalent drawings, not copies of those paths.
- **The panel is a flat white 8px card on 24px of padding — no shadow**, and
  its fields are the live Gravity Forms controls: a 42px box, 20px horizontal
  padding, 15px/600 Plus Jakarta Sans on a 44px leading and no vertical padding,
  ruled in the plugin's `#0000001A`. Fields stack on 8px, the two name inputs
  split on 12px, the message box is a flat 192px, and the submit button is
  full-width at 16px padding on a 15px leading, so it reads 49px.

`/werken-bij` opens on a dark `ink-900` hero band rather than the usual cream
one, so `SiteHeader` reads a `headerGround` route meta (set via
`definePageMeta`) to darken the sticky strip instead of leaving it clear —
see `app/types/route-meta.d.ts`. `RatingLine` has a matching `inverse` tone
for use on that band. The application form is its own `ApplicationForm`
component, not a `ContactForm` variant, since it collects a different shape
of answers; it still posts through `/api/contact` with a fixed subject.

Its layout is measured against `post-45.css` rather than designed, so a few
things there are the live site's and shouldn't be tidied:

- **Its hero and its apply band run 1200px**, where every other page's hero
  is 1100 — the two white bands between them take the kit's 1400 like anywhere
  else. The hero splits 50/50 on a 100px gutter with the copy column padded
  72px over 92px; the apply band splits 34/66 on a 63px gutter and sits on
  `parchment`, not `sand`. The live hero also carries
  192px of top padding because its header floats over the band — ours is in
  flow, so that space lives in the header strip instead.
- **The hero CTA is not `btn-primary`.** It inverts on the dark band: parchment
  with a `black/20` hairline, stepping to the amber on hover.
- **The requirement cards round on 12px**, which is the second measured
  exception to the two-radii rule after the header card. Their photo is a
  176px-tall crop inset by the card's own 12px padding.
- **`field-input-lg`** carries the live Gravity Forms metrics — 15px/600 Plus
  Jakarta Sans, 20px of horizontal padding, a black/10 hairline and the
  plugin's 1px lift, on a **42px** control. It was written here as 86px once,
  from `getComputedStyle` on a Gravity Forms page that was still
  `display: none`; every visible input on `/werken-bij` and `/aanmelden`
  measures 42px. Selects get their own `field-select-lg` at 44px. Neither
  carries a margin — the label above owns the gap.
- The four perk icons reuse `FeatureGrid`'s drawings. Three are the live
  artwork; `clock` stands in for Flexibel, where bijlesbeta.nl draws a door.
  The live icons are rasters embedded in Elementor SVGs and can't be pulled out
  on their own — swap in the real glyph if it ever lands in `public/img`.
- Parity stops at the copy. bijlesbeta.nl writes "Benodigheden" and "Je vindt
  ziet het als een uitdaging"; both are typos and both are corrected here.
  Match the live site's layout and its measurements, not its spelling.

`/aanmelden` is measured against `post-103.css` and the live Gravity Form
rather than designed, so it has its own set of things that shouldn't be tidied:

- **It runs without header or footer.** bijlesbeta.nl serves the page as the
  Elementor document and nothing else, so the route sits on `layouts/bare.vue`
  via `definePageMeta`. Adding the chrome back is a product decision, not a
  cleanup.
- **Its bands split 34.237% / the rest on a 63px gutter** inside the 1100px
  column, and the FAQ below splits 40/60 with *no* gutter. Both are the live
  containers' own numbers; an `auto-fit` grid lands on 50/50 and reads
  visibly wrong.
- **Below 768px the two columns swap.** The live form column carries
  `--order: -99999`, so on a phone the wizard comes first and the contact
  details and the review follow it — hence `flex-col-reverse md:flex-row`.
- **The bands are separated by spacer strips**, as on `/tarieven`: 43px of page
  ground under the wizard, then 84px of white above the FAQ. `StatsBand`
  brings its own 80px, so nothing is written around it.
- **The h1 sets `letter-spacing: normal`**, opting out of the base
  `tracking-tight`. The live heading widgets on this page carry no tracking at
  all; the rest of the site hasn't been re-measured for it.
- **The form's controls are Gravity Forms', not the site's.** Labels, hints,
  required marks, the radio hairline and the progress track all take the
  `--color-field-*` tokens — the plugin's cool palette, kept out of the ink
  ramp deliberately, the same exception `--color-placeholder` already makes.
  Descriptions print *below* the control, never between it and the label.
- **The progress bar is 78px wide, not full width** — the live wrapper is
  sized to its own `Stap 1 van 4` label.
- **`Vorige` sits above `Volgende`, not beside it.** The live footer is a
  wrapping flex row and the next button spans it, so the back button can never
  share the line.
- Parity stops at two places. The live final submit is Gravity Forms' unstyled
  blue `#204ce5` at 38px while every other step's button is the themed amber
  at 49px; ours keeps the amber. And the live `#72`/`#80` (Plaatscode,
  Gemeentecode) are real inputs hidden with `visibility: hidden` — here they're
  plain state on `SignupValues`, filled by the PDOK lookup.

`/zo-werkt-het` is measured against `post-42.css`, and its two own bands carry
the live page's numbers:

- **The hero has no ground of its own.** It sits on the page's `parchment`;
  white starts in the spacer strip below it, as on `/tarieven` and `/contact`.
- **Its H1 holds 32px/44px at every width.** `post-42.css` has no 767px step
  for it — this page and `/contact` are the two that don't take the 26px
  step, so don't add one from the type scale.
- **The copy column is padded 52px over 92px** (32/20 below 768px) and its
  children sit on a flat 12px rhythm plus each widget's own margin, which is
  where the 16/24/36px gaps come from. The band splits 50/50 on a **100px**
  gutter inside the usual 1100px column.
- **The second hero button is not `btn-secondary`.** It is `parchment` with a
  `black/20` hairline, the same inversion `/werken-bij`'s hero CTA takes. The
  row needs `items-start`, or the bordered button's 56px stretches the amber
  one past its 54px.
- **The photograph is a flat 550px crop from the top on the 8px surface
  radius** — not the 12px block radius the `Zo werkt het` picture on
  `/tarieven` uses, and not a fixed aspect. The live artwork is
  `kruiwagenZWARTWITpng-min-2`, a 984 KB cut-out PNG; `fiets.png` stands in
  for it until that file lands in `public/img`.
- **The stappenplan runs a 19px kicker** (like `/contact`) over the 28px
  section title, and takes a further **36px** of gutter inside its band,
  collapsing to 0 below 768px — the same nested-gutter pattern as
  `/kennisbank`. The band itself is the kit's 1400: only the hero above it
  declares 1100.
- **The four cards are equal columns on a 12px gap**, two-up from 1025px down,
  with 24px of padding (12px below 768px), the `line-ink` hairline and the
  8px radius. Their titles are the 19px/26px card heading, stepping to 16px
  below 768px, over 13px body copy in *full* ink. They carry **no hover
  state** on the live page.
- **The step artwork is bijlesbeta.nl's own**, lifted from its media library
  into `public/img/stappen` and wired through `zoWerktHet.steps[].icon`. Two
  are vector; Match and Bijles are rasters inside an SVG wrapper, which is how
  Elementor stored them — don't try to recolour those two with `currentColor`.
- **`Meld je hier aan` is a text link, not a button** — 15px/700 Plus Jakarta
  Sans with a plain `underline` and a trailing `BtnArrow`, no padding.
- The closing amber block sits on the page's parchment here rather than on
  white, which is what `TrialCta`'s `ground` prop is for. One delta remains:
  the live gap between the stappenplan and the comparison band is a flat 80px,
  while `ComparisonTable` adds its own (unmeasured) top padding on top of this
  page's 80px strip. Measure that shared band against the live global template
  before trimming either side.

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

**It was left out of the band-width pass**, deliberately. Every other page was
put onto the live widths in the table above, but this one is a design handoff
rather than a measurement of `post-2180`, and its sections don't correspond:
the live page has no promo video and no levels notice, and ours has none of
its subject-link band. Its bands all still run 1100. The live widths, if the
page is ever measured back onto them, are hero 1100, then 1368 for `Wat kost
dat?!`, the docenten band and `Ga direct naar de juiste pagina`, and 1200 for
`Meld je direct aan`, with 1400 wrappers between.

`/kennisbank` and `/kennisbank/[slug]` are measured against `post-204.css` and
`post-169.css` rather than designed, like the header and `/werken-bij`. The
overview and the article share `ArticleCard`, `AuthorBadge` and
`ArticleCoverPlaceholder`; both cover art and author avatars are wired to
local paths under `public/img` and fall back to the placeholder when a file is
missing, so artwork can land one file at a time. What follows from the
measurements and shouldn't be tidied:

- **The hero sits on the page's own parchment**, not on a ground of its own,
  and the white band opens *below* it with an 80px lead-in. That is why the
  page writes its hero out instead of mounting `PageHero`, which paints
  `linen` with a rule under it.
- **These are the two pages with no 1100 band at all.** Neither `post-204`
  nor `post-169` declares `--content-width` anywhere, so even their heroes
  take the kit's 1400 — every other page narrows its hero and nothing else.
  Their bands are `max-w-[1400px]`, which is what puts the article grid on the
  same edges as the header card above it. The feature band at the foot is a
  shared template (`45ff7e9f`) and declares no width either, so it is 1400
  too — it is not the narrow exception this once claimed.
- **Two nested gutters.** The band takes the sitewide 40px and the filter and
  grid take a further 36px inside it, collapsing to 0 below 768px. The hero's
  36px does *not* collapse — on a phone its copy is inset further than the
  cards beneath it, exactly as on the live page.
- **The kennisbank surfaces round on 12px** (`rounded-block`): the article
  cards, the article's header card and its content card. They join the header
  card, the amber closing panel and the `Zo werkt het` photograph as the
  exceptions to the 4/8px rule; the 176px cover crop inside a card rounds on
  the 4px control radius, not the 8px one.
- **`ink-muted` is not `ink-700`.** The live `410adae` global is `#222` at
  72% and carries the hero intro, every card excerpt and the article meta
  row; `ink-700` is the deep ink at 55% and belongs to the rest of the site.
- **The tag pills have no fill.** Amber label on an amber hairline, straight
  over the photograph — the same parity-over-contrast call as the kicker.
  They're spans, not links, because this app has no per-category archive.
- **The two grids behave differently.** The overview lets cards end where
  their copy ends; the related-articles grid on an article stretches them to
  a common row height (`grid-auto-rows: 1fr` on the live loop). Both step on
  Elementor's breakpoints — three columns from `desk:`, two from `md:`.
- **The article body runs in Plus Jakarta Sans 400**, not Open Sans: the live
  content widget overrides the global text family onto the Secondary one. Its
  links are the deep ink with a plain underline rather than the site's amber.
  `article-prose` carries all of this.
- **The article stacks at 1025px, not 768** — Elementor's tablet floor — which
  puts the table of contents below the article rather than above it.

### The kennisbank articles, and their maths

The eighteen articles bijlesbeta.nl publishes are **transcribed from its
WordPress export, not retyped**. Seventeen of the eighteen now match the live
page word for word; the eighteenth is `kruistabel`, and the difference is
deliberate — see below. Keep the authors' own spelling: "Netwon" in a live
*title* was corrected (`wetten-van-newton`), but nothing inside a body was.

If an article changes on bijlesbeta.nl, **re-export and re-run
`scripts/import-kennisbank.py`** rather than editing the copy here by hand. It
takes the WordPress export and prints the `body: [...]` literal for each post;
running it against the export this data came from reproduces all eighteen
bodies byte for byte, so a diff against it also tells you what has drifted.

The maths is the reason this is not just copy. bijlesbeta.nl writes its
formulas as LaTeX and hands them to the **QuickLaTeX** plugin, which renders
each one to a PNG on quicklatex.com and drops an `<img>` into the post — 429
of them across sixteen articles. **We keep the LaTeX and render it with
KaTeX**, in `TeX.vue`, which follows the same principle as the rest of the
content: the source of truth is the author's own markup, not a picture of it.

- **`$…$` becomes a `tex` run, `$$…$$` a `formula` block.** That split is
  QuickLaTeX's own: it renders `$$…$$` as a displayed equation on its own
  line wherever it appears, so a `$$` ends the paragraph it sits in even when
  the author wrote no blank line around it.
- **KaTeX renders on the server**, so a formula is in the HTML rather than
  appearing once a script has run, and it hydrates without a mismatch because
  `renderToString` is deterministic. `output: 'htmlAndMathml'` keeps the
  MathML layer a screen reader needs — the live PNGs carry only the LaTeX
  source as alt text, so this is the one place the maths reads *better* here
  than there.
- **`throwOnError: false` on purpose.** All 435 formulas parse today; the
  option is there so a typo in a future article renders in red rather than
  500ing the page.
- **KaTeX's stylesheet is imported in `[slug].vue`, not in `main.css`**, so
  its ~23 KB and its fonts land in that route's chunk. It is the only page
  with maths on it; every other page would otherwise carry the weight. Nuxt
  inlines route styles, so the head of an article still carries it and there
  is no unstyled flash.

Two live bugs are **fixed rather than reproduced**, which is where the parity
mandate stops:

- **`kruistabel` and `substitutie` are missing the `[latexpage]` shortcode**,
  so every formula in them prints as raw dollar-sign LaTeX on bijlesbeta.nl
  today. Ours renders. That is the whole of the remaining word-level
  difference against the live pages.
- **One `$$…$$` block in `elektromagnetisch-spectrum` uses `&=` alignment
  with no environment around it**, which QuickLaTeX renders as an error image.
  The stray `&` is dropped so the equation renders. Fix these on bijlesbeta.nl
  and the two sides converge again.

Everything else about the transcription follows WordPress' own rendering:
`wpautop` turns a blank line into a paragraph and a single newline into a
`<br>` (hence the `br` run), `wptexturize` turns `--` into an en dash and
straight quotes into curly ones, and stray `<div>`/`<p>` tags the editor left
unbalanced are dropped the way WordPress drops them.

Two other things the transcription surfaced:

- **`readingMinutes` and `wordCount` are the live figures**, from the
  `Leestijd: N minuten (M woorden)` shortcode. Every `wordCount` was verified
  against a word-level diff of the two rendered pages, so they are the real
  counts and not an estimate — recompute them if a body changes.
- **The table of contents lists h2 and h3 only.** The live Elementor widget is
  set to `headings_by_tags: ["h2", "h3"]`, so the h4s inside a worked example
  ("Uitwerking:", "Opdracht") are rendered but stay out of the contents.

`/kennisbank/technieken-voor-differentieren` is the one article with a **nested
list** — a `<ul>` of sub-steps under the second item of an `<ol>` — which is
why `ArticleList.vue` is recursive and `ArticleListItem` is a union.

### /het-bedrijf

Measured against `post-1567.css`, not designed. It is the one page whose bands
are *wider* than its hero, and the one page whose inline links aren't the
site's:

- **Only the hero runs the 1100px column.** It is the only container on the
  page that sets `--content-width`; everything below takes the kit default,
  `min(100%, 1400px)`. The story bands and the innovations list are therefore
  visibly wider than the headline above them — that is the live page, not a
  mistake.
- **Five 80px spacer strips**, as on `/tarieven`. The first sits on parchment
  and the other four on white, which is where the page changes ground.
- **The headings run `tracking-normal`.** The base heading rule is
  `tracking-tight`, from the design handoff; every heading in this Elementor
  page is at normal letter-spacing. Section titles are 32px/44px, not the 28px
  step, and hold that size at every width — there is no 767px step here, not
  even for the H1.
- **Inline links are `#c36` with no underline** — the hello-elementor theme's
  default, which this page inherits and the rest of the site doesn't. That is
  `--color-link-wp`, reachable only through the `copy-live-links` wrapper. The
  sitewide rule is still ink-900 with a 1.5px underline; don't spread this one.
- **All three CTAs invert to ink-900 on hover**, like the header's, rather than
  stepping to `brand-600` the way `btn-primary` does alone. The hero's is the
  page's only non-amber button: parchment on a 1px black-at-20% rule.
- **The hero stacks at 1025px, not 768.** Between the two the copy goes full
  width while the photograph stays at 50%, so it sits left-aligned under the
  text. It looks like a bug and is what the live page does.
- **The copy is the live page's verbatim, slips included** — "Het onstaan" on
  the hero button, "Binnen Bijles Bèta zijn vanaf onze oprichting",
  "efficient", "tentamen week", "examen vragen", "centraal examens". They are
  transcribed, not introduced; fix them on bijlesbeta.nl first, then here.
- **`#het-onstaan` is a dead anchor on the live site.** The hero button points
  at it and nothing carries the id; ours puts it on the first band.

Its body copy is `Run[]`, the same shape the kennisbank uses, because the live
paragraphs carry inline links and bold. `ArticleRuns` renders internal links
through `NuxtLink` so they pick up the trailing slash.

The three photographs in the story bands are `background-image` on the live
site, so they carry no alt text there; ours are `<img>` with real alts, which
changes nothing visually.

The page had the hero and `Onze aanpak` photographs the wrong way round
against the live page — the blackboard shot is the hero and the two students
at the table belong to `Onze aanpak`, not the reverse — and a library portrait
in a slot the live page doesn't have one. `bord.png` and `studenten.png` are
the same photographs the live page uses, so nothing new was added; the hero's
crop is tighter than `Rijschoolfotos-78.png` and is the only place the artwork
still differs. That left `het-bedrijf-hero.png` — a byte-identical copy of
`studenten.png` — and `het-bedrijf-docent.png` unreferenced, and they are
gone.

Sections shared across pages are components, not copy-paste: `TrialCta` (the
amber closing block, with its own short form), `FaqSection`, `StatsBand`,
`ReviewCarousel`, `TutorCard`, `CheckList` and `RatingLine`.

### The docenten grid on /over-ons

The live roster is one Elementor loop grid (`ce60d92`) with a **fixed column
count**, not a fluid track: **4** columns on desktop, **2** on Elementor's
tablet step and **1** on a phone, on a flat 24px gap both ways. Don't put it
back on `auto-fill`/`auto-fit` — a `minmax(215px,1fr)` track lands on six
columns once the band runs its real 1400px, and the portraits shrink to
thumbnails.

The card itself (`loop-296`, element `2a1767d`) is measured too: a 12px-padded
8px surface on a **2px** `line-ink` rule, 20px between the photograph and the
meta row, the name at 16px/700 on a 26px line in `ink-850` and the study at
13px in `ink-600`. The photograph is a flat **300px-tall** crop at whatever
width the column gives it — an aspect ratio is wrong here, because the height
is what the live page pins.

Our roster is split into three runs (`firstRun`, the story tile, `secondRun`,
the photo band, `rest`) where the live page runs one grid whose story tile
spans `min(2, columns)` and whose teamuitje photo spans `min(4, columns)`.
The runs are sized for a four-column row, so the split only reads correctly at
four — another reason not to make the track fluid.

One live detail not copied: the arrow chip is a parchment 44px button that
goes amber on hover. Ours stays the design boards' 34px linen square with a
hairline, which is what the "cards have no hover state" note above describes.

Watch flex children that hold an `auto-fit` grid — they need `min-w-0` or the
grid refuses to shrink and the page overflows on a phone. Check new pages at
360px wide.

## Deployment

Laravel Forge, as a Node SSR daemon behind an nginx proxy. See README.md for the
full setup. Consequences for code: no filesystem writes at runtime, and
environment variables must be declared in `runtimeConfig` in `nuxt.config.ts` to
be readable.
