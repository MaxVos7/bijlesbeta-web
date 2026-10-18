/** The login form, for visitors who aren't logged in yet. */
export default defineNuxtRouteMiddleware(async () => {
  const { load } = useMijnSession()

  if (await load()) {
    return navigateTo('/mijn/')
  }
})
