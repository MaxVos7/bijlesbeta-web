/**
 * Single source of truth for site-wide content.
 *
 * Copy lives here rather than inline in templates so the design session can
 * restructure layouts without rewriting text, and so contact details only ever
 * change in one place.
 */

export const tagline = 'Maakt het antwoord logisch.'

export const contact = {
  phone: '085 820 1900',
  phoneHref: 'tel:+31858201900',
  whatsapp: '06 382 60 623',
  whatsappHref: 'https://wa.me/31638260623',
  email: 'contact@bijlesbeta.nl',
  emailHref: 'mailto:contact@bijlesbeta.nl',
  address: {
    street: 'De Brink 34',
    postalCode: '9723 AM',
    city: 'Groningen',
  },
  openingHours: 'Maandag t/m zaterdag, 10:00 – 18:00',
  /** Same information as `openingHours`, laid out as a two-column table. */
  openingHoursRows: [
    { days: 'Ma t/m Za', hours: '10:00 – 18:00' },
    { days: 'Zondag', hours: 'Gesloten' },
  ],
} as const

export const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/bijlesbeta' },
  { label: 'Instagram', href: 'https://www.instagram.com/bijlesbeta' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/bijlesbeta' },
  { label: 'X', href: 'https://x.com/bijlesbeta' },
] as const

/** Footer column of portal links — these point at the Laravel portal. */
export const portalLinks = [
  { label: 'Studenten', path: '/login' },
  { label: 'Ouders', path: '/login' },
  { label: 'Docenten', path: '/login' },
] as const

export const legalLinks = [
  { label: 'Algemene voorwaarden', to: '/algemene-voorwaarden' },
  { label: 'Privacy statement', to: '/privacy' },
] as const

/**
 * Headline numbers, counted up when the band scrolls into view.
 * `value` is the number to count to; `suffix` is appended once it lands.
 */
export const stats = [
  { value: 23, suffix: '', label: 'Docenten in ons team' },
  { value: 200, suffix: '+', label: 'Leerlingen geholpen' },
  { value: 25000, suffix: 'km', label: 'Naar bijles gefietst' },
] as const

export const statsIntro = {
  title: 'Bijles Bèta in cijfers',
  body: 'Wiskunde, natuurkunde en scheikunde: dát is waar wij goed in zijn. Al onze docenten volgen een bèta-opleiding aan de ',
  /** Set in bold at the end of `body`. */
  emphasis: 'Rijksuniversiteit Groningen.',
} as const

export type Review = {
  rating: number
  title: string
  body: string
  author: string
  affiliation: string
}

export const reviews: Review[] = [
  {
    rating: 5,
    title: 'Erg tevreden!',
    body: 'Sinds een tijdje volgt onze dochter nu bijles voor al haar Beta vakken, en ze heeft er duidelijk profijt van. Met hard werken en de juiste begeleiding helpen ze haar echt verder, waar de reguliere lessen ophouden. Erg tevreden!',
    author: 'Reinier Teekens',
    affiliation: 'Hanzehogeschool',
  },
]

export const nav = [
  { label: 'Over ons', to: '/over-ons' },
  { label: 'Tarieven', to: '/tarieven' },
  { label: 'Kennisbank', to: '/kennisbank' },
  { label: 'Werken bij', to: '/werken-bij' },
  { label: 'Contact', to: '/contact' },
] as const

export const subjects = [
  {
    slug: 'wiskunde',
    name: 'Wiskunde',
    description:
      'Van wiskunde A, B en C tot wiskunde D en statistiek. Onze docenten leggen de stof uit tot het klikt.',
  },
  {
    slug: 'natuurkunde',
    name: 'Natuurkunde',
    description:
      'Mechanica, elektriciteit, golven en meer — met veel oefenen aan de hand van echte examenopgaven.',
  },
  {
    slug: 'scheikunde',
    name: 'Scheikunde',
    description:
      'Rekenen aan reacties, organische chemie en evenwichten, uitgelegd door scheikundestudenten van de RUG.',
  },
] as const

export type PricingPlan = {
  slug: string
  name: string
  hoursLabel: string
  price: number
  regularPrice: number
  savingsLabel: string | null
  featured: boolean
  features: string[]
}

export const pricingPlans: PricingPlan[] = [
  {
    slug: 'losse-lessen',
    name: 'Losse lessen',
    hoursLabel: 'Geen minimum',
    price: 29.95,
    regularPrice: 33,
    savingsLabel: null,
    featured: false,
    features: [
      'Geen verplichting vooraf',
      'Gratis proefles',
      'Geen servicekosten',
      'Maandelijkse facturatie',
    ],
  },
  {
    slug: 'basis',
    name: 'Basis',
    hoursLabel: 'Vanaf 4 uur per maand',
    price: 30,
    regularPrice: 33,
    savingsLabel: '€3 korting per uur',
    featured: false,
    features: [
      'Extra uren voor €30 per uur',
      'Gratis proefles',
      'Geen servicekosten',
      'Ongebruikte uren schuiven een maand door',
    ],
  },
  {
    slug: 'standaard',
    name: 'Standaard',
    hoursLabel: 'Vanaf 8 uur per maand',
    price: 27,
    regularPrice: 33,
    savingsLabel: '€6 korting per uur',
    featured: true,
    features: [
      'Extra uren voor €27 per uur',
      'Gratis proefles',
      'Geen servicekosten',
      'Ongebruikte uren schuiven een maand door',
    ],
  },
  {
    slug: 'uitgebreid',
    name: 'Uitgebreid',
    hoursLabel: 'Vanaf 12 uur per maand',
    price: 25,
    regularPrice: 33,
    savingsLabel: '€8 korting per uur',
    featured: false,
    features: [
      'Extra uren voor €25 per uur',
      'Gratis proefles',
      'Geen servicekosten',
      'Ongebruikte uren schuiven een maand door',
    ],
  },
]

export const faqs = [
  {
    question: 'Hebben jullie op de korte termijn docenten beschikbaar?',
    answer:
      'Ja! Wij hebben vrijwel altijd docenten beschikbaar die op de korte termijn bijles kunnen geven in de Bèta vakken aan huis in Groningen. In drukke periodes laten we tijdig weten op welk termijn we docenten beschikbaar hebben.',
  },
  {
    question: 'Ik woon buiten Groningen, kan ik ook bijles krijgen van jullie?',
    answer:
      'Dat kan zeker! Er valt vrijwel altijd iets te regelen. Leerlingen die buiten de stad wonen spreken vaak af met onze docenten op openbare locaties zoals het forum of de middelbare school. Mocht de afstand te doen zijn per fiets, dan rekenen wij vaak een reiskostenvergoeding van 5 euro per les, die rechtstreeks naar de docent gaat.',
  },
  {
    question: 'Wanneer en hoe betaal ik voor de bijles?',
    answer:
      'Na de bijlessen sturen wij een factuur. Dit doen wij iedere maand. Je kan het factuur in de eerste twee week van de volgende maand verwachten. Deze is gemakkelijk online te betalen.',
  },
  {
    question: 'Ik zit niet op de middelbare school, kan ik ook bijles krijgen van jullie?',
    answer:
      'Dat kan zeker! Onze topdocenten zijn zeer flexibel, door hun brede kennis kunnen we ons makkelijk aanpassen aan jouw bijlesvraag. Al onze docenten zijn student aan de Faculty of Science & Engineering van de Rijksuniversiteit Groningen.',
  },
  {
    question: 'Ik moet de bijles helaas kort van te voren afzeggen, wat gebeurt er dan?',
    answer:
      'Geef dat minstens 24 uur van te voren aan! Bij ons geldt dat de bijles tot 24 uur van tevoren mag worden afgezegd. Hierna zijn wij genoodzaakt de bijles te verrekenen.',
  },
  {
    question: 'Geven jullie ook examen training?',
    answer:
      'Dat doen we zeker! We geven dit jaar examentraining voor het vak wiskunde. Voor alle andere vakken kunnen onze docenten je perfect voorbereiden op je examen via onze bijles.',
  },
]
