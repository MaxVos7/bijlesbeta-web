/**
 * The proefles block's answers, handed to the signup wizard.
 *
 * bijlesbeta.nl passed these in the query string
 * (`/aanmelden/?naam=…&telefoon=…&e-mailadres=…`), and so did this app for a
 * while. That put a name, a phone number and an e-mail address in the URL —
 * and so in GA4's `page_location`, PostHog's `$current_url`, the ad tags, the
 * nginx access log and the browser history. Google's terms forbid PII in
 * Analytics and Ads outright.
 *
 * The redirect from `LeadForm` is a client-side navigation, so shared Nuxt
 * state carries the answers across it without them ever touching the URL. A
 * hard reload of `/aanmelden/` loses them, which is the same as losing any
 * other half-typed answer in the wizard.
 */
export interface LeadHandoff {
  name: string
  phone: string
  email: string
}

export function useLeadHandoff() {
  return useState<LeadHandoff | null>('lead-handoff', () => null)
}
