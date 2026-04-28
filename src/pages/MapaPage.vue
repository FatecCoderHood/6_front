<template>
  <div class="mapa-page">
    <SidebarFilters @aplicar-filtros="aplicarFiltros" />
    <MapView
      :filtros="filtros"
      :tam="tam"
      :sam="sam"
      @update-metricas="updateMetricas"
    />
    <div v-if="tam !== null && sam !== null" class="metrics-card">
      <div><b>TAM:</b> {{ tam }}</div>
      <div><b>SAM:</b> {{ sam }}</div>
    </div>
    <button v-if="tam !== null && sam !== null" class="btn-report-float" @click="showReport = true">
      <span>Gerar Relatório PDF</span>
    </button>
    <ReportModal
      v-if="showReport"
      :tam="tam"
      :sam="sam"
      :filtros="filtros"
      @close="showReport = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SidebarFilters from '../components/SidebarFilters.vue'
import MapView from '../components/MapView.vue'
import ReportModal from '../components/ReportModal.vue'

const filtros = ref({ 
  distribuidora: '', 
  situacao: '', 
  dataInicial: '', 
  dataFinal: '', 
  indicadores: { DEC: true, FEC: true }, 
  heatmap: false 
})
const tam = ref<number|null>(null)
const sam = ref<number|null>(null)
const showReport = ref(false)

function aplicarFiltros(f: any) {
  filtros.value = f
  tam.value = null
  sam.value = null
}

function updateMetricas({ tam: t, sam: s }: { tam: number, sam: number }) {
  tam.value = t
  sam.value = s
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

.metrics-card {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  color: #232323;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 12px 24px;
  font-size: 1rem;
  z-index: 1000;
  display: flex;
  gap: 24px;
  align-items: center;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-weight: 500;
  pointer-events: none;
}

.btn-report-float {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-report-float:hover {
  background: #1565c0;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}
</style>