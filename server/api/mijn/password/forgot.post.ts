import { z } from 'zod'

/** Mails a link to choose a password. */
export default defineEventHandler(event =>
  publicMijnCall(
    event,
    'web/password/forgot',
    z.object({ email: z.string().trim().email().max(255) }),
    'Vul een geldig e-mailadres in.',
  ),
)
