import { z } from 'zod'

/**
 * Logs a visitor in to `/mijn/`. Only tutors and supervisors for now: this
 * posts to Laravel's `api/tutor/login`, which refuses everyone else with a
 * 422 on `email`. When customers get screens here too, this is the one call
 * that changes.
 *
 * The token goes into the httpOnly cookie and never into the response.
 */
const schema = z.object({
  email: z.string().trim().min(1).max(255),
  password: z.string().min(1).max(255),
})

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const body = await readValidatedBody(event, schema.safeParse)

  if (!body.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { message: 'Vul je e-mailadres en wachtwoord in.' },
    })
  }

  const userAgent = getRequestHeader(event, 'user-agent') ?? 'unknown'

  const { status, data } = await callLaravel(event, 'tutor/login', {
    method: 'POST',
    body: {
      ...body.data,
      // Shows up as the token's name in Laravel; `web:` tells it apart from the app's.
      device_name: `web:${userAgent.slice(0, 200)}`,
    },
  })

  if (status !== 200 || !data?.token) {
    setResponseStatus(event, status === 200 ? 502 : status)
    return data
  }

  setMijnToken(event, data.token)

  return { user: data.user }
})
