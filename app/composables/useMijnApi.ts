/**
 * Calls Laravel's API from a `/mijn/` page, through `server/api/mijn/[...path].ts`.
 * `useMijnApi()('lessons', { query: { page: 2 } })` is `GET <portal>/api/lessons?page=2`.
 *
 * A 401 means the token is gone (revoked, or the cookie expired): the server
 * has already dropped the cookie, so the session is cleared here and the
 * visitor goes to the login form, coming back to this page afterwards.
 */
export function useMijnApi() {
  const { expire } = useMijnSession()
  const route = useRoute()

  return async function <T>(path: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
    try {
      return await $fetch<T>(`/api/mijn/${path}`, options as any)
    }
    catch (error: any) {
      if ((error?.statusCode ?? error?.status) === 401) {
        expire()
        await navigateTo({ path: '/mijn/inloggen/', query: { redirect: route.fullPath } })
      }
      throw error
    }
  }
}

/** The message to show for a failed call: Laravel's own, or a generic one. */
export function mijnErrorMessage(error: any, fallback = 'Er ging iets mis. Probeer het opnieuw.') {
  if ((error?.statusCode ?? error?.status) === 403) return 'Je hebt hier geen toegang toe.'
  return error?.data?.message || fallback
}
