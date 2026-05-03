<template>
  <div class="report-pdf-container" ref="reportContent">
    <!-- Cabeçalho do relatório -->
    <div class="report-header">
      <h1>Relatório de Métricas - Conjunto Elétrico</h1>
      <p>Gerado em: {{ dataGeracao }}</p>
    </div>

    <!-- Classificação de criticidade -->
    <div class="report-section">
      <h2>Classificação de Criticidade</h2>
      <div class="criticidade-box" :class="getCriticidadeClass()">
        <span class="criticidade-label">{{ getCriticidade() }}</span>
      </div>
    </div>

    <!-- Indicador principal -->
    <div class="report-section">
      <h2>Indicador Principal</h2>
      <div class="indicador-principal">
        <div class="valor-grande">{{ indicadorPrincipal.valor.toFixed(2) }}</div>
        <div class="indicador-info">
          <span>{{ indicadorPrincipal.nome }}</span>
          <span>Limite regulatório: {{ indicadorPrincipal.limite.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Contexto operacional -->
    <div class="report-section">
      <h2>Contexto Operacional</h2>
      <div class="contexto-grid">
        <div class="contexto-item">
          <span class="label">Distribuidora:</span>
          <span class="value">{{ contexto.distribuidora }}</span>
        </div>
        <div class="contexto-item">
          <span class="label">Estado:</span>
          <span class="value">{{ contexto.estado }}</span>
        </div>
        <div class="contexto-item">
          <span class="label">Subestação:</span>
          <span class="value">{{ contexto.subestacao }}</span>
        </div>
        <div class="contexto-item">
          <span class="label">Período de referência:</span>
          <span class="value">{{ contexto.periodo }}</span>
        </div>
      </div>
    </div>

    <!-- Indicadores principais DEC/FEC -->
    <div class="report-section">
      <h2>Indicadores Principais</h2>
      <div class="indicadores-grid">
        <div class="indicador-card">
          <div class="card-header">DEC</div>
          <div class="card-valor">{{ dec.valor.toFixed(2) }}</div>
          <div class="card-limite">Limite {{ dec.limite.toFixed(2) }}</div>
        </div>
        <div class="indicador-card">
          <div class="card-header">FEC</div>
          <div class="card-valor">{{ fec.valor.toFixed(2) }}</div>
          <div class="card-limite">Limite {{ fec.limite.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- Métricas TAM/SAM com gráfico -->
    <div class="report-section">
      <h2>Métricas TAM e SAM</h2>
      <div class="metricas-grid">
        <div class="metrica-card">
          <div class="metrica-nome">TAM</div>
          <div class="metrica-valor">{{ tam.toFixed(2) }}</div>
        </div>
        <div class="metrica-card">
          <div class="metrica-nome">SAM</div>
          <div class="metrica-valor">{{ sam.toFixed(2) }}</div>
        </div>
      </div>
      <canvas id="graficoPdf" width="500" height="250"></canvas>
    </div>

    <!-- Leituras complementares -->
    <div class="report-section">
      <h2>Leituras Complementares</h2>
      <div class="complementares-grid">
        <div class="complementar-card">
          <div class="card-header">PERDAS TÉCNICAS</div>
          <div class="card-valor">{{ perdasTecnicas.valor.toFixed(2) }}%</div>
          <div class="card-limite">Limite {{ perdasTecnicas.limite.toFixed(2) }}%</div>
        </div>
        <div class="complementar-card">
          <div class="card-header">PERDAS NÃO TÉCNICAS</div>
          <div class="card-valor">{{ perdasNaoTecnicas.valor.toFixed(2) }}%</div>
          <div class="card-limite">Limite {{ perdasNaoTecnicas.limite.toFixed(2) }}%</div>
        </div>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="report-footer">
      <p>Relatório gerado automaticamente pelo sistema de monitoramento</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import Chart from 'chart.js/auto'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const props = defineProps<{
  tam: number
  sam: number
  dec?: number
  fec?: number
  decLimite?: number
  fecLimite?: number
}>()

const reportContent = ref<HTMLElement | null>(null)
let chart: any = null
const dataGeracao = ref(new Date().toLocaleString('pt-BR'))

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
    return 'Acima do limite'
  } else if (indicadorPrincipal.value.valor < indicadorPrincipal.value.limite * 0.8) {
    return 'Abaixo do limite'
  } else {
    return 'Próximo do limite'
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

async function initChart() {
  const canvas = document.getElementById('graficoPdf') as HTMLCanvasElement
  if (!canvas) {
    console.warn('Canvas do gráfico não encontrado')
    return
  }
  
  if (chart) {
    chart.destroy()
    chart = null
  }
  
  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['TAM', 'SAM'],
      datasets: [{
        label: 'Métricas',
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
          labels: {
            font: { size: 12 }
          }
        }
      }
    }
  })
}

async function generatePDF(): Promise<void> {
  try {
    if (!reportContent.value) {
      console.error('Conteúdo do relatório não encontrado')
      return
    }
    
    // Garantir que o gráfico esteja pronto
    await nextTick()
    await initChart()
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const canvas = await html2canvas(reportContent.value, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      windowWidth: reportContent.value.scrollWidth,
      windowHeight: reportContent.value.scrollHeight
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    const imgWidth = 190
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let position = 0
    let pageHeight = pdf.internal.pageSize.height
    let remainingHeight = imgHeight
    
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    remainingHeight -= pageHeight
    
    while (remainingHeight > 0) {
      pdf.addPage()
      position -= pageHeight
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      remainingHeight -= pageHeight
    }
    
    pdf.save(`relatorio_metricas_${new Date().getTime()}.pdf`)
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
  }
}

// Atualizar dados quando props mudarem
watch(() => [props.tam, props.sam, props.dec, props.fec], () => {
  indicadorPrincipal.value.valor = props.dec || 7.68
  indicadorPrincipal.value.limite = props.decLimite || 6.50
  dec.value.valor = props.dec || 7.68
  dec.value.limite = props.decLimite || 6.50
  fec.value.valor = props.fec || 3.68
  fec.value.limite = props.fecLimite || 3.20
  
  if (chart) {
    chart.data.datasets[0].data = [props.tam, props.sam]
    chart.update()
  }
})

onMounted(() => {
  nextTick(() => initChart())
})

defineExpose({ generatePDF })
</script>

<style scoped>
.report-pdf-container {
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: white;
  color: #232323;
  max-width: 800px;
  margin: 0 auto;
}

.report-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #1976d2;
}

.report-header h1 {
  color: #1976d2;
  margin-bottom: 10px;
  font-size: 24px;
}

.report-header p {
  color: #666;
  font-size: 12px;
}

.report-section {
  margin-bottom: 25px;
  page-break-inside: avoid;
}

.report-section h2 {
  color: #1976d2;
  font-size: 18px;
  margin-bottom: 15px;
  border-left: 3px solid #1976d2;
  padding-left: 10px;
}

.criticidade-box {
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.criticidade-label {
  font-size: 16px;
  font-weight: bold;
}

.criticidade-alta {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
}

.criticidade-media {
  background: #fff3e0;
  color: #ef6c00;
  border: 1px solid #ffcc80;
}

.criticidade-baixa {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.indicador-principal {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.valor-grande {
  font-size: 48px;
  font-weight: bold;
  color: #1976d2;
}

.indicador-info {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.contexto-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.contexto-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.contexto-item .label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.contexto-item .value {
  font-size: 14px;
  font-weight: 600;
  color: #232323;
}

.indicadores-grid,
.complementares-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.indicador-card,
.complementar-card,
.metrica-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.card-header {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
}

.card-valor,
.metrica-valor {
  font-size: 28px;
  font-weight: bold;
  color: #232323;
}

.card-limite {
  font-size: 11px;
  color: #999;
  margin-top: 5px;
}

.metricas-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.metrica-nome {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.report-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  text-align: center;
  font-size: 10px;
  color: #999;
}

#graficoPdf {
  max-width: 100%;
  height: auto;
  margin-top: 15px;
}
</style>