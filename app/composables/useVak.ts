/**
 * The subject a visitor came in on, from an ad's `?vak=` parameter.
 *
 * A Google Ads campaign per subject points its final URL at e.g.
 * `/openingsactie-utrecht/?vak=wiskunde`, and the campaign pages narrow their
 * headline to that one subject. Read from the query during SSR, so the right
 * title is in the HTML and never flashes.
 *
 * It is kept in shared state rather than read off the URL each time, so it
 * survives the client-side navigations that follow (an in-page anchor keeps
 * the query, but a `NuxtLink` drops it). A hard reload without the parameter
 * starts over, which is the right default for anyone not coming from an ad.
 *
 * Anything other than the three known subjects is ignored, so a mistyped or
 * hand-edited link falls back to the general copy rather than printing it.
 */
export const VAKKEN = ['wiskunde', 'natuurkunde', 'scheikunde'] as const
export type Vak = (typeof VAKKEN)[number]

const isVak = (value: unknown): value is Vak =>
  typeof value === 'string' && (VAKKEN as readonly string[]).includes(value)

export function useVak() {
  const route = useRoute()
  const vak = useState<Vak | null>('vak', () => null)

  const fromQuery = String(route.query.vak ?? '').toLowerCase()
  if (isVak(fromQuery)) vak.value = fromQuery

  return vak
}
