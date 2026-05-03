<template>
  <div class="mapa-page">
    <SidebarFilters @aplicar-filtros="aplicarFiltros" />
    <MapView
      :filtros="filtros"
      :tam="tam"
      :sam="sam"
      @update-metricas="updateMetricas"
    />
    
    <!-- Componente flutuante expansível -->
    <FloatingMetrics
      v-if="tam !== null && sam !== null"
      :tam="tam"
      :sam="sam"
      :dec="dec"
      :fec="fec"
      :decLimite="decLimite"
      :fecLimite="fecLimite"
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
    DEC_realizado: false,
    DEC_limite: false,
    Desvio_DEC: false
  },
  indicadoresFEC: {
    FEC: true,
    FEC_realizado: false,
    FEC_limite: false,
    Desvio_FEC: false
  },
  heatmap: false,
  mostrarTorres: true
})

const tam = ref<number|null>(null)
const sam = ref<number|null>(null)
const dec = ref<number>(7.68)
const fec = ref<number>(3.68)
const decLimite = ref<number>(6.50)
const fecLimite = ref<number>(3.20)

function aplicarFiltros(f: any) {
  filtros.value = f
  tam.value = null
  sam.value = null
}

function updateMetricas({ tam: t, sam: s }: { tam: number, sam: number }) {
  tam.value = t
  sam.value = s
}

function fecharMetricas() {
  tam.value = null
  sam.value = null
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