/**
 * Pages only customers have (overview, children, invoices). Runs after `mijn`,
 * so the session is loaded; anyone else goes to their own start page. Laravel
 * refuses these endpoints to other roles regardless — this only keeps a tutor
 * from landing on an empty page.
 */
export default defineNuxtRouteMiddleware(() => {
  const { user } = useMijnSession()

  if (user.value && !user.value.is_customer) {
    return navigateTo('/mijn/', { replace: true })
  }
})
