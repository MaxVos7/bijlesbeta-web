/**
 * Shapes of the Laravel API's answers that more than one `/mijn/` page uses.
 */

/** One lesson — Laravel's `LessonResource`. */
export type MijnLesson = {
  id: number
  date: string
  time_start: string | null
  time_end: string | null
  minutes: number
  is_trial: boolean
  has_travel_allowance: boolean
  is_updatable: boolean
  receiver: { id: number, name: string }
  provider: { id: number, name: string }
  record_body: string | null
}

/** A note shared with the guardian, as plain text. */
export type MijnRecord = {
  id: number
  body: string
  person_name?: string
  writer_name: string | null
  created_at: string | null
}

/** One of a customer's children — `GET api/children`. */
export type MijnChild = {
  id: number
  name: string
  active: boolean
  level: string | null
  subjects: string[]
  tutors: Array<{ id: number, name: string }>
}
