import type { UsersApi } from '../types'
import { currentMockUser, mockError, mockTerms, mockUsers, requireMockAdmin, toUserDto } from './mockStore'

const findUser = (id: string) => {
  const user = mockUsers.find((u) => u.id === id)
  if (!user) throw mockError(404, `User not found: ${id}`)
  return user
}

const requirePending = (id: string) => {
  const user = findUser(id)
  if (user.status !== 'PENDING') throw mockError(409, `User is not pending approval: ${id}`)
  return user
}

// Same rules as the backend: email is freed so the person can sign up again.
const anonymize = (user: ReturnType<typeof findUser>) => {
  user.name = 'Anonymized'
  user.email = `anon-${crypto.randomUUID()}@anonymized.invalid`
  user.status = 'ANONYMIZED'
  user.active = false
}

export const usersMock: UsersApi = {
  async getAll(status) {
    requireMockAdmin()
    return mockUsers.filter((u) => !status || u.status === status).map(toUserDto)
  },

  async getById(id) {
    const current = currentMockUser()
    if (!current) throw mockError(401, 'Authentication required')
    if (current.role !== 'ADMIN' && current.id !== id) throw mockError(403, 'Access denied')
    return toUserDto(findUser(id))
  },

  async register({ name, email, password, acceptedTermIds }) {
    if (!acceptedTermIds) throw mockError(400, 'acceptedTermIds: must not be null')
    if (!name || !email || !password || password.length < 8) {
      throw mockError(400, 'name, email and a password of at least 8 characters are required')
    }
    if (mockUsers.some((u) => u.email === email)) throw mockError(409, `Email already registered: ${email}`)
    const missing = mockTerms.filter((t) => t.type === 'MANDATORY' && !acceptedTermIds.includes(t.id)).map((t) => t.id)
    if (missing.length) throw mockError(422, `Missing acceptance for mandatory terms: [${missing.join(', ')}]`)

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      role: 'USER' as const,
      status: 'PENDING' as const,
      rejectionReason: null,
      active: true,
      createdAt: new Date().toISOString(),
      password
    }
    mockUsers.push(user)
    return toUserDto(user)
  },

  async approveUser(id) {
    requireMockAdmin()
    const user = requirePending(id)
    user.status = 'ACTIVE'
    return toUserDto(user)
  },

  async rejectUser(id, reason) {
    requireMockAdmin()
    if (!reason?.trim()) throw mockError(400, 'reason: must not be blank')
    const user = requirePending(id)
    user.status = 'REJECTED'
    user.rejectionReason = reason
    return toUserDto(user)
  },

  async anonymizeUser(id) {
    requireMockAdmin()
    anonymize(findUser(id))
  },

  async deleteMe() {
    const current = currentMockUser()
    if (!current) throw mockError(401, 'Authentication required')
    anonymize(current)
  }
}
