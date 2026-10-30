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
          const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
          if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
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
        // An expired or invalid token ends the session; a failed login (also 401) must reach the form.
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
          ['auth_token', 'user_data'].forEach((key) => {
            localStorage.removeItem(key)
            sessionStorage.removeItem(key)
          })
          if (window.location.pathname !== '/login') window.location.assign('/login')
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

export const apiClient = new ApiClient()