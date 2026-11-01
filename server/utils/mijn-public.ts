import type { H3Event } from 'h3'
import type { ZodType } from 'zod'

/**
 * A call to the portal for a visitor who is not logged in — asking for a
 * password link, setting a password, asking for a login link. Same-origin and
 * validated here; Laravel throttles per visitor (we forward the address) and
 * answers the same whether or not an address exists, so this passes its answer
 * through unchanged.
 */
export async function publicMijnCall(event: H3Event, path: string, schema: ZodType, invalid: string) {
  assertSameOrigin(event)

  const body = await readValidatedBody(event, (value) => schema.safeParse(value))

  if (!body.success) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed', data: { message: invalid } })
  }

  const { status, data } = await callLaravel(event, path, { method: 'POST', body: body.data })

  setResponseStatus(event, status)
  setHeader(event, 'cache-control', 'no-store')

  return data
}
