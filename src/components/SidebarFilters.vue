<template>
  <div>
    <!-- Overlay quando sidebar está aberta -->
    <div v-if="showSidebar" class="sidebar-overlay" @click="closeSidebar"></div>
    
    <!-- Sidebar de filtros -->
    <div :class="['sidebar-filters', { 'sidebar-filters-open': showSidebar }]">
      <button class="close-btn" @click="closeSidebar">×</button>
      <h2>Filtros do Mapa</h2>
      
      <!-- Filtro de Distribuidoras -->
      <div class="filtro-grupo">
        <label class="group-label">Distribuidoras</label>
        <div class="custom-dropdown" :class="{ open: dropdownOpen === 'distribuidoras' }">
          <div class="dropdown-header" @click.stop="toggleDropdown('distribuidoras')">
            <span>{{ getDistribuidorasLabel() }}</span>
            <span class="dropdown-arrow">▼</span>
          </div>
          <div class="dropdown-content" v-if="dropdownOpen === 'distribuidoras'">
            <label class="checkbox-option">
              <input type="checkbox" :checked="isAllDistribuidorasSelected" @change="selectAllDistribuidoras" />
              <span>Todas</span>
            </label>
            <label v-for="dist in distribuidoras" :key="dist.id" class="checkbox-option">
              <input type="checkbox" :value="dist.id" v-model="selectedDistribuidoras" />
              <span>{{ dist.nome }}</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Indicadores DEC -->
      <div class="filtro-grupo">
        <label class="group-label">Indicadores DEC</label>
        <div class="custom-dropdown" :class="{ open: dropdownOpen === 'dec' }">
          <div class="dropdown-header" @click.stop="toggleDropdown('dec')">
            <span>{{ getIndicadoresDECLabel() }}</span>
            <span class="dropdown-arrow">▼</span>
          </div>
          <div class="dropdown-content" v-if="dropdownOpen === 'dec'">
            <label class="checkbox-option">
              <input type="checkbox" v-model="selectedIndicadoresDEC" value="DEC" />
              <span>DEC</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="selectedIndicadoresDEC" value="DEC_realizado" />
              <span>DEC Realizado</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="selectedIndicadoresDEC" value="DEC_limite" />
              <span>DEC Limite</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="selectedIndicadoresDEC" value="Desvio_DEC" />
              <span>Desvio DEC</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Indicadores FEC -->
      <div class="filtro-grupo">
        <label class="group-label">Indicadores FEC</label>
        <div class="custom-dropdown" :class="{ open: dropdownOpen === 'fec' }">
          <div class="dropdown-header" @click.stop="toggleDropdown('fec')">
            <span>{{ getIndicadoresFECLabel() }}</span>
            <span class="dropdown-arrow">▼</span>
          </div>
          <div class="dropdown-content" v-if="dropdownOpen === 'fec'">
            <label class="checkbox-option">
              <input type="checkbox" v-model="selectedIndicadoresFEC" value="FEC" />
              <span>FEC</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="selectedIndicadoresFEC" value="FEC_realizado" />
              <span>FEC Realizado</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="selectedIndicadoresFEC" value="FEC_limite" />
              <span>FEC Limite</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="selectedIndicadoresFEC" value="Desvio_FEC" />
              <span>Desvio FEC</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Opções adicionais -->
      <div class="filtro-grupo">
        <label class="checkbox-item">
          <input type="checkbox" v-model="showHeatmap" />
          <span>Modo Heatmap</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="mostrarTorres" />
          <span>Mostrar Torres de Transmissão</span>
        </label>
      </div>
      
      <!-- Botões -->
      <button class="btn-atualizar" @click="emitirFiltros">Aplicar Filtros</button>
      <button class="btn-limpar" @click="limparFiltros">Limpar Filtros</button>
    </div>
    
    <!-- Botão para abrir a sidebar -->
    <button v-if="!showSidebar" class="open-filters-btn" @click="openSidebar">
      <span>☰</span> Filtros
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { distribuidoras } from '../service/mockData'

const showSidebar = ref(false)
const dropdownOpen = ref<string | null>(null)

// Filtros
const selectedDistribuidoras = ref<number[]>([])
const selectedIndicadoresDEC = ref<string[]>(['DEC'])
const selectedIndicadoresFEC = ref<string[]>(['FEC'])
const showHeatmap = ref(false)
const mostrarTorres = ref(true)

const emit = defineEmits(['aplicar-filtros'])

// Computed properties
const isAllDistribuidorasSelected = computed(() => {
  return selectedDistribuidoras.value.length === distribuidoras.length
})

// Funções da Sidebar
function openSidebar() {
  showSidebar.value = true
}

function closeSidebar() {
  showSidebar.value = false
  dropdownOpen.value = null
}

// Funções do Dropdown
function toggleDropdown(dropdown: string) {
  if (dropdownOpen.value === dropdown) {
    dropdownOpen.value = null
  } else {
    dropdownOpen.value = dropdown
  }
}

// Funções de Label
function getDistribuidorasLabel(): string {
  if (selectedDistribuidoras.value.length === 0) return 'Selecione...'
  if (selectedDistribuidoras.value.length === distribuidoras.length) return 'Todas'
  if (selectedDistribuidoras.value.length === 1) {
    const dist = distribuidoras.find(d => d.id === selectedDistribuidoras.value[0])
    return dist?.nome || '1 selecionada'
  }
  return `${selectedDistribuidoras.value.length} selecionadas`
}

function getIndicadoresDECLabel(): string {
  if (selectedIndicadoresDEC.value.length === 0) return 'Nenhum selecionado'
  if (selectedIndicadoresDEC.value.length === 4) return 'Todos selecionados'
  return `${selectedIndicadoresDEC.value.length} selecionado(s)`
}

function getIndicadoresFECLabel(): string {
  if (selectedIndicadoresFEC.value.length === 0) return 'Nenhum selecionado'
  if (selectedIndicadoresFEC.value.length === 4) return 'Todos selecionados'
  return `${selectedIndicadoresFEC.value.length} selecionado(s)`
}

// Funções de Seleção
function selectAllDistribuidoras(event: Event) {
  const checkbox = event.target as HTMLInputElement
  if (checkbox.checked) {
    selectedDistribuidoras.value = distribuidoras.map(d => d.id)
  } else {
    selectedDistribuidoras.value = []
  }
}

// Funções principais
function emitirFiltros() {
  const indicadoresDEC = {
    DEC: selectedIndicadoresDEC.value.includes('DEC'),
    DEC_realizado: selectedIndicadoresDEC.value.includes('DEC_realizado'),
    DEC_limite: selectedIndicadoresDEC.value.includes('DEC_limite'),
    Desvio_DEC: selectedIndicadoresDEC.value.includes('Desvio_DEC')
  }
  
  const indicadoresFEC = {
    FEC: selectedIndicadoresFEC.value.includes('FEC'),
    FEC_realizado: selectedIndicadoresFEC.value.includes('FEC_realizado'),
    FEC_limite: selectedIndicadoresFEC.value.includes('FEC_limite'),
    Desvio_FEC: selectedIndicadoresFEC.value.includes('Desvio_FEC')
  }
  
  emit('aplicar-filtros', {
    distribuidoras: selectedDistribuidoras.value,
    indicadoresDEC,
    indicadoresFEC,
    heatmap: showHeatmap.value,
    mostrarTorres: mostrarTorres.value
  })
  closeSidebar()
}

function limparFiltros() {
  selectedDistribuidoras.value = []
  selectedIndicadoresDEC.value = ['DEC']
  selectedIndicadoresFEC.value = ['FEC']
  showHeatmap.value = false
  mostrarTorres.value = true
}
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2002;
  backdrop-filter: blur(3px);
}

.sidebar-filters {
  width: 380px;
  background: rgba(0, 0, 0, 0.7);
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
  gap: 20px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-100%);
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  overflow-y: auto;
}

.sidebar-filters-open {
  transform: translateX(0);
}

.open-filters-btn {
  position: fixed;
  left: 116px;
  top: 20px;
  z-index: 2000;
  background: transparent;
  backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
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
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateX(2px);
}

.close-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-size: 24px;
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
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
  transform: rotate(90deg);
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 5px;
}

/* Custom Dropdown Styles */
.custom-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-header {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.dropdown-header:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
}

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.2s;
}

.custom-dropdown.open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
  max-height: 250px;
  overflow-y: auto;
  padding: 8px 0;
  backdrop-filter: blur(10px);
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
  color: #fff;
  font-size: 0.9rem;
}

.checkbox-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.checkbox-option input {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.checkbox-option span {
  flex: 1;
}

/* Scrollbar para dropdown content */
.dropdown-content::-webkit-scrollbar {
  width: 6px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Checkbox items normais */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.2s;
  padding: 5px 0;
}

.checkbox-item:hover {
  color: #fff;
}

.checkbox-item input {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.btn-atualizar {
  margin-top: 10px;
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-atualizar:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.btn-limpar {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 8px 0;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.btn-limpar:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

h2 {
  font-size: 1.3rem;
  margin-bottom: 5px;
  font-weight: 600;
  color: #fff;
  border-left: 3px solid #1976d2;
  padding-left: 12px;
}

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