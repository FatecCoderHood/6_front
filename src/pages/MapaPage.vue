<template>
  <div class="mapa-page">
    <SidebarFilters @aplicar-filtros="aplicarFiltros" />
    <MapView
      ref="mapViewRef"
      :filtros="filtros"
      @update-metricas="updateMetricas"
    />
    
    <FloatingMetrics
      :key="componentKey"
      v-if="metricas.tam !== 0 && metricas.sam !== 0"
      :tam="metricas.tam"
      :sam="metricas.sam"
      :dec="metricas.dec"
      :fec="metricas.fec"
      :decLimite="metricas.decLimite"
      :fecLimite="metricas.fecLimite"
      :totalLinhas="metricas.totalLinhas"
      :area="metricas.area"
      :distribuidora="metricas.distribuidora"
      :polygonImage="polygonImage"
      @close="fecharMetricas"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SidebarFilters from '../components/SidebarFilters.vue'
import MapView from '../components/MapView.vue'
import FloatingMetrics from '../components/FloatingMetrics.vue'
import html2canvas from 'html2canvas'

const mapViewRef = ref<InstanceType<typeof MapView> | null>(null)
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

const componentKey = ref(0)
const polygonImage = ref('')

const metricas = ref({
  tam: 0,
  sam: 0,
  dec: 0,
  fec: 0,
  decLimite: 6.5,
  fecLimite: 3.2,
  totalLinhas: 0,
  area: 0,
  distribuidora: ''
})

async function capturarImagemPoligono() {
  // Pega o elemento do mapa
  const mapElement = document.querySelector('#map')
  if (!mapElement) return ''
  
  try {
    const canvas = await html2canvas(mapElement as HTMLElement, {
      scale: 0.5,
      backgroundColor: '#1a1a1a',
      useCORS: true
    })
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Erro ao capturar imagem:', error)
    return ''
  }
}

async function updateMetricas(data: any) {
  console.log('MapaPage recebeu novas métricas:', data)
  
  // Captura a imagem do mapa
  const imagem = await capturarImagemPoligono()
  polygonImage.value = imagem
  
  metricas.value = {
    tam: data.tam,
    sam: data.sam,
    dec: data.dec,
    fec: data.fec,
    decLimite: data.decLimite,
    fecLimite: data.fecLimite,
    totalLinhas: data.totalLinhas || 0,
    area: data.area || 0,
    distribuidora: data.distribuidora || ''
  }
  componentKey.value++
}

function aplicarFiltros(f: any) {
  filtros.value = f
  componentKey.value++
  polygonImage.value = ''
}

function fecharMetricas() {
  componentKey.value++
  polygonImage.value = ''
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