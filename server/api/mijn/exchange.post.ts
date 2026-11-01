import { z } from 'zod'

/**
 * Trades the one-time code a link from the portal left on `/mijn/open/` for a
 * login. The portal minted the code after checking the link's signature (or a
 * login, or a magic link); this is the same cookie `login.post.ts` sets, for a
 * visitor who never typed a password.
 *
 * The code is single-use and lives 90 seconds, so a failed attempt here is
 * final: the visitor is sent to the login form.
 */
const schema = z.object({
  code: z.string().trim().regex(/^[A-Za-z0-9]{48}$/),
})

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const body = await readValidatedBody(event, schema.safeParse)

  if (!body.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { message: 'Deze link is verlopen. Log in om door te gaan.' },
    })
  }

  const userAgent = getRequestHeader(event, 'user-agent') ?? 'unknown'

  const { status, data } = await callLaravel(event, 'web/exchange', {
    method: 'POST',
    body: {
      code: body.data.code,
      device_name: `web:${userAgent.slice(0, 200)}`,
    },
  })

  if (status !== 200 || !data?.token) {
    setResponseStatus(event, status === 200 ? 502 : status)
    return { message: data?.errors?.code?.[0] ?? data?.message ?? 'Deze link is verlopen. Log in om door te gaan.' }
  }

  setMijnToken(event, data.token)

  return { user: data.user, next: typeof data.next === 'string' ? data.next : '/mijn/' }
})
