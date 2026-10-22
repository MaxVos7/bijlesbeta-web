/**
 * Who is logged in to `/mijn/`, as Laravel's `api/me` describes them.
 *
 * The token itself lives in an httpOnly cookie the page cannot read (see
 * `server/utils/mijn.ts`), so "logged in" is only ever known by asking: `load()`
 * calls `me` once per page load and caches the answer in `useState`.
 */
export type MijnUser = {
  id: number
  name: string
  email: string
  role: string | null
  is_provider: boolean
  is_supervisor: boolean
  is_customer: boolean
  is_admin: boolean
  must_change_password: boolean
  /** False for an account the aanmelding made, until they choose one. */
  has_password: boolean
}

export function useMijnSession() {
  const user = useState<MijnUser | null>('mijn-user', () => null)
  const loaded = useState('mijn-user-loaded', () => false)

  async function load() {
    if (loaded.value) return user.value

    try {
      const data = await $fetch<{ user: MijnUser }>('/api/mijn/me')
      user.value = data.user
    }
    catch {
      user.value = null
    }

    loaded.value = true
    return user.value
  }

  async function login(email: string, password: string) {
    const data = await $fetch<{ user: MijnUser }>('/api/mijn/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data.user
    loaded.value = true
    return data.user
  }

  async function logout() {
    try {
      await $fetch('/api/mijn/logout', { method: 'POST' })
    }
    finally {
      user.value = null
      loaded.value = true
    }
  }

  /** Called when an API call answers 401: the server has dropped the cookie already. */
  function expire() {
    user.value = null
    loaded.value = true
  }

  return { user, load, login, logout, expire }
}
