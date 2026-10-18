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
