<!-- src/pages/AgentePrevisao.vue -->
<template>
  <div class="previsao-page">
    <!-- Fundo animado -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere second"></div>
      <div class="gradient-sphere third"></div>
    </div>

    <!-- Conteúdo principal -->
    <div class="content">
      <!-- Header -->
      <div class="header">
        <div class="title-section">
          <h1>{{ t('forecast.title') }}</h1>
          <p>{{ t('forecast.subtitle') }}</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-card">
        <div class="filter-group">
          <label>{{ t('forecast.unitCode') }}</label>
          <input 
            v-model="filters.cod_unidade" 
            type="number" 
            placeholder="13654"
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>{{ t('forecast.indicator') }}</label>
          <select v-model="filters.indicador" class="filter-select">
            <option value="DEC">DEC</option>
            <option value="FEC">FEC</option>
          </select>
        </div>
        <button class="btn-filter" @click="fetchPrevisoes">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ t('forecast.search') }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <span>{{ t('forecast.loading') }}</span>
      </div>

      <!-- Conteúdo dos dados -->
      <div v-else-if="previsoes.length > 0" class="dashboard">
        <!-- Cards de métricas -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M3 17V20H21V17M3 10L12 3L21 10M12 3V14" stroke="#FFD700" stroke-width="1.5" fill="none"/>
                <path d="M7 14V20M12 14V20M17 14V20" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">{{ t('forecast.avgMAE') }}</span>
              <span class="metric-value">{{ avgMAE.toFixed(6) }}</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M21 12C21 13.2 20.5 14.2 19.7 15.1C18.9 15.9 17.8 16.5 16.5 16.8C15.2 17.1 13.8 17.1 12.3 16.8" stroke="#FFD700" stroke-width="1.5" fill="none"/>
                <path d="M3 12C3 10.8 3.5 9.8 4.3 8.9C5.1 8.1 6.2 7.5 7.5 7.2C8.8 6.9 10.2 6.9 11.7 7.2" stroke="#FFD700" stroke-width="1.5" fill="none"/>
                <circle cx="12" cy="12" r="2" stroke="#FFD700" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">{{ t('forecast.totalPredictions') }}</span>
              <span class="metric-value">{{ previsoes.length }}</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L15 15M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFD700" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">{{ t('forecast.lastPrediction') }}</span>
              <span class="metric-value">{{ lastPrediction.previsao?.toFixed(6) || '-' }}</span>
              <span class="metric-date">{{ formatDate(lastPrediction.data) }}</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M3 13H8L10 8L14 16L16 11L21 13" stroke="#FFD700" stroke-width="1.5" fill="none" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">{{ t('forecast.trend') }}</span>
              <span class="metric-value" :class="trendClass">
                {{ trend }}
                <svg v-if="trend === 'Crescente'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <svg v-else-if="trend === 'Decrescente'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M12 19L5 12M12 19L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <!-- Gráfico de Linhas -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>{{ t('forecast.predictionTimeline') }}</h3>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-color actual"></span>
                {{ t('forecast.actualMAE') }}
              </span>
              <span class="legend-item">
                <span class="legend-color prediction"></span>
                {{ t('forecast.prediction') }}
              </span>
            </div>
          </div>
          <canvas ref="chartCanvas" class="chart-canvas"></canvas>
        </div>

        <!-- Tabela de Dados -->
        <div class="table-card">
          <h3>{{ t('forecast.detailsTable') }}</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ t('forecast.date') }}</th>
                  <th>MAE</th>
                  <th>{{ t('forecast.prediction') }}</th>
                  <th>{{ t('forecast.difference') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in previsoes" :key="index">
                  <td>{{ formatDate(item.data) }}</td>
                  <td>{{ item.mae.toFixed(6) }}</td>
                  <td class="prediction-value">{{ item.previsao.toFixed(6) }}</td>
                  <td :class="getDiffClass(item)">
                    {{ getDifference(item) }}
                    <svg v-if="getDifference(item) > 0" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <svg v-else-if="getDifference(item) < 0" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 19V5M12 19L5 12M12 19L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Sem dados -->
      <div v-else class="empty-state">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M21 12C21 13.2 20.5 14.2 19.7 15.1C18.9 15.9 17.8 16.5 16.5 16.8C15.2 17.1 13.8 17.1 12.3 16.8" stroke="#FFD700" stroke-width="1.5" fill="none"/>
          <path d="M3 12C3 10.8 3.5 9.8 4.3 8.9C5.1 8.1 6.2 7.5 7.5 7.2C8.8 6.9 10.2 6.9 11.7 7.2" stroke="#FFD700" stroke-width="1.5" fill="none"/>
          <circle cx="12" cy="12" r="2" stroke="#FFD700" stroke-width="1.5"/>
        </svg>
        <p>{{ t('forecast.noData') }}</p>
        <button class="btn-primary" @click="fetchPrevisoes">{{ t('forecast.tryAgain') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import Chart from 'chart.js/auto'

const { t } = useI18n()

// Interfaces
interface Previsao {
  cod_unidade: number
  indicador: string
  mae: number
  data: string
  previsao: number
}

// Estado
const previsoes = ref<Previsao[]>([])
const loading = ref(false)
const filters = reactive({
  cod_unidade: 13654,
  indicador: 'FEC'
})

// Referência para o gráfico
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Computed
const avgMAE = computed(() => {
  if (previsoes.value.length === 0) return 0
  const sum = previsoes.value.reduce((acc, curr) => acc + curr.mae, 0)
  return sum / previsoes.value.length
})

const lastPrediction = computed(() => {
  if (previsoes.value.length === 0) return { previsao: 0, data: '' }
  return previsoes.value[previsoes.value.length - 1]
})

const trend = computed(() => {
  if (previsoes.value.length < 2) return 'Estável'
  
  const first = previsoes.value[0].previsao
  const last = previsoes.value[previsoes.value.length - 1].previsao
  
  if (last > first) return 'Crescente'
  if (last < first) return 'Decrescente'
  return 'Estável'
})

const trendClass = computed(() => {
  if (trend.value === 'Crescente') return 'trend-up'
  if (trend.value === 'Decrescente') return 'trend-down'
  return 'trend-stable'
})

// Métodos
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' })
}

const getDifference = (item: Previsao) => {
  return (item.previsao - item.mae).toFixed(6)
}

const getDiffClass = (item: Previsao) => {
  const diff = item.previsao - item.mae
  if (diff > 0) return 'diff-positive'
  if (diff < 0) return 'diff-negative'
  return 'diff-neutral'
}

const fetchPrevisoes = async () => {
  loading.value = true
  try {
    const url = `http://localhost:8000/previsoes?cod_unidade=${filters.cod_unidade}&indicador=${filters.indicador}`
    const response = await fetch(url)
    const data = await response.json()
    previsoes.value = data.dados || []
    
    // Atualizar gráfico após os dados carregarem
    await nextTick()
    updateChart()
  } catch (error) {
    console.error('Erro ao buscar previsões:', error)
    previsoes.value = []
  } finally {
    loading.value = false
  }
}

const updateChart = () => {
  if (!chartCanvas.value) return
  
  // Destruir gráfico existente
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  // Preparar dados
  const labels = previsoes.value.map(item => formatDate(item.data))
  const maeData = previsoes.value.map(item => item.mae)
  const previsaoData = previsoes.value.map(item => item.previsao)
  
  // Criar novo gráfico
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'MAE (Erro Médio Absoluto)',
          data: maeData,
          borderColor: '#FFD700',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#FFD700',
          pointBorderColor: '#0a0a0a',
          pointBorderWidth: 2,
          fill: true
        },
        {
          label: 'Previsão',
          data: previsaoData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#0a0a0a',
          pointBorderWidth: 2,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'white',
            font: { size: 12 }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#FFD700',
          bodyColor: 'white',
          borderColor: '#FFD700',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'white'
          },
          title: {
            display: true,
            text: t('forecast.value'),
            color: 'white'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'white',
            rotation: 45
          },
          title: {
            display: true,
            text: t('forecast.date'),
            color: 'white'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  })
}

// Watch para quando os dados mudarem
watch(previsoes, async () => {
  await nextTick()
  updateChart()
})

// Carregar dados iniciais
onMounted(() => {
  fetchPrevisoes()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.previsao-page {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow-x: hidden;
  font-family: 'Segoe UI', 'Poppins', sans-serif;
  padding: 2rem;
}

/* Fundo animado */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.gradient-sphere {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0));
  animation: float 20s infinite ease-in-out;
  filter: blur(60px);
}

.gradient-sphere.second {
  width: 400px;
  height: 400px;
  top: 60%;
  left: 70%;
  animation-delay: -5s;
}

.gradient-sphere.third {
  width: 600px;
  height: 600px;
  top: 20%;
  left: -10%;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

/* Conteúdo principal */
.content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.header {
  margin-bottom: 2rem;
  animation: fadeInDown 0.8s ease;
}

.title-section h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.title-section p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

/* Filtros */
.filters-card {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease;
}

.filter-group {
  flex: 1;
}

.filter-group label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.05);
}

.btn-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 24px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: none;
  border-radius: 8px;
  color: #0a0a0a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-filter:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
}

/* Loading */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem;
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  color: white;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  border-top-color: #FFD700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Dashboard */
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.metric-card:hover {
  border-color: #FFD700;
  transform: translateY(-5px);
}

.metric-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-info {
  flex: 1;
}

.metric-label {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.metric-value {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.metric-date {
  display: block;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  margin-top: 0.25rem;
}

.trend-up {
  color: #4CAF50;
}

.trend-down {
  color: #ff4444;
}

.trend-stable {
  color: #FFD700;
}

/* Chart Card */
.chart-card {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-header h3 {
  color: white;
  font-size: 1.2rem;
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

.legend-color {
  width: 20px;
  height: 3px;
  border-radius: 2px;
}

.legend-color.actual {
  background: #FFD700;
}

.legend-color.prediction {
  background: #4CAF50;
}

.chart-canvas {
  max-height: 400px;
  width: 100%;
}

/* Table Card */
.table-card {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
}

.table-card h3 {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.data-table th {
  color: #FFD700;
  font-weight: 600;
  font-size: 0.85rem;
}

.data-table td {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.prediction-value {
  color: #4CAF50;
  font-weight: 600;
}

.diff-positive {
  color: #4CAF50;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.diff-negative {
  color: #ff4444;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.diff-neutral {
  color: rgba(255, 255, 255, 0.5);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem;
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
}

.btn-primary {
  padding: 10px 24px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: none;
  border-radius: 8px;
  color: #0a0a0a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
}

/* Animações */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .previsao-page {
    padding: 1rem;
  }

  .filters-card {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-filter {
    justify-content: center;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .data-table th,
  .data-table td {
    padding: 8px;
    font-size: 0.75rem;
  }
}
</style>