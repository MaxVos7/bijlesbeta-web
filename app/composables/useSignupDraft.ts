import type { SignupValues } from '~/data/signup'

/**
 * The visitor's half-finished aanmelding, saved in the portal as they go.
 *
 * The proefles block opens the funnel (step 0) and the wizard adds a step at a
 * time after it. Each save goes to the portal, which keeps a draft the office
 * can ring back or convert, and answers with a token. That token is the
 * visitor's handle on their own draft, so every later save and the final
 * submission carry it — otherwise each step would start a draft of its own.
 *
 * It lives in shared state rather than the URL for the same reason the lead
 * answers do (see `useLeadHandoff`): it has to survive the client-side
 * navigation from the block to the wizard, and it has no business in the
 * address bar.
 *
 * **A save never blocks and never fails the caller.** The visitor's next step
 * does not wait on it, and a draft that wasn't saved is a missing row in a
 * list, not a lost registration — the finished form is still the real
 * submission. The calls are queued one behind another, though: the first
 * response is what hands out the token, and a second save that overtook it
 * would not have one.
 */
/*
  The queue is module state, not `useState`: a promise can't go through Nuxt's
  payload serialisation, and it is only ever touched from event handlers in the
  browser, never while rendering on the server.
*/
let tail: Promise<void> = Promise.resolve()

/*
  Longer than the server's own ceiling: `postToPortal` gives the portal 15s, and
  the lead route waits for its mail as well. A client that gives up first drops
  the token of a draft the server then goes on to create, and the next step
  starts a second one.
*/
const SAVE_TIMEOUT = 25_000

export function useSignupDraft() {
  const token = useState<string | null>('signup-draft-token', () => null)

  /** Runs after everything already queued, and resolves whatever happens. */
  function enqueue(call: () => Promise<{ token: string | null } | void>): Promise<void> {
    tail = tail.then(async () => {
      try {
        const result = await call()
        if (result?.token) token.value = result.token
      }
      catch {
        // See the note above: nothing the visitor could do about it.
      }
    })

    return tail
  }

  /** The proefles block's answers: step 0, and the first thing in a draft. */
  function saveLead(body: Record<string, unknown>) {
    return enqueue(() => {
      /*
        The block opens a draft; it never continues one. A token still in
        shared state belongs to an earlier lead (an abandoned wizard, or
        somebody else at the same computer), and sending it would overwrite
        that person's name and phone with this one's.
      */
      token.value = null

      return $fetch('/api/lead', {
        method: 'POST',
        timeout: SAVE_TIMEOUT,
        body,
      })
    })
  }

  /**
   * A cleared wizard step.
   *
   * `answers` is everything from the steps cleared so far, not just this
   * one: the portal only overwrites the answers it is sent, so resending the
   * earlier ones is harmless, and sending only the new ones would leave an
   * answer the visitor has since changed stale.
   */
  function saveStep(step: number, stepName: string, answers: Partial<SignupValues>, source?: string) {
    return enqueue(() => $fetch('/api/aanmelding-concept', {
      method: 'POST',
      timeout: SAVE_TIMEOUT,
      body: {
        token: token.value ?? undefined,
        step,
        stepName,
        source,
        answers,
        website: answers.website,
      },
    }))
  }

  /**
   * Resolves once everything queued has been answered, so the token is current
   * — or after `deadline` ms, whichever is first. The draft is a best-effort
   * extra and must not hold up the real submission.
   */
  function settled(deadline = 3_000) {
    return Promise.race([
      tail,
      new Promise<void>(resolve => setTimeout(resolve, deadline)),
    ])
  }

  return { token, saveLead, saveStep, settled }
}
