/**
 * What `ApplicationForm` learned from `/api/solliciteren`, handed to
 * `/docent-worden/bedankt/`.
 *
 * The thank-you page says whether the chosen kennismaking was booked, and
 * when, so the form has to pass that across the navigation. Shared Nuxt state
 * carries it without putting anything in the URL — the same reason
 * `useLeadHandoff` exists. A reload of the thank-you page loses it and the page
 * falls back to the general "we nemen contact op", which is still true.
 *
 * `null` means no time was chosen; `{ booked: false }` means one was chosen
 * and could not be held.
 */
export type ApplicationIntake = { booked: true, label: string, location: string } | { booked: false }

export interface ApplicationHandoff {
  intake: ApplicationIntake | null
}

export function useApplicationHandoff() {
  return useState<ApplicationHandoff | null>('application-handoff', () => null)
}
