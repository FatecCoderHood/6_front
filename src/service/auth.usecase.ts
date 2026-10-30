// src/service/auth.usecase.ts
import authApi from '../api/auth.api'
import { USE_MOCKS } from '../config/api.config'
import LogsMock from './LogsMock'

class AuthUsecase {
  private tokenKey = 'auth_token'
  private userKey = 'user_data'

  async login(email: string, password: string): Promise<any> {
    const resp = await authApi.login({ email, password })
    // The API role is ADMIN | USER; the UI compares lowercase values.
    const user = { ...resp.user, uuid: resp.user.id, role: resp.user.role.toLowerCase() }

    if (USE_MOCKS) {
      LogsMock.registerAction(user.uuid, user.name, user.role, 'Login', 'login', undefined, '127.0.0.1')
    }

    return { token: resp.token, user }
  }

  persist(authData: any, remember: boolean = false) {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(this.tokenKey, authData.token)
    storage.setItem(this.userKey, JSON.stringify(authData.user))
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey)
    return !!token
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

  logout() {
    const currentUser = this.getCurrentUser()
    if (USE_MOCKS && currentUser && currentUser.uuid) {
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
    localStorage.removeItem(this.userKey)
    sessionStorage.removeItem(this.tokenKey)
    sessionStorage.removeItem(this.userKey)
  }
}

export default new AuthUsecase()