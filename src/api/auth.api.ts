import { apiClient } from './client'
import { USE_MOCKS } from '../config/api.config'
import { authMock } from './mocks/auth.mock'
import type { AuthApi, LoginRequest, LoginResponseDto } from './types'

const authReal: AuthApi = {
  async login(payload: LoginRequest): Promise<LoginResponseDto> {
    // Backend expects `{ email, password }`
    return apiClient.post<LoginResponseDto>('/auth/login', payload)
  }
}

export const authApi: AuthApi = USE_MOCKS ? authMock : authReal

export default authApi
