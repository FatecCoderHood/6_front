<template>
  <div class="mapa-page">
    <SidebarFilters @aplicar-filtros="aplicarFiltros" />
    <MapView
      :filtros="filtros"
      @update-metricas="updateMetricas"
    />
    
    <FloatingMetrics
      v-if="metricas.tam !== null && metricas.sam !== null"
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

const metricas = ref({
  tam: null as number | null,
  sam: null as number | null,
  dec: 0,
  fec: 0,
  decLimite: 6.5,
  fecLimite: 3.2
})

function aplicarFiltros(f: any) {
  filtros.value = f
  metricas.value = {
    tam: null,
    sam: null,
    dec: 0,
    fec: 0,
    decLimite: 6.5,
    fecLimite: 3.2
  }
}

function updateMetricas(data: any) {
  metricas.value = {
    tam: data.tam,
    sam: data.sam,
    dec: data.dec,
    fec: data.fec,
    decLimite: data.decLimite,
    fecLimite: data.fecLimite
  }
}

function fecharMetricas() {
  metricas.value.tam = null
  metricas.value.sam = null
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