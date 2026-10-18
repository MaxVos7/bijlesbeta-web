/**
 * Guards every `/mijn/` page except the login form, which sets `mijn-guest`
 * instead. A visitor without a session goes to the login form with the page
 * they asked for remembered; a logged-in one is never shown the form.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { load } = useMijnSession()
  const user = await load()

  if (!user) {
    return navigateTo({ path: '/mijn/inloggen/', query: { redirect: to.fullPath } })
  }
})
