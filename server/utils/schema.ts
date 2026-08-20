import { z } from 'zod'
import { isEmail, type FieldRule, type ListRule } from '#shared/utils/form-rules'
import { normalisePhone } from '#shared/utils/phone'

/**
 * zod schemas built from the shared rule tables in
 * `shared/utils/form-rules.ts`.
 *
 * The routes used to spell their rules out a second time, which is how the
 * forms and the endpoints drifted apart: a length the server enforced and the
 * form didn't, an e-mail zod refused and the form accepted, a `schoolYear`
 * typed as a string on one side and cast to a number on the other. Every one
 * of those was a 422 at the end of a form, which the visitor can do nothing
 * about and which the office never hears of.
 *
 * The endpoint is still the one that decides — an untrusted caller is parsed
 * exactly as before. It just no longer *defines* the rules on its own.
 */

/** One text field, as its rule describes it. */
export function ruleField(rule: FieldRule): z.ZodType<string> {
  let field = z.string().trim()

  // Required is a minimum length of one; a field with a longer minimum (a
  // message, a motivation) is always required as well.
  const min = rule.required ? Math.max(1, rule.minLength ?? 1) : rule.minLength
  if (min !== undefined) field = field.min(min)
  if (rule.maxLength !== undefined) field = field.max(rule.maxLength)

  // Shapes are only checked on a value that is filled in, so an optional
  // phone field can be left blank without being told it is not a number.
  let checked: z.ZodType<string> = field

  if (rule.format === 'email') {
    checked = field.refine(value => value === '' || isEmail(value), {
      message: 'must be an e-mail address',
    })
  }

  if (rule.format === 'phone') {
    /* The portal's `PhoneNumber` rule refuses anything with a separator in it
       and rejects the whole submission for it — see `shared/utils/phone.ts`. */
    checked = field.refine(value => value === '' || normalisePhone(value) !== null, {
      message: 'must be a Dutch phone number',
    })
  }

  if (rule.format === 'integer') {
    checked = field.refine(
      (value) => {
        if (value === '') return true
        const entered = Number(value)
        return (
          Number.isInteger(entered)
          && (rule.min === undefined || entered >= rule.min)
          && (rule.max === undefined || entered <= rule.max)
        )
      },
      { message: `must be a whole number between ${rule.min} and ${rule.max}` },
    )
  }

  // An unasked question arrives missing rather than empty, so an optional
  // field has to accept both and answer with `''` either way.
  return rule.required ? checked : checked.optional().default('')
}

/** Every text field of a form, keyed as the rule table keys it. */
export function ruleFields<T extends Record<string, FieldRule>>(
  rules: T,
): { [K in keyof T]: z.ZodType<string> } {
  const fields = {} as { [K in keyof T]: z.ZodType<string> }

  for (const name of Object.keys(rules) as (keyof T)[]) {
    fields[name] = ruleField(rules[name]!)
  }

  return fields
}

/** A checkbox group — `subjects` on the wizard and on the application form. */
export function ruleList(rule: ListRule): z.ZodType<string[]> {
  let list = z.array(z.string().trim().max(rule.maxLength ?? 255))

  if (rule.minItems !== undefined) list = list.min(rule.minItems)
  if (rule.maxItems !== undefined) list = list.max(rule.maxItems)

  return list
}
