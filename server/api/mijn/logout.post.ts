/**
 * Revokes the token in Laravel and drops the cookie. The cookie goes whatever
 * Laravel says: a visitor who pressed "Uitloggen" is logged out here even if
 * the portal is down.
 */
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const token = getMijnToken(event)

  if (token) {
    await callLaravel(event, 'logout', { method: 'POST', token }).catch(() => {})
  }

  clearMijnToken(event)

  return { ok: true }
})
