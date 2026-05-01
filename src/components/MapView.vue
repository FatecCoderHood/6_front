<template>
  <div id="map" style="height: 100vh; width: 100%; position: absolute; top: 0; left: 0;"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import 'leaflet.heat'
import { linhasEnergia, distribuidoras, calcularTAM, calcularSAM } from '../service/mockData'
import { mdiTransmissionTower } from '@mdi/js'

const props = defineProps<{ filtros: any, tam: number|null, sam: number|null, drawMode?: boolean }>()
const emit = defineEmits(['update-metricas', 'updateDecFec'])
let map: L.Map
let drawnItems: L.FeatureGroup
let drawControl: any
let heatLayer: any
let linesLayer: L.LayerGroup
let towersLayer: L.LayerGroup

function filtrarLinhas() {
  let linhas = linhasEnergia
  
  if (props.filtros.distribuidoras && props.filtros.distribuidoras.length > 0) {
    linhas = linhas.filter(l => props.filtros.distribuidoras.includes(l.distribuidoraId))
  }
  
  return linhas
}

function getValorIndicador(linha: any, indicador: string): number {
  const mapa: Record<string, number> = {
    'DEC': linha.dec,
    'DEC_realizado': linha.dec_realizado,
    'DEC_limite': linha.dec_limite,
    'Desvio_DEC': linha.desvio_dec,
    'FEC': linha.fec,
    'FEC_realizado': linha.fec_realizado,
    'FEC_limite': linha.fec_limite,
    'Desvio_FEC': linha.desvio_fec
  }
  return mapa[indicador] || 0
}

function getCorPorValor(valor: number): string {
  if (valor > 10) return '#ff4444'
  if (valor > 5) return '#ffaa44'
  return '#44ff44'
}

function renderizarLinhas() {
  if (linesLayer) {
    linesLayer.clearLayers()
  } else {
    linesLayer = L.layerGroup().addTo(map)
  }
  
  const linhas = filtrarLinhas()
  
  const indicadoresAtivosDEC = Object.entries(props.filtros.indicadoresDEC || {})
    .filter(([_, ativo]) => ativo)
    .map(([nome]) => nome)
  
  const indicadoresAtivosFEC = Object.entries(props.filtros.indicadoresFEC || {})
    .filter(([_, ativo]) => ativo)
    .map(([nome]) => nome)
  
  const todosIndicadores = [...indicadoresAtivosDEC, ...indicadoresAtivosFEC]
  
  linhas.forEach(linha => {
    const distrib = distribuidoras.find(d => d.id === linha.distribuidoraId)
    
    let cor = '#1976d2'
    if (todosIndicadores.length > 0) {
      const primeiroValor = getValorIndicador(linha, todosIndicadores[0])
      cor = getCorPorValor(primeiroValor)
    }
    
    const polyline = L.polyline(linha.coordinates as L.LatLngExpression[], {
      color: cor,
      weight: 4,
      opacity: 0.9
    }).addTo(linesLayer)
    
    let popupContent = `<b>${distrib?.nome || 'Distribuidora'}</b><br><hr>`
    
    todosIndicadores.forEach(indicador => {
      const valor = getValorIndicador(linha, indicador)
      popupContent += `<b>${indicador}:</b> ${valor.toFixed(2)}<br>`
    })
    
    polyline.bindPopup(popupContent)
  })
  
  if (props.filtros.mostrarTorres !== false) {
    renderizarTorres()
  }
}

function renderizarTorres() {
  if (towersLayer) {
    towersLayer.clearLayers()
  } else {
    towersLayer = L.layerGroup().addTo(map)
  }
  
  const linhas = filtrarLinhas()
  
  linhas.forEach(linha => {
    const distrib = distribuidoras.find(d => d.id === linha.distribuidoraId)
    const midPoint = linha.coordinates[Math.floor(linha.coordinates.length / 2)]
    const torreIcon = createTorreIcon()
    
    const indicadoresAtivosDEC = Object.entries(props.filtros.indicadoresDEC || {})
      .filter(([_, ativo]) => ativo)
      .map(([nome]) => nome)
    
    const indicadoresAtivosFEC = Object.entries(props.filtros.indicadoresFEC || {})
      .filter(([_, ativo]) => ativo)
      .map(([nome]) => nome)
    
    const todosIndicadores = [...indicadoresAtivosDEC, ...indicadoresAtivosFEC]
    let popupContent = `<b>${distrib?.nome || 'Distribuidora'}</b><br>`
    popupContent += `Torre de Transmissão<br><hr>`
    
    todosIndicadores.forEach(indicador => {
      const valor = getValorIndicador(linha, indicador)
      popupContent += `<b>${indicador}:</b> ${valor.toFixed(2)}<br>`
    })
    
    L.marker([midPoint[1], midPoint[0]], { icon: torreIcon })
      .addTo(towersLayer)
      .bindPopup(popupContent)
  })
}

function createTorreIcon() {
  const svg = `<svg width="72" height="72" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="${mdiTransmissionTower}" fill="#FFD700" stroke="#fffae1" stroke-width="1"/>
  </svg>`
  
  return L.divIcon({
    html: svg,
    className: 'torre-icon',
    iconSize: [72, 72],
    iconAnchor: [36, 36],
    popupAnchor: [0, -36]
  })
}

function renderizarHeatmap() {
  const linhas = filtrarLinhas()
  let heatData: any[] = []
  
  const indicadoresAtivosDEC = Object.entries(props.filtros.indicadoresDEC || {})
    .filter(([_, ativo]) => ativo)
    .map(([nome]) => nome)
  
  const indicadoresAtivosFEC = Object.entries(props.filtros.indicadoresFEC || {})
    .filter(([_, ativo]) => ativo)
    .map(([nome]) => nome)
  
  const todosIndicadores = [...indicadoresAtivosDEC, ...indicadoresAtivosFEC]
  
  linhas.forEach(linha => {
    const midPoint = linha.coordinates[Math.floor(linha.coordinates.length / 2)]
    
    todosIndicadores.forEach(indicador => {
      const valor = getValorIndicador(linha, indicador)
      if (valor > 0) {
        heatData.push([midPoint[1], midPoint[0], valor])
      }
    })
  })
  
  if (heatData.length > 0 && heatLayer) {
    map.removeLayer(heatLayer)
  }
  
  if (heatData.length > 0) {
    heatLayer = (L as any).heatLayer(heatData, { 
      radius: 30, 
      blur: 20, 
      maxZoom: 17,
      minOpacity: 0.5
    }).addTo(map)
  }
}

function limparMapa() {
  if (linesLayer) {
    linesLayer.clearLayers()
  }
  if (towersLayer) {
    towersLayer.clearLayers()
  }
  if (heatLayer) {
    map.removeLayer(heatLayer)
    heatLayer = null
  }
}

onMounted(() => {
  map = L.map('map', {
    zoomControl: false,
  }).setView([-23.55, -46.63], 12)
  
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
  }).addTo(map)
  
  L.control.zoom({ position: 'topright' }).addTo(map)
  L.control.scale({ position: 'bottomright' }).addTo(map)
  
  drawnItems = new L.FeatureGroup()
  map.addLayer(drawnItems)
  
  // Configurar ferramentas de desenho: APENAS retângulo e polígono livre
  drawControl = new (L.Control as any).Draw({
    position: 'topright',
    edit: { featureGroup: drawnItems },
    draw: {
      polygon: {
        shapeOptions: { color: '#ff4444', weight: 3, opacity: 0.7, fillOpacity: 0.2 },
        allowIntersection: false,
        drawError: { color: '#ff4444', message: 'Desenho inválido!' },
        icon: new L.DivIcon({ iconSize: [0, 0] })
      },
      rectangle: {
        shapeOptions: { color: '#ff4444', weight: 3, opacity: 0.7, fillOpacity: 0.2 },
        icon: new L.DivIcon({ iconSize: [0, 0] })
      },
      circle: false,      // Desativar círculo
      circlemarker: false, // Desativar marcador circular
      marker: false,       // Desativar marcador
      polyline: false      // Desativar linha
    }
  })
  map.addControl(drawControl)
  
  map.on(L.Draw.Event.CREATED, function (e: any) {
    // Limpar desenhos anteriores
    drawnItems.clearLayers()
    drawnItems.addLayer(e.layer)
    const tam = calcularTAM(e.layer)
    const sam = calcularSAM(e.layer)
    emit('update-metricas', { tam, sam })
  })
  
  if (props.filtros.heatmap) {
    renderizarHeatmap()
  } else {
    renderizarLinhas()
  }
})

watch(() => props.filtros, (nv) => {
  limparMapa()
  if (nv.heatmap) {
    renderizarHeatmap()
  } else {
    renderizarLinhas()
    if (nv.mostrarTorres !== false) {
      renderizarTorres()
    }
  }
}, { deep: true })
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
  z-index: 1000;
}

.torre-icon svg {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
  transition: transform 0.2s ease;
}

.torre-icon svg:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
}

/* Estilizar a barra de ferramentas de desenho */
.leaflet-draw-toolbar a {
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(5px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.leaflet-draw-toolbar a:hover {
  background-color: rgba(255, 68, 68, 0.8) !important;
}
</style>