import { authClient } from './client'

interface LoginRequest {
  username?: string
  email?: string
  password: string
}

interface LoginResponse {
  token: string
  refreshToken?: string
  user: {
    id: string
    email: string
    name?: string | null
    roles: string[]
  }
}

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    // enersight-auth expects `{ email, password }` — accept username or email from caller
    const body = {
      email: payload.email || payload.username,
      password: payload.password
    }
    return authClient.post<LoginResponse>('/auth/login', body)
  },

  async refresh(refreshToken: string): Promise<LoginResponse> {
    return authClient.post<LoginResponse>('/auth/refresh', { refreshToken })
  },

  async logout(refreshToken: string): Promise<void> {
    return authClient.post<void>('/auth/logout', { refreshToken })
  }
}

export default authApi
