import { tutors as snapshot, type Tutor } from '~/data/tutors'

/**
 * The docenten roster, read from the portal's public `api/tutors` and kept
 * for a day, so a docent the office marks `visible_on_website` shows up on
 * `/over-ons/` and gets a `/docenten/<slug>/` page without a deploy.
 *
 * The cache lives in memory — no filesystem writes at runtime — and is
 * stale-while-revalidate: the first request after a day still gets the old
 * roster at once and triggers the refresh behind it. A refresh that fails
 * keeps the roster it had. With no roster at all (a fresh start while the
 * portal is down) the snapshot in `app/data/tutors.ts` stands in, so the
 * pages never depend on the portal answering.
 */

const DAY = 60 * 60 * 24

/** One entry of `PersonController::tutors` in the portal. */
type PortalTutor = {
  id: number
  name: string | null
  study: string | null
  bio: string | null
  expertise_1: string | null
  expertise_2: string | null
  expertise_3: string | null
  profile_picture: string | null
  extra_picture: string | null
}

/**
 * The URL a profile lives at. Every one of the snapshot's 28 slugs is exactly
 * this of the docent's name — and those URLs are indexed, so it must stay so.
 */
export function tutorSlug(name: string) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const point = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return Number.isNaN(point) ? match : String.fromCodePoint(point)
    }
    return ENTITIES[code.toLowerCase()] ?? match
  })
}

/**
 * The bio comes out of the portal's rich-text editor as HTML. The pages
 * render paragraphs as text, never as markup, so it is split on its
 * paragraphs and every tag is dropped.
 */
function bioParagraphs(html: string | null) {
  if (!html) return []
  return html
    .split(/<\/p>|<br\s*\/?>|\n/i)
    .map((part) => decodeEntities(part.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function toTutor(entry: PortalTutor): Tutor | undefined {
  const name = entry.name?.trim()
  // A card with no photo has nothing to show; leave the docent out until the
  // portal has one rather than render a broken image.
  if (!name || !entry.profile_picture) return undefined
  return {
    slug: tutorSlug(name),
    name,
    study: entry.study?.trim() ?? '',
    expertise: [entry.expertise_1, entry.expertise_2, entry.expertise_3].filter((s): s is string => !!s),
    photo: entry.profile_picture,
    extraPhoto: entry.extra_picture ?? entry.profile_picture,
    bio: bioParagraphs(entry.bio),
  }
}

/**
 * Docenten already in the snapshot keep its order — `/over-ons/` breaks the
 * grid at fixed positions, so the roster shouldn't reshuffle on its own.
 * New ones follow, in the portal's order.
 */
function inRosterOrder(list: Tutor[]) {
  const position = new Map(snapshot.map((tutor, index) => [tutor.slug, index]))
  return list
    .map((tutor, index) => ({ tutor, rank: position.get(tutor.slug) ?? snapshot.length + index }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ tutor }) => tutor)
}

const fetchRoster = defineCachedFunction(
  async (): Promise<Tutor[]> => {
    const { portalUrl } = useRuntimeConfig().public
    const entries = await $fetch<PortalTutor[]>('/api/tutors', {
      baseURL: String(portalUrl),
      timeout: 5000,
    })
    const seen = new Set<string>()
    const list = (Array.isArray(entries) ? entries : [])
      .map(toTutor)
      .filter((tutor): tutor is Tutor => {
        if (!tutor || seen.has(tutor.slug)) return false
        seen.add(tutor.slug)
        return true
      })
    // An empty roster is a portal fault, not a team of nobody; throwing keeps
    // whatever was cached before.
    if (!list.length) throw new Error('The portal returned no docenten')
    return inRosterOrder(list)
  },
  { name: 'tutors', getKey: () => 'roster', maxAge: DAY, swr: true },
)

export async function getTutors(): Promise<Tutor[]> {
  try {
    return await fetchRoster()
  } catch (error) {
    console.error('[tutors] could not read the roster from the portal; using the snapshot', error)
    return snapshot
  }
}

export async function getTutor(slug: string) {
  return (await getTutors()).find((tutor) => tutor.slug === slug)
}
