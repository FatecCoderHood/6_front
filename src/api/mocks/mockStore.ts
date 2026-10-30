import type { ErrorResponse, TermsOfUseResponseDto, UserResponseDto } from '../types'

// Fake credentials for local mock mode only. Never real data.
export const MOCK_PASSWORD = '1234'
export const MOCK_TOKEN_PREFIX = 'mock-token:'

const ERROR_NAMES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity'
}

// Same shape axios rejects with, so pages keep reading `err.response.data.message`.
export function mockError(status: number, message: string) {
  const data: ErrorResponse = {
    status,
    error: ERROR_NAMES[status] ?? 'Error',
    message,
    timestamp: new Date().toISOString()
  }
  return Object.assign(new Error(message), { response: { status, data } })
}

const now = () => new Date().toISOString()

export const mockTerms: TermsOfUseResponseDto[] = [
  {
    id: '00000000-0000-4000-8000-0000000000a1',
    title: 'Terms of Service',
    content: 'Mock mandatory term.',
    type: 'MANDATORY',
    version: 1,
    active: true,
    createdAt: now()
  },
  {
    id: '00000000-0000-4000-8000-0000000000a2',
    title: 'Marketing Communications',
    content: 'Mock optional term.',
    type: 'NON_MANDATORY',
    version: 1,
    active: true,
    createdAt: now()
  }
]

export const mockUsers: Array<UserResponseDto & { password: string }> = [
  {
    id: '00000000-0000-4000-8000-0000000000b1',
    name: 'Mock Admin',
    email: 'admin@tecsys.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    rejectionReason: null,
    active: true,
    createdAt: now(),
    password: MOCK_PASSWORD
  },
  {
    id: '00000000-0000-4000-8000-0000000000b2',
    name: 'Mock User',
    email: 'user@tecsys.com',
    role: 'USER',
    status: 'ACTIVE',
    rejectionReason: null,
    active: true,
    createdAt: now(),
    password: MOCK_PASSWORD
  },
  {
    id: '00000000-0000-4000-8000-0000000000b3',
    name: 'Mock Pending',
    email: 'pending@tecsys.com',
    role: 'USER',
    status: 'PENDING',
    rejectionReason: null,
    active: true,
    createdAt: now(),
    password: MOCK_PASSWORD
  }
]

export const toUserDto = ({ password: _password, ...dto }: (typeof mockUsers)[number]): UserResponseDto => dto

export function currentMockUser() {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (!token?.startsWith(MOCK_TOKEN_PREFIX)) return undefined
  return mockUsers.find((u) => u.id === token.slice(MOCK_TOKEN_PREFIX.length))
}

export function requireMockAdmin() {
  const user = currentMockUser()
  if (!user) throw mockError(401, 'Authentication required')
  if (user.role !== 'ADMIN') throw mockError(403, 'Access denied')
  return user
}
