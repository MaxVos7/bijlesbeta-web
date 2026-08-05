/**
 * Content for the subject landing pages served at `/bijles-[vak]-[stad]`.
 *
 * One template renders every combination: a subject supplies the copy as a
 * function of the city, a city supplies the place names that copy drops in.
 * Adding a city is a single entry here — no new page file.
 */

export type LandingCity = {
  slug: string
  /** As it reads inside a sentence: "bijles wiskunde in Groningen". */
  name: string
  /** The university our tutors study at, named in the body copy. */
  university: string
}

export const landingCities: LandingCity[] = [
  {
    slug: 'groningen',
    name: 'Groningen',
    university: 'Rijksuniversiteit Groningen',
  },
]

export type LandingSubject = {
  slug: string
  /** Capitalised, for headings: "Natuurkunde". */
  name: string
  /** Lowercase, for mid-sentence use: "bijles natuurkunde". */
  lowerName: string
  intro: (city: LandingCity) => string
  block: {
    kicker: string
    title: string
    /** The four paragraphs of the text-and-photo block. */
    body: (city: LandingCity) => string[]
  }
  seoDescription: (city: LandingCity) => string
}

export const landingSubjects: LandingSubject[] = [
  {
    slug: 'natuurkunde',
    name: 'Natuurkunde',
    lowerName: 'natuurkunde',
    intro: () =>
      'Van mechanica tot elektriciteit: natuurkunde wordt logisch als je het concept snapt. Onze docenten leggen eerst uit waarom iets werkt – daarna worden de formules vanzelf helder.',
    block: {
      kicker: 'Natuurkunde logisch gemaakt',
      title: 'Eerst snappen, dan rekenen',
      body: (city) => [
        `Zoek je bijles natuurkunde in ${city.name}? Natuurkunde is overal om je heen, maar het vak kan behoorlijk abstract zijn. Formules, eenheden, berekeningen – bij Bijles Bèta maken we het weer logisch.`,
        `Onze docenten zijn natuurkunde- en techniekstudenten aan de ${city.university}. Ze leggen eerst het concept uit: waarom werkt iets zo? Wat gebeurt er eigenlijk? Pas als je dat snapt, gaan we rekenen. Dan worden die formules opeens logisch.`,
        'Of je nu vastloopt bij mechanica, elektriciteit, golven of kernfysica – wij helpen je verder. We werken met jouw lesboek en methode, of je nu op het vmbo, de havo of het vwo zit.',
        `Onze bijles natuurkunde is aan huis in ${city.name} en omgeving. Bekijk onze tarieven en start met een gratis proefles.`,
      ],
    },
    seoDescription: (city) =>
      `Bijles natuurkunde in ${city.name} door studenten van de ${city.university}. Eerst het concept, dan de formules. Start met een gratis proefles.`,
  },
  {
    slug: 'wiskunde',
    name: 'Wiskunde',
    lowerName: 'wiskunde',
    intro: () =>
      'Van algebra tot analyse: wiskunde wordt logisch zodra je het patroon ziet. Onze docenten leggen de stof uit tot het kwartje valt.',
    block: {
      kicker: 'Wiskunde bijles aan huis',
      title: 'Het kwartje moet vallen',
      body: (city) => [
        `Zoek je bijles wiskunde in ${city.name}? Bij Bijles Bèta krijg je persoonlijke begeleiding van studenten die zelf wiskunde of een bèta-studie volgen aan de ${city.university}. Ze snappen de stof én weten hoe ze het moeten uitleggen.`,
        'Onze wiskunde bijles is voor alle niveaus: vmbo, havo en vwo. Van de brugklas tot je eindexamen. Volg je wiskunde A of wiskunde B? Onze docenten hebben ervaring met beide varianten.',
        `Wat bijles wiskunde in ${city.name} bij ons bijzonder maakt? We komen bij je thuis. Geen reistijd, geen gedoe. Gewoon effectief werken aan jouw wiskunde in je eigen omgeving.`,
        'Bekijk onze tarieven of lees hoe het werkt. We starten altijd met een gratis proefles – vrijblijvend en zonder opzegtermijn.',
      ],
    },
    seoDescription: (city) =>
      `Bijles wiskunde in ${city.name} aan huis, voor vmbo, havo en vwo. Persoonlijke begeleiding door bèta-studenten. Start met een gratis proefles.`,
  },
  {
    slug: 'scheikunde',
    name: 'Scheikunde',
    lowerName: 'scheikunde',
    intro: () =>
      'Van mol rekenen tot organische chemie: scheikunde wordt logisch als je stap voor stap opbouwt. Onze docenten beginnen bij de basis.',
    block: {
      kicker: 'Scheikunde bijles aan huis',
      title: 'Scheikunde stap voor stap',
      body: (city) => [
        `Zoek je bijles scheikunde in ${city.name}? Scheikunde is het vak van moleculen, reacties en berekeningen. Mol rekenen, reactievergelijkingen balanceren, organische structuren – er komt veel bij kijken. Bij Bijles Bèta krijg je begeleiding van studenten die het vak zelf studeren aan de ${city.university}.`,
        'Het beruchte mol rekenen is voor veel leerlingen een struikelblok. Onze docenten hebben een duidelijke aanpak: we beginnen bij de basis en bouwen stap voor stap op. Met veel oefening en herhaling, want scheikunde leer je door te doen.',
        'De BINAS is je beste vriend bij scheikunde – als je weet hoe je hem moet gebruiken. Onze docenten leren je niet alleen de stof, maar ook hoe je efficiënt met je tabellenboek werkt. Of het nu gaat om zuur-base reacties, redox of organische chemie.',
        `We geven bijles scheikunde aan vmbo, havo en vwo leerlingen. De bijles is aan huis in ${city.name}. Bekijk onze tarieven en start met een gratis proefles.`,
      ],
    },
    seoDescription: (city) =>
      `Bijles scheikunde in ${city.name}: mol rekenen, reacties en organische chemie, stap voor stap uitgelegd. Start met een gratis proefles.`,
  },
]

/** The promises under the landing hero — shorter than the homepage's three. */
export const landingPromises = [
  '22+ bijles-docenten beschikbaar',
  'Kwalitatieve bijles',
  'Efficiënt en doelgericht',
] as const

export const landingHeroForm = {
  kicker: 'Gratis proefles?',
  title: 'Claim je eerste gratis proefles.',
  body: 'Zet de eerste stap in de investering voor jezelf, of je kind. De eerste proefles is altijd 100% gratis!',
} as const

/** The "Easy as 1,2,3…" band. */
export const landingSteps = {
  kicker: 'Onze werkwijze',
  title: 'Easy as 1,2,3…',
  items: [
    {
      label: 'Stap 1.',
      title: 'Proefles',
      body: 'Leer je docent kennen en maak samen een plan voor de bijles.',
      image: '/img/proefles.png',
      alt: 'Twee leerlingen werken samen tijdens de proefles',
    },
    {
      label: 'Stap 2.',
      title: 'Kies het juiste pakket',
      body: 'Bepaal samen met je docent hoeveel bijlessen je nodig hebt en kies het juiste pakket.',
      image: '/img/bord.png',
      alt: 'Docent werkt een natuurkundeopgave uit op het bord',
    },
    {
      label: 'Stap 3.',
      title: 'Wordt een Bèta pro',
      body: 'Ontdek hoe de bijles jou laat zien hoe leuk de bèta vakken eigenlijk zijn.',
      image: '/img/fiets.png',
      alt: 'Docent op de fiets onderweg naar de bijles',
    },
  ],
} as const

/** The city that site-wide links (footer, subject cards) point at. */
export const defaultLandingCity = landingCities[0]!

/** The route for a landing page, e.g. `/bijles-wiskunde-groningen`. */
export function landingPath(subjectSlug: string, citySlug = defaultLandingCity.slug) {
  return `/bijles-${subjectSlug}-${citySlug}`
}

/** Look up a subject and city from the route params; `null` when unknown. */
export function findLanding(vak: string, stad: string) {
  const subject = landingSubjects.find((item) => item.slug === vak)
  const city = landingCities.find((item) => item.slug === stad)

  return subject && city ? { subject, city } : null
}
