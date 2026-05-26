import { apiClient } from './client'
import type { SsdmtGeoDto, GeoParams } from '../types/mapa.types'

export const mapaApi = {
  async getGeoData(params: GeoParams): Promise<SsdmtGeoDto[]> {
    return apiClient.get<SsdmtGeoDto[]>('/geo', { params })
  },
  
  // Outros endpoints do mapa (exemplo)
  async getLinhaById(id: number): Promise<SsdmtGeoDto> {
    return apiClient.get<SsdmtGeoDto>(`/geo/${id}`)
  },
  
  async getEstatisticas(params: { year: number }): Promise<any> {
    return apiClient.get('/geo/estatisticas', { params })
  }
}