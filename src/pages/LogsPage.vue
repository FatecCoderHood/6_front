<!-- src/pages/LogsPage.vue -->
<template>
  <div class="logs-page">
    <!-- Fundo animado -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere second"></div>
      <div class="gradient-sphere third"></div>
    </div>

    <!-- Conteúdo principal -->
    <div class="content">
      <div class="page-header">
        <h1 class="page-title">{{ t('logs.title') }}</h1>
        <p class="page-subtitle">{{ t('logs.subtitle') }}</p>
      </div>

      <!-- Filtros -->
      <div class="filters-card">
        <div class="filter-group">
          <label>{{ t('logs.search') }}</label>
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input 
              type="text" 
              v-model="searchTerm" 
              :placeholder="t('logs.searchPlaceholder')"
              class="filter-input"
            />
          </div>
        </div>
        <div class="filter-group">
          <label>{{ t('logs.actionType') }}</label>
          <select v-model="filterActionType" class="filter-select">
            <option value="">{{ t('logs.all') }}</option>
            <option value="create">Criação</option>
            <option value="update">Edição</option>
            <option value="delete">Exclusão</option>
            <option value="approve">Aprovação</option>
            <option value="reject">Recusa</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
        </div>
        <div class="filter-group">
          <label>{{ t('logs.userRole') }}</label>
          <select v-model="filterUserRole" class="filter-select">
            <option value="">{{ t('logs.all') }}</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuário</option>
          </select>
        </div>
        <button class="btn-clear" @click="clearFilters">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {{ t('logs.clearFilters') }}
        </button>
      </div>

      <!-- Estatísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#FFD700" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ filteredLogs.length }}</span>
            <span class="stat-label">{{ t('logs.totalLogs') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" stroke="#4CAF50" stroke-width="1.5" fill="none"/>
              <path d="M12 2C17.52 2 22 6.48 22 12" stroke="#FFD700" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ uniqueUsers }}</span>
            <span class="stat-label">{{ t('logs.uniqueUsers') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M3 13H8L10 8L14 16L16 11L21 13" stroke="#FFD700" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ actionsByType.login }}</span>
            <span class="stat-label">{{ t('logs.logins') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="#4CAF50" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ actionsByType.approve }}</span>
            <span class="stat-label">{{ t('logs.approvals') }}</span>
          </div>
        </div>
      </div>

      <!-- Tabela de Logs -->
      <div class="table-container">
        <div class="table-header">
          <span>{{ t('logs.auditLog') }}</span>
          <button class="btn-export" @click="exportLogs">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3V15M12 15L9 12M12 15L15 12M5 21H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            {{ t('logs.export') }}
          </button>
        </div>
        <div class="table-wrapper">
          <table class="logs-table">
            <thead>
              <tr>
                <th class="col-timestamp">{{ t('logs.timestamp') }}</th>
                <th class="col-user">{{ t('logs.user') }}</th>
                <th class="col-action">{{ t('logs.action') }}</th>
                <th class="col-details">{{ t('logs.details') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in paginatedLogs" :key="log.id">
                <td class="timestamp-cell">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V12L15 15M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                  </svg>
                  {{ formatDate(log.timestamp) }}
                </td>
                <td>
                  <!-- Condição para não mostrar nome e avatar quando for "Exclusão de Conta Própria" -->
                  <div v-if="log.action === 'Exclusão de Conta Própria'" class="user-info-placeholder">
                    <div class="user-avatar anonymous">
                      <span>?</span>
                    </div>
                    <div class="user-details">
                      <span class="user-name anonymous-text">Usuário Excluído</span>
                      <span class="user-uuid anonymous-text">Conta removida</span>
                    </div>
                  </div>
                  <div v-else class="user-info">
                    <div class="user-avatar" :class="log.userRole || 'user'">
                      <span>{{ getUserInitials(log.userName) }}</span>
                    </div>
                    <div class="user-details">
                      <span class="user-name">{{ log.userName || 'Usuário Desconhecido' }}</span>
                      <span class="user-uuid">{{ log.userUuid || 'UUID não disponível' }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span :class="['action-badge', log.actionType || 'default']">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path v-if="log.actionType === 'login'" d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                      <path v-else-if="log.actionType === 'logout'" d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                      <path v-else-if="log.actionType === 'create'" d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <path v-else-if="log.actionType === 'update'" d="M15 3L21 9M21 9L14 16H8V10L15 3Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                      <path v-else-if="log.actionType === 'delete'" d="M3 6H5H21M8 6V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V6M10 11V16M14 11V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <path v-else-if="log.actionType === 'approve'" d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <path v-else-if="log.actionType === 'reject'" d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <path v-else d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    {{ log.action || 'Ação desconhecida' }}
                  </span>
                </td>
                <td class="details-cell">{{ log.details || 'Sem detalhes' }}</td>
              </tr>
              <tr v-if="filteredLogs.length === 0">
                <td colspan="4" class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#FFD700" stroke-width="1.5" fill="none"/>
                  </svg>
                  <p>{{ t('logs.noLogs') }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginação -->
        <div v-if="filteredLogs.length > 0" class="pagination">
          <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import LogsMock, { type LogEntry, formatLogDate } from '../service/LogsMock'

const { t } = useI18n()

// Estado
const logs = ref<LogEntry[]>([])
const searchTerm = ref('')
const filterActionType = ref('')
const filterUserRole = ref('')
const currentPage = ref(1)
const itemsPerPage = 15

// Computed
const filteredLogs = computed(() => {
  let filtered = logs.value
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(log => 
      (log.userName || '').toLowerCase().includes(term) ||
      (log.userUuid || '').toLowerCase().includes(term) ||
      (log.action || '').toLowerCase().includes(term) ||
      (log.details || '').toLowerCase().includes(term)
    )
  }
  
  if (filterActionType.value) {
    filtered = filtered.filter(log => log.actionType === filterActionType.value)
  }
  
  if (filterUserRole.value) {
    filtered = filtered.filter(log => log.userRole === filterUserRole.value)
  }
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLogs.value.slice(start, end)
})

const uniqueUsers = computed(() => {
  const users = new Set(logs.value.map(log => log.userUuid).filter(u => u))
  return users.size
})

const actionsByType = computed(() => {
  const stats = {
    login: 0,
    logout: 0,
    create: 0,
    update: 0,
    delete: 0,
    approve: 0,
    reject: 0,
    anonymize: 0
  }
  
  logs.value.forEach(log => {
    if (log.actionType && stats[log.actionType as keyof typeof stats] !== undefined) {
      stats[log.actionType as keyof typeof stats]++
    }
  })
  
  return stats
})

// Métodos
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return formatLogDate(dateStr)
}

const getUserInitials = (name: string) => {
  if (!name || typeof name !== 'string') return '?'
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return initials || '?'
}

const clearFilters = () => {
  searchTerm.value = ''
  filterActionType.value = ''
  filterUserRole.value = ''
  currentPage.value = 1
}

const exportLogs = () => {
  if (filteredLogs.value.length === 0) return
  
  const data = filteredLogs.value.map(log => ({
    Timestamp: formatDate(log.timestamp),
    Usuário: log.action === 'Exclusão de Conta Própria' ? 'Usuário Excluído' : (log.userName || 'Desconhecido'),
    UUID: log.action === 'Exclusão de Conta Própria' ? 'Conta removida' : (log.userUuid || 'N/A'),
    Ação: log.action || 'N/A',
    Detalhes: log.details || 'N/A'
  }))
  
  const csv = [
    Object.keys(data[0] || {}).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.setAttribute('download', `logs_${new Date().toISOString()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const loadLogs = () => {
  logs.value = LogsMock.getAll()
  console.log('Logs carregados:', logs.value.length)
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.logs-page {
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

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #FFD700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
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
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.filter-group {
  flex: 1;
  min-width: 180px;
}

.filter-group label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.search-box {
  position: relative;
}

.search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 10px 12px 10px 38px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.05);
}

.btn-clear {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  color: #FFD700;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-end;
}

.btn-clear:hover {
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-2px);
}

/* Estatísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #FFD700;
  transform: translateY(-3px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  display: block;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Tabela */
.table-container {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.table-header span {
  color: #FFD700;
  font-weight: 600;
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-export:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: #FFD700;
}

.table-wrapper {
  overflow-x: auto;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
}

.logs-table th,
.logs-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logs-table th {
  color: #FFD700;
  font-weight: 600;
  font-size: 0.85rem;
}

.logs-table td {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
}

.col-timestamp { width: 18%; }
.col-user { width: 25%; }
.col-action { width: 15%; }
.col-details { width: 42%; }

.timestamp-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info-placeholder {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
}

.user-avatar.admin {
  background: rgba(255, 68, 68, 0.2);
  color: #ff4444;
}

.user-avatar.user {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.user-avatar.anonymous {
  background: rgba(158, 158, 158, 0.2);
  color: #9e9e9e;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: white;
}

.anonymous-text {
  color: #9e9e9e !important;
  font-style: italic;
}

.user-uuid {
  font-size: 0.65rem;
  color: rgba(255, 215, 0, 0.7);
  font-family: monospace;
}

.action-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.action-badge.login,
.action-badge.logout {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.action-badge.create {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.action-badge.update {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
}

.action-badge.delete,
.action-badge.reject {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.action-badge.approve {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.details-cell {
  word-break: break-word;
  font-family: monospace;
  font-size: 0.8rem;
}

.empty-state {
  text-align: center;
  padding: 3rem !important;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Paginação */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
}

.page-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 6px;
  padding: 6px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 215, 0, 0.1);
  border-color: #FFD700;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  color: white;
  font-size: 0.85rem;
}

/* Responsividade */
@media (max-width: 1024px) {
  .col-timestamp { width: 20%; }
  .col-user { width: 30%; }
  .col-action { width: 15%; }
  .col-details { width: 35%; }
}

@media (max-width: 768px) {
  .logs-page {
    padding: 1rem;
  }

  .filters-card {
    flex-direction: column;
  }

  .filter-group {
    min-width: 100%;
  }

  .btn-clear {
    align-self: stretch;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .logs-table th,
  .logs-table td {
    padding: 8px 12px;
  }
  
  .col-user { width: 35%; }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-export {
    width: 100%;
    justify-content: center;
  }
}
</style>