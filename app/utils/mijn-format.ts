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
