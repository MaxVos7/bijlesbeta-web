import { z } from 'zod'

/**
 * Saves what a visitor has answered so far on `/aanmelden`, after every step.
 *
 * The wizard is four steps and most of the people who leave do so partway. This
 * hands each step's answers to the portal as a draft (`SignupDraft`), where the
 * office can see them and turn them into a registration. It is not a
 * registration itself: nothing is mailed, no account exists, and the portal
 * answers with a token the wizard sends along from then on.
 *
 * Never allowed to stop the visitor. The wizard doesn't wait for this before
 * moving to the next step, and a draft that couldn't be saved is only a
 * missing row in a list — the finished form is still the real submission.
 * That is also why a bad answer isn't a 422: the portal keeps the answers that
 * pass its rules and drops the rest, rather than losing all of them.
 *
 * `answers` must be cumulative — everything from the steps cleared so far, not
 * just the latest step's. The portal only overwrites the keys it is sent, and a
 * key made from several answers (`location_indication`) is recomputed from
 * whichever of them are present, so sending a later step on its own would
 * blank what the earlier ones contributed.
 *
 * The answers are only capped here, not checked against `SIGNUP_RULES`. Those
 * rules describe a *finished* form — a required field is required — and a
 * draft is by definition missing some. The finished form is held to them.
 */
const text = z.string().max(2000)

const schema = z.object({
  token: z.string().max(64).optional(),
  step: z.number().int().min(0).max(20),
  stepName: z.string().max(64).optional(),
  source: z.string().max(255).optional(),
  answers: z.object({
    ...Object.fromEntries(
      Object.keys(SIGNUP_RULES).map(name => [name, text.optional()]),
    ),
    subjects: z.array(z.string().max(100)).max(20).optional(),
  }),
  // Honeypot, as on the other forms.
  website: z.string().max(200).optional(),
})

export default defineEventHandler(async (event) => {
  // Looser than the forms': every step of a signup is a request.
  rateLimit(event, { limit: 40 })

  const body = await readValidatedBody(event, schema.safeParse)

  if (!body.success) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed' })
  }

  const { token, step, stepName, source, answers, website } = body.data

  if (isSpam({ website })) return { ok: true as const, token: null }

  const saved = await postToPortal(event, '/external-signup-draft', {
    token,
    step,
    step_name: stepName,
    source,
    ...draftPayload(answers as Partial<SignupAnswers>),
  })

  // A token only means something if the portal handed it out.
  return {
    ok: saved.ok,
    token: saved.ok && typeof saved.data?.token === 'string' ? saved.data.token : null,
  }
})
