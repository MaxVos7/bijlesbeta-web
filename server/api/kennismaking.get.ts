/**
 * The kennismaking times the aanmeldformulier at `/werken-bij/` offers.
 *
 * A read-only pass-through of the portal's `external-intake-slots`, which
 * lists the upcoming sessions of every training marked "open voor aanmelders".
 * The shared key stays on the server, which is the whole reason this route
 * exists.
 *
 * Like `/api/adres`, it never throws at its caller: with no portal, or a
 * portal that doesn't answer, there are simply no times to offer and the form
 * leaves the question out. An applicant can always apply without one.
 */
export default defineEventHandler(async (event) => {
  // Not cached: a time somebody just took has to read as taken for the next
  // visitor, and the list is four rows.
  setResponseHeader(event, 'Cache-Control', 'no-store')

  return { slots: await fetchIntakeSlots(event) }
})
