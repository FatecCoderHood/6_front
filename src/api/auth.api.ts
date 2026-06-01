import { apiClient } from './client'

interface LoginRequest {
  username?: string
  email?: string
  password: string
}

interface LoginResponse {
  token?: string
  // backend may return user info in different shapes; accept any
  user?: any
}

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    // Backend expects `{ email, password }` — accept username or email from caller
    const body: any = {
      email: payload.email || payload.username,
      password: payload.password
    }
    return apiClient.post<LoginResponse>('/auth/login', body)
  }
}

export default authApi
