/**
 * The honeypot check, shared by all three form routes.
 *
 * `website` is a field the forms render off-screen: a person never sees it and
 * never fills it in, a naive bot fills in everything. A hit is accepted with
 * the same response a real submission gets, so the bot learns nothing.
 */
export function isSpam(payload: { website?: unknown }) {
  return typeof payload.website === 'string' && payload.website.trim().length > 0
}
