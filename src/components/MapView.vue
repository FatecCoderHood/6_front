<template>
  <div id="map" style="height: 100vh; width: 100%; position: absolute; top: 0; left: 0;"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import { linhasEnergia, distribuidoras } from '../service/mockData'
import { mdiTransmissionTower } from '@mdi/js'

const props = defineProps<{ filtros: any }>()
const emit = defineEmits(['update-metricas'])

let map: L.Map
let drawnItems: L.FeatureGroup
let drawControl: any
let linesLayer: L.LayerGroup
let towersLayer: L.LayerGroup

// Função para verificar se um ponto está dentro do polígono
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

// Função para verificar se uma linha cruza o polígono
function lineIntersectsPolygon(lineCoords: [number, number][], polygon: L.LatLng[][]): boolean {
  for (const point of lineCoords) {
    if (isPointInPolygon(point, polygon)) {
      return true
    }
  }
  return false
}

// Função que calcula métricas REAIS baseadas nas linhas dentro do polígono
function calculateRealMetricsFromPolygon(polygonLayer: any) {
  const polygonLatLngs = polygonLayer.getLatLngs()
  
  // Filtrar linhas por distribuidora (se houver filtro)
  let linhas = [...linhasEnergia]
  if (props.filtros.distribuidoras && props.filtros.distribuidoras.length > 0) {
    linhas = linhas.filter(l => props.filtros.distribuidoras.includes(l.distribuidoraId))
  }
  
  // Linhas dentro do polígono
  const linhasNoPoligono: typeof linhasEnergia = []
  
  for (const linha of linhas) {
    const lineLatLngs = linha.coordinates.map(coord => [coord[1], coord[0]]) as [number, number][]
    
    if (lineIntersectsPolygon(lineLatLngs, polygonLatLngs)) {
      linhasNoPoligono.push(linha)
    }
  }
  
  if (linhasNoPoligono.length === 0) {
    return null
  }
  
  // Calcular médias
  let totalDEC = 0
  let totalFEC = 0
  let totalComprimento = 0
  
  for (const linha of linhasNoPoligono) {
    totalDEC += linha.dec_realizado
    totalFEC += linha.fec_realizado
    totalComprimento += linha.coordinates.length
  }
  
  const count = linhasNoPoligono.length
  
  // Calcular distribuidora predominante
  const distribCount: Record<number, number> = {}
  for (const linha of linhasNoPoligono) {
    distribCount[linha.distribuidoraId] = (distribCount[linha.distribuidoraId] || 0) + 1
  }
  let predominantDistId = 1
  let maxCount = 0
  for (const [id, c] of Object.entries(distribCount)) {
    if (c > maxCount) {
      maxCount = c
      predominantDistId = parseInt(id)
    }
  }
  const distribPredominante = distribuidoras.find(d => d.id === predominantDistId)
  
  // TAM e SAM baseados no comprimento total das linhas
  const tam = totalComprimento * 50
  const sam = totalComprimento * 25
  
  return {
    tam: tam,
    sam: sam,
    dec: totalDEC / count,
    fec: totalFEC / count,
    decLimite: linhasNoPoligono[0]?.dec_limite || 6.5,
    fecLimite: linhasNoPoligono[0]?.fec_limite || 3.2,
    totalLinhas: count,
    distribuidora: distribPredominante?.nome || 'Múltiplas'
  }
}

function filtrarLinhas() {
  let linhas = [...linhasEnergia]
  
  if (props.filtros.distribuidoras && props.filtros.distribuidoras.length > 0) {
    linhas = linhas.filter(l => props.filtros.distribuidoras.includes(l.distribuidoraId))
  }
  
  return linhas
}

function getValorIndicador(linha: any, indicador: string): number {
  const mapa: Record<string, number> = {
    'DEC': linha.dec_realizado,
    'DEC_realizado': linha.dec_realizado,
    'DEC_limite': linha.dec_limite,
    'Desvio_DEC': linha.desvio_dec,
    'FEC': linha.fec_realizado,
    'FEC_realizado': linha.fec_realizado,
    'FEC_limite': linha.fec_limite,
    'Desvio_FEC': linha.desvio_fec
  }
  return mapa[indicador] ?? 0
}

function getCorPorDesvio(desvioPercentual: number): string {
  if (desvioPercentual >= 10) return '#ff4444'
  if (desvioPercentual > 0) return '#ffaa44'
  return '#44ff44'
}

function getCorParaLinha(linha: any): string {
  const indicadoresAtivosDEC = Object.entries(props.filtros.indicadoresDEC || {})
    .filter(([_, ativo]) => ativo === true)
    .map(([nome]) => nome)
  
  const indicadoresAtivosFEC = Object.entries(props.filtros.indicadoresFEC || {})
    .filter(([_, ativo]) => ativo === true)
    .map(([nome]) => nome)
  
  const todosIndicadores = [...indicadoresAtivosDEC, ...indicadoresAtivosFEC]
  
  if (todosIndicadores.length === 0) {
    return '#1976d2'
  }
  
  const primeiroIndicador = todosIndicadores[0]
  let valor = getValorIndicador(linha, primeiroIndicador)
  
  if (primeiroIndicador === 'DEC' || primeiroIndicador === 'DEC_realizado') {
    const limite = linha.dec_limite
    if (limite && limite > 0) {
      valor = ((valor - limite) / limite) * 100
    }
  } else if (primeiroIndicador === 'FEC' || primeiroIndicador === 'FEC_realizado') {
    const limite = linha.fec_limite
    if (limite && limite > 0) {
      valor = ((valor - limite) / limite) * 100
    }
  }
  
  return getCorPorDesvio(valor)
}

function renderizarLinhas() {
  if (!map) return
  
  if (linesLayer) {
    linesLayer.clearLayers()
  } else {
    linesLayer = L.layerGroup().addTo(map)
  }
  
  const linhas = filtrarLinhas()
  
  linhas.forEach(linha => {
    const distrib = distribuidoras.find(d => d.id === linha.distribuidoraId)
    const cor = getCorParaLinha(linha)
    
    const latLngs = linha.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
    
    const polyline = L.polyline(latLngs as L.LatLngExpression[], {
      color: cor,
      weight: 5,
      opacity: 0.9
    }).addTo(linesLayer)
    
    let popupContent = `<b>${linha.name || distrib?.nome || 'Linha de Energia'}</b><br><hr>`
    popupContent += `<b>DEC:</b> ${linha.dec_realizado.toFixed(2)} (limite: ${linha.dec_limite.toFixed(2)})<br>`
    popupContent += `<b>Desvio DEC:</b> ${linha.desvio_dec >= 0 ? '+' : ''}${linha.desvio_dec.toFixed(1)}%<br>`
    popupContent += `<b>FEC:</b> ${linha.fec_realizado.toFixed(2)} (limite: ${linha.fec_limite.toFixed(2)})<br>`
    popupContent += `<b>Desvio FEC:</b> ${linha.desvio_fec >= 0 ? '+' : ''}${linha.desvio_fec.toFixed(1)}%`
    
    polyline.bindPopup(popupContent)
  })
  
  if (props.filtros.mostrarTorres !== false) {
    renderizarTorres()
  }
}

function renderizarTorres() {
  if (!map) return
  
  if (towersLayer) {
    towersLayer.clearLayers()
  } else {
    towersLayer = L.layerGroup().addTo(map)
  }
  
  const linhas = filtrarLinhas()
  
  linhas.forEach(linha => {
    const distrib = distribuidoras.find(d => d.id === linha.distribuidoraId)
    const coords = linha.coordinates
    const midIndex = Math.floor(coords.length / 2)
    const midPoint = coords[midIndex]
    
    const torreIcon = L.divIcon({
      html: `<svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="${mdiTransmissionTower}" fill="#FFD700" stroke="#fff" stroke-width="0.5"/>
      </svg>`,
      className: 'torre-icon',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    })
    
    L.marker([midPoint[1], midPoint[0]], { icon: torreIcon })
      .addTo(towersLayer)
      .bindPopup(`
        <b>${linha.name || distrib?.nome || 'Torre'}</b><br>
        Torre de Transmissão<br>
        DEC: ${linha.dec_realizado.toFixed(2)} | FEC: ${linha.fec_realizado.toFixed(2)}
      `)
  })
}

function limparMapa() {
  if (linesLayer) {
    linesLayer.clearLayers()
  }
  if (towersLayer) {
    towersLayer.clearLayers()
  }
}

function initMap() {
  if (map) return
  
  map = L.map('map', {
    zoomControl: false,
  }).setView([-23.55, -46.63], 13)
  
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
  }).addTo(map)
  
  L.control.zoom({ position: 'topright' }).addTo(map)
  L.control.scale({ position: 'bottomright' }).addTo(map)
  
  drawnItems = new L.FeatureGroup()
  map.addLayer(drawnItems)
  
  drawControl = new (L.Control as any).Draw({
    position: 'topright',
    edit: { featureGroup: drawnItems },
    draw: {
      polygon: {
        shapeOptions: { color: '#ff4444', weight: 3, opacity: 0.7, fillOpacity: 0.2 },
        allowIntersection: false,
        drawError: { color: '#ff4444', message: 'Desenho inválido!' }
      },
      rectangle: {
        shapeOptions: { color: '#ff4444', weight: 3, opacity: 0.7, fillOpacity: 0.2 }
      },
      circle: false,
      circlemarker: false,
      marker: false,
      polyline: false
    }
  })
  map.addControl(drawControl)
  
  // Evento principal - quando o usuário FINALIZA o desenho
  map.on(L.Draw.Event.CREATED, function(e: any) {
    const layer = e.layer
    
    // Limpar desenhos anteriores
    drawnItems.clearLayers()
    drawnItems.addLayer(layer)
    
    // Calcular métricas REAIS baseadas nas linhas dentro do polígono
    const metrics = calculateRealMetricsFromPolygon(layer)
    
    if (metrics) {
      emit('update-metricas', metrics)
    }
  })
  
  renderizarLinhas()
}

watch(() => props.filtros, () => {
  if (map) {
    limparMapa()
    renderizarLinhas()
    if (drawnItems) {
      drawnItems.clearLayers()
    }
  }
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})
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

.torre-icon {
  background: transparent;
  border: none;
  cursor: pointer;
}

.torre-icon svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: transform 0.2s ease;
}

.torre-icon svg:hover {
  transform: scale(1.15);
}

.leaflet-draw-toolbar a {
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(5px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.leaflet-draw-toolbar a:hover {
  background-color: rgba(255, 68, 68, 0.8) !important;
}
</style>