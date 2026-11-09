import { beforeEach, describe, expect, it, vi } from 'vitest'

const http = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() }))
vi.mock('./client', () => ({ apiClient: http }))

import authApi from './auth.api'
import termsApi from './terms.api'
import usersApi from './users.api'

describe('real API endpoints', () => {
  beforeEach(() => Object.values(http).forEach((fn) => fn.mockReset()))

  it('posts credentials to /auth/login', async () => {
    http.post.mockResolvedValue({ token: 't' })

    await authApi.login({ email: 'a@x.com', password: 'p' })

    expect(http.post).toHaveBeenCalledWith('/auth/login', { email: 'a@x.com', password: 'p' })
  })

  it('lists terms from /terms', async () => {
    await termsApi.getAll()

    expect(http.get).toHaveBeenCalledWith('/terms')
  })

  it('filters users by status only when given', async () => {
    await usersApi.getAll()
    await usersApi.getAll('PENDING')

    expect(http.get).toHaveBeenNthCalledWith(1, '/users', { params: undefined })
    expect(http.get).toHaveBeenNthCalledWith(2, '/users', { params: { status: 'PENDING' } })
  })

  it('calls the user endpoints with the expected verbs and paths', async () => {
    await usersApi.getById('u1')
    await usersApi.register({ name: 'A', email: 'a@x.com', password: 'p', acceptedTermIds: ['t1'] })
    await usersApi.approveUser('u1')
    await usersApi.rejectUser('u1', 'incomplete')
    await usersApi.anonymizeUser('u1')
    await usersApi.deleteMe()

    expect(http.get).toHaveBeenCalledWith('/users/u1')
    expect(http.post).toHaveBeenCalledWith('/users/register', expect.objectContaining({ email: 'a@x.com' }))
    expect(http.patch).toHaveBeenCalledWith('/users/u1/approve-access')
    expect(http.patch).toHaveBeenCalledWith('/users/u1/reject', { reason: 'incomplete' })
    expect(http.delete).toHaveBeenCalledWith('/users/u1')
    expect(http.delete).toHaveBeenCalledWith('/users/me')
  })
})
