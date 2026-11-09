import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../api/auth.api', () => ({
  default: {
    login: vi.fn().mockResolvedValue({
      token: 'jwt-token',
      tokenType: 'Bearer',
      user: { id: 'u-1', name: 'Ana', email: 'ana@x.com', role: 'ADMIN', status: 'ACTIVE' }
    })
  }
}))

import authUsecase from './auth.usecase'

describe('auth.usecase', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('maps the API user to the UI shape on login', async () => {
    const result = await authUsecase.login('ana@x.com', 'secret')

    expect(result.token).toBe('jwt-token')
    expect(result.user).toMatchObject({ uuid: 'u-1', role: 'admin' })
  })

  it('persists to sessionStorage by default and to localStorage when remembered', () => {
    authUsecase.persist({ token: 't1', user: { uuid: 'a' } })
    expect(sessionStorage.getItem('auth_token')).toBe('t1')
    expect(localStorage.getItem('auth_token')).toBeNull()

    authUsecase.persist({ token: 't2', user: { uuid: 'b' } }, true)
    expect(localStorage.getItem('auth_token')).toBe('t2')
  })

  it('reports authentication, token, role and uuid from storage', () => {
    expect(authUsecase.isAuthenticated()).toBe(false)
    expect(authUsecase.getUserRole()).toBe('user')
    expect(authUsecase.getCurrentUser()).toBeNull()
    expect(authUsecase.getCurrentUserUuid()).toBeNull()

    authUsecase.persist({ token: 't', user: { uuid: 'u-9', role: 'admin' } })

    expect(authUsecase.isAuthenticated()).toBe(true)
    expect(authUsecase.getToken()).toBe('t')
    expect(authUsecase.getUserRole()).toBe('admin')
    expect(authUsecase.getCurrentUserUuid()).toBe('u-9')
  })

  it('falls back safely when stored user data is corrupted', () => {
    sessionStorage.setItem('user_data', '{not-json')

    expect(authUsecase.getUserRole()).toBe('user')
    expect(authUsecase.getCurrentUser()).toBeNull()
  })

  it('clears both storages on logout', () => {
    authUsecase.persist({ token: 't', user: { uuid: 'u' } })
    authUsecase.persist({ token: 't', user: { uuid: 'u' } }, true)

    authUsecase.logout()

    expect(authUsecase.isAuthenticated()).toBe(false)
    expect(localStorage.getItem('user_data')).toBeNull()
    expect(sessionStorage.getItem('user_data')).toBeNull()
  })
})
