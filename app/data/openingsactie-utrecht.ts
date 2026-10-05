import { pricingPlans, stats } from './site'

/** From the site's own figures, so the two can't disagree. */
const tutorCount = stats.find((s) => s.label === 'Docenten in ons team')?.value
const pupilCount = stats.find((s) => s.label === 'Leerlingen geholpen')?.value

/**
 * `/openingsactie-utrecht` — the opening campaign for Utrecht, from the Claude
 * Design handoff `Actie Utrecht.dc.html`.
 *
 * A stripped-down page meant for ad traffic: no navigation in the header or
 * the footer, every CTA scrolling to the proefles block at the bottom.
 */

/** How many new pupils the offer is open to. Shown in four places. */
export const spotsLeft = 4

/**
 * The free week, in hours, per package: a quarter of the monthly minimum.
 * The benefit shown on each card is these hours at the package's own rate,
 * which is also what the FAQ promises to take off the first invoice.
 */
const freeWeekHours: Record<string, number> = {
  uitgebreid: 3,
  standaard: 2,
  basis: 1,
}

export const openingsactieUtrecht = {
  seoTitle: 'Openingsactie Utrecht: gratis week bijles',
  seoDescription:
    'Nieuw in Utrecht: plan een gratis proefles en krijg bij elk pakket de eerste week bijles gratis. Openingsactie voor de eerste nieuwe leerlingen, geldig t/m 31 oktober.',

  /** The label on every CTA on the page, the form's own button included. */
  ctaLabel: 'Proefles claimen',

  banner: 'Openingsactie Utrecht: eerste week bijles gratis · geldig t/m 31 oktober',
  headerSpots: `Nog ${spotsLeft} plekken`,

  hero: {
    badge: `Nieuw in Utrecht · nog ${spotsLeft} plekken`,
    title: 'Bijles wiskunde, natuurkunde en scheikunde in Utrecht',
    body: `Start nu met een gratis week. Plan je gratis proefles. Kies je daarna een pakket, dan is de eerste week bijles van ons. We hebben plek voor ${spotsLeft} nieuwe leerlingen in Utrecht.`,
    promises: [
      'Gratis proefles, altijd 100% vrijblijvend',
      'Eerste week bijles gratis bij elk pakket',
      'Bij jou thuis, door universitaire bèta-studenten',
    ],
  },

  steps: {
    kicker: 'Zo werkt het',
    title: 'Het stappenplan',
    items: [
      {
        icon: '/img/stappen/stap-1-aanmelden.svg',
        title: 'Stap 1: Aanmelden',
        body: 'Meld je aan via het formulier en claim een van de laatste plekken.',
      },
      {
        icon: '/img/stappen/stap-2-match.svg',
        title: 'Stap 2: Match',
        body: 'We gaan direct op zoek naar een docent in Utrecht die goed bij jou past.',
      },
      {
        icon: '/img/stappen/stap-3-proefles.svg',
        title: 'Stap 3: Proefles',
        body: 'Leer elkaar kennen en maak een plan voor de komende bijlessen. Gratis en vrijblijvend.',
      },
      {
        icon: '/img/stappen/stap-4-bijles.svg',
        title: 'Stap 4: Bijles',
        body: 'Kies je pakket en start met een gratis week. Stap voor stap grip op die lastige bètavakken.',
      },
    ],
    link: 'Meld je hier aan',
  },

  team: {
    kicker: 'Wie wij zijn',
    title: 'Ontmoet je toekomstige docent',
    body: `Sinds 2017 geven wij bijles in wiskunde, natuurkunde en scheikunde in Groningen. Ons team van ${tutorCount} universitaire bèta-studenten heeft al meer dan ${pupilCount} leerlingen geholpen. Die ervaring nemen we nu mee naar Utrecht.`,
  },

  pricingIntro: {
    kicker: 'Tarieven en pakketten · Openingsactie Utrecht',
    title: 'Eerlijk geprijsd, eerste week gratis',
    body: 'Met pakketten stimuleren we consistente bijles waardoor jij het vak echt leert begrijpen. Kies nu een pakket en de eerste week bijles is gratis — zolang er plek is. Het uurtarief is afhankelijk van het gekozen pakket.',
  },
  pricingOffer: 'Openingsactie: eerste week gratis',
  looseLessonBlurb:
    'Flexibele bijles op maat, wanneer jij extra hulp nodig hebt. De gratis week geldt alleen bij een pakket.',
  pricingAssurances: [
    'Wis-, natuur- en scheikunde',
    'Elke maand aanpasbaar of opzegbaar',
    'Geen inschrijf- of bemiddelingskosten',
  ],

  features: {
    kicker: 'De B van Bijles, Bèta, Bekwaamheid en Begrip',
    title: 'Waarom onze leerlingen zo tevreden zijn?',
    items: [
      {
        image: '/img/proefles.webp',
        alt: 'Twee leerlingen lachen tijdens de proefles',
        title: 'De beste docenten',
        body: 'Onze docenten volgen een bèta-studie aan de universiteit en zijn zorgvuldig geselecteerd op kennis, motivatie en sociale vaardigheden.',
      },
      {
        image: '/img/teamuitje.webp',
        alt: 'Het team van Bijles Bèta tijdens een teamavond',
        title: 'Een hecht team',
        body: 'We hebben persoonlijk contact met onze leerlingen én tussen de docenten onderling. Zo zorgen we samen voor een prettige en effectieve bijleservaring.',
      },
      {
        image: '/img/bord.webp',
        alt: 'Docent werkt natuurkundeformules uit op het schoolbord',
        title: 'Snel een docent',
        body: 'We schakelen snel, zodat jij direct kunt beginnen. Gemiddeld duurt het maar vijf dagen tussen je aanmelding en de proefles.',
      },
      {
        image: '/img/het-bedrijf-verhaal.webp',
        alt: 'Twee docenten van Bijles Bèta met een kruiwagen',
        title: 'Een eerlijke prijs',
        body: 'Ons bedrijf wordt gerund door studenten: professioneel georganiseerd, korte lijntjes en altijd een eerlijke prijs.',
      },
    ],
  },

  trialCta: {
    formTitle: 'Vul je gegevens in en claim je gratis proefles',
    kicker: 'Gratis proefles in Utrecht?',
    title: 'Claim je eerste gratis proefles.',
    body: 'Zet de eerste stap in de investering voor jezelf, of je kind. De eerste proefles is altijd 100% gratis — en bij een pakket krijg je nu de eerste week bijles erbij.',
    promises: [
      'Enthousiaste docenten',
      'Snel een proefles ingepland',
      'Eerste week gratis bij een pakket',
    ],
  },

  faqs: [
    {
      question: 'Hoe werkt de gratis week bijles precies?',
      lead: 'Simpel.',
      answer: `Plan je gratis proefles en kies daarna een pakket. Van je eerste maand vergoeden wij één week: bij Uitgebreid 3 uur, bij Standaard 2 uur en bij Basis 1 uur. Die week trekken we van je eerste factuur af. De openingsactie geldt voor de eerste ${spotsLeft} nieuwe leerlingen in Utrecht en omgeving, uiterlijk tot eind oktober.`,
    },
    {
      question: 'Moet ik meteen een pakket kiezen na de proefles?',
      lead: 'Nee.',
      answer:
        'De proefles is 100% vrijblijvend. Wil je daarna doorgaan, dan kies je een pakket — zolang er nog plek is, krijg je de gratis week.',
    },
    {
      question: 'Hebben jullie op de korte termijn docenten beschikbaar in Utrecht?',
      lead: 'Ja!',
      answer:
        'Wij hebben vrijwel altijd docenten beschikbaar die op de korte termijn bijles kunnen geven in de Bèta vakken bij jou aan huis. In drukke periodes laten we tijdig weten op welk termijn we docenten beschikbaar hebben.',
    },
    {
      question: 'Wanneer en hoe betaal ik voor de bijles?',
      lead: 'Na de bijlessen sturen wij een factuur.',
      answer:
        'Dit doen wij iedere maand. Je kan het factuur in de eerste twee week van de volgende maand verwachten. Deze is gemakkelijk online te betalen.',
    },
    {
      question: 'Ik moet de bijles helaas kort van te voren afzeggen, wat gebeurt er dan?',
      lead: 'Geef dat minstens 24 uur van te voren aan!',
      answer:
        'Bij ons geldt dat de bijles tot 24 uur van tevoren mag worden afgezegd. Hierna zijn wij genoodzaakt de bijles te verrekenen.',
    },
  ],
} as const

/** What the free week is worth on each package, in euros. */
export const freeWeekBenefit = Object.fromEntries(
  pricingPlans.map((plan) => [plan.slug, (freeWeekHours[plan.slug] ?? 0) * plan.price]),
) as Record<string, number>
