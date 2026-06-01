// src/api/client.ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { API_CONFIG } from '../config/api.config'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS
    })

    // Attach auth token from storage if available
    this.client.interceptors.request.use(
      (config) => {
        try {
          const raw = localStorage.getItem('auth') || sessionStorage.getItem('auth')
          if (raw) {
            const auth = JSON.parse(raw)
            if (auth && auth.token) {
              config.headers = config.headers || {}
              config.headers.Authorization = `Bearer ${auth.token}`
            }
          }
        } catch (e) {
          // ignore parse errors
        }
        console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('🔴 API Error:', error.response?.data || error.message)
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

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()