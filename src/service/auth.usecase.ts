// src/service/auth.usecase.ts
import { MockUsers, type MockUser } from './UsersMock'
import LogsMock from './LogsMock'

class AuthUsecase {
  private tokenKey = 'auth_token'
  private userKey = 'user_data'

  async login(email: string, password: string): Promise<any> {
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
          uuid: user.uuid,        // ← ADICIONE O UUID AQUI
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
    localStorage.removeItem(this.userKey)
    sessionStorage.removeItem(this.tokenKey)
    sessionStorage.removeItem(this.userKey)
  }
}

export default new AuthUsecase()