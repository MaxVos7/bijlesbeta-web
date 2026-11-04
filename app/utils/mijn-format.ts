/**
 * Formatting for `/mijn/` pages. Intl only — the site carries no date library,
 * and these are the few shapes the API's values need.
 */

/** "di 14 okt 2026". `date` is the API's `Y-m-d`, read as a local date. */
export function lessonDate(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('nl-NL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** "15:30" from the API's "15:30:00". */
export function clockTime(time: string | null) {
  return time ? time.slice(0, 5) : ''
}

/** "1 uur 30 min", ported from the app's `hoursAndMinutes`. */
export function hoursAndMinutes(minutes: number) {
  const abs = Math.abs(minutes)
  const hours = Math.floor(abs / 60)
  const rest = abs % 60

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours} uur`)
  if (rest > 0) parts.push(`${rest} min`)

  return parts.length ? parts.join(' ') : '0 uur'
}

/** "€ 140" from the API's cents; "€ 12,50" when there are cents to show. */
export function euros(cents: number) {
  const whole = cents % 100 === 0
  return (cents / 100).toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

/** "14 oktober 2026" from the API's `Y-m-d`. */
export function longDate(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

const SHORT_MONTHS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

/** "7 sep" from the API's `Y-m-d`. */
export function shortDate(date: string) {
  const [, m, d] = date.split('-').map(Number)
  return `${d} ${SHORT_MONTHS[m! - 1]}`
}

/** "7 sep t/m 4 okt"; the year only appears when the two dates differ in it. */
export function periodRange(from: string, to: string) {
  const sameYear = from.slice(0, 4) === to.slice(0, 4)
  return `${sameYear ? shortDate(from) : `${shortDate(from)} ${from.slice(0, 4)}`} t/m ${shortDate(to)}${sameYear ? '' : ` ${to.slice(0, 4)}`}`
}

/** "2,5 uur" or "1 uur 30 min" from the API's decimal hours. */
export function hoursLabel(hours: number) {
  return hoursAndMinutes(Math.round(hours * 60))
}

/** The ISO week number out of "2026-W37". */
export function weekNumber(week: string) {
  return Number(week.split('-W')[1])
}

/** The ISO week of a `Y-m-d`, as "2026-W37". */
export function isoWeekKey(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  const day = new Date(Date.UTC(y!, m! - 1, d!))
  // The Thursday of this week decides which year the week belongs to.
  day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7))
  const jan1 = Date.UTC(day.getUTCFullYear(), 0, 1)
  const week = Math.ceil(((day.getTime() - jan1) / 86400000 + 1) / 7)
  return `${day.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

/** `Y-m-d` plus a number of days, computed in UTC so a daylight-saving switch can't move it. */
export function addDays(date: string, days: number) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y!, m! - 1, d! + days)).toISOString().slice(0, 10)
}

/** The Monday of an ISO week such as "2026-W37", as `Y-m-d`. */
export function isoWeekStart(week: string) {
  const [year, number] = week.split('-W').map(Number)
  const jan4 = new Date(Date.UTC(year!, 0, 4))
  const monday = jan4.getUTCDate() - ((jan4.getUTCDay() || 7) - 1) + (number! - 1) * 7
  return new Date(Date.UTC(year!, 0, monday)).toISOString().slice(0, 10)
}

/** Whole days from today to a `Y-m-d`, negative when it has passed. */
export function daysUntil(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  const target = new Date(y!, m! - 1, d!).getTime()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.round((target - today) / 86_400_000)
}

/** Today as `Y-m-d`, in the visitor's own time zone. */
export function today() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/** The ISO week a `Y-m-d` falls in, as "2026-W44". */
export function isoWeekOf(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  const thursday = new Date(Date.UTC(y!, m! - 1, d!))
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7))
  const week = Math.ceil(((thursday.getTime() - Date.UTC(thursday.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7)
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}
