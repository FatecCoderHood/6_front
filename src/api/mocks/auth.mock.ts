import type { AuthApi } from '../types'
import { MOCK_TOKEN_PREFIX, mockError, mockUsers, toUserDto } from './mockStore'

export const authMock: AuthApi = {
  async login({ email, password }) {
    if (!email || !password) throw mockError(400, 'email: must not be blank, password: must not be blank')
    const user = mockUsers.find((u) => u.email === email)
    if (!user || user.password !== password) throw mockError(401, 'Invalid email or password')
    if (!user.active) throw mockError(403, 'User account is deactivated')
    if (user.status === 'PENDING') throw mockError(403, 'User access pending approval. Please contact support.')
    if (user.status === 'REJECTED') throw mockError(403, 'User access request was rejected.')
    return { token: MOCK_TOKEN_PREFIX + user.id, tokenType: 'Bearer', user: toUserDto(user) }
  }
}
