/**
 * Guards every `/mijn/` page except the login form, which sets `mijn-guest`
 * instead. A visitor without a session goes to the login form with the page
 * they asked for remembered; a logged-in one is never shown the form.
 *
 * An account still on the temporary password from its invitation gets the
 * password form and nothing else, as the portal's MustChangePassword does.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { load } = useMijnSession()
  const user = await load()

  if (!user) {
    return navigateTo({ path: '/mijn/inloggen/', query: { redirect: to.fullPath } })
  }

  if (user.must_change_password && to.path !== '/mijn/wachtwoord/') {
    return navigateTo('/mijn/wachtwoord/', { replace: true })
  }
})
