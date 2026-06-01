import { apiClient } from './client'

export const usersApi = {
  async getAll(): Promise<any[]> {
    return apiClient.get<any[]>('/users')
  },

  async getById(id: string) {
    return apiClient.get(`/users/${id}`)
  },

  async register(payload: any) {
    return apiClient.post('/users/register', payload)
  },

  async approveUser(id: string) {
    return apiClient.put(`/users/${id}/approve-access`)
  },

  async deleteUser(id: string) {
    return apiClient.delete(`/users/${id}`)
  }
}

export default usersApi
