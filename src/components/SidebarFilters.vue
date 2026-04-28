<template>
  <div>
    <!-- Overlay quando sidebar está aberta -->
    <div v-if="showSidebar" class="sidebar-overlay" @click="toggleSidebar"></div>
    
    <!-- Sidebar de filtros -->
    <div :class="['sidebar-filters', { 'sidebar-filters-open': showSidebar }]">
      <button class="close-btn" @click="toggleSidebar">×</button>
      <h2>Filtros do Mapa</h2>
      
      <div class="filtro-grupo">
        <label>Distribuidora</label>
        <select v-model="selectedDistribuidora">
          <option value="">Todas</option>
          <option v-for="d in distribuidoras" :key="d.id" :value="d.id">{{ d.nome }}</option>
        </select>
      </div>
      
      <div class="filtro-grupo">
        <label>Situação do Alerta</label>
        <select v-model="selectedSituacao">
          <option value="">Todas</option>
          <option value="pendente">Pendente</option>
          <option value="analise">Análise</option>
          <option value="vistoria">Vistoria</option>
          <option value="acao">Ação Fiscal</option>
          <option value="encerrado">Encerrado</option>
        </select>
      </div>
      
      <div class="filtro-grupo">
        <label>Período</label>
        <div class="datas">
          <input type="date" v-model="dataInicial" placeholder="Data inicial" />
          <span>até</span>
          <input type="date" v-model="dataFinal" placeholder="Data final" />
        </div>
      </div>
      
      <div class="filtro-grupo">
        <label>Indicadores</label>
        <div class="indicadores">
          <label><input type="checkbox" v-model="indicadores.DEC" /> DEC</label>
          <label><input type="checkbox" v-model="indicadores.FEC" /> FEC</label>
        </div>
      </div>
      
      <div class="filtro-grupo">
        <label>
          <input type="checkbox" v-model="showHeatmap" />
          Modo Heatmap
        </label>
      </div>
      
      <button class="btn-atualizar" @click="emitirFiltros">Aplicar Filtros</button>
    </div>
    
    <!-- Botão para abrir a sidebar - SÓ aparece quando a sidebar está FECHADA -->
    <button v-if="!showSidebar" class="open-filters-btn" @click="toggleSidebar">
      <span>☰</span> Filtros
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { distribuidoras } from '../service/mockData'

const showSidebar = ref(false)
const selectedDistribuidora = ref('')
const selectedSituacao = ref('')
const dataInicial = ref('')
const dataFinal = ref('')
const indicadores = ref({ DEC: true, FEC: true })
const showHeatmap = ref(false)

const emit = defineEmits(['aplicar-filtros'])

function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}

function emitirFiltros() {
  emit('aplicar-filtros', {
    distribuidora: selectedDistribuidora.value,
    situacao: selectedSituacao.value,
    dataInicial: dataInicial.value,
    dataFinal: dataFinal.value,
    indicadores: { ...indicadores.value },
    heatmap: showHeatmap.value,
  })
  showSidebar.value = false
}
</script>

<style scoped>
/* Overlay - fica ATRÁS da sidebar mas ACIMA do mapa */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2002;
  backdrop-filter: blur(3px);
}

/* Sidebar de filtros - z-index mais alto que a navbar */
.sidebar-filters {
  width: 340px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  color: #fff;
  padding: 28px 20px 20px 20px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.5);
  z-index: 2003;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-100%);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  overflow-y: auto;
}

.sidebar-filters-open {
  transform: translateX(0);
}

/* Botão para abrir filtros - SÓ aparece quando sidebar está fechada */
.open-filters-btn {
  position: fixed;
  left: 116px;
  top: 20px;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
  border-radius: 8px;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.open-filters-btn:hover {
  background: rgba(0, 0, 0, 0.6);
  transform: translateX(2px);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Botão fechar da sidebar */
.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 28px;
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filtro-grupo label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2px;
  color: rgba(255, 255, 255, 0.9);
}

.filtro-grupo select,
.filtro-grupo input[type="date"] {
  background: rgba(255, 255, 255, 0.95);
  color: #232323;
  border: none;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.filtro-grupo select:focus,
.filtro-grupo input[type="date"]:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.5);
}

.indicadores {
  display: flex;
  gap: 20px;
}

.indicadores label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.datas {
  display: flex;
  gap: 10px;
  align-items: center;
}

.datas input {
  flex: 1;
}

.btn-atualizar {
  margin-top: 12px;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-atualizar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.btn-atualizar:active {
  transform: translateY(0);
}

h2 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  font-weight: 600;
  color: #fff;
  border-left: 3px solid #1976d2;
  padding-left: 12px;
}

/* Scrollbar */
.sidebar-filters::-webkit-scrollbar {
  width: 6px;
}

.sidebar-filters::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.sidebar-filters::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.sidebar-filters::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>