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
  /** The note without the editor's HTML — what the site shows. */
  record_text: string | null
}

/** A note shared with the guardian, as plain text. */
export type MijnRecord = {
  id: number
  body: string
  person_name?: string
  writer_name: string | null
  created_at: string | null
}

/** A tutor as their student's guardian meets them (`tutors` of `GET api/children`). */
export type MijnTutor = {
  id: number
  name: string
  picture_url?: string | null
  subjects?: string[]
  /** Plain text. */
  bio?: string | null
}

/** One of a customer's children — `GET api/children`. */
export type MijnChild = {
  id: number
  name: string
  active: boolean
  level: string | null
  subjects: string[]
  tutors: MijnTutor[]
  /** What the edit form starts from. */
  first_name: string
  last_name: string | null
  school: string | null
  year: number | null
  level_id: number | null
  subject_ids: number[]
}

/** Packages with periods (`GET api/package`). Amounts are cents, hours decimals, dates `Y-m-d`. */
export type PackagePlan = {
  id: number
  name: string
  hours_per_period: number
  price: number
  extra_hour_price: number
}

export type PackagePayment = {
  invoice_id: string | null
  number: string | null
  status: 'preparing' | 'open' | 'paid' | 'uncollectible' | string
  /** In euros, unlike every other amount. */
  total: number
  due_date: string | null
  pay_url: string | null
}

export type PackagePeriod = {
  id: number
  position: number
  starts_on: string
  ends_on: string
  lesson_weeks: number
  is_truncated: boolean
  status: 'scheduled' | 'active' | 'ended' | 'settled'
  /** When the period is settled, `Y-m-d`. */
  due_for_settlement_on: string
  hours: number
  price: number
  usage: { hours: number, used: number, remaining: number, credit: number, expected_extra_hours: number }
  payment: PackagePayment | null
  settlement: null | {
    settled_at: string | null
    hours_used: number
    hours_from_credit: number
    extra_hours: number
    extra_cents: number
    credit_generated: number
    credit_capped: number
    invoice: PackagePayment | null
  }
}

export type PackageEnrollment = {
  id: number
  status: 'pending' | 'running' | 'cancelled' | 'ended'
  plan: PackagePlan
  first_week: string
  cancelled_at: string | null
  ends_on: string | null
  suggested_by_name: string | null
}

export type PackageState = {
  enrollment: PackageEnrollment | null
  periods: PackagePeriod[]
  credit: { hours: number, max_hours: number | null }
  cancel: null | {
    stops_on: string
    /** Past the notice date: one more period starts and is paid. */
    is_late: boolean
    /** The last day cancelling still stops the package after the running period; null once `is_late`. */
    deadline: string | null
    extra_period: null | { starts_on: string, ends_on: string, lesson_weeks: number, price: number }
  }
  plans: PackagePlan[]
  can_start: boolean
  start_weeks: { week: string, starts_on: string, holiday: string | null, is_summer: boolean }[]
  terms_and_conditions_link: string | null
}

export type PackagePreview = {
  plan: PackagePlan
  starts_on: string
  ends_on: string
  lesson_weeks: number
  is_truncated: boolean
  starts_later_than_asked: boolean
  next_starts_on: string
  hours: number
  price: number
}

/** The package block of `GET api/dashboard`; null while the feature is off. */
export type PackageDashboard = {
  enrollment: PackageEnrollment | null
  /** The running period, or else the next one. */
  period: PackagePeriod | null
  can_start: boolean
}
