import { describe, it, expect, vi, beforeEach } from 'vitest'
import authUsecase from './auth.usecase'
import authApi from '../api/auth.api'
import { MockUsers } from './UsersMock'

vi.mock('../api/auth.api', () => ({
  default: { login: vi.fn() }
}))

describe('authUsecase.login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a normalized user when the real backend accepts the credentials', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      token: 'real-jwt',
      user: { id: 'uuid-1', email: 'admin@tecsys.com', roles: ['ADMIN'] }
    })

    const result = await authUsecase.login('admin@tecsys.com', 'Admin@123')

    expect(result.token).toBe('real-jwt')
    expect(result.user).toEqual({
      id: 'uuid-1',
      uuid: 'uuid-1',
      name: 'Admin',
      email: 'admin@tecsys.com',
      role: 'admin'
    })
  })

  it('throws without falling back to mock when the real backend rejects the credentials', async () => {
    const authenticateSpy = vi.spyOn(MockUsers, 'authenticate')
    vi.mocked(authApi.login).mockRejectedValue({ response: { status: 401 } })

    await expect(authUsecase.login('admin@tecsys.com', 'wrong-password'))
      .rejects.toThrow('Credenciais inválidas')

    expect(authenticateSpy).not.toHaveBeenCalled()
  })

  it('throws CONTA_PENDENTE without falling back to mock when the account is not approved', async () => {
    const authenticateSpy = vi.spyOn(MockUsers, 'authenticate')
    vi.mocked(authApi.login).mockRejectedValue({ response: { status: 403 } })

    await expect(authUsecase.login('pending@tecsys.com', 'correct-password'))
      .rejects.toThrow('CONTA_PENDENTE')

    expect(authenticateSpy).not.toHaveBeenCalled()
  })

  it('falls back to the mocked users when the real backend is unreachable', async () => {
    vi.mocked(authApi.login).mockRejectedValue({ message: 'Network Error' })

    const result = await authUsecase.login('admin@tecsys.com', '1234')

    expect(result.token).toMatch(/^fake-jwt-token-/)
    expect(result.user.role).toBe('admin')
  })
})
