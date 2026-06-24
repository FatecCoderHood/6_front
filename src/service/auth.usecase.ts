// src/service/auth.usecase.ts
import { MockUsers } from './UsersMock'
import LogsMock from './LogsMock'
import authApi from '../api/auth.api'

// enersight-auth has no `name` field (LGPD data minimization) — derive a display name from the
// email's local-part so existing UI that shows user.name keeps working.
function deriveNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || email
  return localPart.charAt(0).toUpperCase() + localPart.slice(1)
}

// The UI only recognizes these two roles; default to the least-privileged one for anything else.
function toAppRole(role: string | undefined): 'admin' | 'user' {
  return role?.toLowerCase() === 'admin' ? 'admin' : 'user'
}

class AuthUsecase {
  private tokenKey = 'auth_token'
  private refreshTokenKey = 'refresh_token'
  private userKey = 'user_data'

  async login(email: string, password: string): Promise<any> {
    try {
      const { token, refreshToken, user } = await authApi.login({ email, password })
      const normalized = {
        id: user.id,
        uuid: user.id,
        name: user.name || deriveNameFromEmail(user.email),
        email: user.email,
        role: toAppRole(user.roles?.[0])
      }

      LogsMock.registerAction(
        normalized.uuid,
        normalized.name,
        normalized.role,
        'Login',
        'login',
        undefined,
        '127.0.0.1'
      )

      return { token, refreshToken, user: normalized }
    } catch (err: any) {
      // enersight-auth unreachable (not just a rejection) — fall back to mocked users so
      // local/demo usage keeps working without the auth service running.
      if (!err.response) {
        return this.loginWithMock(email, password)
      }
      // Correct credentials, but the account isn't approved yet.
      if (err.response.status === 403) {
        throw new Error('CONTA_PENDENTE: Seu cadastro está aguardando aprovação do administrador.')
      }
      // Reachable backend genuinely rejected these credentials — do not fall back to mock,
      // that would let a coincidentally-matching mock account bypass a real wrong password.
      throw new Error('Credenciais inválidas')
    }
  }

  private loginWithMock(email: string, password: string): any {
    const user = MockUsers.authenticate(email, password)

    if (user) {
      LogsMock.registerAction(
        user.uuid,
        user.name,
        user.role,
        'Login',
        'login',
        undefined,
        '127.0.0.1'
      )

      return {
        token: `fake-jwt-token-${user.id}`,
        user: {
          id: user.id,
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    }

    const pendingUser = MockUsers.getByEmail(email)
    if (pendingUser && pendingUser.status === 'pending') {
      throw new Error('CONTA_PENDENTE: Seu cadastro está aguardando aprovação do administrador.')
    }

    throw new Error('Credenciais inválidas')
  }

  persist(authData: any, remember: boolean = false) {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(this.tokenKey, authData.token)
    storage.setItem(this.userKey, JSON.stringify(authData.user))
    if (authData.refreshToken) {
      storage.setItem(this.refreshTokenKey, authData.refreshToken)
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey)
    return !!token
  }

  // A session from the mock fallback carries a fake token (see loginWithMock) — callers that need
  // to know which backend to talk to for self-service calls should check this directly, rather
  // than infer it from a failed request (a fake token sent to a now-reachable real backend would
  // get a genuine 401, which looks like "real backend rejected this" rather than "wrong backend").
  isMockSession(): boolean {
    return !!this.getToken()?.startsWith('fake-jwt-token-')
  }

  getUserRole(): string {
    const userStr = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey)
    if (!userStr) return 'user'
    
    try {
      const user = JSON.parse(userStr)
      return user.role || 'user'
    } catch {
      return 'user'
    }
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey)
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  getCurrentUserUuid(): string | null {
    const user = this.getCurrentUser()
    return user?.uuid || null
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey) || sessionStorage.getItem(this.refreshTokenKey)
  }

  // Exchanges the stored refresh token for a new access token (rotating the refresh token too),
  // persisting both into whichever storage tier is currently active. Returns null — never throws —
  // on any failure (no refresh token, mock session, expired/revoked token, network error), leaving
  // the decision of what to do next (typically: force logout) to the caller.
  async refreshAccessToken(): Promise<string | null> {
    if (this.isMockSession()) return null

    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const result = await authApi.refresh(refreshToken)
      const tier = localStorage.getItem(this.tokenKey) ? localStorage : sessionStorage
      tier.setItem(this.tokenKey, result.token)
      if (result.refreshToken) {
        tier.setItem(this.refreshTokenKey, result.refreshToken)
      }
      return result.token
    } catch {
      return null
    }
  }

  async logout() {
    const currentUser = this.getCurrentUser()
    const refreshToken = this.getRefreshToken()
    const wasMockSession = this.isMockSession()

    if (currentUser && currentUser.uuid) {
      LogsMock.registerAction(
        currentUser.uuid,
        currentUser.name,
        currentUser.role,
        'Logout',
        'logout',
        undefined,
        '127.0.0.1'
      )
    }

    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    localStorage.removeItem(this.userKey)
    sessionStorage.removeItem(this.tokenKey)
    sessionStorage.removeItem(this.refreshTokenKey)
    sessionStorage.removeItem(this.userKey)

    // Best-effort server-side revoke so the refresh token can't be replayed after logout — but
    // local state is already cleared above regardless of whether this succeeds, so a network
    // hiccup never leaves the user stuck mid-logout.
    if (refreshToken && !wasMockSession) {
      try {
        await authApi.logout(refreshToken)
      } catch {
        // ignore — local logout already happened
      }
    }
  }
}

export default new AuthUsecase()