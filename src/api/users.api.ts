import { getAllUsers, pendingUsers, users as approvedUsers, approveUser as mockApprove, rejectUser as mockReject } from '../service/mockData'

export const usersApi = {
  async getAll(): Promise<any[]> {
    // Return a copy combining approved and pending
    return getAllUsers()
  },

  async getById(id: string) {
    const all = getAllUsers()
    return all.find((u: any) => String(u.id) === String(id) || u.email === id)
  },

  async register(payload: any) {
    // Create a pending user mock entry
    const id = Date.now()
    const newUser = {
      id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      role: payload.role || 'user',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    pendingUsers.push(newUser as any)
    return newUser
  },

  async approveUser(id: string) {
    // Try numeric id first
    const numeric = Number(id)
    const ok = mockApprove(isNaN(numeric) ? id : numeric)
    return ok
  },

  async deleteUser(id: string) {
    const numeric = Number(id)
    // Try to remove from pending first
    const ok = mockReject(isNaN(numeric) ? id : numeric)
    return ok
  }
}

export default usersApi
