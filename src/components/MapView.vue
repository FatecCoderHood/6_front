<template>
  <div id="map" style="height: 100vh; width: 100%; position: absolute; top: 0; left: 0;"></div>
  <Legend />
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <span>Carregando dados da região...</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import { updateLinhasEnergia, linhasEnergia } from '../service/data'
import Legend from './Legend.vue'

const props = defineProps<{ filtros: any }>()
const emit = defineEmits(['update-metricas'])

let map: L.Map
let drawnItems: L.FeatureGroup
let drawControl: any
let linesLayer: L.LayerGroup
const isLoading = ref(false)
const { t } = useI18n()

let lastLoadedBounds: any = null
let debounceTimeout: any = null
const MAX_LINHAS = 76000

function classificarCriticidade(score: number): string {
  if (score === 0) return 'Verde'
  if (score > 0 && score <= 10) return 'Laranja'
  return 'Vermelho'
}

const corMap: Record<string, string> = {
  'Verde': '#4CAF50',
  'Laranja': '#FF9800',
  'Vermelho': '#F44336'
}

function getCorPorScore(score: number): string {
  const categoria = classificarCriticidade(score)
  return corMap[categoria]
}

// Função para calcular área aproximada do polígono
function calcularAreaPoligono(polygonLayer: any): number {
  try {
    const bounds = polygonLayer.getBounds()
    if (bounds && bounds.getNorth && bounds.getSouth) {
      const latDiff = Math.abs(bounds.getNorth() - bounds.getSouth())
      const lngDiff = Math.abs(bounds.getEast() - bounds.getWest())
      // Área aproximada em km² (1 grau ~ 111km)
      return (latDiff * 111) * (lngDiff * 111)
    }
  } catch(e) {
    console.warn('Erro ao calcular área:', e)
  }
  return 0
}

async function carregarDados() {
  if (!map) return
  
  const bounds = map.getBounds()
  const year = props.filtros.ano || 2025
  
  const buffer = 0.05
  if (lastLoadedBounds) {
    const sameBounds = 
      Math.abs(lastLoadedBounds.minx - bounds.getWest()) < buffer &&
      Math.abs(lastLoadedBounds.miny - bounds.getSouth()) < buffer &&
      Math.abs(lastLoadedBounds.maxx - bounds.getEast()) < buffer &&
      Math.abs(lastLoadedBounds.maxy - bounds.getNorth()) < buffer
    
    if (sameBounds) {
      console.log('📦 Bounds similares, ignorando requisição')
      return
    }
  }
  
  lastLoadedBounds = {
    minx: bounds.getWest(),
    miny: bounds.getSouth(),
    maxx: bounds.getEast(),
    maxy: bounds.getNorth()
  }
  
  console.log('📡 Carregando dados da região visível...')
  isLoading.value = true
  
  await updateLinhasEnergia(year, {
    minx: bounds.getWest(),
    miny: bounds.getSouth(),
    maxx: bounds.getEast(),
    maxy: bounds.getNorth()
  })
  
  isLoading.value = false
  console.log(`📊 Carregadas ${linhasEnergia.length} linhas na região`)
  
  renderizarLinhas()
}

function carregarDadosDebounced() {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    carregarDados()
  }, 300)
}

function isPointInPolygon(point: [number, number], polygon: L.LatLng[][]): boolean {
  let inside = false
  const polygonPoints = polygon[0]
  for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
    const xi = polygonPoints[i].lat
    const yi = polygonPoints[i].lng
    const xj = polygonPoints[j].lat
    const yj = polygonPoints[j].lng
    
    const intersect = ((yi > point[1]) !== (yj > point[1])) &&
      (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

function lineIntersectsPolygon(lineCoords: [number, number][], polygon: L.LatLng[][]): boolean {
  for (const point of lineCoords) {
    if (isPointInPolygon(point, polygon)) {
      return true
    }
  }
  return false
}

function calculateRealMetricsFromPolygon(polygonLayer: any) {
  console.log('📐 Calculando métricas do polígono...')
  
  // Verificar se há pontos no polígono
  if (!polygonLayer.getLatLngs || polygonLayer.getLatLngs().length === 0) {
    console.warn('Polígono sem pontos')
    return null
  }
  
  const polygonLatLngs = polygonLayer.getLatLngs()
  
  // Calcular área usando função manual (não usar getArea)
  let area = 0
  try {
    const bounds = polygonLayer.getBounds()
    if (bounds && typeof bounds.getNorth === 'function') {
      const latDiff = Math.abs(bounds.getNorth() - bounds.getSouth())
      const lngDiff = Math.abs(bounds.getEast() - bounds.getWest())
      area = (latDiff * 111) * (lngDiff * 111) // km² aproximado
    }
  } catch(e) {
    area = 0
  }
  
  const linhasNoPoligono: typeof linhasEnergia = []
  
  for (const linha of linhasEnergia) {
    const lineLatLngs = linha.coordinates.map(coord => [coord[1], coord[0]]) as [number, number][]
    
    if (lineIntersectsPolygon(lineLatLngs, polygonLatLngs)) {
      linhasNoPoligono.push(linha)
    }
  }
  
  console.log(`📐 Linhas dentro do polígono: ${linhasNoPoligono.length}`)
  
  if (linhasNoPoligono.length === 0) return null
  
  let totalDEC = 0, totalFEC = 0, totalScore = 0, totalComprimento = 0
  
  for (const linha of linhasNoPoligono) {
    totalDEC += linha.dec_realizado
    totalFEC += linha.fec_realizado
    totalScore += linha.score
    totalComprimento += linha.coordinates.length
  }
  
  const count = linhasNoPoligono.length
  const tam = totalComprimento * 50
  const sam = totalComprimento * 25
  
  const result = {
    tam: tam,
    sam: sam,
    dec: totalDEC / count,
    fec: totalFEC / count,
    decLimite: linhasNoPoligono[0]?.dec_limite || 6.5,
    fecLimite: linhasNoPoligono[0]?.fec_limite || 3.2,
    score: totalScore / count,
    totalLinhas: count,
    area: area,
    distribuidora: 'Não disponível'
  }
  
  console.log('📊 Métricas calculadas:', result)
  return result
}

function renderizarLinhas() {
  if (!map) return
  
  if (linesLayer) linesLayer.clearLayers()
  else linesLayer = L.layerGroup().addTo(map)
  
  const linhasParaRenderizar = linhasEnergia.slice(0, MAX_LINHAS)
  
  if (linhasEnergia.length > MAX_LINHAS) {
    console.warn(`⚠️ ${linhasEnergia.length} linhas encontradas. Renderizando apenas ${MAX_LINHAS}.`)
  }
  
  console.log(`🎨 Renderizando ${linhasParaRenderizar.length} linhas`)
  
  linhasParaRenderizar.forEach(linha => {
    const cor = getCorPorScore(linha.score)
    const latLngs = linha.coordinates.map(coord => [coord[1], coord[0]])
    
    if (latLngs.length < 2) return
    
    const polyline = L.polyline(latLngs as L.LatLngExpression[], {
      color: cor,
      weight: 3,
      opacity: 0.8
    }).addTo(linesLayer)
    
    const categoria = classificarCriticidade(linha.score)
    let categoriaText = categoria === 'Verde' ? '✅ Boa disponibilidade' : 
                        categoria === 'Laranja' ? '⚠️ Atenção necessária' : '🔴 Restrição'
    
    let popupContent = `<b>${linha.name}</b><br><hr>`
    popupContent += `<b>Score:</b> ${linha.score.toFixed(1)}<br>`
    popupContent += `<b>Classificação:</b> ${categoriaText}<br>`
    popupContent += `<b>DEC:</b> ${linha.dec_realizado.toFixed(2)} (limite: ${linha.dec_limite.toFixed(2)})<br>`
    popupContent += `<b>FEC:</b> ${linha.fec_realizado.toFixed(2)} (limite: ${linha.fec_limite.toFixed(2)})<br>`
    popupContent += `<b>Desvio DEC:</b> ${linha.desvio_dec >= 0 ? '+' : ''}${linha.desvio_dec.toFixed(1)}%<br>`
    popupContent += `<b>Desvio FEC:</b> ${linha.desvio_fec >= 0 ? '+' : ''}${linha.desvio_fec.toFixed(1)}%`
    
    polyline.bindPopup(popupContent)
  })
}

function initMap() {
  if (map) return
  
  console.log('🗺️ Inicializando mapa...')
  
  map = L.map('map', { zoomControl: false }).setView([-23.55, -46.63], 12)
  
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
  }).addTo(map)
  
  L.control.zoom({ position: 'topright' }).addTo(map)
  L.control.scale({ position: 'bottomright' }).addTo(map)
  
  drawnItems = new L.FeatureGroup()
  map.addLayer(drawnItems)
  
  drawControl = new (L.Control as any).Draw({
    position: 'topright',
    edit: { featureGroup: drawnItems, remove: true },
    draw: {
      polygon: {
        shapeOptions: { color: '#ff4444', weight: 3, opacity: 0.7, fillOpacity: 0.2 },
        allowIntersection: false,
        drawError: { color: '#ff4444', message: t('map.drawError') }
      },
      rectangle: false, circle: false, circlemarker: false, marker: false, polyline: false
    }
  })
  map.addControl(drawControl)
  
  map.on(L.Draw.Event.CREATED, (e: any) => {
    console.log('✏️ Desenho finalizado!', e.layerType)
    const layer = e.layer
    
    drawnItems.clearLayers()
    drawnItems.addLayer(layer)
    
    const metrics = calculateRealMetricsFromPolygon(layer)
    
    if (metrics) {
      console.log('📤 Emitindo métricas para o MapaPage...')
      emit('update-metricas', metrics)
    } else {
      console.warn('⚠️ Nenhuma métrica encontrada para o polígono')
    }
  })
  
  map.on('moveend', () => carregarDadosDebounced())
  
  carregarDados()
}

watch(() => props.filtros.ano, () => {
  if (map) {
    lastLoadedBounds = null
    carregarDados()
  }
})

onMounted(() => nextTick(() => initMap()))
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.loading-overlay {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  z-index: 1002;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #1976d2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.leaflet-draw-toolbar a {
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(5px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.leaflet-draw-toolbar a:hover {
  background-color: rgba(255, 68, 68, 0.8) !important;
}
</style>