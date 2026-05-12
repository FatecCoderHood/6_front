// src/service/data.ts
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

export interface SsdmtGeoDto {
  conjuntoId: number
  geom: string
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
  name: string
  coordinates: [number, number][]
  dec_realizado: number
  dec_limite: number
  fec_realizado: number
  fec_limite: number
  desvio_dec: number
  desvio_fec: number
  score: number
}

// Cache para dados carregados
let cachedLinhas: LinhaEnergia[] = []
let currentBoundsKey: string = ''
let currentYear: number = 2025

export async function fetchGeoData(params: {
  year: number
  minx: number
  miny: number
  maxx: number
  maxy: number
}): Promise<LinhaEnergia[]> {
  try {
    console.log('🟡 Buscando dados da API:', params)
    
    const response = await axios.get<SsdmtGeoDto[]>(`${API_BASE_URL}/geo`, {
      params: {
        year: params.year,
        minx: params.minx,
        miny: params.miny,
        maxx: params.maxx,
        maxy: params.maxy
      }
    })
    
    console.log('🟢 API retornou', response.data.length, 'itens')
    
    // Converter os dados da API para o formato esperado
    const linhas = response.data
      .map((item) => {
        // Parse do GeoJSON
        let coordinates: [number, number][] = []
        try {
          const geoJson = JSON.parse(item.geom)
          
          if (geoJson.type === 'MultiLineString') {
            if (geoJson.coordinates && geoJson.coordinates.length > 0) {
              coordinates = geoJson.coordinates[0].map((coord: number[]) => [coord[0], coord[1]])
            }
          } else if (geoJson.type === 'LineString') {
            coordinates = geoJson.coordinates.map((coord: number[]) => [coord[0], coord[1]])
          }
        } catch (e) {
          console.error('Erro ao parsear GeoJSON:', e)
        }
        
        if (coordinates.length === 0) {
          console.warn(`⚠️ Linha ${item.conjuntoId} sem coordenadas válidas`)
          return null
        }
        
        return {
          id: item.conjuntoId,
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
      })
      .filter((item): item is LinhaEnergia => item !== null)
    
    console.log(`🟢 Convertidas ${linhas.length} linhas válidas`)
    return linhas
  } catch (error) {
    console.error('🔴 Erro ao buscar dados geoespaciais:', error)
    return []
  }
}

// Linhas de energia (serão preenchidas pela API)
export let linhasEnergia: LinhaEnergia[] = []

// Função para carregar dados da API
export async function loadLinhasEnergia(
  year: number,
  bounds: { minx: number; miny: number; maxx: number; maxy: number }
): Promise<LinhaEnergia[]> {
  const boundsKey = `${bounds.minx},${bounds.miny},${bounds.maxx},${bounds.maxy}`
  
  console.log('📦 Cache atual:', { currentBoundsKey, currentYear })
  console.log('📦 Nova requisição:', { boundsKey, year })
  
  // Se os bounds ou ano mudaram, buscar novos dados
  if (currentBoundsKey !== boundsKey || currentYear !== year) {
    console.log('🔄 Cache miss, buscando dados...')
    currentBoundsKey = boundsKey
    currentYear = year
    cachedLinhas = await fetchGeoData({ year, ...bounds })
  } else {
    console.log('✅ Cache hit, usando dados cacheados')
  }
  
  return cachedLinhas
}

// Função para atualizar as linhas globais
export async function updateLinhasEnergia(
  year: number,
  bounds: { minx: number; miny: number; maxx: number; maxy: number }
) {
  console.log('🔄 updateLinhasEnergia chamado')
  linhasEnergia = await loadLinhasEnergia(year, bounds)
  console.log(`✅ linhasEnergia atualizado com ${linhasEnergia.length} linhas`)
  return linhasEnergia
}