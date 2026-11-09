import { apiClient } from './client'
import { USE_MOCKS } from '../config/api.config'
import { termsMock } from './mocks/terms.mock'
import type { TermsApi, TermsOfUseResponseDto } from './types'

const termsReal: TermsApi = {
  getAll: () => apiClient.get<TermsOfUseResponseDto[]>('/terms')
}

export const termsApi: TermsApi = USE_MOCKS ? termsMock : termsReal

export default termsApi
