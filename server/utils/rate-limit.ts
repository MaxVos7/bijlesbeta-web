import type { H3Event } from 'h3'

/**
 * A small per-IP rate limit for the public form endpoints.
 *
 * The honeypot stops naive bots but not a script: 40 concurrent valid POSTs
 * were accepted and forwarded in 356ms, so the portal could be filled with
 * fake leads at will. There is no captcha, so this is the only thing standing
 * between the endpoints and a flood.
 *
 * In-memory on purpose. The app runs as a single Node process behind nginx on
 * Forge, so a shared store would be infrastructure for no gain — but that is
 * exactly why it stops working the day this runs on more than one instance.
 * Move it to the portal or a shared cache before scaling out.
 *
 * Deliberately generous: a household filling in the wizard for two children,
 * or an office behind one NAT address, must never be turned away. It is a cap
 * on floods, not on enthusiasm.
 */

type Bucket = { count: number, resetAt: number }

const buckets = new Map<string, Bucket>()

/** Keeps the map from growing without bound on a long-lived process. */
function sweep(now: number) {
  if (buckets.size < 5000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/**
 * Throws a 429 once `limit` requests have come from one IP inside `windowMs`.
 *
 * The visitor-facing message is Dutch and says what to do; the status code is
 * what a script sees.
 */
export function rateLimit(
  event: H3Event,
  { limit = 10, windowMs = 60_000 }: { limit?: number, windowMs?: number } = {},
) {
  // Behind nginx, so the forwarded address is the real client.
  const ip
    = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
      || getRequestHeader(event, 'x-real-ip')
      || event.node.req.socket.remoteAddress
      || 'unknown'

  const key = `${ip}:${event.path}`
  const now = Date.now()
  sweep(now)

  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return
  }

  bucket.count += 1

  if (bucket.count > limit) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000)
    setHeader(event, 'retry-after', retryAfter)

    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests',
      data: {
        message:
          'Je hebt dit formulier net al een paar keer verstuurd. Wacht even en probeer het opnieuw, of bel ons.',
      },
    })
  }
}
