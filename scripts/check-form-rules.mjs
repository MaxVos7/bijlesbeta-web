/*
  Does the check a form runs accept exactly what its endpoint accepts?

  Both sides read `shared/utils/form-rules.ts`, so they are supposed to agree
  by construction: the component calls `checkField`, and the route parses with
  the zod schema `server/utils/schema.ts` builds from the same rule. This walks
  every field of every form over a corpus of awkward values and reports any
  case where the two disagree — the bridge between the rule and zod is the one
  place a rule could still be mistranslated.

  Run it from the repository root with Node 22:

      node scripts/check-form-rules.mjs

  It is not wired into a test suite, because there isn't one yet. Run it after
  touching a rule table, `ruleField`, or `checkField`.
*/
import { createJiti } from 'jiti'

const root = new URL('..', import.meta.url).pathname
const jiti = createJiti(import.meta.url, {
  alias: { '#shared': `${root}shared` },
  interopDefault: true,
})

const rules = await jiti.import(`${root}shared/utils/form-rules.ts`)
const schema = await jiti.import(`${root}server/utils/schema.ts`)

const CORPUS = [
  '', ' ', '  \t ', 'a', 'ab', 'test', 'Groningen',
  // Whole numbers, and the things people type instead of one.
  '0', '1', '4', '6', '7', '-5', '3.5', '1e1', 'abc', '007', ' 4 ', '4e0',
  // Phone numbers the portal takes, and the separators it refuses.
  '0612345678', '+31612345678', '06 12 34 56 78', '06-12345678', '(06) 12345678',
  '0031612345678', '612345678', '06123456789',
  // E-mail addresses either side of zod's own regex.
  'info@example.nl', 'a@b.nl', 'a@b.c', '.a@b.nl', 'a..b@c.nl', 'a@b',
  'a@-b.nl', 'a@b.nl!', 'a b@c.nl', 'a@b.co.uk', 'A@B.NL', 'a+b@c.nl',
  // Either side of every cap in the tables.
  'x'.repeat(9), 'x'.repeat(10), 'x'.repeat(11),
  'x'.repeat(39), 'x'.repeat(40), 'x'.repeat(41),
  'x'.repeat(119), 'x'.repeat(120), 'x'.repeat(121),
  'x'.repeat(255), 'x'.repeat(256),
  'x'.repeat(4999), 'x'.repeat(5000), 'x'.repeat(5001),
  ` ${'x'.repeat(120)} `,
  // What a form must never post, and what cost us this script.
  4, 0, null, undefined, true,
]

const TABLES = {
  SIGNUP_RULES: rules.SIGNUP_RULES,
  CONTACT_RULES: rules.CONTACT_RULES,
  APPLICATION_RULES: rules.APPLICATION_RULES,
  LEAD_RULES: rules.LEAD_RULES,
}

const show = value =>
  typeof value === 'string'
    ? JSON.stringify(value.slice(0, 30)) + (value.length > 30 ? `…(${value.length})` : '')
    : String(value)

let checked = 0
const mismatches = []

for (const [table, fields] of Object.entries(TABLES)) {
  for (const [field, rule] of Object.entries(fields)) {
    const zodField = schema.ruleField(rule)

    for (const value of CORPUS) {
      const client = rules.checkField(rule, value) === null
      const server = zodField.safeParse(value).success
      checked++

      /*
        A value that isn't a string is the one disagreement that is meant to be
        there: the endpoint refuses it outright, while the form coerces before
        it posts — so what actually leaves the form is a string either way.
      */
      if (typeof value !== 'string' && client && !server) continue

      if (client !== server) {
        mismatches.push({
          table,
          field,
          value: show(value),
          form: client ? 'accepts' : 'refuses',
          endpoint: server ? 'accepts' : 'refuses',
        })
      }
    }
  }
}

// The two checkbox groups.
const LISTS = {
  SIGNUP_SUBJECTS_RULE: rules.SIGNUP_SUBJECTS_RULE,
  APPLICATION_SUBJECTS_RULE: rules.APPLICATION_SUBJECTS_RULE,
}

for (const [table, rule] of Object.entries(LISTS)) {
  const zodList = schema.ruleList(rule)

  const candidates = [
    [], ['Wiskunde'], ['Wiskunde', 'Natuurkunde'],
    Array.from({ length: 10 }, () => 'x'), Array.from({ length: 11 }, () => 'x'),
    ['x'.repeat(60)], ['x'.repeat(61)],
  ]

  for (const list of candidates) {
    const client = rules.checkList(rule, list) === null
    const server = zodList.safeParse(list).success
    checked++

    if (client !== server) {
      mismatches.push({
        table,
        field: 'subjects',
        value: `${list.length} × ${show(list[0] ?? '')}`,
        form: client ? 'accepts' : 'refuses',
        endpoint: server ? 'accepts' : 'refuses',
      })
    }
  }
}

console.log(`${checked} field/value pairs checked`)

if (mismatches.length) {
  console.table(mismatches)
  process.exitCode = 1
}
else {
  console.log('No mismatches: every form accepts exactly what its endpoint does.')
}
