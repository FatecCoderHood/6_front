import { authClient } from './client'

export interface RemoteUser {
  id: string
  email: string
  roles: string[]
  approved: boolean
}

export interface RemoteMe {
  id: string
  email: string
  name: string | null
  phone: string | null
  roles: string[]
  approved: boolean
}

export const usersApi = {
  async register(email: string, password: string, name?: string, phone?: string): Promise<{ id: string; email: string; approved: boolean }> {
    return authClient.post('/auth/register', { email, password, name, phone })
  },

  async getMe(): Promise<RemoteMe> {
    return authClient.get<RemoteMe>('/auth/me')
  },

  async updateMe(name: string, phone: string): Promise<RemoteMe> {
    return authClient.patch<RemoteMe>('/auth/me', { name, phone })
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return authClient.patch<void>('/auth/me/password', { currentPassword, newPassword })
  },

  async deleteMe(): Promise<void> {
    return authClient.delete<void>('/auth/me')
  },

  async getAll(): Promise<RemoteUser[]> {
    return authClient.get<RemoteUser[]>('/auth/users')
  },

  async create(email: string, password: string, roles: string[]): Promise<RemoteUser> {
    return authClient.post<RemoteUser>('/auth/users', { email, password, roles })
  },

  async updateRoles(id: string, roles: string[]): Promise<RemoteUser> {
    return authClient.patch<RemoteUser>(`/auth/users/${id}`, { roles })
  },

  async approve(id: string): Promise<RemoteUser> {
    return authClient.patch<RemoteUser>(`/auth/users/${id}/approve`, {})
  },

  async deleteUser(id: string): Promise<void> {
    return authClient.delete<void>(`/auth/users/${id}`)
  }
}

export default usersApi
