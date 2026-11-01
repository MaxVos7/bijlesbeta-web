import { z } from 'zod'

/** Sets a password with the token from the mailed link. */
export default defineEventHandler(event =>
  publicMijnCall(
    event,
    'web/password/reset',
    z.object({
      token: z.string().trim().min(1).max(200),
      email: z.string().trim().email().max(255),
      password: z.string().min(1).max(255),
      password_confirmation: z.string().min(1).max(255),
    }),
    'Vul een nieuw wachtwoord in en herhaal het.',
  ),
)
