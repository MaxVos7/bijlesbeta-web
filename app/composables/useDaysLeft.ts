/**
 * Whole days left until a campaign's last day (`YYYY-MM-DD`, inclusive), on
 * the Amsterdam calendar, as the phrase the campaign copy drops into its
 * `{dagen}` slot: "nog 12 dagen", "nog 1 dag", "alleen vandaag".
 *
 * Held in `useState` so the client reuses the server's count instead of
 * recomputing it — a visitor in another time zone, or a page rendered just
 * before midnight, would otherwise hydrate onto different text.
 */
export function useDaysLeft(lastDay: string) {
  const days = useState(`days-left:${lastDay}`, () => {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date())
    const toUtc = (iso: string) => {
      const [y, m, d] = iso.split('-').map(Number)
      return Date.UTC(y!, m! - 1, d!)
    }
    return Math.max(0, Math.round((toUtc(lastDay) - toUtc(today)) / 86_400_000))
  })

  const phrase = computed(() =>
    days.value === 0 ? 'alleen vandaag' : days.value === 1 ? 'nog 1 dag' : `nog ${days.value} dagen`,
  )

  /** Fills the `{dagen}` slot in a line of copy; a line without one is returned as is. */
  const fill = (text: string) => text.replace('{dagen}', phrase.value)

  return { days, phrase, fill }
}
