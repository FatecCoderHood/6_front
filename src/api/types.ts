// Shapes mirror the backend DTOs (backend/enersight-api, package com.enersight.dto).
export type UserRole = 'USER' | 'ADMIN'

export type UserStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'ANONYMIZED'

export type TermType = 'MANDATORY' | 'NON_MANDATORY'

export interface UserResponseDto {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  rejectionReason: string | null
  active: boolean
  createdAt: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponseDto {
  token: string
  tokenType: string
  user: UserResponseDto
}

export interface UserRegisterRequestDto {
  name: string
  email: string
  password: string
  acceptedTermIds: string[]
}

export interface TermsOfUseResponseDto {
  id: string
  title: string
  content: string
  type: TermType
  version: number
  active: boolean
  createdAt: string
}

export interface ErrorResponse {
  status: number
  error: string
  message: string
  timestamp: string
}

export interface AuthApi {
  login(payload: LoginRequest): Promise<LoginResponseDto>
}

export interface UsersApi {
  getAll(status?: UserStatus): Promise<UserResponseDto[]>
  getById(id: string): Promise<UserResponseDto>
  register(payload: UserRegisterRequestDto): Promise<UserResponseDto>
  approveUser(id: string): Promise<UserResponseDto>
  rejectUser(id: string, reason: string): Promise<UserResponseDto>
  anonymizeUser(id: string): Promise<void>
  deleteMe(): Promise<void>
}

export interface TermsApi {
  getAll(): Promise<TermsOfUseResponseDto[]>
}

export type AuditAction = 'REGISTER' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'APPROVE' | 'REJECT' | 'ANONYMIZE'

export interface AuditLogResponseDto {
  id: string
  createdAt: string
  action: AuditAction
  actorId: string | null
  actorName: string | null
  actorRole: UserRole | null
  targetId: string | null
}
