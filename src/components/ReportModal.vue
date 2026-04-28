<template>
  <div class="modal-bg">
    <div class="modal">
      <h2>Relatório de Métricas</h2>
      <p><b>TAM:</b> {{ tam }}</p>
      <p><b>SAM:</b> {{ sam }}</p>
      <canvas id="grafico" width="300" height="150"></canvas>
      <button @click="baixarPDF">Baixar PDF</button>
      <button @click="$emit('close')">Fechar</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'
import jsPDF from 'jspdf'
const props = defineProps<{ tam: number, sam: number, filtros: any }>()
let chart: any
onMounted(() => {
  chart = new Chart(document.getElementById('grafico') as HTMLCanvasElement, {
    type: 'bar',
    data: {
      labels: ['TAM', 'SAM'],
      datasets: [{
        label: 'Métricas',
        data: [props.tam, props.sam],
        backgroundColor: ['#1976d2', '#43a047']
      }]
    }
  })
})
function baixarPDF() {
  const pdf = new jsPDF()
  pdf.text('Relatório de Métricas', 10, 10)
  pdf.text(`TAM: ${props.tam}`, 10, 20)
  pdf.text(`SAM: ${props.sam}`, 10, 30)
  // Adiciona gráfico como imagem
  const canvas = document.getElementById('grafico') as HTMLCanvasElement
  const imgData = canvas.toDataURL('image/png')
  pdf.addImage(imgData, 'PNG', 10, 40, 180, 80)
  pdf.save('relatorio.pdf')
}
</script>
<style scoped>
.modal-bg {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: #0008;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  min-width: 350px;
  box-shadow: 0 2px 16px #0003;
}
button { margin: 8px 8px 0 0; }
</style>
