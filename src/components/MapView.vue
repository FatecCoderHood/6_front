<template>
  <div id="map" style="height: 100vh; width: 100%; position: absolute; top: 0; left: 0;"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import 'leaflet.heat'
import { pontos, distribuidoras, calcularTAM, calcularSAM } from '../service/mockData'
import { mdiMapMarker } from '@mdi/js'

const props = defineProps<{ filtros: any, tam: number|null, sam: number|null }>()
const emit = defineEmits(['update-metricas'])
let map: L.Map
let drawnItems: L.FeatureGroup
let drawControl: any
let heatLayer: any

function filtrarPontos() {
  let pts = pontos
  if (props.filtros.distribuidora) {
    pts = pts.filter(p => p.distribuidoraId == props.filtros.distribuidora)
  }
  if (props.filtros.situacao) {
    // Adapte conforme dados reais
  }
  if (props.filtros.dataInicial) {
    // Adapte conforme dados reais
  }
  if (props.filtros.dataFinal) {
    // Adapte conforme dados reais
  }
  return pts
}

function renderizarPontos() {
  const pts = filtrarPontos()
  pts.forEach(p => {
    const distrib = distribuidoras.find(d => d.id === p.distribuidoraId)
    const colorMap: Record<number, string> = { 1: '#ff7043', 2: '#42a5f5', 3: '#66bb6a' }
    const color = colorMap[p.distribuidoraId] || '#1976d2'

    function createSvgIcon(path: string, fill: string, size = 28) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="${fill}"/></svg>`
    }

    const html = createSvgIcon(mdiMapMarker, color, 36)
    const icon = L.divIcon({ html, className: 'mdi-marker', iconSize: [36, 36], iconAnchor: [18, 36] })
    let popup = `${distrib?.nome || ''}`
    if (props.filtros.indicadores?.DEC) popup += `<br>DEC: ${p.dec}`
    if (props.filtros.indicadores?.FEC) popup += `<br>FEC: ${p.fec}`
    L.marker([p.lat, p.lng], { icon }).addTo(map).bindPopup(popup)
  })
}

function renderizarHeatmap() {
  const pts = filtrarPontos()
  let heatData: any[] = []
  if (props.filtros.indicadores?.DEC) {
    heatData = heatData.concat(pts.map(p => [p.lat, p.lng, p.dec]))
  }
  if (props.filtros.indicadores?.FEC) {
    heatData = heatData.concat(pts.map(p => [p.lat, p.lng, p.fec]))
  }
  if (heatData.length > 0) {
    heatLayer = (L as any).heatLayer(heatData, { radius: 25, blur: 15, maxZoom: 17 }).addTo(map)
  }
}

function limparMapa() {
  if (map) {
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.LayerGroup || layer._heat) {
        map.removeLayer(layer)
      }
    })
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
    attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }).addTo(map)
  
  L.control.zoom({ position: 'topright' }).addTo(map)
  L.control.scale({ position: 'bottomright' }).addTo(map)
  
  drawnItems = new L.FeatureGroup()
  map.addLayer(drawnItems)
  
  drawControl = new (L.Control as any).Draw({
    position: 'topright',
    edit: { featureGroup: drawnItems },
    draw: { polygon: true, rectangle: true, circle: false, marker: false, polyline: false }
  })
  map.addControl(drawControl)
  
  map.on(L.Draw.Event.CREATED, function (e: any) {
    drawnItems.clearLayers()
    drawnItems.addLayer(e.layer)
    emit('update-metricas', { tam: calcularTAM(e.layer), sam: calcularSAM(e.layer) })
  })
  
  if (props.filtros.heatmap) {
    renderizarHeatmap()
  } else {
    renderizarPontos()
  }
})

watch(() => props.filtros, (nv) => {
  limparMapa()
  if (nv.heatmap) {
    renderizarHeatmap()
  } else {
    renderizarPontos()
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

.mdi-marker svg { 
  display: block; 
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45));
}
</style>