import { freeWeekBenefit, spotsLeft } from './openingsactie-utrecht'

/**
 * `/actie-utrecht` — the compact, single-column version of the Utrecht
 * opening campaign, from the Claude Design handoff
 * `Openingsactie Utrecht v3.dc.html`. The handoff's hero video is left out.
 *
 * The number of places is shared with `/openingsactie-utrecht`, so the two
 * pages can't disagree about how many are left.
 */

/** How many places the offer opened with; the progress bar is out of this. */
export const totalSpots = 10

/** When the offer ends: the last second of 31 October, Dutch time. */
export const actieEnd = '2026-10-31T23:59:59+01:00'

export const actieUtrecht = {
  seoTitle: 'Openingsactie Utrecht: gratis proefles en eerste week gratis',
  seoDescription:
    'Nieuw in Utrecht: plan een gratis proefles en krijg je eerste week bijles gratis. Alleen voor de eerste 10 leerlingen, geldig t/m 31 oktober.',

  ctaLabel: 'Proefles claimen',

  /** The countdown is appended after "nog". */
  banner: 'Openingsactie Utrecht: eerste week bijles gratis · nog',
  bannerFallback: 'Openingsactie Utrecht: eerste week bijles gratis · geldig t/m 31 oktober',
  countdown: (d: number, hms: string) => `${d} ${d === 1 ? 'dag' : 'dagen'} ${hms}`,

  headerSpots: `Nog ${spotsLeft} plekken`,
  badge: `Nieuw in Utrecht · nog ${spotsLeft} plekken`,

  /** The title is split so the middle can be set in amber. */
  title: {
    before: 'Plan een gratis proefles en krijg je ',
    highlight: 'eerste week bijles gratis',
  },
  /** The subjects that open the intro; narrowed to one by an ad's `?vak=`. */
  subjects: 'Wiskunde, natuurkunde en scheikunde',
  subjectsFor: {
    wiskunde: 'Wiskundebijles',
    natuurkunde: 'Natuurkundebijles',
    scheikunde: 'Scheikundebijles',
  },
  body: `bij jou thuis in Utrecht, door universitaire bèta-studenten. Alleen voor de eerste ${totalSpots} leerlingen, t/m 31 oktober.`,

  claim: {
    kicker: 'Gratis proefles in Utrecht?',
    title: 'Claim je plek hieronder 👇',
  },

  form: {
    progress: `${totalSpots - spotsLeft} van de ${totalSpots} plekken geclaimd`,
    left: `Nog ${spotsLeft} over`,
    title: 'Vul je gegevens in en claim je gratis proefles',
  },

  /** The middle one carries the saving, set in green; the rest are plain. */
  promises: [
    'Gratis proefles, altijd 100% vrijblijvend',
    // `amount` is the most the free week can save, on the largest package.
    {
      before: 'Eerste week bijles gratis bij elk pakket, tot ',
      amount: `€${Math.max(...Object.values(freeWeekBenefit))}`,
      after: ' besparing',
    },
    'Bij jou thuis, door universitaire bèta-studenten',
  ],

  contactLead: 'Sneller contact?',

  /** The small print at the foot of the amber proefles card. */
  validUntil: 'Actie t/m 31 oktober. Vol = vol.',
} as const
