/**
 * The kennismaking times a new docent can pick on the aanmeldformulier at
 * `/werken-bij/`.
 *
 * They are sessions of a training the portal has marked "open voor
 * aanmelders" — the office makes and changes them there, and this app only
 * reads them. Shared between the form and the route so the time a visitor is
 * shown, the time they are thanked for and the time the office reads in its
 * mail are one piece of formatting.
 */
export interface IntakeSlot {
  id: number
  /** The training's name in the portal, e.g. "Kennismaking docenten". */
  name: string
  /** ISO 8601, with the portal's offset. */
  startAt: string
  endAt: string | null
  location: string
  full: boolean
}

/*
  Pinned to Amsterdam rather than left to the runtime: the same instant is
  formatted by the visitor's browser, by this app's server for the office copy
  and during SSR, and a server on UTC would otherwise print an hour off.
*/
const ZONE = 'Europe/Amsterdam'
const DAY = new Intl.DateTimeFormat('nl-NL', { timeZone: ZONE, weekday: 'long', day: 'numeric', month: 'long' })
const TIME = new Intl.DateTimeFormat('nl-NL', { timeZone: ZONE, hour: '2-digit', minute: '2-digit' })

/** `woensdag 16 december` */
export function intakeDay(slot: Pick<IntakeSlot, 'startAt'>): string {
  return DAY.format(new Date(slot.startAt))
}

/** `13:00 – 14:00` */
export function intakeHours(slot: Pick<IntakeSlot, 'startAt' | 'endAt'>): string {
  const start = TIME.format(new Date(slot.startAt))
  return slot.endAt ? `${start} – ${TIME.format(new Date(slot.endAt))}` : start
}

/** `woensdag 16 december, 13:00 – 14:00` */
export function intakeLabel(slot: Pick<IntakeSlot, 'startAt' | 'endAt'>): string {
  return `${intakeDay(slot)}, ${intakeHours(slot)}`
}

/**
 * One slot out of the portal's JSON, or null when it isn't one. The portal's
 * answer is untrusted input like any other: a row without an id or a readable
 * start is dropped rather than rendered as "Invalid Date".
 */
export function parseIntakeSlot(raw: any): IntakeSlot | null {
  const id = Number(raw?.id)
  const startAt = typeof raw?.start_at === 'string' ? raw.start_at : ''

  if (!Number.isInteger(id) || id < 1 || Number.isNaN(Date.parse(startAt))) return null

  const endAt = typeof raw?.end_at === 'string' && !Number.isNaN(Date.parse(raw.end_at)) ? raw.end_at : null

  return {
    id,
    name: typeof raw?.name === 'string' ? raw.name : '',
    startAt,
    endAt,
    location: typeof raw?.location === 'string' ? raw.location : '',
    full: raw?.is_full === true,
  }
}
