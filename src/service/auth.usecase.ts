import authApi from '../api/auth.api'

interface AuthStore {
  token: string
  user: any
}

const AUTH_KEY = 'auth'

export const authUsecase = {
  async login(username: string, password: string) {
    const resp = await authApi.login({ username, password })
    const token = resp.token || (resp as any).accessToken || ''
    const user = resp.user || (resp as any).user || (resp as any).principal || null

    const auth: AuthStore = { token, user }
    return auth
  },

  persist(auth: AuthStore, remember = false) {
    const raw = JSON.stringify(auth)
    if (remember) {
      localStorage.setItem(AUTH_KEY, raw)
    } else {
      sessionStorage.setItem(AUTH_KEY, raw)
    }
  },

  clear() {
    localStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(AUTH_KEY)
  },

  getAuth(): AuthStore | null {
    const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch (e) {
      return null
    }
  },

  isAuthenticated(): boolean {
    return !!this.getAuth()
  },

  hasRole(role: string): boolean {
    const auth = this.getAuth()
    if (!auth || !auth.user) return false
    const roles: string[] = auth.user.roles || auth.user.authorities || auth.user.authority || []
    // normalize
    const normalized = roles.map((r: string) => r.replace(/^ROLE_/, '').toLowerCase())
    return normalized.includes(role.toLowerCase()) || normalized.includes('admin')
  }
}

export default authUsecase
