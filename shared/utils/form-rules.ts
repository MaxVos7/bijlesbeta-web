/**
 * What every form field is allowed to contain — one table per form, read by
 * both halves of that form.
 *
 * These live in `shared/` for the same reason `normalisePhone` does: the two
 * halves must not disagree about what the endpoint will accept. The API route
 * builds its zod schema from the table (`server/utils/schema.ts`), and the
 * component checks the visitor's answers against the same one before it posts.
 * A rule can no longer be tightened on the server and forgotten in the form.
 *
 * That is not a theoretical worry. `schoolYear` reached the endpoint as the
 * number `4` rather than the string `"4"` — `v-model` on an `<input
 * type="number">` casts silently — and the wizard happily let the visitor
 * press *Aanmelden* at the end of four steps to be told, by a generic red
 * line, that something was wrong. Three quieter versions of the same drift
 * were live alongside it: an e-mail the form accepted and zod refused, and
 * name and message fields with no length cap on the client at all.
 *
 * The rules are deliberately dumb — lengths, a shape, a range. Anything the
 * client cannot know (the portal being down, a duplicate account) stays on the
 * server and is handled by the office copy, not by a 422. See "The office
 * copy" in CLAUDE.md.
 */

import { normalisePhone } from './phone'

export type FieldRule = {
  /** Blank is a problem. Blank means empty once trimmed. */
  required?: boolean
  /** Fewest characters, once trimmed. */
  minLength?: number
  /** Most characters, once trimmed — the portal's own cap, as a rule. */
  maxLength?: number
  /**
   * An extra shape on top of the lengths, only ever checked on a value that
   * is actually filled in — an optional phone field is blank or a number,
   * never "blank is not a phone number".
   */
  format?: 'email' | 'phone' | 'integer'
  /** For `integer` only: the inclusive range, as the portal validates it. */
  min?: number
  max?: number
}

/** A checkbox group: `subjects` on both the wizard and the application form. */
export type ListRule = {
  minItems?: number
  maxItems?: number
  /** Cap on each individual value. */
  maxLength?: number
}

export type FieldProblem =
  | { kind: 'required' }
  | { kind: 'tooShort', limit: number }
  | { kind: 'tooLong', limit: number }
  | { kind: 'email' }
  | { kind: 'phone' }
  | { kind: 'wholeNumber' }
  | { kind: 'numberMin', limit: number }
  | { kind: 'numberMax', limit: number }
  | { kind: 'tooFew', limit: number }
  | { kind: 'tooMany', limit: number }

/**
 * zod's own "practical" e-mail regex, copied rather than referenced so the
 * client doesn't have to bundle zod to agree with the server about it. The
 * routes check with this too, instead of `z.email()`, so the two can't drift:
 * the form used to accept `a@b.c` and `.a@b.nl`, which zod refuses.
 */
export const EMAIL_RE
  = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value)
}

/**
 * What's wrong with one answer, or `null`.
 *
 * Takes `unknown` on purpose. A form field that stops being a string is
 * exactly the failure this module exists to catch, and a checker that only
 * accepted `string` would be blind to it.
 */
export function checkField(rule: FieldRule, raw: unknown): FieldProblem | null {
  const value = typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim()

  if (!value) return rule.required ? { kind: 'required' } : null

  if (rule.minLength !== undefined && value.length < rule.minLength) {
    return { kind: 'tooShort', limit: rule.minLength }
  }
  if (rule.maxLength !== undefined && value.length > rule.maxLength) {
    return { kind: 'tooLong', limit: rule.maxLength }
  }

  if (rule.format === 'email' && !isEmail(value)) return { kind: 'email' }
  if (rule.format === 'phone' && normalisePhone(value) === null) return { kind: 'phone' }

  if (rule.format === 'integer') {
    const entered = Number(value)
    if (!Number.isInteger(entered)) return { kind: 'wholeNumber' }
    if (rule.min !== undefined && entered < rule.min) return { kind: 'numberMin', limit: rule.min }
    if (rule.max !== undefined && entered > rule.max) return { kind: 'numberMax', limit: rule.max }
  }

  return null
}

/** The same, for a checkbox group. */
export function checkList(rule: ListRule, values: unknown): FieldProblem | null {
  const list = Array.isArray(values) ? values : []

  if (rule.minItems !== undefined && list.length < rule.minItems) {
    return { kind: 'tooFew', limit: rule.minItems }
  }
  if (rule.maxItems !== undefined && list.length > rule.maxItems) {
    return { kind: 'tooMany', limit: rule.maxItems }
  }
  if (rule.maxLength !== undefined) {
    const overlong = list.some(
      value => String(value ?? '').trim().length > rule.maxLength!,
    )
    if (overlong) return { kind: 'tooLong', limit: rule.maxLength }
  }

  return null
}

/**
 * Every field of a form that would be refused, keyed by field name.
 *
 * This is the guard that runs over the *payload*, rather than over whichever
 * questions happen to be on screen: it is what makes "the endpoint said no"
 * impossible to reach by pressing the submit button.
 */
export function checkForm<T extends Record<string, FieldRule>>(
  rules: T,
  values: Record<string, unknown>,
): Partial<Record<keyof T, FieldProblem>> {
  const problems: Partial<Record<keyof T, FieldProblem>> = {}

  for (const name of Object.keys(rules) as (keyof T & string)[]) {
    const problem = checkField(rules[name]!, values[name])
    if (problem) problems[name] = problem
  }

  return problems
}

/** Dutch copy for a problem. Forms may say something friendlier per field. */
export function describeProblem(problem: FieldProblem): string {
  switch (problem.kind) {
    case 'required':
      return 'Dit veld is verplicht.'
    case 'tooShort':
      return `Gebruik minimaal ${problem.limit} tekens.`
    case 'tooLong':
      return `Dit antwoord is te lang. Gebruik maximaal ${problem.limit} tekens.`
    case 'email':
      return 'Vul een geldig e-mailadres in.'
    case 'phone':
      return 'Vul een geldig Nederlands telefoonnummer in, bijvoorbeeld 0612345678.'
    case 'wholeNumber':
      return 'Voer een heel getal in.'
    case 'numberMin':
      return `Voer een getal groter dan of gelijk aan ${problem.limit} in.`
    case 'numberMax':
      return `Voer een getal kleiner dan of gelijk aan ${problem.limit} in.`
    case 'tooFew':
      return problem.limit === 1 ? 'Kies minimaal één optie.' : `Kies er minimaal ${problem.limit}.`
    case 'tooMany':
      return `Kies er maximaal ${problem.limit}.`
  }
}

/**
 * The maximum lengths as a plain table, for `maxlength` on the inputs.
 *
 * The cap belongs on the control as well as in the check: an answer that can't
 * be typed doesn't need a message underneath it.
 */
export function maxLengths<T extends Record<string, FieldRule>>(
  rules: T,
): Record<keyof T, number> {
  const caps = {} as Record<keyof T, number>
  for (const name of Object.keys(rules) as (keyof T)[]) {
    caps[name] = rules[name]!.maxLength ?? Number.MAX_SAFE_INTEGER
  }
  return caps
}

/*
  ── The tables ──────────────────────────────────────────────────────────────

  Every cap here is the portal's, not ours; see the field-by-field notes in
  CLAUDE.md under "Forms". Change one and both halves change with it.
*/

/**
 * `/aanmelden`, the four-step wizard.
 *
 * Conditional questions are not `required`: which ones are asked is the
 * wizard's business (`app/data/signup.ts` decides), and refusing a submission
 * over a question nobody was shown would strand the visitor.
 */
export const SIGNUP_RULES = {
  // Step 1 — Bijles
  lessonKind: { required: true, maxLength: 40 },
  lessonKindNote: { maxLength: 2000 },
  weeklyHours: { maxLength: 40 },
  totalHours: { maxLength: 40 },
  availability: { required: true, maxLength: 500 },
  location: { required: true, maxLength: 40 },
  locationNote: { maxLength: 500 },
  school: { maxLength: 200 },

  /*
    Step 2 — Vak en niveau. The portal validates `student_year` as
    `integer|min:1|max:6` and refuses the *whole* submission outside it, so
    "abc", "3.5", "0" and "-5" have to fail here rather than there.
  */
  schoolYear: { required: true, maxLength: 20, format: 'integer', min: 1, max: 6 },
  level: { required: true, maxLength: 40 },
  levelOther: { maxLength: 120 },
  subjectOther: { maxLength: 200 },

  // Step 3 — Kennismaking en proefles
  studentFirstName: { required: true, maxLength: 120 },
  studentPhone: { required: true, maxLength: 40, format: 'phone' },
  contactMethod: { required: true, maxLength: 60 },

  // Step 4 — Factuurgegevens
  contactFirstName: { required: true, maxLength: 120 },
  contactLastName: { required: true, maxLength: 120 },
  email: { required: true, maxLength: 180, format: 'email' },
  // `account_postcode` and `account_housenumber` are `max:10` on the portal.
  postalCode: { required: true, maxLength: 10 },
  houseNumber: { required: true, maxLength: 10 },
  street: { required: true, maxLength: 200 },
  city: { required: true, maxLength: 120 },
  // Filled by the PDOK lookup, not by the visitor — absent if it didn't resolve.
  cityCode: { maxLength: 10 },
  municipalityCode: { maxLength: 10 },
  // `account_address_comment` is `max:255` on the portal.
  addressNote: { maxLength: 255 },
  contactPhone: { maxLength: 40, format: 'phone' },
  heardAbout: { required: true, maxLength: 200 },

  // Honeypot — never filled by a human, so it carries no rules of its own.
  website: { maxLength: 200 },
} as const satisfies Record<string, FieldRule>

export const SIGNUP_SUBJECTS_RULE = {
  minItems: 1,
  maxItems: 10,
  maxLength: 60,
} as const satisfies ListRule

/** `/contact`, and the same component in its `panel` variant. */
export const CONTACT_RULES = {
  name: { required: true, maxLength: 120 },
  email: { required: true, maxLength: 180, format: 'email' },
  phone: { maxLength: 40 },
  subject: { maxLength: 120 },
  message: { required: true, minLength: 10, maxLength: 5000 },
  website: { maxLength: 200 },
} as const satisfies Record<string, FieldRule>

/** `/solliciteren`, posted from `/werken-bij`. The CV has its own checks. */
export const APPLICATION_RULES = {
  firstName: { required: true, maxLength: 255 },
  lastName: { required: true, maxLength: 255 },
  phone: { required: true, maxLength: 40, format: 'phone' },
  email: { required: true, maxLength: 255, format: 'email' },
  study: { required: true, maxLength: 255 },
  motivation: { required: true, minLength: 10, maxLength: 5000 },
  postalCode: { required: true, maxLength: 10 },
  houseNumber: { required: true, maxLength: 10 },
  heardFrom: { maxLength: 255 },
  website: { maxLength: 200 },
} as const satisfies Record<string, FieldRule>

export const APPLICATION_SUBJECTS_RULE = {
  minItems: 1,
  maxItems: 10,
  maxLength: 60,
} as const satisfies ListRule

/**
 * The short proefles block. Live form 1 requires the name and the phone
 * number and leaves the e-mail optional — see "The proefles block" in
 * CLAUDE.md — but an e-mail that *is* filled in still has to be one, or the
 * lead mail is lost to a 422 the visitor never sees.
 */
export const LEAD_RULES = {
  name: { required: true, maxLength: 120 },
  phone: { required: true, maxLength: 40, format: 'phone' },
  email: { maxLength: 180, format: 'email' },
  page: { maxLength: 200 },
  website: { maxLength: 200 },
} as const satisfies Record<string, FieldRule>
