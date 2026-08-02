import { z } from 'zod'

/**
 * Dutch address lookup, proxied to the PDOK Locatieserver (the same public
 * service the Gravity Form's `pdok-*` fields use on the current site).
 *
 * Postcode + huisnummer resolve to street, city, and the two codes the signup
 * form keeps hidden: `woonplaatscode` and `gemeentecode`. Those codes are what
 * decide whether an at-home lesson falls inside gemeente Groningen, which
 * drives the travel-cost and out-of-region warnings on the last step.
 *
 * Proxied rather than called from the browser so visitors' addresses aren't
 * sent to a third party from their own IP, and so the response shape is
 * normalised in one place.
 *
 * Best-effort by design: any failure returns `found: false` and the visitor
 * fills street and city in by hand. Never throws at the caller.
 */

const query = z.object({
  postcode: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, '').toUpperCase())
    .pipe(z.string().regex(/^[1-9][0-9]{3}[A-Z]{2}$/, 'Invalid Dutch postcode')),
  huisnummer: z.string().trim().min(1).max(10),
})

/** PDOK returns codes as `0014`, `GM0014` or `14` depending on the field. */
function normaliseCode(value: unknown): string {
  if (typeof value !== 'string') return ''
  const digits = value.replace(/\D/g, '')
  return digits ? digits.padStart(4, '0') : ''
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

type PdokResponse = {
  response?: { docs?: Record<string, unknown>[] }
}

export default defineEventHandler(async (event) => {
  const parsed = query.safeParse(getQuery(event))

  if (!parsed.success) {
    return { found: false as const }
  }

  const { postcode, huisnummer } = parsed.data

  try {
    const result = await $fetch<PdokResponse>(
      'https://api.pdok.nl/bzk/locatieserver/search/v3_1/free',
      {
        query: {
          q: `${postcode} ${huisnummer}`,
          fq: 'type:adres',
          rows: 1,
          fl: 'straatnaam,woonplaatsnaam,woonplaatscode,gemeentecode,gemeentenaam,postcode,huisnummer',
        },
        timeout: 5_000,
      },
    )

    const doc = result?.response?.docs?.[0]
    if (!doc) return { found: false as const }

    return {
      found: true as const,
      street: text(doc.straatnaam),
      city: text(doc.woonplaatsnaam),
      cityCode: normaliseCode(doc.woonplaatscode),
      municipalityCode: normaliseCode(doc.gemeentecode),
    }
  } catch (error) {
    console.warn('[adres] PDOK lookup failed', error)
    return { found: false as const }
  }
})
