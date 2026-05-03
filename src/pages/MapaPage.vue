<template>
  <div class="mapa-page">
    <SidebarFilters @aplicar-filtros="aplicarFiltros" />
    <MapView
      :filtros="filtros"
      @update-metricas="updateMetricas"
    />
    
    <FloatingMetrics
      v-if="mostrarMetricas"
      :tam="metricas.tam"
      :sam="metricas.sam"
      :dec="metricas.dec"
      :fec="metricas.fec"
      :decLimite="metricas.decLimite"
      :fecLimite="metricas.fecLimite"
      @close="fecharMetricas"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SidebarFilters from '../components/SidebarFilters.vue'
import MapView from '../components/MapView.vue'
import FloatingMetrics from '../components/FloatingMetrics.vue'

const filtros = ref({ 
  distribuidoras: [],
  indicadoresDEC: {
    DEC: true,
    DEC_realizado: true,
    DEC_limite: false,
    Desvio_DEC: false
  },
  indicadoresFEC: {
    FEC: true,
    FEC_realizado: true,
    FEC_limite: false,
    Desvio_FEC: false
  },
  heatmap: false,
  mostrarTorres: true,
  periodo: 'Junho/2024'
})

const mostrarMetricas = ref(false)
let timeoutId: any = null

const metricas = ref({
  tam: 0,
  sam: 0,
  dec: 0,
  fec: 0,
  decLimite: 6.5,
  fecLimite: 3.2
})

function aplicarFiltros(f: any) {
  filtros.value = f
  // Fecha o painel ao aplicar filtros
  mostrarMetricas.value = false
  metricas.value = {
    tam: 0,
    sam: 0,
    dec: 0,
    fec: 0,
    decLimite: 6.5,
    fecLimite: 3.2
  }
}

function updateMetricas(data: any) {
  console.log('MapaPage recebeu novas métricas:', data)
  
  // Primeiro, esconde o painel atual
  mostrarMetricas.value = false
  
  // Pequeno delay para garantir que o componente foi destruído
  if (timeoutId) clearTimeout(timeoutId)
  
  timeoutId = setTimeout(() => {
    // Atualiza os dados
    metricas.value = {
      tam: data.tam,
      sam: data.sam,
      dec: data.dec,
      fec: data.fec,
      decLimite: data.decLimite,
      fecLimite: data.fecLimite
    }
    // Mostra o painel com os novos dados
    mostrarMetricas.value = true
    timeoutId = null
  }, 50)
}

function fecharMetricas() {
  mostrarMetricas.value = false
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.mapa-page {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
</style>