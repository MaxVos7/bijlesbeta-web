import { z } from 'zod'

/** Mails a link that logs a customer in without a password. */
export default defineEventHandler(event =>
  publicMijnCall(
    event,
    'web/magic-link',
    z.object({ email: z.string().trim().email().max(255) }),
    'Vul een geldig e-mailadres in.',
  ),
)
