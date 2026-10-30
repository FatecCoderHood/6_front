import { apiClient } from './client'
import { USE_MOCKS } from '../config/api.config'
import LogsMock, { type LogEntry } from '../service/LogsMock'
import type { AuditAction, AuditLogResponseDto } from './types'

export interface LogsApi {
  getAll(): Promise<LogEntry[]>
}

const ACTIONS: Record<AuditAction, { label: string; type: LogEntry['actionType'] }> = {
  REGISTER: { label: 'Cadastro de Usuário', type: 'create' },
  LOGIN_SUCCESS: { label: 'Login', type: 'login' },
  LOGIN_FAILURE: { label: 'Falha de Login', type: 'login' },
  APPROVE: { label: 'Aprovação de Usuário', type: 'approve' },
  REJECT: { label: 'Recusa de Usuário', type: 'reject' },
  ANONYMIZE: { label: 'Anonimização de Usuário', type: 'anonymize' }
}

// An actor who anonymizes their own account is shown by the page as "deleted user" (no personal data).
const SELF_DELETE_LABEL = 'Exclusão de Conta Própria'

const toLogEntry = (dto: AuditLogResponseDto, index: number): LogEntry => {
  const isSelfDelete = dto.action === 'ANONYMIZE' && dto.actorId !== null && dto.actorId === dto.targetId
  const { label, type } = ACTIONS[dto.action]
  return {
    id: index,
    timestamp: dto.createdAt,
    userName: dto.actorName ?? '',
    userUuid: dto.actorId ?? '',
    userRole: dto.actorRole === 'ADMIN' ? 'admin' : 'user',
    action: isSelfDelete ? SELF_DELETE_LABEL : label,
    actionType: isSelfDelete ? 'delete' : type,
    details: dto.targetId ? `Alvo: ${dto.targetId}` : '',
    targetUuid: dto.targetId ?? undefined
  }
}

const logsReal: LogsApi = {
  async getAll() {
    const entries = await apiClient.get<AuditLogResponseDto[]>('/audit-logs')
    return entries.map(toLogEntry)
  }
}

const logsMock: LogsApi = {
  async getAll() {
    return LogsMock.getAll()
  }
}

export const logsApi: LogsApi = USE_MOCKS ? logsMock : logsReal

export default logsApi
