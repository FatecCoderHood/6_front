// src/api/client.ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { API_CONFIG, AUTH_API_CONFIG } from '../config/api.config'

type RetryableRequestConfig = AxiosRequestConfig & { _retried?: boolean }

// A 401 from one of enersight-auth's own public auth endpoints means "these credentials/this
// token are invalid", never "the access token expired" — refreshing and retrying would either be
// meaningless (login/register) or risk recursing into /auth/refresh itself.
const AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']

class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string, timeout: number, headers: Record<string, string>) {
    this.client = axios.create({ baseURL, timeout, headers })

    // Attach the token persisted by auth.usecase.ts, if any
    this.client.interceptors.request.use(
      (config) => {
        try {
          const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
          if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch (e) {
          // ignore storage access errors
        }
        console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error('🔴 API Error:', error.response?.data || error.message)

        const original = error.config as RetryableRequestConfig | undefined
        const isExemptEndpoint = AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH.some((path) => original?.url?.includes(path))

        if (error.response?.status === 401 && original && !original._retried && !isExemptEndpoint) {
          original._retried = true

          // Dynamic import: auth.usecase.ts -> auth.api.ts -> client.ts is a real circular
          // dependency at the module level; resolving it lazily here (only once a 401 actually
          // happens) sidesteps load-order issues a static top-level import would risk.
          const { default: authUsecase } = await import('../service/auth.usecase')
          const newToken = await authUsecase.refreshAccessToken()

          if (newToken) {
            original.headers = original.headers || {}
            original.headers.Authorization = `Bearer ${newToken}`
            return this.client.request(original)
          }

          await authUsecase.logout()
          const { default: router } = await import('../routes')
          router.push('/login')
        }

        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL, API_CONFIG.TIMEOUT, API_CONFIG.HEADERS)

// enersight-auth (Identity Provider) — separate service, separate base URL.
export const authClient = new ApiClient(AUTH_API_CONFIG.BASE_URL, AUTH_API_CONFIG.TIMEOUT, AUTH_API_CONFIG.HEADERS)