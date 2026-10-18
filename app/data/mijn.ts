/**
 * Copy for `/mijn/`, the logged-in part of the site. Tutors only for now;
 * customers follow later on the same prefix.
 */

export const mijnLogin = {
  title: 'Inloggen',
  kicker: 'Mijn Bijles Bèta',
  intro: 'Log in met het e-mailadres en wachtwoord van je docentenaccount.',
  email: 'E-mailadres',
  password: 'Wachtwoord',
  submit: 'Inloggen',
  pending: 'Bezig met inloggen…',
  forgotPassword: 'Wachtwoord vergeten?',
  failed: 'Inloggen lukte niet. Probeer het opnieuw.',
  throttled: 'Te veel pogingen. Wacht een minuut en probeer het opnieuw.',
  customersNote: 'Ouder of leerling? Log in via',
}

export const mijnNav = {
  lessons: 'Lessen',
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
