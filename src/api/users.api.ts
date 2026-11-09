import { apiClient } from './client'
import { USE_MOCKS } from '../config/api.config'
import { usersMock } from './mocks/users.mock'
import type { UsersApi, UserResponseDto, UserStatus, UserRegisterRequestDto } from './types'

const usersReal: UsersApi = {
  getAll: (status?: UserStatus) => apiClient.get<UserResponseDto[]>('/users', { params: status ? { status } : undefined }),
  getById: (id: string) => apiClient.get<UserResponseDto>(`/users/${id}`),
  register: (payload: UserRegisterRequestDto) => apiClient.post<UserResponseDto>('/users/register', payload),
  approveUser: (id: string) => apiClient.patch<UserResponseDto>(`/users/${id}/approve-access`),
  rejectUser: (id: string, reason: string) => apiClient.patch<UserResponseDto>(`/users/${id}/reject`, { reason }),
  anonymizeUser: (id: string) => apiClient.delete<void>(`/users/${id}`),
  deleteMe: () => apiClient.delete<void>('/users/me')
}

export const usersApi: UsersApi = USE_MOCKS ? usersMock : usersReal

export default usersApi