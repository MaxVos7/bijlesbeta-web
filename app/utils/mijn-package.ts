import { mijnPackages as copy } from '~/data/mijn'
import type { PackagePayment } from '~/utils/mijn-types'

/** The colour of a package invoice's label: green paid, amber open, red problem, grey otherwise. */
export function paymentTone(payment: PackagePayment | null): 'ok' | 'open' | 'grey' | 'bad' {
  if (payment?.status === 'paid') return 'ok'
  if (payment?.status === 'open') return 'open'
  if (payment?.status === 'uncollectible') return 'bad'
  return 'grey'
}

/** The label itself. No invoice yet, or a draft the customer may not see, reads "Factuur volgt". */
export function paymentPill(payment: PackagePayment | null) {
  if (payment?.status === 'paid') return copy.pill.paid
  if (payment?.status === 'open') return copy.pill.open
  if (payment?.status === 'uncollectible') return copy.pill.uncollectible
  return copy.pill.invoiceComing
}
