// src/service/UsersMock.ts

import LogsMock from './LogsMock'

export interface MockUser {
  id: number
  uuid: string
  name: string
  email: string
  password: string
  phone: string
  role: 'admin' | 'user'
  status: 'approved' | 'pending' | 'deleted'
  createdAt: string
  termsAccepted: boolean
  privacyAccepted: boolean
  communicationsAccepted: boolean
  deletedAt?: string
}

// Gerar UUID simples
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Usuários iniciais com UUID
const initialUsers: MockUser[] = [
  {
    id: 1,
    uuid: "ad-550e8400-e29b-41d4-a716-446655440000",
    name: 'Administrador',
    email: 'admin@tecsys.com',
    password: '1234',
    phone: '(11) 99999-0001',
    role: 'admin',
    status: 'approved',
    createdAt: new Date('2026-05-01').toISOString(),
    termsAccepted: true,
    privacyAccepted: true,
    communicationsAccepted: true
  },
  {
    id: 2,
    uuid: "us-550e8400-e29b-41d4-a716-446655440001",
    name: 'Usuário Comum',
    email: 'user@tecsys.com',
    password: '1234',
    phone: '(11) 99999-0002',
    role: 'user',
    status: 'approved',
    createdAt: new Date('2026-05-02').toISOString(),
    termsAccepted: true,
    privacyAccepted: true,
    communicationsAccepted: false
  }
]

const loadUsers = (): MockUser[] => {
  const stored = localStorage.getItem('enersigh_users')
  if (stored) {
    return JSON.parse(stored)
  }
  return JSON.parse(JSON.stringify(initialUsers))
}

const saveUsers = (users: MockUser[]) => {
  localStorage.setItem('enersigh_users', JSON.stringify(users))
}

let users: MockUser[] = loadUsers()
let nextId = Math.max(...users.map(u => u.id), 0) + 1

export const MockUsers = {
  getAll: (includeDeleted: boolean = false): MockUser[] => {
    if (includeDeleted) {
      return [...users]
    }
    return users.filter(u => u.status !== 'deleted')
  },

  getById: (id: number): MockUser | undefined => {
    return users.find(u => u.id === id)
  },

  getByUuid: (uuid: string): MockUser | undefined => {
    return users.find(u => u.uuid === uuid)
  },

  getByEmail: (email: string): MockUser | undefined => {
    return users.find(u => u.email === email)
  },

  create: (userData: Omit<MockUser, 'id' | 'uuid' | 'createdAt' | 'status'>): MockUser => {
    const newUser: MockUser = {
      id: nextId++,
      uuid: generateUUID(),
      ...userData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    saveUsers(users)
    return newUser
  },

  update: (id: number, updates: Partial<MockUser>): MockUser | null => {
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null
    users[index] = { ...users[index], ...updates }
    saveUsers(users)
    return users[index]
  },

  softDelete: (id: number): MockUser | null => {
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null
    const deletedUser = { 
      ...users[index], 
      status: 'deleted' as const,
      deletedAt: new Date().toISOString()
    }
    users[index] = deletedUser
    saveUsers(users)
    return deletedUser
  },

  hardDelete: (id: number): boolean => {
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return false
    users.splice(index, 1)
    saveUsers(users)
    return true
  },

  approve: (id: number): MockUser | null => {
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null
    users[index] = { ...users[index], status: 'approved' }
    saveUsers(users)
    return users[index]
  },

  reject: (id: number): boolean => {
    return MockUsers.hardDelete(id)
  },

  authenticate: (email: string, password: string): MockUser | null => {
    const user = users.find(u => u.email === email && u.password === password)
    if (user && user.status === 'approved') {
      return user
    }
    return null
  },

  reset: () => {
    users = JSON.parse(JSON.stringify(initialUsers))
    nextId = Math.max(...users.map(u => u.id), 0) + 1
    saveUsers(users)
  }
}

export default MockUsers