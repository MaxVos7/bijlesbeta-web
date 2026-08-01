/**
 * Single source of truth for site-wide content.
 *
 * Copy lives here rather than inline in templates so the design session can
 * restructure layouts without rewriting text, and so contact details only ever
 * change in one place.
 */

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
} as const

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
    question: 'Hoe snel kan ik beginnen?',
    answer:
      'Meestal koppelen we binnen vijf dagen een passende docent aan je. Je start altijd met een gratis proefles, zonder verplichtingen.',
  },
  {
    question: 'Is de proefles echt gratis?',
    answer:
      'Ja. De eerste les is gratis en vrijblijvend. Klikt het niet, dan zoeken we een andere docent of stopt het daar.',
  },
  {
    question: 'Kan de bijles ook online?',
    answer:
      'Zowel online als bij jou thuis is mogelijk. Voor lessen buiten Groningen rekenen we €5 reiskosten per les.',
  },
  {
    question: 'Hoe zit het met afzeggen?',
    answer:
      'Tot 24 uur van tevoren afzeggen is kosteloos. Daarna brengen we de les in rekening.',
  },
  {
    question: 'Wanneer krijg ik de factuur?',
    answer:
      'We factureren per maand, achteraf, op basis van de lessen die daadwerkelijk hebben plaatsgevonden.',
  },
  {
    question: 'Wat als ik meer uren nodig heb dan mijn pakket?',
    answer:
      'Je kunt altijd meer bijles afnemen dan in het pakket zit. Extra uren reken je af tegen hetzelfde uurtarief.',
  },
]
