/**
 * Copy for `/mijn/`, the logged-in part of the site, for tutors and customers.
 */

export const mijnLogin = {
  title: 'Inloggen',
  kicker: 'Mijn Bijles Bèta',
  intro: 'Log in met het e-mailadres en wachtwoord van je Bijles Bèta-account.',
  email: 'E-mailadres',
  password: 'Wachtwoord',
  submit: 'Inloggen',
  pending: 'Bezig met inloggen…',
  forgotPassword: 'Wachtwoord vergeten?',
  magicLink: 'Mail me een inloglink',
  expired: 'Die link is verlopen. Log in om door te gaan.',
  failed: 'Inloggen lukte niet. Probeer het opnieuw.',
  throttled: 'Te veel pogingen. Wacht een minuut en probeer het opnieuw.',
}

export const mijnNav = {
  overview: 'Overzicht',
  lessons: 'Lessen',
  children: 'Leerlingen',
  package: 'Pakket',
  invoices: 'Facturen',
  profile: 'Profiel',
  logout: 'Uitloggen',
}

export const mijnLessons = {
  title: 'Lessen',
  kicker: 'Mijn Bijles Bèta',
  count: (n: number) => `${n} ${n === 1 ? 'les' : 'lessen'}`,
  searchLabel: 'Zoek op leerling',
  searchPlaceholder: 'Naam van de leerling',
  empty: 'Nog geen lessen.',
  emptySearch: 'Geen lessen gevonden.',
  loading: 'Lessen laden…',
  more: 'Meer lessen laden',
  trial: 'Proefles',
  travel: 'Reiskosten',
  provider: 'Docent',
  record: 'Verslag',
}

export const mijnOverview = {
  title: 'Overzicht',
  greeting: (name: string) => `Hoi ${name.split(' ')[0]}!`,
  loading: 'Overzicht laden…',

  /** Shown to an account without a password, i.e. one made by the aanmelding. */
  passwordTitle: 'Wil je makkelijk terug in dit account?',
  passwordBody: 'Maak een wachtwoord aan, dan kun je later altijd zelf weer inloggen.',
  passwordCta: 'Wachtwoord aanmaken',

  /** Shown until a tutor is connected to one of the children. */
  welcomeTitle: 'Welkom bij Bijles Bèta!',
  welcomeBody:
    'Fijn dat je er bent. Je aanmelding is binnen en je account staat klaar. Zodra we een docent aan je hebben gekoppeld, vind je hier je lessen, je pakket en de berichten van de docent.',
  welcomeSteps: [
    {
      title: '1. We zoeken een docent bij je',
      body: 'We kijken welke docent het beste past bij het vak, het niveau en de momenten die je hebt opgegeven. Je hoeft hier niets voor te doen.',
    },
    {
      title: '2. De docent neemt contact op',
      body: 'Zodra er een match is, neemt de docent contact met je op om de gratis proefles in te plannen.',
    },
    {
      title: '3. Proefles en daarna bijles',
      body: 'Tijdens de proefles maken jullie kennis en maken jullie een plan. Daarna kies je een pakket en start de bijles.',
    },
  ],
  welcomeContact: 'Vragen of wil je iets aanpassen aan je aanmelding? App of mail ons gerust, dan helpen we je meteen.',

  packageTitle: 'Je pakket',
  packageNone: 'Je hebt nog geen pakket.',
  packageStart: 'Pakket kiezen',
  packageManage: 'Pakket wijzigen',
  packageMonth: (month: string) => `Uren in ${month}`,
  packageNewKicker: 'Pakket',
  packageNewSuggest: (name: string | null) => `${name ?? 'Je begeleider'} stelt een pakket voor`,
  packageNewOpen: 'Bekijk mijn pakket',
  packageNewStart: 'Kies een pakket',
  packageNewNone: 'Je hebt nog geen pakket.',
  packageNewUsed: (used: string) => `${used} gebruikt`,
  hoursUsed: 'Gebruikt',
  hoursRemaining: 'Nog over',
  hoursExtra: 'Extra uren',
  perMonth: (hours: number) => `${hours} uur per maand`,
  pendingTitle: (name: string) => `${name} stelt een pakket voor`,
  pendingCta: 'Bekijken en bevestigen',
  futureTitle: (name: string, date: string) => `${name} start op ${date}`,

  stripTitle: 'Strippenkaart',
  stripRemaining: (time: string) => `Nog ${time} over`,

  scheduleTitle: 'Plan je lessen in',
  scheduleBody: (date: string) => `Je bent uitgenodigd om een vast lesmoment te kiezen. De uitnodiging is geldig tot ${date}.`,
  scheduleCta: 'Lesmoment kiezen',

  lessonsTitle: 'Laatste lessen',
  lessonsAll: 'Alle lessen',
  lessonsEmpty: 'Nog geen lessen.',

  recordsTitle: 'Berichten van de docent',
}

/** The package page. Where the portal already words something, this says it the same way. */
export const mijnPackage = {
  title: 'Pakket',
  kicker: 'Mijn Bijles Bèta',
  loading: 'Pakket laden…',

  // No package yet
  chooseTitle: 'Kies een pakket',
  searching: 'We zijn op zoek naar een passende bijlesdocent. Zodra we die hebben gevonden, nemen we contact met je op.',
  noLessonsYet: 'Bespreek tijdens de proefles met je docent welk pakket bij je past.',
  sharedHours: 'Uren worden gedeeld tussen alle leerlingen onder dit account.',
  perMonth: (hours: number) => `${hours} uur per maand`,
  perHour: (price: string) => `${price}/uur`,
  monthly: (price: string) => `${price}/maand`,
  looseTitle: 'Losse lessen',
  looseSubtitle: 'Geen abonnement',
  loosePerLesson: 'betaal per les',

  startTitle: 'Startdatum',
  startToday: 'Start vandaag',
  startNextMonth: (date: string) => `Start per ${date}`,
  firstMonthTitle: (month: string) => `Eerste maand (${month})`,
  firstMonthBody: (amount: string, hours: string, weeks: number) =>
    `Omdat je vandaag start, betaal je voor deze maand ${amount} voor ${hours} uur (${weeks} van 4 weken).`,

  termsTitle: 'Voorwaarden',
  terms: ['Ongebruikte uren zijn 1 maand geldig', 'Bij ziekte is een uitzondering te maken'],
  agreeBefore: 'Ik ga akkoord met de',
  agreeLink: 'algemene voorwaarden',
  agreeFallback: 'regels',
  agreeRequired: 'Ga akkoord met de voorwaarden om verder te gaan.',

  submitStart: 'Pakket starten',
  submitLoose: 'Losse lessen kiezen',

  // A tutor's suggestion
  pendingTitle: (name: string | null) => `${name ?? 'Je begeleider'} heeft dit pakket voor je voorgesteld`,
  submitConfirm: 'Pakket bevestigen',
  reject: 'Afwijzen',
  rejectConfirm: 'Weet je zeker dat je dit pakket wilt afwijzen?',

  // The running package
  activeTitle: 'Je pakket',
  cancelledUntil: (date: string) => `Opgezegd, loopt tot en met ${date}`,
  endsAfter: (description: string) => `Eindigt na ${description}`,
  cancel: 'Opzeggen',
  changeEnd: 'Einddatum wijzigen',
  change: 'Pakket wijzigen',
  cancelTitle: 'Pakket opzeggen',
  cancelBody: (description: string) => `Weet je zeker dat je het pakket wilt opzeggen? Het pakket eindigt na ${description}.`,
  cancelSubmit: 'Ja, opzeggen',
  changeTitle: 'Pakket wijzigen',
  changeLabel: 'Nieuw pakket',
  changePlaceholder: 'Kies een pakket',
  changeBody: (end: string, start: string) => `Je huidige pakket eindigt na ${end}. Het nieuwe pakket start op ${start}.`,
  changeSubmit: 'Opslaan',
  back: 'Annuleren',

  futureTitle: (name: string, date: string) => `${name} start op ${date}`,
}

/** Choosing a weekly lesson slot after an invitation. Worded as the portal words it. */
export const mijnSchedule = {
  title: 'Kies een tijdslot voor je bijles',
  loading: 'Rooster laden…',
  none: 'Je hebt op dit moment geen uitnodiging om een tijdslot te kiezen.',

  howTitle: 'Zo werkt het',
  howIntro: 'In vier eenvoudige stappen kies je een tijdslot voor je bijles.',
  steps: [
    { title: 'Kies een tijdslot', body: 'Bekijk de beschikbare tijden en kies een tijdslot van 1 uur dat jou uitkomt.' },
    { title: 'Word gekoppeld aan een docent', body: 'We sturen je verzoek naar de docent en zorgen voor de koppeling.' },
    { title: 'Plan een gratis proefles', body: 'Je ontvangt informatie over de exacte datum. Aan de proefles zijn geen kosten verbonden.' },
    { title: 'Ga verder met de bijles', body: 'Was het een goede match? Dan zet je de bijles in dit tijdslot voort.' },
  ],
  keepSearching: 'Vind je geen geschikt tijdslot? Geen zorgen — we blijven voor je zoeken naar andere geschikte docenten. Dit kan even duren.',
  validUntil: (date: string) => `Je uitnodiging is geldig tot ${date}.`,
  noChildren: 'Je hebt nog geen leerlingen aan je account gekoppeld. Neem contact met ons op om dit in orde te maken.',
  forWhom: 'Voor wie is deze bijles?',
  next: 'Verder',

  back: 'Terug',
  forChild: (name: string) => `Voor: ${name}`,
  pickTitle: 'Hoe kies je een tijdslot?',
  pickBody: 'Bekijk per dag welke docenten beschikbaar zijn en klik op een vrij uur om het aan te vragen. Wil je eerst meer weten over een docent? Klik dan op Details.',
  blocksCount: (n: number) => `${n} ${n === 1 ? 'blok' : 'blokken'}`,
  noBlocks: 'Geen blokken',
  noHours: 'Geen vrije uren in dit blok',
  details: 'Details',
  hideDetails: 'Minder',
  aboutTutor: 'Over de docent',
  location: 'Locatie',
  maps: 'Open in Google Maps',
  website: 'Website',

  noMatchTitle: 'Geen geschikt tijdslot gevonden?',
  noMatchBody: 'Geen probleem — laat het ons weten en we gaan voor je op zoek naar andere geschikte docenten of momenten. Dit kan even duren.',
  noMatchCta: 'Geen geschikt tijdslot voor mij',

  bookedTitle: 'Verzoek verzonden!',
  bookedBody: 'We hebben je verzoek doorgestuurd. Je ontvangt binnenkort meer informatie van ons over de exacte datum van de proefles.',
  usedBookedTitle: 'Je hebt je tijdslot al gekozen',
  searchingTitle: 'We gaan voor je op zoek',
  searchingBody: 'Bedankt voor je bericht. We gaan op zoek naar andere geschikte docenten of momenten en nemen contact met je op zodra we een match hebben gevonden.',
  toOverview: 'Naar je overzicht',
}

export const mijnChildren = {
  title: 'Leerlingen',
  kicker: 'Mijn Bijles Bèta',
  loading: 'Leerlingen laden…',
  empty: 'Er staan nog geen leerlingen op je account.',
  tutors: 'Docent',
  noTutor: 'Nog geen docent gekoppeld',
  tutorsTitle: 'Docent',
  tutorsTitlePlural: 'Docenten',
  inactive: 'Gestopt',
  back: 'Alle leerlingen',
  lessonsTitle: 'Lessen',
  lessonsEmpty: 'Nog geen lessen.',
  recordsTitle: 'Berichten van de docent',
  notFound: 'Deze leerling bestaat niet of hoort niet bij je account.',
}

export const mijnInvoices = {
  title: 'Facturen',
  kicker: 'Mijn Bijles Bèta',
  loading: 'Facturen laden…',
  empty: 'Je hebt nog geen facturen.',
  number: 'Factuur',
  pay: 'Betalen',
  pdf: 'Bekijk pdf',
  status: {
    open: 'Openstaand',
    paid: 'Betaald',
    uncollectible: 'Vervallen',
    void: 'Vervallen',
  } as Record<string, string>,
}

export const mijnProfile = {
  title: 'Profiel',
  kicker: 'Mijn Bijles Bèta',
  loading: 'Profiel laden…',
  detailsTitle: 'Je gegevens',
  name: 'Naam',
  email: 'E-mailadres',
  phone: 'Telefoonnummer',
  address: 'Adres',
  addressComment: 'Opmerking bij het adres',
  children: 'Leerlingen',
  empty: '—',
  changeNote: 'Klopt er iets niet? Neem contact met ons op, dan passen we het aan.',
  contact: 'Contact opnemen',
  stripsTitle: 'Strippenkaart',
  stripsRemaining: (time: string) => `Nog ${time} over`,
  stripsMinutes: 'Uren',
  stripsEndsAt: 'Geldig tot',
  stripsNegative: 'in de min',
  passwordTitle: 'Wachtwoord',
  passwordCta: 'Wachtwoord wijzigen',
}

/**
 * Changing the password. `forced` is the first change of an account that still
 * has the temporary password from its invitation: the current one isn't asked
 * for, and nothing else on `/mijn/` opens until it's done.
 */
export const mijnPassword = {
  title: 'Wachtwoord wijzigen',
  firstTitle: 'Maak een wachtwoord aan',
  firstIntro: 'Met een wachtwoord log je later makkelijk weer in op je account, zonder dat we je een link hoeven te mailen.',
  forcedTitle: 'Kies een eigen wachtwoord',
  forcedIntro: 'Je account gebruikt nog een tijdelijk wachtwoord. Kies eerst een eigen wachtwoord om verder te gaan.',
  current: 'Huidig wachtwoord',
  new: 'Nieuw wachtwoord',
  confirm: 'Herhaal het nieuwe wachtwoord',
  hint: 'Minimaal 8 tekens.',
  submit: 'Wachtwoord opslaan',
  pending: 'Bezig met opslaan…',
  mismatch: 'De wachtwoorden zijn niet hetzelfde.',
  back: 'Terug naar je profiel',
}

/**
 * Packages with periods (the new system, shown as plain "Pakket" instead of the
 * old subscriptions). Worded as in the Pakketten design.
 */
export const mijnPackages = {
  title: 'Pakket',
  kicker: 'Mijn Bijles Bèta',
  loading: 'Pakket laden…',
  unavailable: 'Pakketten met vaste periodes zijn voor jou nog niet beschikbaar.',
  legacyNotice: 'Je hebt nog een pakket in het oude systeem. Rond dat eerst af voordat je een nieuw pakket kiest.',
  legacyLink: 'Naar je huidige pakket',
  back: '‹ Mijn pakket',
  explainLink: 'Zo werken pakketten',
  periodsLink: 'Periodes en afrekening',

  perPeriod: (hours: number) => `${hours} uur per periode`,
  planSub: (price: string, extra: string) => `${price} per periode · extra uren ${extra} per uur`,
  pill: {
    running: 'Loopt door',
    cancelled: 'Opgezegd',
    ended: 'Beëindigd',
    pending: 'Voorgesteld',
    startsIn: (days: number) => (days <= 0 ? 'Start vandaag' : `Start over ${days} ${days === 1 ? 'dag' : 'dagen'}`),
    pause: 'Pauze',
    paid: 'Betaald',
    open: 'Openstaand',
    invoiceComing: 'Factuur volgt',
    preparing: 'Factuur wordt klaargezet',
    uncollectible: 'Neem contact op',
  },

  // No package yet
  noneTitle: 'Kies een pakket',
  noneBody: 'Een vast aantal uren per vier lesweken, met een vaste prijs. Het loopt vanzelf door en je zegt op wanneer je wilt.',
  noneCta: 'Kies een pakket',
  noPlans: 'Er zijn nu geen pakketten beschikbaar.',

  // The running period
  currentKicker: 'Huidige periode',
  periodTitle: (position: number, range: string) => `Periode ${position}: ${range}`,
  lessonWeeks: (n: number) => `${n} ${n === 1 ? 'lesweek' : 'lesweken'}`,
  truncated: (n: number) => `Deze periode is korter (${n} van 4 lesweken), omdat de zomervakantie begint. Uren en prijs gaan naar rato.`,
  usedOf: (used: string, cap: string) => `${used} van ${cap} gebruikt`,
  usedExtra: (used: string, extra: string) => `${used} gevolgd, ${extra} extra`,
  capNoCredit: (hours: number) => `${hours} uur in je pakket`,
  capWithCredit: (hours: number, credit: string) => `${hours} uur pakket + ${credit} tegoed`,
  legendPackage: 'Uit je pakket',
  legendCredit: 'Uit je tegoed',
  legendExtra: 'Extra uren',
  statUsed: 'Gebruikt',
  statLeft: 'Nog over',
  statCredit: 'Tegoed',
  statFollowed: 'Gevolgd',
  statExtra: 'Extra uren',
  statOfPackage: (hours: number) => `van ${hours} uur pakket`,
  statInclCredit: 'incl. tegoed',
  statCreditMax: 'op het maximum',
  statCreditNext: 'gaat op na je pakket',
  statCreditUsedUp: 'volledig gebruikt',
  statAllUsed: 'pakket en tegoed zijn op',
  statExtraCost: (amount: string) => `${amount} op de volgende factuur`,
  extraNote: (extra: string, amount: string) =>
    `Naar verwachting heb je ${extra} extra (${amount}). Eerst gebruik je je pakket, dan je tegoed. Extra uren reken je af nadat de periode klaar is.`,
  creditMaxNote: (hours: number) =>
    `Je tegoed zit op het maximum van ${hours} uur. Uren uit je pakket die je deze periode niet volgt, vervallen. Volg je ze wel, dan gaat je tegoed pas daarna op.`,

  // Payment
  payOpenTitle: (amount: string, due: string | null) => (due ? `${amount}, uiterlijk ${due}` : amount),
  payOpenText: 'Je lessen lopen gewoon door. Betalen mag ook na de start van de periode.',
  payPaidTitle: (amount: string) => `${amount} voor deze periode`,
  payPaidText: 'Bedankt, we hebben je betaling ontvangen.',
  payPreparingText: 'Je ontvangt de factuur per e-mail.',
  payUncollectibleText: 'Er is iets misgegaan met deze factuur. Neem contact met ons op.',
  payNone: 'Factuur wordt klaargezet',
  pay: 'Betalen',

  // Not started yet / pause / ended
  futureTitle: (date: string) => `Start op ${date}`,
  futureNote: 'Factuur volgt bij de start van de periode. Je ontvangt hem per e-mail. Je mag al starten voordat je betaald hebt.',
  futureDays: 'dagen',
  pauseTitle: (date: string) => `Pauze tot ${date}`,
  pauseBody: (credit: string) => `Je pakket pauzeert in de zomervakantie. Je tegoed (${credit}) blijft staan.`,
  pauseSmall: 'Losse lessen in deze weken staan op je maandfactuur. Je tegoed gaat daar eerst vanaf.',
  endedTitle: (date: string | null) => (date ? `Je pakket is gestopt op ${date}` : 'Je pakket is gestopt'),
  endedCredit: 'Je tegoed blijft nog twee weken na het einde staan, ook voor losse lessen. Start je binnen die tijd weer met een pakket, dan blijft het staan. Daarna vervalt het.',
  restart: 'Weer starten',

  // Side column
  nextKicker: 'Volgende periode',
  nextTitle: (date: string) => `Start op ${date}`,
  nextText: (until: string) => `Deze periode loopt vanzelf door tot ${until}. De factuur krijg je aan het begin.`,
  laterKicker: 'Daarna',
  noNext: 'Geen volgende periode',
  noNextText: (date: string) => `Je lessen lopen tot en met ${date}.`,
  creditTitle: 'Hoe werkt je tegoed?',
  creditBody: (max: number) =>
    `Uren die je in een periode niet gebruikt blijven staan als tegoed, maximaal ${max} uur. Je volgt eerst de uren uit je pakket, daarna je tegoed. Pas daarna zijn het extra uren.`,

  // History
  historyTitle: 'Eerdere periodes',
  historyAll: 'Alles bekijken',
  cancelledBanner: (date: string) => `Je pakket stopt op ${date}.`,
  cancelledStatus: (date: string) => `Opgezegd, stopt op ${date}`,

  // Cancel
  cancelText: (date: string) => `Wil je stoppen? Opzeggen kan t/m ${date}, een week voor het einde van de periode.`,
  cancelTextPlain: 'Wil je stoppen? Opzeggen kan tot een week voor het einde van de periode.',
  cancelLink: 'Pakket opzeggen',
  cancelTitle: 'Pakket opzeggen',
  cancelBody: (date: string) => `Je pakket stopt op ${date}. Je maakt de lopende periode af.`,
  cancelLateTitle: 'Waarom niet eerder?',
  cancelLateBody: (periodEnd: string, extraStart: string, extraEnd: string, amount: string) =>
    `Je zegt minder dan een week voor het einde van de periode (${periodEnd}) op. Daarom start de volgende periode (${extraStart} t/m ${extraEnd}) nog wel. Die periode betaal je ook: ${amount}.`,
  cancelFacts: [
    'Je lopende periode loopt gewoon door. Je lessen blijven staan.',
    'Je tegoed blijft nog 14 dagen na het einde staan.',
    'Heb je extra uren gevolgd, dan sturen we kort na het einde een aparte afrekening.',
  ],
  cancelSubmit: 'Opzeggen',
  cancelBack: 'Toch niet',

  // A suggestion
  suggestKicker: 'Voorstel',
  suggestTitle: (name: string | null) => `${name ?? 'Je begeleider'} stelt een pakket voor`,
  suggestIntro: 'Dit pakket is voor je klaargezet. Het gaat pas in als jij bevestigt.',
  suggestRowsHours: 'Uren in je pakket',
  suggestRowsFirst: 'Eerste periode',
  suggestRowsThen: 'Daarna',
  suggestRowsExtra: 'Extra uur',
  suggestLate: (asked: string, actual: string) => `Je startweek (${asked}) is voorbij. Bevestig je nu, dan start je pakket in de huidige week: ${actual}.`,
  confirm: 'Pakket bevestigen',
  reject: 'Afwijzen',
  rejectConfirm: 'Weet je zeker dat je dit pakket wilt afwijzen?',
  rejectYes: 'Ja, afwijzen',
  confirmed: (date: string) => `Pakket bevestigd. Je start op ${date}.`,
  rejected: 'Voorstel afgewezen. Er verandert niets.',
  invoiceByMail: 'Je factuur komt per e-mail zodra de periode begint.',

  // Before the trial lesson: no package yet
  trial: {
    kicker: 'Eerst een proefles',
    title: 'Eerst kennismaken, dan een pakket',
    body: 'Een pakket kies je nadat je proefles heeft plaatsgevonden. Zo ontdek je eerst of de bijles en de docent bij je passen, zonder dat je ergens aan vastzit.',
    steps: [
      { title: 'Proefles', body: 'Je maakt kennis met je docent en vertelt waar je hulp bij nodig hebt.' },
      { title: 'Samen een plan', body: 'Jullie bespreken hoeveel uur bijles er nodig is om je doel te halen.' },
      { title: 'Pakket kiezen', body: 'Daarna kies je hier het pakket dat daarbij past. Dit scherm opent vanzelf.' },
    ],
    contactBefore: 'Nog geen proefles gepland?',
    contactLink: 'Neem contact met ons op',
    short: 'Een pakket kies je na je proefles. Zo kun je eerst rustig kennismaken.',
    shortLink: 'Hoe het werkt',
  },

  // Choosing
  chooseKicker: 'Pakket kiezen',
  chooseTitle: 'Kies je pakket en wanneer je start',
  chooseIntro: 'Je pakket loopt in periodes van vier lesweken en gaat vanzelf door, tot je opzegt. Je betaalt aan het begin van elke periode.',
  step1: '1. Kies je pakket',
  step2: '2. Kies je startweek',
  step3: '3. Controleer en bevestig',
  moreWeeks: 'Meer weken tonen',
  periodWeeks: {
    label: 'De weken van je eerste periode',
    week: (n: number) => `Wk ${n}`,
    lesson: (n: number) => `Les ${n}`,
    holiday: 'Vakantie',
    holidayNote: 'Vakantieweken tellen niet mee als lesweek: je periode loopt er een week langer door. Bijles volgen in de vakantie kan wel.',
  },
  weeksIntro: 'Je pakket loopt ook door in vakantieweken, en bijles volgen kan dan gewoon. Wil je juist in een vakantie van start? Dan helpen we je graag persoonlijk.',
  weeksContact: 'Neem contact met ons op',
  hoursUnit: 'uur per periode',
  aboutPerWeek: (hours: number) => `ongeveer ${hours} uur per week`,
  perPeriodShort: 'per periode',
  perHour: (price: string) => `${price} per uur`,
  extraHour: (price: string) => `Extra uur: ${price}`,
  chosen: 'Gekozen',
  choose: 'Kies dit pakket',
  weekLabel: (n: number) => `WEEK ${n}`,
  thisWeek: 'Deze week',
  firstPeriod: 'Je eerste periode',
  rowPlan: 'Pakket',
  rowHours: 'Uren in je pakket',
  rowPrice: 'Prijs eerste periode',
  rowExtra: 'Extra uur',
  rowThen: 'Daarna',
  rowThenValue: (date: string) => `nieuwe periode vanaf ${date}`,
  laterStart: (date: string) => `Deze week valt in de zomervakantie. Je pakket start in de eerste lesweek erna: ${date}.`,
  shortPeriod: (n: number) => `Deze eerste periode is korter (${n} van 4 lesweken) omdat de zomervakantie begint. Uren en prijs gaan naar rato. Je nieuwe periode begint in de eerste lesweek na de zomer.`,
  termsTitle: 'Dit mag je weten',
  terms: (extraPrice: string, hours: number) => [
    'Je pakket loopt vanzelf door tot je opzegt. Opzeggen kan tot een week voor het einde van de periode.',
    'Je mag al starten voordat de factuur betaald is.',
    `Een extra uur kost ${extraPrice}. Extra uren reken je af na de periode.`,
    `Uren die je overhoudt worden tegoed, maximaal ${hours} uur. Je tegoed blijft staan zolang je pakket loopt en nog twee weken daarna.`,
    'In de zomervakantie pauzeert je pakket.',
  ],
  agreeBefore: 'Ik ga akkoord met de',
  agreeLink: 'algemene voorwaarden',
  agreeFallback: 'regels',
  agreeRequired: 'Ga akkoord met de voorwaarden om verder te gaan.',
  start: 'Pakket starten',
  startFailed: 'Het starten lukt nog niet.',
  startedKicker: 'Pakket gestart',
  startedTitle: (date: string) => `Je pakket start ${date}`,
  startedTitleBegun: (date: string) => `Je pakket loopt sinds ${date}`,
  weekBegun: (date: string) => `Deze week is al begonnen (maandag ${date}). Je betaalt wel de volledige periode van vier lesweken. Liever vanaf volgende week? Kies die hierboven.`,
  startedBody: (plan: string, hours: number) =>
    `${plan}, ${hours} uur per periode. De factuur komt per e-mail zodra de periode begint. Je mag al starten voordat je betaald hebt.`,
  toPackage: 'Naar mijn pakket',

  // Periods and settlement
  periodsTitle: 'Periodes en afrekening',
  periodsIntro: 'Hier zie je per periode wat je hebt gevolgd en waarom een factuur zo hoog is.',
  periodsCorrection: 'Wordt een les ingevoerd nadat de periode is afgerekend, dan verrekenen we het verschil op je volgende factuur: extra uren erbij, of tegoed eraf.',
  periodsPending: (date: string) => `Deze periode wordt afgerekend op ${date}. Daarna zie je hier hoeveel uur je hebt gevolgd en of er extra uren zijn.`,
  periodsEmpty: 'Er zijn nog geen periodes.',
  periodsSub: (weeks: string, state: string) => `${weeks} · ${state}`,
  stateRunning: 'loopt nu',
  stateScheduled: 'nog niet gestart',
  stateEnded: 'afgelopen',
  stateSettled: 'afgerekend',
  lineHours: 'Pakket',
  lineUsed: 'Gevolgd',
  lineFromCredit: 'Uit tegoed gehaald',
  lineExtra: 'Extra uren',
  lineNoExtra: 'geen',
  lineCreditAdded: 'Tegoed erbij',
  lineCapped: 'Vervallen boven het maximum',
  lineInvoice: 'Factuur',
  lineSettlementInvoice: 'Afrekening',
  hoursFraction: (hours: number) => `${hours} uur`,
  ceilingNotice: (max: number) =>
    `Je tegoed zit op het maximum van ${max} uur. Uren die je daarboven overhoudt, vervallen. Volg je meer uren dan je pakket, dan gebruik je eerst je tegoed.`,

  // Explanation page
  explain: {
    kicker: 'Pakketten',
    title: 'Zo werken onze pakketten',
    intro: 'Een pakket loopt vier lesweken. Jij kiest in welke week je start, we sturen aan het begin de factuur en vakanties tellen niet mee. De zomervakantie is een pauze.',
    yours: (plan: string, hours: number, price: string, extra: string) =>
      `Jouw pakket: ${plan}, ${hours} uur per periode, ${price} per periode. Een extra uur kost ${extra}.`,
    stepsTitle: 'Een pakket in vier stappen',
    steps: [
      { t: 'Kies je startweek', p: 'Je start deze week, of in een week die jou uitkomt. Je hoeft niet te wachten tot de eerste van de maand.' },
      { t: 'Je krijgt de factuur', p: 'Aan het begin van je pakket sturen we de factuur voor de hele periode. Je kunt al beginnen met bijles voordat je betaald hebt.' },
      { t: 'Vier lesweken bijles', p: 'Je pakket loopt vier lesweken. Zit er een vakantieweek tussen, dan loopt je pakket een week langer door.' },
      { t: 'Daarna loopt het door', p: 'Na vier lesweken begint vanzelf je volgende periode, met een nieuwe factuur. Wil je stoppen, laat het ons dan uiterlijk een week voor het einde van je periode weten.' },
    ],
    holidayTitle: 'Vakantieweken tellen niet mee',
    holidayBody: 'We rekenen in lesweken. In een schoolvakantie vallen er geen lessen, en die week gaat dus ook niet van je pakket af. Je krijgt altijd vier volle lesweken.',
    weekRows: [
      { label: 'Zonder vakantie', cap: '', cells: [['Lesweek 1', '', 'les'], ['Lesweek 2', '', 'les'], ['Lesweek 3', '', 'les'], ['Lesweek 4', '', 'les']] },
      { label: 'Met een vakantieweek', cap: 'Voorbeeld. Welke weken vakantie zijn, staat bij ons vast. Je ziet de einddatum van je pakket terug in je factuur.', cells: [['Lesweek 1', '', 'les'], ['Lesweek 2', '', 'les'], ['Vakantie', 'telt niet mee', 'off'], ['Lesweek 3', '', 'les'], ['Lesweek 4', '', 'les']] },
      { label: 'Een periode die voor de zomer begint', cap: 'Voorbeeld. In dit voorbeeld betaal je voor twee lesweken en krijg je de helft van de uren van je pakket. Je tegoed blijft in de zomer gewoon staan.', cells: [['Lesweek 1', '', 'les'], ['Lesweek 2', '', 'les'], ['Zomervakantie', 'pauze, geen pakket', 'off'], ['Nieuwe periode', '', 'nieuw']] },
    ],
    summerTitle: 'De zomervakantie werkt anders',
    summerBody: 'Een pakket loopt niet door de zomervakantie heen. Als de zomervakantie begint terwijl je periode nog loopt, eindigt je periode daar. Je betaalt dan voor de lesweken die je hebt gehad, en je uren gaan naar rato mee: twee van de vier lesweken betekent de helft van de uren. Je nieuwe periode begint in de eerste lesweek na de zomer.',
    hoursTitle: 'Zo werken de uren',
    hoursBody: 'In je pakket zit een vast aantal uren voor de vier lesweken, bijvoorbeeld 8 uur bij Standaard. Hoe je die uren over de weken verdeelt, bepaal je met je docent.',
    outcomes: [
      { t: 'Minder uren gevolgd', p: 'Wat je overhoudt wordt tegoed. Dat gebruik je in een volgende periode.' },
      { t: 'Precies je uren', p: 'Dan is er niets bij te rekenen en niets over.' },
      { t: 'Meer uren gevolgd', p: 'Je tegoed gaat eerst op. Daarna betaal je de extra uren tegen de prijs van een extra uur, kort na het einde van je periode.' },
    ],
    exampleTitle: 'Voorbeeld met een pakket van 8 uur',
    examples: [
      { t: 'Eerste periode', c: '8 uur in je pakket', blocks: ['used', 'used', 'used', 'used', 'used', 'used', 'empty', 'empty'], res: 'Je volgt 6 uur. Er blijft 2 uur tegoed over.' },
      { t: 'Tweede periode', c: '8 uur in je pakket + 2 uur tegoed', blocks: ['used', 'used', 'used', 'used', 'used', 'used', 'used', 'used', 'credit', 'credit', 'extra'], res: 'Je volgt 11 uur. Je pakket en je tegoed gaan op, en 1 uur is extra.' },
    ],
    legend: [['used', 'uur uit je pakket'], ['credit', 'uur uit je tegoed'], ['extra', 'extra uur'], ['empty', 'niet gebruikt']],
    creditTitle: 'Je tegoed blijft staan zolang je pakket loopt',
    creditBody: [
      'Uren die je overhoudt verlopen niet, zolang je pakket doorloopt. Ook in de zomervakantie blijft je tegoed staan. Stop je met je pakket, dan kun je je tegoed nog twee weken gebruiken, bijvoorbeeld voor losse lessen.',
      'Je tegoed kan niet groter worden dan de uren van je pakket. Heb je een pakket van 8 uur, dan bewaar je maximaal 8 uur. Wat daarboven komt, vervalt.',
    ],
    creditNote: 'Begin je binnen die twee weken opnieuw met een pakket, dan blijft je tegoed gewoon staan.',
    invoicesTitle: 'Welke facturen krijg je?',
    invoices: [
      { tag: 'Aan het begin', t: 'Pakketfactuur', p: 'Je krijgt deze aan het begin van elke periode, voor de vier lesweken die je gaat volgen. Had je in je vorige periode extra uren, dan staan die ook op deze factuur. Je krijgt dus geen aparte factuur.' },
      { tag: 'Na je periode', t: 'Afrekening', p: 'Volgt er niet direct een nieuwe periode, bijvoorbeeld omdat je stopt of omdat de zomervakantie begint, en had je extra uren? Dan sturen we kort na het einde van je periode een aparte afrekening.' },
      { tag: 'Na de maand', t: 'Maandfactuur', p: 'Alleen voor losse lessen, in het begin van de volgende maand. Heb je die maand geen losse lessen gevolgd, dan krijg je ook geen maandfactuur.' },
    ],
    invoicesNote: 'Of je extra uren hebt gevolgd of tegoed overhoudt, weten we pas als je periode klaar is. Daarom rekenen we je periode af zodra de laatste lessen zijn ingevoerd.',
    looseTitle: 'Liever geen pakket?',
    looseBody: 'Dan volg je losse lessen. Die factureren we achteraf, één keer per maand. Dat geldt ook voor lessen in de zomervakantie, als je pakket dan pauzeert. Heb je tegoed, dan gaat dat eerst af. Een pakket loont wanneer je regelmatig bijles volgt, want dan betaal je een lager uurtarief.',
    faqTitle: 'Veelgestelde vragen',
    faq: [
      ['Kan ik op elk moment starten?', 'Ja. Je kiest zelf de week waarin je pakket begint, deze week of een latere week. Je periode loopt vanaf de maandag van die week.'],
      ['Moet ik betalen voordat ik begin?', 'Je ontvangt de factuur aan het begin van je pakket. Je kunt al starten met bijles voordat je hebt betaald. We rekenen er wel op dat je de factuur op tijd betaalt.'],
      ['Wat gebeurt er in een schoolvakantie?', 'Vakantieweken tellen niet mee voor je pakket. Je pakket loopt dan een week langer, zodat je vier lesweken krijgt. Alleen de zomervakantie werkt anders: dan pauzeert je pakket.'],
      ['Wat gebeurt er in de zomervakantie?', 'Je periode eindigt als de zomervakantie begint, en je betaalt naar rato voor de lesweken die je hebt gehad. Je nieuwe periode begint in de eerste lesweek na de zomer. Je tegoed blijft in de tussentijd staan.'],
      ['Mag ik meer uren volgen dan in mijn pakket zit?', 'Ja, dat kan altijd. Eerst gebruik je je eventuele tegoed. Daarna betaal je extra uren tegen de prijs van een extra uur. Die staan kort na het einde van je periode op je eerstvolgende factuur.'],
      ['Wat gebeurt er met uren die ik niet gebruik?', 'Die worden tegoed. Zolang je pakket loopt blijft het tegoed staan, en je kunt het in een volgende periode gebruiken. Je tegoed kan niet groter worden dan de uren van je pakket.'],
      ['Hoe stop ik mijn pakket?', 'Laat het ons uiterlijk een week voor het einde van je lopende periode weten. Je huidige periode maak je altijd af, daarna stopt je pakket. Laat je het later weten, dan begint er nog één periode.'],
      ['Hoe lang kan ik mijn tegoed nog gebruiken na het stoppen?', 'Nog twee weken na het einde van je laatste periode. Daarna vervalt het tegoed.'],
    ],
    closingTitle: 'Wil je iets aan je pakket veranderen?',
    closingBody: 'Je kunt je pakket opzeggen vanaf de pakketpagina. Vragen? Neem gerust contact met ons op.',
  },
}

/** Landing page of a link from a mail or WhatsApp message: logs the visitor in and moves on. */
export const mijnOpen = {
  title: 'Je wordt ingelogd',
  pending: 'Een moment, we loggen je in…',
  failed: 'Deze link is verlopen of al gebruikt. Log in om door te gaan.',
}

/** Asking for a password link or a login link. Both answer the same whether or not the address is known. */
export const mijnForgot = {
  kicker: 'Mijn Bijles Bèta',
  title: 'Wachtwoord vergeten?',
  intro: 'Vul je e-mailadres in. Dan mailen we je een link om een nieuw wachtwoord te kiezen.',
  email: 'E-mailadres',
  submit: 'Mail me de link',
  pending: 'Bezig met versturen…',
  back: 'Terug naar inloggen',
}

export const mijnMagicLink = {
  kicker: 'Mijn Bijles Bèta',
  title: 'Inloggen met een link',
  intro: 'Vul je e-mailadres in. Dan mailen we je een link waarmee je direct inlogt, zonder wachtwoord. De link werkt 10 minuten.',
  email: 'E-mailadres',
  submit: 'Mail me de link',
  pending: 'Bezig met versturen…',
  back: 'Terug naar inloggen',
}

/** Choosing a password with the link from a mail: after the aanmelding, or after "wachtwoord vergeten". */
export const mijnReset = {
  kicker: 'Mijn Bijles Bèta',
  title: 'Kies een wachtwoord',
  intro: 'Kies een wachtwoord voor je account. Daarna log je in met je e-mailadres en dit wachtwoord.',
  email: 'E-mailadres',
  new: 'Nieuw wachtwoord',
  confirm: 'Herhaal het nieuwe wachtwoord',
  hint: 'Minimaal 8 tekens.',
  submit: 'Wachtwoord opslaan',
  pending: 'Bezig met opslaan…',
  mismatch: 'De wachtwoorden zijn niet hetzelfde.',
  invalidLink: 'Deze link is niet compleet. Vraag een nieuwe aan.',
  newLink: 'Nieuwe link aanvragen',
  done: 'Je wachtwoord is ingesteld. Je kunt nu inloggen.',
}

/** Adding and editing a child. */
export const mijnChildForm = {
  addTitle: 'Leerling toevoegen',
  editTitle: 'Gegevens wijzigen',
  addLink: 'Leerling toevoegen',
  editLink: 'Gegevens wijzigen',
  firstName: 'Voornaam',
  lastName: 'Achternaam',
  year: 'Klas',
  yearHint: 'Het leerjaar waarin de leerling nu zit (1 t/m 8).',
  level: 'Niveau',
  levelNone: 'Kies een niveau',
  subjects: 'Vakken',
  subjectsHint: 'Waarvoor heeft de leerling bijles nodig?',
  subjectsMax: (n: number) => `Kies maximaal ${n} vakken.`,
  school: 'School',
  location: 'Waar vindt de bijles plaats?',
  locationHint: 'Bijvoorbeeld thuis bij de leerling, of dichtbij school.',
  dateTime: 'Wanneer past bijles?',
  dateTimeHint: 'Bijvoorbeeld: dinsdag- of donderdagmiddag.',
  submit: 'Opslaan',
  pending: 'Bezig met opslaan…',
  cancel: 'Annuleren',
  saved: 'De gegevens zijn opgeslagen.',
  loading: 'Gegevens laden…',
}

/** Signing up for the sessions of a training, after an invitation. */
export const mijnTrainings = {
  title: 'Trainingen',
  kicker: 'Mijn Bijles Bèta',
  loading: 'Trainingen laden…',
  empty: 'Je bent op dit moment voor geen enkele training uitgenodigd.',
  sessions: 'Kies de momenten waarop je erbij wilt zijn.',
  full: 'Vol',
  save: 'Inschrijving opslaan',
  pending: 'Bezig met opslaan…',
  saved: 'Je inschrijving is opgeslagen. Je krijgt een bevestiging per e-mail.',
  tutor: 'Docent',
  location: 'Locatie',
  overviewTitle: 'Training',
  overviewBody: (n: number) => (n === 1 ? 'Je bent uitgenodigd voor een training.' : `Je bent uitgenodigd voor ${n} trainingen.`),
  overviewCta: 'Kies je momenten',
}
