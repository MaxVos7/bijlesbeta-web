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

/**
 * Accounts that still carry the generated password from their invitation.
 * There is no API route to set a new one yet, so they finish that on the
 * Laravel portal first.
 */
export const mijnChangePassword = {
  title: 'Kies eerst een nieuw wachtwoord',
  body: 'Je account gebruikt nog het tijdelijke wachtwoord. Stel een eigen wachtwoord in via het portaal en log daarna hier opnieuw in.',
  cta: 'Wachtwoord instellen',
}
