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
    title: 'leuke bijles',
    body: 'leuke bijles je leert veel nu eindelijk voldoende gehaald, heel fijn dus.',
    author: 'Marco van der Wal',
    affiliation: 'Middelbarescholier',
  },
  {
    rating: 5,
    title: 'Roderick heeft mij supergoed geholpen',
    body: 'Mega tevreden bijles-student hier! Roderick heeft mij supergoed geholpen in mijn voorbereiding op mijn pre-masterstudie. Er werd met behulp van maatwerk meegedacht in waar mijn leerbehoefte lag wat ervoor heeft gezorgd dat ik zo veel meer zelfvertrouwen heb gekregen op het gebied van wiskunde en statistiek! Onwijs dankbaar voor. Top!',
    author: 'Janka Klein Entink',
    affiliation: 'Pre-master student',
  },
  {
    rating: 5,
    title: 'Haar cijfers zijn gestegen.',
    body: 'Onze dochter krijgt 1x per week bijles wiskunde van een docent van Bijles Beta. Wij zijn zeer tevreden. Hij legt goed uit, op een manier die onze dochter begrijpt. Haar cijfers zijn gestegen. Ook is de docent altijd op tijd en communiceert goed. Wij raden Bijles Beta zeker aan.',
    author: 'Roel Steunenberg',
    affiliation: 'Ouder van een middelbare scholier',
  },
  {
    rating: 5,
    title: 'Hij is deskundig en kan goed uitleggen.',
    body: 'Ik heb een paar keer bijles natuurkunde gehad van Sander. Hij is deskundig en kan goed uitleggen.\nVerder is het contact prettig en is hij flexibel in het inplannen van bijles afspraken. Ik ben erg tevreden dus.',
    author: 'Juul de Lange',
    affiliation: 'Middelbare scholier',
  },
  {
    rating: 5,
    title: 'Erg tevreden!',
    body: 'Sinds een tijdje volgt onze dochter nu bijles voor al haar Beta vakken, en ze heeft er duidelijk profijt van. Met hard werken en de juiste begeleiding helpen ze haar echt verder, waar de reguliere lessen ophouden. Erg tevreden!',
    author: 'Reinier Teekens',
    affiliation: 'Hanzehogeschool',
  },
]

/** The single review pulled out on the aanmelden page. */
export const featuredReview: Review =
  reviews.find((review) => review.author === 'Reinier Teekens') ?? reviews[0]!

export const rating = { label: 'Uitstekend', stars: 5, count: '20+ Reviews' } as const

/** The three promises repeated under every hero. */
export const heroPromises = [
  'Altijd een persoonlijke match met de juiste docent',
  'Enthousiaste bèta-studenten van de Rijksuniversiteit Groningen',
  'Direct resultaat met effectieve 1-op-1 begeleiding',
] as const

export const reassurance = '100% gratis, je zit nergens aan vast'

/**
 * `icon` names a path drawn inline in FeatureCard — the design uses custom
 * line drawings rather than an icon set.
 */
export const features = [
  {
    icon: 'board',
    title: 'De beste docenten',
    body: 'Onze docenten volgen een bèta-studie aan de universiteit en zijn zorgvuldig geselecteerd op kennis, motivatie en sociale vaardigheden.',
  },
  {
    icon: 'team',
    title: 'Een hecht team',
    body: 'We hebben persoonlijk contact met onze leerlingen én tussen de docenten onderling. Zo zorgen we samen voor een prettige en effectieve bijleservaring.',
  },
  {
    icon: 'clock',
    title: 'Snel een docent',
    body: 'We schakelen snel, zodat jij direct kunt beginnen. Gemiddeld duurt het maar vijf dagen tussen je aanmelding en de proefles.',
  },
  {
    icon: 'coins',
    title: 'Een eerlijke prijs',
    body: 'Ons bedrijf wordt gerund door studenten: professioneel georganiseerd, korte lijntjes en altijd een eerlijke prijs.',
  },
] as const

/** Blurb and photo per subject, for the cards on the homepage. */
export const subjectCards = [
  {
    slug: 'wiskunde',
    name: 'Wiskunde',
    image: '/img/wiskunde.jpg',
    alt: 'Bijles wiskunde Groningen',
    body: 'Wiskunde is geen mysterie. Soms heb je alleen een klein duwtje in de rug nodig om het te zien.',
  },
  {
    slug: 'natuurkunde',
    name: 'Natuurkunde',
    image: '/img/natuurkunde.jpg',
    alt: 'Bijles natuurkunde Groningen',
    body: 'Achter elke formule zit een idee. Zodra je dat begrijpt, wordt natuurkunde echt interessant.',
  },
  {
    slug: 'scheikunde',
    name: 'Scheikunde',
    image: '/img/scheikunde.jpg',
    alt: 'Bijles scheikunde Groningen',
    body: 'In scheikunde hangt alles samen als moleculen in een reactie. Begrijp het geheel, wij helpen je!',
  },
] as const

export const story = {
  kicker: 'Al 7 jaar een begrip in de bèta Bijles',
  title: 'Ons verhaal',
  body: 'Bijles Bèta is ontstaan vanuit de bèta afdeling van de Rijksuniversiteit Groningen. Een kleine groep met ambitieuze studenten dacht dat het anders moest. De bèta vakken verdienen het om met passie te worden over gedragen.',
} as const

export const teamIntro = {
  kicker: 'Een hecht team',
  title: 'Ontmoet je toekomstige docent',
  body: 'Wij zijn een team van universitaire bèta-studenten met passie voor onderwijs. Door samen te werken en ervaringen te delen, zorgen we voor de beste bijles voor elke leerling.',
} as const

/** The yellow trial-lesson block that closes most pages. */
export const trialCta = {
  kicker: 'Gratis proefles?',
  title: 'Claim je eerste gratis proefles.',
  body: 'Zet de eerste stap in de investering voor jezelf, of je kind. De eerste proefles is altijd 100% gratis',
  promises: ['Enthousiaste docenten', 'Snel een proefles ingepland', 'Scherp geprijsd'],
} as const

export const faqIntro = {
  title: 'Moeilijke vragen bestaan niet!',
  before: 'Staat je vraag er niet tussen?',
  link: 'Neem contact op!',
} as const

/**
 * The contact page. Its FAQ sits beside the accordion rather than above it, so
 * it has its own lead-in instead of reusing `faqIntro`.
 */
export const contactPage = {
  kicker: 'Contact',
  title: 'Zo kan je ons bereiken',
  intro:
    'Hoi! Mijn naam is Max en ik ben de contactpersoon van Bijles Bèta. Twijfel je ergens over? Of heb je een vraag. Neem dan nu contact op.',
  openingHoursTitle: 'Openingstijden:',
  faq: {
    title: 'Veelgestelde vragen (FAQ)',
    body: 'Bekijk onze veelgestelde vragen (FAQ)',
  },
  /** The panel beside the hero — placeholders stand in for labels here. */
  form: {
    kicker: 'Voor al je vragen',
    title: 'Contactformulier',
    firstName: 'Voornaam',
    lastName: 'Achternaam',
    email: 'E-mailadres',
    message: 'Bericht',
    privacy: 'Ik ga akkoord met het privacybeleid.',
    /** Set in red directly after `privacy`, with no space between. */
    privacyRequired: '(Vereist)',
    submit: 'Verzenden',
    submitting: 'Versturen…',
  },
} as const

/** Shown by both variants of ContactForm once a message is through. */
export const contactFormSuccess = {
  title: 'Bedankt voor je bericht',
  body: 'We hebben je bericht ontvangen en nemen zo snel mogelijk contact met je op.',
} as const

/** The Bijles Bèta / reguliere aanbieders comparison on Over ons. */
export const comparison = {
  kicker: 'Daarom kies je voor Bijles Bèta',
  title: 'De verschillen op een rij',
  us: {
    title: 'Bijles Bèta',
    body: 'Alleen in Groningen en persoonlijk contact.',
    points: [
      'Persoonlijk en betrokken in contact',
      'Klein team van bèta-studenten dat samenwerkt en elkaar goed kent',
      'Gespecialiseerd in de Bèta vakken',
      'Vaak dezelfde docent voor langere tijd',
      'Even appen of bellen is genoeg, we reageren snel en persoonlijk',
      'Snel een passende docent beschikbaar',
    ],
  },
  them: {
    title: 'Reguliere aanbieders',
    body: 'Groot en landelijk georganiseerd, vaak op afstand.',
    points: [
      'Anoniem en op afstand',
      'Grote poule van docenten die vaak wisselen of elkaar niet kennen',
      'Breed georiënteerd dus minder gefocust',
      'Docenten wisselen regelmatig door grote schaal',
      'Contact vaak via formulieren of klantenservice',
      'Langdurig inschrijfproces of wachttijd',
    ],
  },
} as const

/** The two alternating text/photo blocks on Over ons. */
export const overOnsBlocks = [
  {
    title: 'Persoonlijk contact',
    body: 'We kennen onze leerlingen, hun ouders én onze docenten persoonlijk. Dat maakt ons flexibel en zorgt dat we snel kunnen schakelen als dat nodig is. We denken actief mee en creëren een fijne sfeer, omdat je alleen goed leert als je je op je gemak voelt. Onze passie voor bèta-vakken proberen we in elke les over te brengen.',
    image: '/img/persoonlijk.png',
    alt: 'Onze docent',
    cta: { label: 'Ons verhaal', to: '/#verhaal' },
  },
  {
    title: 'Vlot en efficiënt',
    body: 'We zijn klein, flexibel en reageren vlot. Geen ingewikkelde structuren of trage communicatie, maar bijles wanneer jij die nodig hebt. Contact gaat snel en makkelijk: via mail, telefoon of gewoon via WhatsApp. En omdat we efficiënt werken, blijven de kosten laag.',
    image: '/img/studenten.png',
    alt: 'Leerlingen aan het werk',
    cta: { label: 'Meld je aan', to: '/aanmelden' },
  },
] as const

export const pricingIntro = {
  kicker: 'Tarieven en pakketten',
  title: 'Eerlijk geprijsd',
  body: 'Met pakketten stimuleren we consistente bijles waardoor jij het vak echt leert begrijpen. Het uurtarief is afhankelijk van het gekozen pakket.',
} as const

/** How the pricing packages work — the list beside the photo on Tarieven. */
export const pricingNotes = [
  'Je kan altijd meer bijles afnemen dan in het pakket zit, je betaalt zelfde uurtarief.',
  'De pakketten zijn elke maand eenvoudig aan te passen of op te zeggen.',
  'Niet gebruikte uren neem je kosteloos één extra maand mee.',
  'We rekenen geen inschrijf- of bemiddelingskosten.',
  'Iedere maand sturen we een factuur.',
] as const

export const pricingAssurances = [
  'Wis-, natuur- en scheikunde',
  'Kwalitatieve bijles',
  'Efficiënt en doelgericht',
] as const

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
  /** The pill above the plan name. */
  hoursLabel: string
  price: number
  regularPrice: number
  savingsLabel: string | null
  blurb: string
  /** Highlighted with an amber border and a soft glow. */
  featured: boolean
  /** Rendered as ink-on-white inverted — the design gives this to the flexible plan. */
  inverted: boolean
  features: string[]
}

export const pricingPlans: PricingPlan[] = [
  {
    slug: 'uitgebreid',
    name: 'Uitgebreid',
    hoursLabel: 'Vanaf 12 uur / maand',
    price: 25,
    regularPrice: 33,
    savingsLabel: '-€8 euro korting',
    blurb: 'Krijg de bèta vakken weer volledig onder controle!',
    featured: false,
    inverted: false,
    features: [
      'Wis-, natuur- en scheikunde',
      'Geen servicekosten',
      'Gratis proefles',
      'Extra uren voor €25/uur',
    ],
  },
  {
    slug: 'standaard',
    name: 'Standaard',
    hoursLabel: 'Vanaf 8 uur / maand',
    price: 27,
    regularPrice: 33,
    savingsLabel: '-€6 euro korting',
    blurb: 'Structurele bijles voor beter begrip en een stevige basis in het vak.',
    featured: true,
    inverted: false,
    features: [
      'Wis-, natuur- en scheikunde',
      'Geen servicekosten',
      'Gratis proefles',
      'Extra uren voor €27/uur',
    ],
  },
  {
    slug: 'basis',
    name: 'Basis',
    hoursLabel: 'Vanaf 4 uur / maand',
    price: 30,
    regularPrice: 33,
    savingsLabel: '-€3 euro korting',
    blurb: 'Krijg een steuntje in de rug voor jouw volgende toets.',
    featured: false,
    inverted: false,
    features: [
      'Wis-, natuur- en scheikunde',
      'Geen servicekosten',
      'Gratis proefles',
      'Extra uren voor €30/uur',
    ],
  },
  {
    slug: 'losse-lessen',
    name: 'Losse lessen',
    hoursLabel: 'Flexibel',
    price: 33,
    regularPrice: 33,
    savingsLabel: null,
    blurb: 'Flexibele bijles op maat, wanneer jij extra hulp nodig hebt.',
    featured: false,
    inverted: true,
    features: ['Wis-, natuur- en scheikunde', 'Geen servicekosten', 'Gratis proefles'],
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
