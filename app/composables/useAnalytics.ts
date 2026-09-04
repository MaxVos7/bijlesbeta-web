/**
 * Every analytics event this site sends, defined once.
 *
 * `app/plugins/posthog.client.ts` initialises the SDK and owns the consent
 * gate; this is the vocabulary on top of it. Components call the named
 * functions below and never `capture()` directly, so the set of events the
 * site can emit is the list in this file and nothing else. That is the whole
 * point: PostHog deduplicates nothing, and an event name typed slightly
 * differently at a second call site is a second event forever.
 *
 * ## The rules these names follow
 *
 * Dutch, `snake_case`, verb in the past participle — `aanvraag_verzonden`, not
 * `verzendAanvraag` or `form_submit`. Properties are flat and lowercase: no
 * nested objects, because PostHog cannot break down on a sub-key.
 *
 * ## What must never go in a property
 *
 * No names, e-mail addresses, phone numbers, postcodes, house numbers, streets
 * or cities. No free-text answer — not the motivation, not the message, not
 * the school, not any "Anders, namelijk…" wording. What is here instead is the
 * *shape* of a submission: which subject, which level, how many hours. That is
 * enough to build every funnel we asked for and carries nothing that
 * identifies anybody.
 *
 * If you are about to add a property, the test is not "is this useful" but
 * "would I be comfortable reading this row out loud". The wizard collects a
 * child's first name and phone number; none of it belongs here.
 *
 * ## Timing
 *
 * A conversion fires on a confirmed success — after the API answered, never on
 * the click that submitted. `proefles_aangevraagd` is the one exception and it
 * is documented at its own definition; read that before copying the pattern.
 */
/* -------------------------------------------------------------------------- */
/* Properties                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * PostHog takes numbers and booleans as well as strings, but nothing nested —
 * an object property cannot be broken down on, so it is not worth sending.
 */
type EventProps = Record<string, string | number | boolean | undefined>

/**
 * `Wiskunde B` -> `wiskunde-b`.
 *
 * Subjects reach us as the label a visitor ticked, and those labels carry
 * capitals, spaces and the odd slash (`Wiskunde A/C`). Slugging them here
 * means a breakdown in PostHog groups the same subject together instead of
 * splitting it on presentation, and it survives a label being reworded for
 * the page without silently starting a new series.
 */
export function slug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* -------------------------------------------------------------------------- */
/* The transport                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The SDK, or `null` when there is nothing to send to.
 *
 * `null` is the normal state, not an error state: on the server, with no key
 * configured, before consent, and for any visitor whose browser refused to
 * let PostHog initialise. Every function below goes through here, which is why
 * none of them needs a guard of its own and why nothing in this file can throw
 * at a component.
 */
function client() {
  if (!import.meta.client) return null
  /*
    Reached through `app/utils/posthog-client.ts` rather than by importing
    `posthog-js` here. A static import in this file would pull the SDK back
    into the entry chunk and undo the dynamic import in the plugin — see the
    note in that file. `null` until the chunk has landed and consent is in.
  */
  return getPosthogInstance()
}

/**
 * Sends one event, or doesn't.
 *
 * `undefined` properties are dropped rather than sent as null, so an event
 * from a branch that has no `vak` simply lacks the key instead of carrying an
 * empty one — a filter on "vak is set" then means what it says.
 */
function capture(event: string, props: EventProps = {}) {
  if (!import.meta.client) return

  const clean: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined && value !== '') clean[key] = value
  }

  /*
    `withPosthog` rather than a bare null check: on a cold page load the SDK
    chunk is still in flight when the first events happen, and dropping those
    loses the entry step of the funnel far more often than it loses anything
    else. See the note in `app/utils/posthog-client.ts`.
  */
  withPosthog((ph) => {
    try {
      ph.capture(event, clean)
    }
    catch {
      // Never the visitor's problem. A dropped event is a gap in a chart; a
      // thrown one is a form that didn't submit.
    }
  })
}

/* -------------------------------------------------------------------------- */
/* The honeypot guard                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Whether a submission looks like a bot, from the honeypot field the form
 * carries.
 *
 * The endpoints answer `{ ok: true }` to a honeypot hit on purpose — a bot
 * that is told it was caught learns to stop filling the field — which means
 * the server's answer cannot be used to tell a real submission from a fake
 * one. The client can: it is holding the field, and a filled one is never a
 * human, because the input sits at `left: -9999px` behind `aria-hidden`.
 *
 * So the event is suppressed here and the request goes out unchanged. The
 * server keeps lying to the bot; the funnel stops counting it.
 */
function isBot(honeypot: string | undefined): boolean {
  return Boolean(honeypot && honeypot.trim() !== '')
}

/* -------------------------------------------------------------------------- */
/* The events                                                                 */
/* -------------------------------------------------------------------------- */

/** Where a short proefles form or a contact link sat when it was used. */
export type Positie =
  | 'header'
  | 'footer'
  | 'contact'
  | 'trial_cta'
  | 'hero'
  | 'aanmelden'
  | 'examentraining'

export function useAnalytics() {
  const route = useRoute()

  /** The page an event happened on. Read at call time, not at setup, because
      a component like `TrialCta` outlives several navigations. */
  const pagina = () => route.path

  return {
    /* ---------------------------------------------------------------- */
    /* Leerling-flow: proefles -> wizard -> aanmelding                   */
    /* ---------------------------------------------------------------- */

    /**
     * The short proefles form in the amber block and the landing heroes.
     *
     * **This event measures intent, not confirmed delivery.** It fires just
     * before the redirect to the wizard and deliberately does not wait for
     * `POST /api/lead` — that request is not awaited by design, because the
     * visitor's next step is the wizard and their answers travel in the URL
     * whether or not the office mail left. Awaiting it here would put an
     * analytics call in front of a navigation the visitor is entitled to.
     *
     * The consequence is that this is the one event in the file that can
     * over-count: if `/api/lead` fails, `proefles_aangevraagd` still fires and
     * the office never gets the tip-off. That failure is invisible from
     * PostHog, which is why `server/api/lead.post.ts` logs the outcome of
     * every hand-off — compare that log against this event's count to spot a
     * silent failure ratio. Do not "fix" this by awaiting the POST.
     */
    proeflesAangevraagd(opts: {
      bron: Positie
      /** Whether the visitor filled the optional e-mail field — not the
          address itself, which is why this is a boolean. */
      emailIngevuld: boolean
      honeypot?: string
    }) {
      if (isBot(opts.honeypot)) return
      capture('proefles_aangevraagd', {
        bron: opts.bron,
        email_ingevuld: opts.emailIngevuld,
        pagina: pagina(),
      })
    },

    /**
     * The wizard was opened. Fires once, when the form mounts.
     *
     * `$pageview` on `/aanmelden/` almost covers this — the difference is
     * `bron` and `prefill`, which answer the question the pageview cannot:
     * does a visitor handed over by the proefles block finish more often than
     * one who arrived at the wizard directly.
     */
    aanmeldingGestart(opts: { prefill: boolean }) {
      capture('aanmelding_gestart', {
        prefill: opts.prefill,
        bron: opts.prefill ? 'leadform' : 'direct',
      })
    },

    /**
     * One wizard step cleared. Fires after that step's validation passed and
     * before the step counter moves, including on the last step — so a
     * completed wizard emits all four.
     *
     * This is what makes a real funnel possible. The wizard never changes the
     * URL, so without these the only available shape is a pageview on
     * `/aanmelden/` followed by a conversion, with the three places people
     * actually give up invisible between them.
     */
    aanmeldingStapVoltooid(opts: {
      stap: number
      /** The step's own `id` from `app/data/signup.ts` — passed in rather than
          looked up here, so there is no second list of step names to drift. */
      stapNaam: string
      prefill: boolean
    }) {
      capture('aanmelding_stap_voltooid', {
        stap: opts.stap,
        stap_naam: opts.stapNaam,
        prefill: opts.prefill,
      })
    },

    /**
     * A leerling-aanmelding reached us. Fires on the API's answer, not the
     * click.
     *
     * "Reached us" is `ok: true`, which the route returns when the portal
     * accepted the submission *or* the office copy was delivered — see
     * `deliveryResult` in `server/utils/office-copy.ts`. That is the right
     * definition for a conversion: an aanmelding the office can act on has
     * converted, whether or not the portal happened to take it.
     */
    aanmeldingVoltooid(opts: {
      vak?: string
      vakkenAantal: number
      niveau?: string
      leerjaar?: number
      lesvorm?: string
      urenIndicatie?: string
      locatie?: string
      prefill: boolean
      /** How many steps the wizard had, from `signupSteps.length`. */
      stapTotaal: number
      honeypot?: string
    }) {
      if (isBot(opts.honeypot)) return
      capture('aanmelding_voltooid', {
        vak: opts.vak,
        vakken_aantal: opts.vakkenAantal,
        niveau: opts.niveau,
        leerjaar: opts.leerjaar,
        lesvorm: opts.lesvorm,
        uren_indicatie: opts.urenIndicatie,
        locatie: opts.locatie,
        prefill: opts.prefill,
        stap_totaal: opts.stapTotaal,
        pagina: pagina(),
      })
    },

    /* ---------------------------------------------------------------- */
    /* Docent-flow                                                       */
    /* ---------------------------------------------------------------- */

    /**
     * A sollicitatie reached us, on the API's answer.
     *
     * Named apart from the leerling events on purpose. A docent and a leerling
     * are two different funnels with two different definitions of success, and
     * one shared `formulier_verzonden` with a `type` property would let a
     * careless filter merge them — which is exactly the mistake that makes a
     * conversion number stop meaning anything.
     */
    sollicitatieVerzonden(opts: {
      vak?: string
      vakkenAantal: number
      cvMeegestuurd: boolean
      honeypot?: string
    }) {
      if (isBot(opts.honeypot)) return
      capture('sollicitatie_verzonden', {
        vak: opts.vak,
        vakken_aantal: opts.vakkenAantal,
        cv_meegestuurd: opts.cvMeegestuurd,
        pagina: pagina(),
      })
    },

    /* ---------------------------------------------------------------- */
    /* Contact                                                           */
    /* ---------------------------------------------------------------- */

    /**
     * A contact request reached us, on the API's answer.
     *
     * `onderwerp` is the form's fixed subject prop, slugged — never the
     * message and never anything the visitor typed.
     */
    contactverzoekVerzonden(opts: {
      onderwerp: string
      variant: 'panel' | 'labelled'
      honeypot?: string
    }) {
      if (isBot(opts.honeypot)) return
      capture('contactverzoek_verzonden', {
        onderwerp: slug(opts.onderwerp),
        variant: opts.variant,
        pagina: pagina(),
      })
    },

    /* ---------------------------------------------------------------- */
    /* Bellen en WhatsApp                                                */
    /* ---------------------------------------------------------------- */

    /**
     * A `tel:` link was used.
     *
     * These two exist because autocapture is off. Without them, phoning is an
     * invisible conversion channel: a visitor who reads the number and calls
     * leaves no event at all and is counted as a bounce, which makes the pages
     * that work best look like the pages that work worst.
     *
     * It cannot be confirmed the way a form can — the browser hands the URL to
     * the OS and tells us nothing about what happened next. So this measures
     * intent, like `proefles_aangevraagd`, and should be read as "reached for
     * the phone", not "called".
     */
    telefoonGeklikt(opts: { positie: Positie }) {
      capture('telefoon_geklikt', { positie: opts.positie, pagina: pagina() })
    },

    /** A `wa.me` link was used. Same caveat as `telefoonGeklikt`. */
    whatsappGeklikt(opts: { positie: Positie }) {
      capture('whatsapp_geklikt', { positie: opts.positie, pagina: pagina() })
    },

    /* ---------------------------------------------------------------- */
    /* Identificatie                                                     */
    /* ---------------------------------------------------------------- */

    /**
     * Ties the current browser to a known person.
     *
     * **Nothing calls this today, and that is correct.** This app has no
     * login, no session and no user state; the only identity it ever handles
     * is what somebody just typed into a form, and none of that may become a
     * `distinct_id`. Never pass an e-mail address, a phone number or a name —
     * a `distinct_id` is stored indefinitely, appears in every export and
     * cannot be taken back out of the events already sent under it.
     *
     * The hook is here so that the day the portal starts returning the account
     * id it creates (`register-external-full` has one; `/api/aanmelden` just
     * doesn't pass it back), wiring it up is one call at one call site rather
     * than a rethink. Until then `person_profiles: 'identified_only'` means no
     * profiles are created at all.
     */
    identificeer(id: string) {
      const ph = client()
      if (!ph || !id) return
      try {
        ph.identify(id)
      }
      catch { /* no-op */ }
    },

    /**
     * Drops the current identity — the logout counterpart of `identificeer`.
     *
     * Note the opt-in afterwards. `reset()` clears the stored consent decision
     * along with everything else, and with `opt_out_capturing_by_default` the
     * state it clears to is *opted out*, so a bare `reset()` while the visitor
     * has consented would silently stop capturing for the rest of the visit.
     * Re-asserting the opt-in is what keeps that from happening. The plugin's
     * withdrawal path does the same thing in the opposite order, and for the
     * opposite reason.
     */
    vergeetGebruiker() {
      const ph = client()
      if (!ph) return
      try {
        const consented = ph.has_opted_in_capturing()
        ph.reset()
        if (consented) ph.opt_in_capturing()
      }
      catch { /* no-op */ }
    },
  }
}
