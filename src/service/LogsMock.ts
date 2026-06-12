// src/service/LogsMock.ts

export interface LogEntry {
  id: number
  timestamp: string
  userName: string
  userUuid: string
  userRole: 'admin' | 'user'
  action: string
  actionType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'login' | 'logout' | 'anonymize'
  details: string
  targetUuid?: string
  ip?: string
}

const getTimestamp = () => {
  return new Date().toISOString()
}

export const formatLogDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Gerar UUIDs para os usuários iniciais
const adminUuid = 'admin-550e8400-e29b-41d4-a716-446655440000'
const userUuid = 'user-550e8400-e29b-41d4-a716-446655440001'

const initialLogs: LogEntry[] = [
  {
    id: 1,
    timestamp: '2024-01-01T10:00:00.000Z',
    userName: 'Administrador',
    userUuid: adminUuid,
    userRole: 'admin',
    action: 'Login',
    actionType: 'login',
    details: 'Usuário realizou login no sistema',
    ip: '192.168.1.100'
  },
  {
    id: 2,
    timestamp: '2024-01-01T10:30:00.000Z',
    userName: 'Administrador',
    userUuid: adminUuid,
    userRole: 'admin',
    action: 'Aprovação de Usuário',
    actionType: 'approve',
    details: 'Aprovou usuário: user-550e8400-e29b-41d4-a716-446655440002',
    targetUuid: 'user-550e8400-e29b-41d4-a716-446655440002',
    ip: '192.168.1.100'
  },
  {
    id: 3,
    timestamp: '2024-01-02T14:20:00.000Z',
    userName: 'Administrador',
    userUuid: adminUuid,
    userRole: 'admin',
    action: 'Edição de Usuário',
    actionType: 'update',
    details: 'Editou usuário: user-550e8400-e29b-41d4-a716-446655440003',
    targetUuid: 'user-550e8400-e29b-41d4-a716-446655440003',
    ip: '192.168.1.100'
  },
  {
    id: 4,
    timestamp: '2024-01-03T09:15:00.000Z',
    userName: 'Usuário Comum',
    userUuid: userUuid,
    userRole: 'user',
    action: 'Login',
    actionType: 'login',
    details: 'Usuário realizou login no sistema',
    ip: '192.168.1.101'
  },
]

const loadLogs = (): LogEntry[] => {
  const stored = localStorage.getItem('enersigh_logs')
  if (stored) {
    return JSON.parse(stored)
  }
  return JSON.parse(JSON.stringify(initialLogs))
}

const saveLogs = (logsData: LogEntry[]) => {
  localStorage.setItem('enersigh_logs', JSON.stringify(logsData))
}

let logs: LogEntry[] = loadLogs()
let nextId = Math.max(...logs.map(l => l.id), 0) + 1

export const LogsMock = {
  getAll: (): LogEntry[] => {
    return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },

  getByUser: (uuid: string): LogEntry[] => {
    return logs.filter(l => l.userUuid === uuid).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },

  getByActionType: (actionType: string): LogEntry[] => {
    return logs.filter(l => l.actionType === actionType).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },

  add: (log: Omit<LogEntry, 'id' | 'timestamp'>): LogEntry => {
    const newLog: LogEntry = {
      id: nextId++,
      timestamp: getTimestamp(),
      ...log
    }
    logs.push(newLog)
    saveLogs(logs)
    return newLog
  },

  registerAction: (userUuid: string, userName: string, userRole: 'admin' | 'user', action: string, actionType: LogEntry['actionType'], targetUuid?: string, ip?: string) => {
    let details = ''
    
    switch(actionType) {
      case 'approve':
        details = `Aprovou usuário: ${targetUuid}`
        break
      case 'reject':
        details = `Recusou usuário: ${targetUuid}`
        break
      case 'delete':
        details = `Excluiu usuário: ${targetUuid}`
        break
      case 'create':
        details = `Criou usuário: ${targetUuid}`
        break
      case 'update':
        details = `Editou usuário: ${targetUuid}`
        break
      case 'anonymize':
        details = `Anonimizou usuário: ${targetUuid}`
        break
      case 'login':
        details = `Usuário realizou login no sistema`
        break
      case 'logout':
        details = `Usuário realizou logout do sistema`
        break
      default:
        details = action
    }
    
    return LogsMock.add({
      userName: userName,
      userUuid: userUuid,
      userRole: userRole,
      action: action,
      actionType: actionType,
      details: details,
      targetUuid: targetUuid,
      ip: ip || '127.0.0.1'
    })
  },

  clear: () => {
    logs = []
    nextId = 1
    saveLogs(logs)
  },

  reset: () => {
    logs = JSON.parse(JSON.stringify(initialLogs))
    nextId = Math.max(...logs.map(l => l.id), 0) + 1
    saveLogs(logs)
  }
}

export default LogsMock