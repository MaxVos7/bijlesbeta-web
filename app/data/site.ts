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
  /** Sollicitaties go to a separate mailbox — shown beside the form on Werken bij. */
  applicationsEmail: 'info@bijlesbeta.nl',
  applicationsEmailHref: 'mailto:info@bijlesbeta.nl',
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

/**
 * Zo werkt het — the route from aanmelding to the first bijles.
 *
 * `icon` names a path drawn inline in the page, as on `features`: the four
 * step illustrations from the design aren't in the repo, so these are line
 * icons in the brand amber. Swap them for the real drawings when they land.
 */
export const zoWerktHet = {
  title: 'Zo werkt het',
  intro:
    'Krijg snel de juiste match met een professionele bijles docent. Leer elkaar kennen tijdens de proefles en maak een plan voor de bijlessen.',
  /** Scrolls to the stappenplan below rather than leaving the page. */
  secondaryCta: 'Kennismaking',
  stepsIntro: {
    kicker: 'Zo werkt het',
    title: 'Het stappenplan',
  },
  steps: [
    {
      icon: 'form',
      title: 'Stap 1: Aanmelden',
      body: 'Meld je aan via ons handige aanmeldformulier.',
    },
    {
      icon: 'match',
      title: 'Stap 2: Match',
      body: 'We gaan direct op zoek naar een docent die goed bij jou past.',
    },
    {
      icon: 'trial',
      title: 'Stap 3: Proefles',
      body: 'Leer elkaar kennen en maak een plan voor de komende bijlessen.',
    },
    {
      icon: 'lesson',
      title: 'Stap 4: Bijles',
      body: 'Met jouw bijlesdocent krijg je stap voor stap grip op die lastige bètavakken.',
    },
  ],
  stepsLink: { label: 'Meld je hier aan', to: '/aanmelden' },
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

/**
 * Het bedrijf — the company story page, recreated from a Claude Design
 * handoff based on screenshots of the legacy site. Lives at `/het-bedrijf`,
 * separate from `/over-ons`, which keeps its own tutor roster and comparison
 * table.
 */
export const hetBedrijf = {
  hero: {
    title: 'Bèta Bijles in Groningen sinds 2017',
    body: 'Bijles Bèta is niet zomaar een bijles bedrijf. Wij zijn een groep van gepassioneerd bèta studenten in Groningen die onze passie voor het vak willen overbrengen aan anderen. Ontstaan met een duidelijke visie. Ontdek onze geschiedenis en onze kernwaarden.',
    image: '/img/het-bedrijf-hero.png',
    imageAlt: 'Twee leerlingen werken samen aan wiskunde',
  },
  verhaal: {
    title: 'Ons verhaal',
    body: 'Bijles kan hét hulpmiddel zijn om een leerling weer mee te laten komen op school. In 2017 zagen Mathijn en Max, beiden met een passie voor de exacte vakken, dit als een unieke kans. Vanuit Groningen richtten zij Bijles Bèta op met een duidelijke visie: wij laten leerlingen zien hoe je bèta vakken aanpakt en wanneer je dat eenmaal ziet, wordt een bèta vak ontzettend leuk!',
    image: '/img/het-bedrijf-verhaal.png',
    imageAlt: 'Twee docenten van Bijles Bèta met een kruiwagen',
  },
  aanpak: {
    title: 'Onze aanpak',
    body: [
      'Voor ons is bijles een hulpmiddel om de leerling zo snel mogelijk weer mee te laten komen op school. We bieden handvatten waarmee leerlingen zelf de lessen beter kunnen volgen en de lol van het vak ontdekken. Onze prioriteit: een leerling leert zelf hoe je vraagstukken in een bèta vak aanpakt. Wij geven onze bijles vanuit passie voor de exacte vakken.',
      'Wij geven bijles wiskunde, natuurkunde en scheikunde vanuit een passie voor de exacte vakken op vmbo, havo en vwo niveau.',
    ],
    image: '/img/het-bedrijf-docent.png',
    imageAlt: 'Docent van Bijles Bèta',
  },
  team: {
    title: 'Het team',
    body: 'Bijles Bèta wordt vanaf het begin volledig georganiseerd door studenten van de rijksuniversiteit Groningen. Hierdoor is een hecht team ontstaan die veel contact met elkaar hebben en van elkaar leren.',
    /** Split around the bold "buddy systeem" mid-sentence, same pattern as `statsIntro`. */
    buddyBefore: 'Dit wordt versterkt door ons unieke ',
    buddyBold: 'buddy systeem',
    buddyAfter:
      '. Beginnende docenten worden gekoppeld aan ervaren docenten, tijdens ieder bijles traject is er geregeld contact tussen beide docenten. Hierdoor krijgt een beginnend docent de kennis en het zelfvertrouwen om een kwalitatieve bijles te verzorgen.',
    image: '/img/het-bedrijf-team.jpg',
    imageAlt: 'Het team van Bijles Bèta tijdens een teamavond',
  },
  innovaties: {
    kicker: 'Innovaties',
    title: 'Zo blijft onze Bijles efficient en effectief',
    intro: [
      'Binnen Bijles Bèta zijn we vanaf onze oprichting gefocust op innovatie. Wij proberen onze organisatie altijd zo efficiënt mogelijk te laten werken. Hierdoor kunnen we onze tarieven laag houden.',
      'Daarnaast zijn we altijd bezig om onze dienst te verbeteren. Bijles lijkt misschien een simpel product, maar door innovaties proberen wij meer te bieden dan onze concurrenten.',
    ],
    items: [
      {
        title: 'Ons eigen administratie portaal',
        body: [
          'Bijles Bèta heeft in de loop van de jaren een eigen administratie portaal ontwikkeld. In dit portaal geeft docenten, leerlingen en administratoren makkelijk toegang tot alle benodigde informatie. Lessen registratie, persoonsregistratie, facturatie en uitbetalingen gebeuren volledig automatisch.',
          'Het systeem werkt zelfs zo goed dat het ondertussen ook door andere bijles bedrijven wordt gebruikt onder de naam StaatGenoteerd.',
        ],
      },
      {
        title: 'Bètatheek',
        body: [
          'Bijles Bèta focust de goede uitleg van de stof. Sinds kort zijn we bezig met het ontwikkelen van onze eigen kennisbank genaamd Bètatheek. De bètatheek is een collectie van artikelen die elk een specifiek vraagstuk uitgebreid uitlegt. De bètatheek dient als oefenmateriaal voor onze eigen leerlingen en voor alle andere bezoekers van onze website. Ook dient het als database voor onze docenten om oefenvragen uit te halen die ze kunnen gebruiken tijdens een bijles.',
          'De bètatheek is nog in ontwikkeling en komt binnenkort beschikbaar! Blijf op de hoogte via een van onze sociale media kanalen.',
        ],
      },
      {
        title: 'Unieke examentraining',
        body: [
          'Het centraal examen is misschien wel de belangrijkste toets tijdens de middelbare school. Bijles Bèta biedt hiervoor een unieke ondersteuning: Bijles Bèta examentraining.',
          'Onze examentraining is een intensieve persoonlijke begeleiding in de periode tussen de laatste tentamenweek en het centraal examen. Aan de hand van een speciaal ontwikkelde planning en toegang tot een uitgebreide collectie van uitwerkingen van examenvragen bereiden we onze leerlingen optimaal voor op de centrale examens.',
          'Lees hier meer over onze examentraining.',
        ],
      },
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

/**
 * Werken bij — the recruitment page.
 *
 * The hero opens on the dark ink band rather than the usual cream one, which is
 * why the page sets `headerGround: 'ink'` in its page meta.
 */
export const werkenBij = {
  hero: {
    title: 'Werken bij',
    intro:
      'Heb jij passie voor de bèta vakken en vind je het leuk om dit te delen met middelbare scholieren? Solliciteer dan direct!',
    /*
      Only this one line is confirmed: the cookie banner covered the rest of the
      checklist in every screenshot the design handoff was built from. Add the
      remaining lines here and the hero picks them up.
    */
    promises: ['Hecht team van Bèta docenten'],
    cta: 'Direct solliciteren',
    reassurance: 'We nemen zo snel mogelijk contact op.',
    image: '/img/werken-bij-hero.png',
    imageAlt: 'Docent legt natuurkunde uit aan een leerling voor het schoolbord',
  },
  perksIntro: {
    kicker: 'Plezier, Passie en Kwaliteit',
    title: 'Voor bijles bèta werken',
  },
  perks: [
    {
      title: 'Compensatie',
      body: 'Wij bieden jou een goede compensatie van €16/uur.',
    },
    {
      title: 'Geen tussenpersoon',
      body: 'Wij ondersteunen waar nodig, maar zitten je niet in de weg.',
    },
    {
      title: 'Flexibel',
      body: 'Plan samen met je leerling de bijles in, wanneer het jullie uitkomt.',
    },
    {
      title: 'Eigen manier',
      body: 'Geef bijles op je eigen manier, als de leerling er maar blij van wordt.',
    },
  ],
  perksLink: { label: 'Lees meer over onze docenten', to: '/over-ons#team' },
  requirementsIntro: {
    kicker: 'Benodigdheden',
    title: 'Wat vragen wij van jou',
  },
  /** Only the first card carries a photo; the others start lower to line up with it. */
  requirements: [
    {
      title: 'Science & Engineering',
      body: 'Bijles Bèta wordt volledig gerund vanuit de faculteit Science & Engineering aan de Rijksuniversiteit in Groningen. Wij willen dit graag houden en zoeken naar docenten die hier een opleiding volgen.',
      image: '/img/werken-bij-science.jpg',
      alt: 'Student van de faculteit Science & Engineering in het lab',
    },
    {
      title: 'Goed in Bèta',
      body: 'Je bent goed in bèta. Bij voorkeur heb je op vwo een mooi cijfer gehaald voor het vak waarin jij bijles wil geven. Dit hoeft alleen dus niet per se, en ook niet in elk vak te zijn.',
      image: null,
      alt: null,
    },
    {
      title: 'Plezier en passie',
      body: 'Je vindt ziet het als een uitdaging om middelbare scholieren, die bèta misschien niet zo leuk vinden, te laten inzien dat bèta wèl heel leuk kan zijn. Hiervoor moet je een passie hebben voor het vak!',
      image: null,
      alt: null,
    },
  ],
  apply: {
    kicker: 'Solliciteren',
    title: 'Vul je gegevens in',
    body: 'We leren je graag kennen! Vul je gegevens in en we nemen contact op voor het inplannen van een sollicitatiegesprek.',
    formKicker: 'Wij zoeken docenten',
    formTitle: 'Solliciteren',
  },
  /** Checkbox options in the application form, in the order the live form lists them. */
  subjectOptions: [
    'Wiskunde A/C',
    'Wiskunde B/D',
    'Wiskunde',
    'Natuurkunde',
    'Scheikunde',
    'NaSk',
  ],
} as const

/**
 * The Examentraining page — a one-day exam bootcamp, distinct from the
 * ongoing weekly bijles. From the Claude Design handoff `Examentraining.dc.html`.
 */
export const examentraining = {
  hero: {
    /** Overrides RatingLine's default label; stars/count stay the sitewide ones. */
    ratingLabel: '7 jaar ervaring',
    title: 'Examentraining',
    intro:
      'Wij bieden een examentraining die jou op het juiste moment het duwtje geeft in de richting van een geslaagd eindexamen.',
    promises: [
      'Veel persoonlijke aandacht',
      'Door universitair geschoolde docenten',
      'Kleine klas van maximaal 8 leerlingen',
    ],
    cta: 'Meld je direct aan',
    image: '/img/examentraining-hero.jpg',
    imageAlt: 'Docent voor het bord tijdens de examentraining',
  },
  /**
   * The four reasons the training works. Icons are left as placeholders —
   * no artwork was supplied for these in the design handoff.
   */
  features: {
    kicker: 'Examentraining van ervaren bijlesdocenten',
    title: 'Wat maakte onze examentraining effectief',
    items: [
      {
        title: 'Ervaren docenten',
        body: 'Onze docenten volgen een bèta-studie aan de universiteit en geven al jaren lang wekelijks bijles.',
      },
      {
        title: 'Kleine groepen',
        body: 'Bij onze examen training heb je kleine groepen (<10 leerling) en meerdere docenten voor maximale persoonlijk aandacht.',
      },
      {
        title: 'Goeie timing',
        body: 'Onze examentraining vindt plaats ongeveer 2 weken voor je examen. Precies het juiste moment.',
      },
      {
        title: 'Een scherpe prijs',
        body: 'De meest voordelige van Groningen met veel persoonlijke aandacht.',
      },
    ],
  },
  details: {
    kicker: 'Wat kost dat?!',
    title: 'Details',
    intro:
      'De Bijles Bèta examentraining duurt één dag. In de ochtend herhalen we de belangrijkste onderdelen. In de middag maken we samen een oefenexamen.',
    planningLabel: 'Planning:',
    planning: [
      { time: '9:00 – 12:00', label: 'Examenstof herhalen' },
      { time: '12:00 – 13:00', label: 'Pauze (neem je eigen brood mee)' },
      { time: '13:00 – 16:00', label: 'Samen het eindexamen 2024 maken' },
      { time: '16:00 – 17:00', label: 'Vragenuurtje' },
    ],
    datesLabel: 'Datums:',
    datesBody: 'Zie hieronder de datums per vak en niveau.',
    locationLabel: 'Locatie:',
    locationLines: ['Noorderhaven 46, 9712 VL Groningen', 'Ruime en rustige vergaderzaal van Rapide Software'],
    specialNoticeBefore: 'Let op, de volgende trainingen:',
    specialTrainings: ['vwo wiskunde A', 'vwo wiskunde B'],
    specialNoticeAfter: 'zijn op een andere locatie:',
    specialLocation: 'Henri Dunantlaan 2, 9728 HD Groningen',
  },
  /** The single "all-in-one" package card beside the details column. */
  pricing: {
    badge: 'Alles in één',
    title: 'Examentraining',
    blurb: 'ééndaagse examentraining waarbij we je volledig klaarstomen voor je examens.',
    price: 119,
    features: [
      'Veel persoonlijke aandacht',
      'Universitair geschoolde en ervaren docenten',
      'Kleine klas van maximaal 8 leerlingen',
    ],
    cta: 'Meld je aan',
  },
  video: {
    title: 'We stellen ons graag aan je voor!',
    body: [
      'Om je een idee te geven van onze examentraining hebben we een korte promotievideo opgenomen.',
      'Bekijk onze video!',
    ],
    cta: 'Meld je aan',
    caption: 'Klik hierboven om de video te starten',
    startLabel: 'Video starten',
  },
  levelsNotice: {
    kicker: 'Ga direct naar de juiste pagina',
    title: 'Welk niveau doe je?',
    noticeLead: 'Let op:',
    notice: 'de examentraining voor 2026 zijn afgerond.',
    body: 'Wil je nog ondersteuning voor je (her)examens. Vul dan onderstaand contact formulier in of meld je aan voor bijles.',
  },
  signup: {
    kicker: 'Meld je direct aan',
    title: 'Vul je gegevens in',
    noticeLead: 'Let op:',
    notice: 'Onze examentrainingen voor 2026 zijn inmiddels afgerond.',
    body: 'Wil je begeleiding voor je (her)examens. Vul dat het contactformulier hiernaast in of meld je aan voor onze bijles.',
  },
  /** This page's own FAQ set — separate from the sitewide `faqs`. */
  faqs: [
    {
      question: 'Wat doen we tijdens de examentraining?',
      answer:
        'In de ochtend leggen we de belangrijkste onderdelen van de examenstof nog een keer uit. Na de lunch maken we gezamenlijk het eindexamen van vorig jaar.',
    },
    {
      question: 'Wanneer is de examen training?',
      answer:
        'Onze examentraining vindt plaats ongeveer twee weken voor je examen. De datums per vak en niveau staan hierboven bij de details.',
    },
    {
      question: 'Kan ik ook bijles krijgen in combinatie met de examentraining?',
      answer:
        'Dat kan zeker. Veel leerlingen combineren de examentraining met wekelijkse bijles in de weken ervoor. Neem contact op en we kijken samen wat je nodig hebt.',
    },
  ],
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
