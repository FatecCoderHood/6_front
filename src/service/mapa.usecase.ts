import { mapaApi } from '../api/mapa.api'
import type { LinhaEnergia, GeoBounds, SsdmtGeoDto } from '../types/mapa.types'

class MapaUseCase {
  private cache: Map<string, LinhaEnergia[]> = new Map()
  private currentYear: number = 2025

  private getCacheKey(year: number, bounds: GeoBounds): string {
    return `${year}|${bounds.minx},${bounds.miny},${bounds.maxx},${bounds.maxy}`
  }

  private parseGeometry(geoJsonString: string): [number, number][] {
    try {
      const geoJson = JSON.parse(geoJsonString)
      
      if (geoJson.type === 'MultiLineString') {
        if (geoJson.coordinates?.[0]) {
          return geoJson.coordinates[0].map((coord: number[]) => [coord[0], coord[1]])
        }
      } else if (geoJson.type === 'LineString') {
        return geoJson.coordinates.map((coord: number[]) => [coord[0], coord[1]])
      }
    } catch (e) {
      console.error('Erro ao parsear GeoJSON:', e)
    }
    return []
  }

  private convertToLinhaEnergia(dto: SsdmtGeoDto): LinhaEnergia | null {
    const coordinates = this.parseGeometry(dto.geom)
    
    if (coordinates.length === 0) {
      console.warn(`⚠️ Linha ${dto.conjuntoId} sem coordenadas válidas`)
      return null
    }
    
    return {
      id: dto.conjuntoId,
      name: `Conjunto ${dto.conjuntoId}`,
      coordinates,
      dec_realizado: dto.decRealizado || 0,
      dec_limite: dto.decLimite || 6.5,
      fec_realizado: dto.fecRealizado || 0,
      fec_limite: dto.fecLimite || 3.2,
      desvio_dec: dto.desvioDec || 0,
      desvio_fec: dto.desvioFec || 0,
      score: dto.score || 0
    }
  }

  async loadLinhas(year: number, bounds: GeoBounds): Promise<LinhaEnergia[]> {
    const cacheKey = this.getCacheKey(year, bounds)
    
    // Verificar cache
    if (this.cache.has(cacheKey)) {
      console.log('✅ Cache hit:', cacheKey)
      return this.cache.get(cacheKey)!
    }
    
    console.log('🔄 Cache miss, buscando dados da API...')
    
    const data = await mapaApi.getGeoData({ year, ...bounds })
    
    const linhas = data
      .map(dto => this.convertToLinhaEnergia(dto))
      .filter((item): item is LinhaEnergia => item !== null)
    
    // Salvar no cache
    this.cache.set(cacheKey, linhas)
    console.log(`💾 Cache salvo: ${linhas.length} linhas`)
    
    return linhas
  }

  clearCache(): void {
    this.cache.clear()
    console.log('🗑️ Cache limpo')
  }

  async preloadProximasAreas(year: number, boundsAtuais: GeoBounds): Promise<void> {
    // Lógica para pré-carregar áreas vizinhas
    const offsets = [[-10, -10], [-10, 10], [10, -10], [10, 10]]
    
    for (const [dx, dy] of offsets) {
      const boundsVizinhas: GeoBounds = {
        minx: boundsAtuais.minx + dx,
        miny: boundsAtuais.miny + dy,
        maxx: boundsAtuais.maxx + dx,
        maxy: boundsAtuais.maxy + dy
      }
      
      const cacheKey = this.getCacheKey(year, boundsVizinhas)
      if (!this.cache.has(cacheKey)) {
        this.loadLinhas(year, boundsVizinhas).catch(err => 
          console.warn('Pré-carga falhou:', err)
        )
      }
    }
  }
}

export const mapaUseCase = new MapaUseCase()