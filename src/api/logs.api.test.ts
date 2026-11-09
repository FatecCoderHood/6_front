import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuditLogResponseDto } from './types'

const get = vi.hoisted(() => vi.fn())
vi.mock('./client', () => ({ apiClient: { get } }))

import { logsApi } from './logs.api'

const dto = (overrides: Partial<AuditLogResponseDto>): AuditLogResponseDto => ({
  id: 'l-1',
  createdAt: '2026-11-01T10:00:00',
  action: 'LOGIN_SUCCESS',
  actorId: 'actor-1',
  actorName: 'Ana',
  actorRole: 'USER',
  targetId: null,
  ...overrides
})

describe('logsApi (real mode)', () => {
  beforeEach(() => get.mockReset())

  it('maps audit entries to log entries', async () => {
    get.mockResolvedValue([dto({ actorRole: 'ADMIN', action: 'APPROVE', targetId: 't-1' })])

    const [entry] = await logsApi.getAll()

    expect(get).toHaveBeenCalledWith('/audit-logs')
    expect(entry).toMatchObject({
      id: 0,
      userUuid: 'actor-1',
      userRole: 'admin',
      actionType: 'approve',
      details: 'Alvo: t-1',
      targetUuid: 't-1'
    })
  })

  it('flags an actor anonymizing their own account as a self delete', async () => {
    get.mockResolvedValue([dto({ action: 'ANONYMIZE', actorId: 'same', targetId: 'same' })])

    const [entry] = await logsApi.getAll()

    expect(entry.actionType).toBe('delete')
  })

  it('keeps anonymize for another target and tolerates missing actor data', async () => {
    get.mockResolvedValue([
      dto({ action: 'ANONYMIZE', actorId: null, actorName: null, actorRole: null, targetId: 'other' })
    ])

    const [entry] = await logsApi.getAll()

    expect(entry).toMatchObject({ actionType: 'anonymize', userName: '', userUuid: '', userRole: 'user' })
  })
})
