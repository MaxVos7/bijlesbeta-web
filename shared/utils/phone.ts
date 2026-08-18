/**
 * Puts a Dutch phone number in the one shape the portal accepts, or returns
 * `null` if it can't.
 *
 * The portal's `PhoneNumber` rule is
 * `^((?:(?:(?:\+|00)[0-9][0-9])|0)+([0-9]{9}))$` — it takes `0612345678` and
 * `+31612345678` and refuses everything else, including `06 12 34 56 78`,
 * `06-12345678` and `(06) 12345678`, which is how people actually type a phone
 * number. A refusal is a 422 on the *whole* submission, so a visitor who
 * finished four wizard steps could lose the lot over a single space.
 *
 * It lives in `shared/` because both halves have to agree on it: the forms
 * check the shape before the visitor can move on, and the API routes normalise
 * to `06…` on the way out so the portal never sees a separator.
 */
export function normalisePhone(input: string): string | null {
  const cleaned = input.replace(/[\s\-().]/g, '')

  // +31 6 …, 0031 6 …, and any other country code the rule's `[0-9][0-9]`
  // allows: the portal keeps the last nine digits and prefixes a zero.
  const international = /^(?:\+|00)[0-9]{2}([0-9]{9})$/.exec(cleaned)
  if (international) return `0${international[1]}`

  if (/^0[0-9]{9}$/.test(cleaned)) return cleaned

  return null
}
