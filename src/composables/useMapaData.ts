// src/composables/useMapaData.ts
import { ref, readonly } from 'vue'
import { mapaUseCase } from '../service/mapa.usecase'
import type { LinhaEnergia, GeoBounds } from '../types/mapa.types'

export function useMapaData() {
  const linhas = ref<LinhaEnergia[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadData(year: number, bounds: GeoBounds) {
    isLoading.value = true
    error.value = null
    
    try {
      linhas.value = await mapaUseCase.loadLinhas(year, bounds)
      return linhas.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar dados'
      console.error('Erro no useMapaData:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  function clearCache() {
    mapaUseCase.clearCache()
  }

  return {
    linhas: readonly(linhas),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadData,
    clearCache
  }
}