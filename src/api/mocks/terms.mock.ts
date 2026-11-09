import type { TermsApi } from '../types'
import { mockTerms } from './mockStore'

export const termsMock: TermsApi = {
  async getAll() {
    return mockTerms
  }
}
