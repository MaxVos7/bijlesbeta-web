/**
 * Pages of the packages with periods. Runs after `mijn` and `mijn-customer`.
 * A customer who may not use them (still on an old-style subscription, or the
 * feature is off) goes to the package page they do have; the portal refuses
 * the endpoints for them as well, so this only keeps them off empty pages.
 */
export default defineNuxtRouteMiddleware(() => {
  const { user } = useMijnSession()

  if (user.value && !user.value.package_periods) {
    return navigateTo('/mijn/pakket/', { replace: true })
  }
})
