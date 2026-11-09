import { beforeEach, describe, expect, it, vi } from 'vitest'

type Handler = (arg: any) => any
const captured = vi.hoisted(() => ({
  request: undefined as undefined | Handler,
  responseError: undefined as undefined | Handler,
  instance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  } as Record<string, any>
}))

vi.mock('axios', () => {
  captured.instance.interceptors = {
    request: { use: (ok: Handler) => (captured.request = ok) },
    response: { use: (_ok: Handler, err: Handler) => (captured.responseError = err) }
  }
  return { default: { create: () => captured.instance } }
})

import { apiClient } from './client'

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  it('returns only the response body for every verb', async () => {
    for (const verb of ['get', 'post', 'put', 'patch', 'delete'] as const) {
      captured.instance[verb].mockResolvedValue({ data: { verb } })
      expect(await (apiClient as any)[verb]('/x')).toEqual({ verb })
    }
  })

  it('adds the bearer token from storage when present', () => {
    sessionStorage.setItem('auth_token', 'abc')

    const config = captured.request!({ method: 'get', url: '/x', headers: {} })

    expect(config.headers.Authorization).toContain('abc')
  })

  it('leaves the request untouched without a token', () => {
    const config = captured.request!({ method: 'get', url: '/x', headers: {} })

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('clears the session on a 401 from a protected endpoint', async () => {
    localStorage.setItem('auth_token', 't')
    sessionStorage.setItem('user_data', '{}')
    const assign = vi.fn()
    vi.stubGlobal('location', { pathname: '/dashboard', assign })

    await expect(
      captured.responseError!({ response: { status: 401 }, config: { url: '/users' } })
    ).rejects.toBeDefined()

    expect(localStorage.getItem('auth_token')).toBeNull()
    expect(sessionStorage.getItem('user_data')).toBeNull()
    expect(assign).toHaveBeenCalledWith('/login')
    vi.unstubAllGlobals()
  })

  it('does not end the session when the login itself returns 401', async () => {
    localStorage.setItem('auth_token', 't')

    await expect(
      captured.responseError!({ response: { status: 401 }, config: { url: '/auth/login' } })
    ).rejects.toBeDefined()

    expect(localStorage.getItem('auth_token')).toBe('t')
  })
})
