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
