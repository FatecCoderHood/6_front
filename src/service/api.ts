// src/services/api.ts
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

export interface SsdmtGeoDto {
  conjuntoId: number
  geom: string  // GeoJSON string
  decLimite: number | null
  fecLimite: number | null
  decRealizado: number | null
  fecRealizado: number | null
  desvioDec: number | null
  desvioFec: number | null
  score: number | null
}

export interface LinhaEnergia {
  id: number
  distribuidoraId: number
  name: string
  coordinates: [number, number][] // array de [lng, lat]
  dec_realizado: number
  dec_limite: number
  fec_realizado: number
  fec_limite: number
  desvio_dec: number
  desvio_fec: number
  score: number
}

export interface GeoParams {
  year: number
  minx: number
  miny: number
  maxx: number
  maxy: number
}

export async function fetchGeoData(params: GeoParams): Promise<LinhaEnergia[]> {
  try {
    const response = await axios.get<SsdmtGeoDto[]>(`${API_BASE_URL}/geo`, {
      params: {
        year: params.year,
        minx: params.minx,
        miny: params.miny,
        maxx: params.maxx,
        maxy: params.maxy
      }
    })
    
    // Converter os dados da API para o formato esperado pelo MapView
    const linhas = response.data.map((item) => {
      // Parse do GeoJSON
      let coordinates: [number, number][] = []
      try {
        const geoJson = JSON.parse(item.geom)
        
        // O GeoJSON pode ser MultiLineString ou LineString
        if (geoJson.type === 'MultiLineString') {
          // Pega a primeira linha do MultiLineString
          if (geoJson.coordinates && geoJson.coordinates.length > 0) {
            coordinates = geoJson.coordinates[0].map((coord: number[]) => [coord[0], coord[1]])
          }
        } else if (geoJson.type === 'LineString') {
          coordinates = geoJson.coordinates.map((coord: number[]) => [coord[0], coord[1]])
        }
      } catch (e) {
        console.error('Erro ao parsear GeoJSON:', e)
      }
      
      // Mapear distribuidora com base no conjuntoId (ajuste conforme sua lógica)
      // Você pode ter uma API separada para distribuidoras ou mapear aqui
      let distribuidoraId = 1
      if (item.conjuntoId) {
        if (item.conjuntoId <= 10000) distribuidoraId = 1
        else if (item.conjuntoId <= 20000) distribuidoraId = 2
        else distribuidoraId = 3
      }
      
      return {
        id: item.conjuntoId,
        distribuidoraId: distribuidoraId,
        name: `Conjunto ${item.conjuntoId}`,
        coordinates: coordinates,
        dec_realizado: item.decRealizado || 0,
        dec_limite: item.decLimite || 6.5,
        fec_realizado: item.fecRealizado || 0,
        fec_limite: item.fecLimite || 3.2,
        desvio_dec: item.desvioDec || 0,
        desvio_fec: item.desvioFec || 0,
        score: item.score || 0
      }
    }).filter(linha => linha.coordinates.length > 0) // Remove linhas sem coordenadas
    
    console.log(`Carregadas ${linhas.length} linhas da API`)
    return linhas
  } catch (error) {
    console.error('Erro ao buscar dados geoespaciais:', error)
    return []
  }
}