<template>
  <div 
    class="floating-metrics" 
    :class="{ expanded: isExpanded, minimized: isMinimized, hidden: isHidden }"
    :style="positionStyle"
    @mousedown="startDrag"
  >
    <!-- Header do componente -->
    <div class="metrics-header">
      <div class="header-left">
        <span class="header-title">{{ t('floating.headerTitle') }}</span>
      </div>
      <div class="header-right" @click.stop>
        <button 
          class="icon-btn" 
          @click="toggleMinimize" 
          :title="isMinimized ? t('floating.expand') : t('floating.minimize')"
        >
          {{ isMinimized ? '□' : '─' }}
        </button>
        <button 
          v-if="!isMinimized && isExpanded && !isHidden" 
          class="icon-btn" 
          @click="gerarRelatorio" 
          :title="t('floating.generatePdf')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path :d="mdiFilePdfBox" />
          </svg>
        </button>
        <button class="icon-btn close-btn" @click="hideModal" :title="t('floating.close')">
          ✕
        </button>
      </div>
    </div>

    <!-- Componente ReportPdf escondido (mas montado) -->
    <div style="position: absolute; left: -9999px; top: -9999px;">
      <ReportPdf 
        ref="reportPdfRef" 
        :tam="tam" 
        :sam="sam" 
        :dec="dec.valor" 
        :fec="fec.valor" 
        :decLimite="dec.limite" 
        :fecLimite="fec.limite" 
      />
    </div>

    <!-- Conteúdo expandido -->
    <div v-if="isExpanded && !isMinimized && !isHidden" class="metrics-content">
      <!-- Classificação de criticidade -->
      <div class="criticidade-section">
        <span class="criticidade-label">{{ t('floating.criticidade') }}</span>
        <span class="criticidade-value" :class="getCriticidadeClass()">
          {{ getCriticidade() }}
        </span>
      </div>

      <!-- Indicador principal -->
      <div class="indicador-principal">
        <div class="indicador-valor">
          <span class="valor-grande">{{ indicadorPrincipal.valor.toFixed(2) }}</span>
          <span class="indicador-nome">{{ indicadorPrincipal.nome }}</span>
        </div>
        <div class="indicador-limite">
          <span>{{ t('floating.limitLabel') }}: {{ indicadorPrincipal.limite.toFixed(2) }}</span>
          <span class="referencia">{{ t('floating.reference') }}</span>
        </div>
      </div>

      <!-- Contexto operacional -->
      <div class="contexto-section">
        <h4>{{ t('floating.contextTitle') }}</h4>
        <div class="contexto-grid">
          <div class="contexto-item">
            <span class="label">{{ t('floating.labelDistributor') }}</span>
            <span class="value">{{ contexto.distribuidora }}</span>
          </div>
          <div class="contexto-item">
            <span class="label">{{ t('floating.labelState') }}</span>
            <span class="value">{{ contexto.estado }}</span>
          </div>
          <div class="contexto-item">
            <span class="label">{{ t('floating.labelSubstation') }}</span>
            <span class="value">{{ contexto.subestacao }}</span>
          </div>
          <div class="contexto-item">
            <span class="label">{{ t('floating.labelPeriod') }}</span>
            <span class="value">{{ contexto.periodo }}</span>
          </div>
        </div>
      </div>

      <!-- Indicadores principais -->
      <div class="indicadores-principais">
        <div class="indicador-card">
          <div class="card-header">DEC</div>
          <div class="card-valor">{{ dec.valor.toFixed(2) }}</div>
          <div class="card-limite">{{ t('report.limit') }} {{ dec.limite.toFixed(2) }}</div>
        </div>
        <div class="indicador-card">
          <div class="card-header">FEC</div>
          <div class="card-valor">{{ fec.valor.toFixed(2) }}</div>
          <div class="card-limite">{{ t('report.limit') }} {{ fec.limite.toFixed(2) }}</div>
        </div>
      </div>

      <!-- TAM e SAM com gráficos -->
      <div class="metricas-graficos">
        <div class="metricas-row">
          <div class="metrica-card">
            <div class="metrica-nome">TAM</div>
            <div class="metrica-valor">{{ tam.toFixed(2) }}</div>
          </div>
          <div class="metrica-card">
            <div class="metrica-nome">SAM</div>
            <div class="metrica-valor">{{ sam.toFixed(2) }}</div>
          </div>
        </div>
        <canvas id="graficoMetricas" width="300" height="150"></canvas>
      </div>

      <!-- Leituras complementares -->
      <div class="complementares-section">
        <h4>{{ t('floating.complementaryTitle') }}</h4>
        <div class="complementares-grid">
          <div class="complementar-card">
            <div class="card-header">{{ t('report.lossTechnical') }}</div>
            <div class="card-valor">{{ perdasTecnicas.valor.toFixed(2) }}%</div>
            <div class="card-limite">{{ t('report.limit') }} {{ perdasTecnicas.limite.toFixed(2) }}%</div>
          </div>
          <div class="complementar-card">
            <div class="card-header">{{ t('report.lossNonTechnical') }}</div>
            <div class="card-valor">{{ perdasNaoTecnicas.valor.toFixed(2) }}%</div>
            <div class="card-limite">{{ t('report.limit') }} {{ perdasNaoTecnicas.limite.toFixed(2) }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo minimizado -->
    <div v-if="isMinimized && !isHidden" class="minimized-content" @click="restoreWindow">
        <div class="minimized-stats">
        <span class="stat">{{ t('report.tam') }}: {{ tam.toFixed(2) }}</span>
        <span class="stat">{{ t('report.sam') }}: {{ sam.toFixed(2) }}</span>
        <span class="stat">DEC: {{ dec.valor.toFixed(2) }}</span>
        <span class="stat">FEC: {{ fec.valor.toFixed(2) }}</span>
      </div>
    </div>
  </div>

  <!-- Botão flutuante para reabrir - posicionado mais à direita do botão de filtro -->
  <button 
    v-if="isHidden" 
    class="reopen-btn" 
    @click="reopenModal" 
    :title="t('floating.reopen')"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'chart.js/auto'
import ReportPdf from './ReportPdf.vue'
import { mdiFilePdfBox } from '@mdi/js'

const props = defineProps<{
  tam: number
  sam: number
  dec?: number
  fec?: number
  decLimite?: number
  fecLimite?: number
}>()

const emit = defineEmits(['close'])

const { t } = useI18n()

const isExpanded = ref(true)
const isMinimized = ref(false)
const isHidden = ref(false)
let chart: any = null
const reportPdfRef = ref<InstanceType<typeof ReportPdf> | null>(null)

// Posição arrastável - padrão lado direito
const position = ref({ x: window.innerWidth - 620, y: 80 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const startPos = ref({ x: 0, y: 0 })

const positionStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  right: 'auto',
  bottom: 'auto'
}))

function startDrag(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest('.icon-btn') || target.closest('.header-right')) {
    return
  }
  
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  startPos.value = { ...position.value }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return
  
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y
  
  let newX = startPos.value.x + dx
  let newY = startPos.value.y + dy
  
  newX = Math.max(0, Math.min(window.innerWidth - 620, newX))
  newY = Math.max(0, Math.min(window.innerHeight - 100, newY))
  
  position.value = { x: newX, y: newY }
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

async function gerarRelatorio() {
  try {
    if (reportPdfRef.value) {
      await reportPdfRef.value.generatePDF()
    } else {
      console.error('ReportPdf ref não encontrado')
    }
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
  }
}

function hideModal() {
  isHidden.value = true
  isExpanded.value = false
  isMinimized.value = false
}

function reopenModal() {
  isHidden.value = false
  isExpanded.value = true
  isMinimized.value = false
  nextTick(() => initChart())
}

function toggleMinimize() {
  if (isMinimized.value) {
    isMinimized.value = false
    isExpanded.value = true
    nextTick(() => initChart())
  } else {
    isMinimized.value = true
    isExpanded.value = false
  }
}

function restoreWindow() {
  isMinimized.value = false
  isExpanded.value = true
  nextTick(() => initChart())
}

// Dados
const indicadorPrincipal = ref({
  nome: 'DEC',
  valor: props.dec || 7.68,
  limite: props.decLimite || 6.50
})

const dec = ref({
  valor: props.dec || 7.68,
  limite: props.decLimite || 6.50
})

const fec = ref({
  valor: props.fec || 3.68,
  limite: props.fecLimite || 3.20
})

const contexto = ref({
  distribuidora: 'RGE Sul',
  estado: 'RS',
  subestacao: 'Não aplicável no recorte atual',
  periodo: '12/2022'
})

const perdasTecnicas = ref({
  valor: 3.79,
  limite: 3.03
})

const perdasNaoTecnicas = ref({
  valor: 1.76,
  limite: 1.60
})

function getCriticidade(): string {
  if (indicadorPrincipal.value.valor > indicadorPrincipal.value.limite) {
    return t('floating.crit_above')
  } else if (indicadorPrincipal.value.valor < indicadorPrincipal.value.limite * 0.8) {
    return t('floating.crit_below')
  } else {
    return t('floating.crit_near')
  }
}

function getCriticidadeClass(): string {
  if (indicadorPrincipal.value.valor > indicadorPrincipal.value.limite) {
    return 'criticidade-alta'
  } else if (indicadorPrincipal.value.valor < indicadorPrincipal.value.limite * 0.8) {
    return 'criticidade-baixa'
  } else {
    return 'criticidade-media'
  }
}

function initChart() {
  const canvas = document.getElementById('graficoMetricas') as HTMLCanvasElement
  if (!canvas) {
    setTimeout(() => initChart(), 100)
    return
  }
  
  if (chart) {
    chart.destroy()
    chart = null
  }
  
  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: [t('report.tam'), t('report.sam')],
      datasets: [{
        label: t('floating.metricsLabel'),
        data: [props.tam, props.sam],
        backgroundColor: ['#1976d2', '#43a047'],
        borderColor: ['#1565c0', '#2e7d32'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#fff' }
        }
      },
      scales: {
        y: {
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    }
  })
}

watch(() => [props.tam, props.sam], () => {
  if (chart && !isMinimized.value && isExpanded.value && !isHidden.value) {
    chart.data.datasets[0].data = [props.tam, props.sam]
    chart.update()
  }
})

onMounted(() => {
  nextTick(() => initChart())
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

<style scoped>
.floating-metrics {
  position: fixed;
  width: 600px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1001;
  transition: all 0.3s ease;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  cursor: move;
  user-select: none;
}

.floating-metrics.hidden {
  display: none;
}

.floating-metrics.expanded {
  max-height: 80vh;
  overflow-y: auto;
}

.floating-metrics.minimized {
  width: auto;
  min-width: 400px;
}

.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: move;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px 12px 0 0;
}

.floating-metrics.minimized .metrics-header {
  border-radius: 12px;
  border-bottom: none;
  cursor: default;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.header-title {
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 8px;
  pointer-events: auto;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.close-btn:hover {
  background: #ff4444;
  border-color: #ff4444;
}

.reopen-btn {
  position: fixed;
  left: 215px;
  top: 20px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: transparent;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.reopen-btn svg {
  stroke: white;
}

.reopen-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
}

.minimized-content {
  padding: 12px 16px;
  cursor: pointer;
}

.minimized-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat {
  font-size: 12px;
  color: #fff;
  font-weight: 500;
  pointer-events: none;
}

.stat::before {
  content: '•';
  margin-right: 6px;
  color: #1976d2;
}

.metrics-content {
  padding: 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: default;
  user-select: text;
}

/* Restante dos estilos */
.criticidade-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.criticidade-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.criticidade-value {
  font-size: 14px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.criticidade-alta {
  background: rgba(255, 68, 68, 0.2);
  color: #ff8888;
}

.criticidade-media {
  background: rgba(255, 170, 68, 0.2);
  color: #ffaa44;
}

.criticidade-baixa {
  background: rgba(68, 255, 68, 0.2);
  color: #88ff88;
}

.indicador-principal {
  text-align: center;
  padding: 16px;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 8px;
  border-left: 3px solid #1976d2;
}

.indicador-valor {
  margin-bottom: 8px;
}

.valor-grande {
  font-size: 32px;
  font-weight: bold;
  color: #1976d2;
}

.indicador-nome {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 8px;
}

.indicador-limite {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.referencia {
  display: block;
  font-size: 11px;
  margin-top: 4px;
}

.contexto-section h4,
.complementares-section h4 {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.contexto-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 8px;
}

.contexto-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contexto-item .label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.contexto-item .value {
  font-size: 13px;
  font-weight: 500;
}

.indicadores-principais {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.indicador-card,
.complementar-card {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.card-header {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.card-valor {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.card-limite {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.metricas-graficos {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 8px;
}

.metricas-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.metrica-card {
  text-align: center;
}

.metrica-nome {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.metrica-valor {
  font-size: 20px;
  font-weight: bold;
}

.complementares-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

#graficoMetricas {
  max-width: 100%;
  height: auto;
}

.floating-metrics::-webkit-scrollbar {
  width: 6px;
}

.floating-metrics::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.floating-metrics::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
</style>