import { stats, type Review } from './site'

/** From the site's own figures, so the two can't disagree. */
const tutorCount = stats.find((s) => s.label === 'Docenten in ons team')?.value
const pupilCount = stats.find((s) => s.label === 'Leerlingen geholpen')?.value

/**
 * `/actie-groningen` — the Groningen campaign, a copy of `/openingsactie-utrecht`
 * (itself from the Claude Design handoff `Actie Utrecht.dc.html`).
 *
 * A stripped-down page meant for ad traffic: no navigation in the header or
 * the footer, every CTA scrolling to the proefles block at the bottom.
 */

/**
 * The free week, in hours, per package: a quarter of the monthly minimum.
 * `PriceLadder` prices these at the package's own rate, which is also what
 * the FAQ promises to take off the first invoice.
 */
const freeWeekHours = { basis: 1, standaard: 2, uitgebreid: 3 }

/**
 * The herfstactie's last day, inclusive. `useDaysLeft` counts down to it and
 * fills every `{dagen}` slot below — "nog 12 dagen" — so the page reads as
 * temporary without a date anybody has to keep current by hand.
 */
export const lastDay = '2026-10-31'

export const actieGroningen = {
  seoTitle: 'Herfstactie Groningen: eerste week bijles gratis',
  seoDescription:
    'Herfstactie in Groningen: plan een gratis proefles en krijg bij elk pakket de eerste week bijles gratis. Geldig t/m 31 oktober.',

  /** The label on every CTA on the page, the form's own button included. */
  ctaLabel: 'Proefles claimen',

  banner: 'Herfstactie, {dagen}: eerste week bijles gratis bij elk pakket · alleen t/m 31 oktober',
  headerOffer: 'Eerste week gratis',

  /** The bar pinned to the foot of a phone screen once the hero is gone. */
  stickyBar: 'Herfstactie – eerste week bijles gratis',

  hero: {
    badge: 'Tijdelijk: eerste week bijles gratis',
    /**
     * Split so the subjects can be set in amber; an ad's `?vak=` narrows them
     * to the one it was for. `/openingsactie-utrecht` shows the same title.
     */
    title: {
      before: 'Eindelijk weer voldoendes in ',
      highlight: 'wiskunde, scheikunde of natuurkunde',
      highlightFor: {
        wiskunde: 'wiskunde',
        natuurkunde: 'natuurkunde',
        scheikunde: 'scheikunde',
      },
    },
    body: 'Bijles op de middelbare school van docenten die de tijd nemen die er in de klas niet is. Zodat je kind niet alleen betere cijfers haalt, maar het ook écht snapt en er niet meer tegenop ziet.',
    promises: [
      'Gratis proefles, altijd 100% vrijblijvend',
      'Eerste week bijles gratis bij elk pakket',
      'Bij jou thuis, door universitaire bèta-studenten',
    ],
  },

  /** The white review card in the hero: under the form on desktop, under the promises on a phone. */
  heroReview: {
    stars: 5,
    quote: '“Van zware onvoldoendes naar een 7 op zijn eindexamen Wiskunde B.”',
    author: 'Marianne, moeder',
  },

  /**
   * The band straight under the hero form: the problem in the parents' own
   * words, then the turn. The reviews' common thread is not "better grades"
   * but the moment it clicks — grades, motivation and calm at home follow it.
   */
  pain: {
    image: '/img/studenten.webp',
    alt: 'Een docent van Bijles Bèta legt een leerling iets uit aan tafel',
    kicker: 'Herken je dit?',
    title: 'Je kind snapt het niet meer en ziet er steeds meer tegenop',
    body: 'In de klas is geen tijd om iets drie keer uit te leggen. Wie één keer de draad kwijt is, raakt bij elk volgend hoofdstuk verder achter. De cijfers zakken, het huiswerk wordt uitgesteld en het vak wordt iets om tegenop te zien.',
    turnTitle: 'We leggen het uit tot het klikt.',
    turnBody: 'Onze docenten nemen de tijd die er in de klas niet is. Ze leggen het uit tot het kwartje valt. Dat is het moment waarop alles verandert: je kind snapt het weer en krijgt zelfvertrouwen terug.',
  },

  /** The amber form panel beside the hero copy, as on the landings. */
  heroForm: {
    kicker: 'Gratis proefles in Groningen?',
    title: 'Claim je gratis proefles.',
    body: 'Plan vrijblijvend een gratis proefles in. Je maakt kennis met je docent en zit nergens aan vast. Kies je daarna een pakket, dan is de eerste week bijles gratis.',
    /** Under the body, behind a pulsing dot. */
    offer: 'Herfstactie: eerste week gratis bij elk pakket, alleen t/m 31 oktober.',
  },

  steps: {
    kicker: 'Zo werkt het',
    title: 'Het stappenplan',
    items: [
      {
        icon: '/img/stappen/stap-1-aanmelden.svg',
        title: 'Stap 1: Aanmelden',
        body: 'Meld je aan via het formulier en claim je gratis proefles.',
      },
      {
        icon: '/img/stappen/stap-2-match.svg',
        title: 'Stap 2: Match',
        body: 'We gaan direct op zoek naar een docent in Groningen die goed bij jou past.',
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
    body: `Sinds 2017 geven wij bijles in wiskunde, natuurkunde en scheikunde in Groningen. Ons team van ${tutorCount} universitaire bèta-studenten heeft al meer dan ${pupilCount} leerlingen geholpen. Die ervaring zetten we graag ook voor jouw kind in.`,
  },

  /**
   * The price ladder, from the Claude Design handoff `Tarieven Bijles Beta.dc.html`.
   * The rates and the monthly sums are read off `pricingPlans` and
   * `looseLesson` by `PriceLadder`, so only the words live here. Where the
   * design words a line differently on a phone, `short` is that wording.
   */
  priceLadder: {
    kicker: 'Tarieven · Herfstactie',
    title: { long: 'Hoe meer uur per maand,\nhoe lager het uurtarief.', short: 'Meer uur per maand, lager uurtarief.' },
    body: {
      long: 'Eén uurtarief, vier pakketten. Elk pakket bevat precies hetzelfde: wis-, natuur- en scheikunde, geen servicekosten en een gratis proefles. Het enige verschil is het aantal uur dat je per maand afneemt. En nu met de herfstactie: bij elk pakket is de eerste week bijles gratis.',
      short: 'Elk pakket bevat hetzelfde. Kies alleen hoeveel uur je per maand wilt. Herfstactie: de eerste week is gratis.',
    },
    /** Cheapest-per-hour last, in the order the ladder climbs. */
    tiers: [
      {
        slug: 'los',
        toggle: 'Los',
        label: 'Flexibel',
        blurb: { long: 'Wanneer jij extra hulp nodig hebt.', short: 'Flexibele bijles op maat, wanneer jij extra hulp nodig hebt.' },
      },
      {
        slug: 'basis',
        toggle: '4 u',
        blurb: { long: 'Een steuntje in de rug voor je volgende toets.', short: 'Een steuntje in de rug voor je volgende toets.' },
      },
      {
        slug: 'standaard',
        toggle: '8 u',
        blurb: { long: 'Structureel beter begrip en een stevige basis.', short: 'Structurele bijles voor beter begrip en een stevige basis.' },
      },
      {
        slug: 'uitgebreid',
        toggle: '12 u',
        blurb: { long: 'De bètavakken weer volledig onder controle.', short: 'Krijg de bètavakken weer volledig onder controle.' },
      },
    ],
    /** The tier the phone's selector opens on. */
    initialTier: 'standaard',
    noDiscount: 'Geen korting',
    /** The free week, priced per package by `PriceLadder`. */
    offer: {
      lastDay,
      title: 'Herfstactie · {dagen}',
      saving: 'Eerste week gratis, je bespaart',
      /** Over the struck-through monthly sum, in place of "Per maand". */
      firstMonth: 'Eerste maand',
      /** On Losse lessen, which the offer doesn't cover. */
      none: 'De herfstactie geldt alleen bij een pakket.',
      hours: freeWeekHours,
    },
    payPerLesson: 'Je betaalt per les',
    featuredBadge: 'Laagste uurtarief',
    selectorLabel: 'Hoeveel uur bijles per maand?',
    included: {
      title: { long: 'Bij elk pakket inbegrepen', short: 'Altijd inbegrepen' },
      items: [
        { long: 'Wis-, natuur- en scheikunde', short: 'Wis-, natuur- en scheikunde' },
        { long: 'Gratis proefles', short: 'Gratis proefles' },
        { long: 'Geen inschrijf- of servicekosten', short: 'Geen servicekosten' },
        { long: 'Persoonlijke match met je docent', short: 'Persoonlijke docentmatch' },
      ],
    },
    terms: {
      title: 'Goed om te weten',
      items: [
        { long: 'Extra uren? Zelfde uurtarief als je pakket.', short: 'Extra uren tegen hetzelfde uurtarief.' },
        { long: 'Elke maand aanpassen of opzeggen.', short: 'Maandelijks aanpassen of opzeggen.' },
        { long: 'Niet gebruikte uren gaan één maand mee.', short: 'Niet gebruikte uren gaan één maand mee.' },
        { long: 'Je betaalt achteraf, één factuur per maand.', short: 'Achteraf betalen, één factuur per maand.' },
      ],
    },
    cta: 'Gratis proefles plannen',
    help: { before: 'Twijfel je welk pakket past?', link: 'WhatsApp ons' },
  },

  reviewsTitle: 'Wat ouders over ons zeggen',
  /** This page's own reviews: parents only, in their own words. */
  reviews: [
    {
      rating: 5,
      title: 'Een 7 op zijn eindexamen Wiskunde B',
      body: 'Ontzettend blij met de bijlessen wiskunde van Henk voor onze zoon. Onze zoon is van zware onvoldoendes naar voldoendes en zelfs een 7 op zijn eindexamen Wiskunde B gegaan. Hij vond de uitleg van Henk erg duidelijk en Henk nam ook alle tijd voor hem. Heel erg bedankt Henk. Jij hebt een groot aandeel in die 7 op zijn eindexamen gehad!',
      author: 'Marianne',
      affiliation: 'Ouder van een middelbare scholier',
    },
    {
      rating: 5,
      title: 'Haar cijfers zijn gestegen',
      body: 'Onze dochter krijgt 1x per week bijles wiskunde van Sander van Bijles Beta. Wij zijn zeer tevreden. Sander legt goed uit, op een manier die onze dochter begrijpt. Haar cijfers zijn gestegen. Ook is de docent altijd op tijd en communiceert goed. Wij raden Bijles Beta zeker aan.',
      author: 'Roel',
      affiliation: 'Ouder van een middelbare scholier',
    },
    {
      rating: 5,
      title: 'Ze ziet er niet langer tegenop',
      body: 'Mijn dochter heeft wekelijks bijles wiskunde gehad van Sander. Naast haar betere cijfers merken we vooral dat ze veel meer inzicht in de stof heeft gekregen en met meer zelfvertrouwen aan wiskunde werkt. Ze ziet er niet langer tegenop en heeft inmiddels een mooi voldoende gehaald.\n\nWe zijn Sander ontzettend dankbaar. Dankzij zijn rustige, geduldige en duidelijke manier van lesgeven heeft onze dochter niet alleen goede resultaten behaald, maar ook meer zelfvertrouwen ontwikkeld. We kunnen hem van harte aanbevelen!',
      author: 'Johanna',
      affiliation: 'Ouder van een middelbare scholier',
    },
    {
      rating: 5,
      title: 'Het is weer leuk om huiswerk te maken',
      body: 'Sinds mijn dochter via Beta bijles krijgt is het weer leuk om huiswerk te maken. Hij kan goed uitleggen en is daarnaast ook nog eens een aardige vent waar ze zich bij op haar gemak voelt. Deze club houden we er nog wel even bij :)',
      author: 'Ouder van een leerling',
      affiliation: 'Ouder van een middelbare scholier',
    },
    {
      rating: 5,
      title: 'Ze heeft er duidelijk profijt van',
      body: 'Sinds een tijdje volgt onze dochter nu bijles voor al haar Beta vakken, en ze heeft er duidelijk profijt van. Met hard werken en de juiste begeleiding helpen ze haar echt verder, waar de reguliere lessen ophouden. Erg tevreden!',
      author: 'Reinier',
      affiliation: 'Ouder van een middelbare scholier',
    },
    {
      rating: 5,
      title: 'Haar motivatie komt terug',
      body: 'Hoi, ik heb voor mijn dochter bijlessen geregeld via Bijles Beta. Zij zit in 5V. Het gaat goed; haar motivatie komt terug door de lessen. De docent legt de stof goed uit.',
      author: 'Ouder van een leerling uit 5V',
      affiliation: 'Ouder van een middelbare scholier',
    },
  ] satisfies Review[],

  features: {
    kicker: 'De B van Bijles, Bèta, Bekwaamheid en Begrip',
    title: 'Waarom ouders zo tevreden zijn?',
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
    kicker: 'Gratis proefles in Groningen?',
    title: 'Claim je eerste gratis proefles.',
    body: 'Zet de eerste stap in de investering voor jezelf, of je kind. De eerste proefles is altijd 100% gratis. Bij een pakket krijg je nu de eerste week bijles erbij.',
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
      answer: `Plan je gratis proefles en kies daarna een pakket. Van je eerste maand vergoeden wij één week: bij Uitgebreid 3 uur, bij Standaard 2 uur en bij Basis 1 uur. Die week trekken we van je eerste factuur af. De herfstactie geldt voor nieuwe leerlingen in Groningen en omgeving die zich uiterlijk 31 oktober aanmelden.`,
    },
    {
      question: 'Moet ik meteen een pakket kiezen na de proefles?',
      lead: 'Nee.',
      answer:
        'De proefles is 100% vrijblijvend. Wil je daarna doorgaan, dan kies je een pakket. Heb je je vóór 1 november aangemeld, dan krijg je de gratis week.',
    },
    {
      question: 'Hebben jullie op de korte termijn docenten beschikbaar in Groningen?',
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

