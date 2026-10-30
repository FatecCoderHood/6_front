<template>
  <div class="users-page">
    <div class="page-header">
      <h1 class="page-title">{{ t('users.title') }}</h1>
      <p class="page-subtitle">{{ t('users.subtitle') }}</p>
    </div>

    <div class="tabs-container">
      <button 
        @click="activeTab = 'approved'" 
        :class="['tab', { active: activeTab === 'approved' }]"
      >
        <span class="tab-icon" v-html="svg(mdiAccountCheck)"></span>
        <span>{{ t('users.approved') }}</span>
        <span class="tab-count">{{ approvedUsers.length }}</span>
      </button>
      <button 
        @click="activeTab = 'pending'" 
        :class="['tab', { active: activeTab === 'pending' }]"
      >
        <span class="tab-icon" v-html="svg(mdiAccountClock)"></span>
        <span>{{ t('users.pending') }}</span>
        <span class="tab-count">{{ pendingUsers.length }}</span>
      </button>
    </div>

    <!-- Tabela de Usuários Aprovados -->
    <div v-if="activeTab === 'approved'" class="table-container">
      <div class="table-header">
        <div class="search-box">
          <span class="search-icon" v-html="svg(mdiMagnify)"></span>
          <input 
            type="text" 
            v-model="searchApproved" 
            :placeholder="t('users.search')"
            class="search-input"
          />
        </div>
        <button class="btn-add" @click="openUserModal()">
          <span v-html="svg(mdiPlus)"></span>
          {{ t('users.newUser') }}
        </button>
      </div>

      <div class="table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th class="col-name">{{ t('users.name') }}</th>
              <th class="col-email">{{ t('users.email') }}</th>
              <th class="col-phone">{{ t('users.phone') }}</th>
              <th class="col-role">{{ t('users.role') }}</th>
              <th class="col-date">{{ t('users.date') }}</th>
              <th class="col-actions">{{ t('users.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredApprovedUsers" :key="user.id">
              <td>
                <div class="user-info">
                  <div class="user-avatar" v-html="svg(mdiAccountCircle)"></div>
                  <span class="user-name">{{ user.name }}</span>
                </div>
              </td>
              <td class="col-email" :title="user.email">{{ user.email }}</td>
              <td class="col-phone">{{ user.phone || '—' }}</td>
              <td>
                <span :class="['role-badge', getRoleClass(user.role)]">
                  {{ getRoleName(user.role) }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit" @click="openUserModal(user)" :title="t('users.edit')">
                    <span v-html="svg(mdiPencil)"></span>
                  </button>
                  <button class="action-btn delete" @click="softDeleteUser(user)" :title="t('users.delete')">
                    <span v-html="svg(mdiDelete)"></span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredApprovedUsers.length === 0">
              <td colspan="6" class="empty-state">
                <span v-html="svg(mdiAccountMultiple)"></span>
                <p>{{ t('users.noUsers') }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabela de Usuários Pendentes -->
    <div v-if="activeTab === 'pending'" class="table-container">
      <div class="table-header">
        <div class="search-box">
          <span class="search-icon" v-html="svg(mdiMagnify)"></span>
          <input 
            type="text" 
            v-model="searchPending" 
            :placeholder="t('users.searchPending')"
            class="search-input"
          />
        </div>
      </div>

      <div class="table-wrapper">
        <table class="users-table pending-table">
          <thead>
            <tr>
              <th class="col-name-pending">{{ t('users.name') }}</th>
              <th class="col-email-pending">{{ t('users.email') }}</th>
              <th class="col-phone-pending">{{ t('users.phone') }}</th>
              <th class="col-date-pending">{{ t('users.date') }}</th>
              <th class="col-actions-pending">{{ t('users.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredPendingUsers" :key="user.id">
              <td>
                <div class="user-info">
                  <div class="user-avatar" v-html="svg(mdiAccountClock)"></div>
                  <span class="user-name">{{ user.name }}</span>
                </div>
              </td>
              <td class="col-email-pending" :title="user.email">{{ user.email }}</td>
              <td class="col-phone-pending">{{ user.phone || '—' }}</td>
              <td class="col-date-pending">{{ formatDate(user.createdAt) }}</td>
              <td class="col-actions-pending">
                <div class="action-buttons">
                  <button class="action-btn approve" @click="approveUser(user)" :title="t('users.approve')">
                    <span v-html="svg(mdiCheckCircle)"></span>
                  </button>
                  <button class="action-btn reject" @click="rejectUser(user)" :title="t('users.reject')">
                    <span v-html="svg(mdiCloseCircle)"></span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPendingUsers.length === 0">
              <td colspan="5" class="empty-state">
                <span v-html="svg(mdiAccountCheck)"></span>
                <p>{{ t('users.noPending') }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Usuário -->
    <div v-if="showUserModal" class="modal" @click.self="closeUserModal">
      <div class="modal-content modal-user">
        <div class="modal-header">
          <h3>{{ editingUser ? t('users.editUser') : t('users.newUser') }}</h3>
          <button class="modal-close" @click="closeUserModal">&times;</button>
        </div>
        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-group">
            <label>{{ t('users.fullName') }} *</label>
            <input type="text" v-model="userForm.name" required class="form-input" />
          </div>
          <div class="form-group">
            <label>{{ t('users.email') }} *</label>
            <input type="email" v-model="userForm.email" required class="form-input" />
          </div>
          <div class="form-group">
            <label>UUID</label>
            <input type="text" v-model="userForm.uuid" disabled class="form-input" />
          </div>
          <div class="form-group">
            <label>{{ t('users.phone') }}</label>
            <input type="tel" v-model="userForm.phone" class="form-input" />
          </div>
          <div class="form-group">
            <label>{{ t('users.role') }} *</label>
            <select v-model="userForm.role" required class="form-select">
              <option value="user">{{ t('users.roleUser') }}</option>
              <option value="admin">{{ t('users.roleAdmin') }}</option>
            </select>
          </div>
          <div class="form-group" v-if="!editingUser">
            <label>{{ t('users.password') }} *</label>
            <input type="password" v-model="userForm.password" required class="form-input" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeUserModal">{{ t('users.cancel') }}</button>
            <button type="submit" class="btn-save">{{ t('users.save') }}</button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal
      :visible="showConfirmModal"
      :type="confirmModalType"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirm-text="confirmModalConfirmText"
      @confirm="handleConfirmAction"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '../composables/useToast'
import ConfirmModal from '../components/ConfirmModal.vue'
import { 
  mdiAccountCheck, 
  mdiAccountClock, 
  mdiMagnify, 
  mdiPlus, 
  mdiPencil, 
  mdiDelete, 
  mdiCheckCircle,
  mdiCloseCircle,
  mdiAccountCircle,
  mdiAccountMultiple
} from '@mdi/js'
import { MockUsers } from '../service/UsersMock'
import LogsMock from '../service/LogsMock'
import authUsecase from '../service/auth.usecase'

const { t } = useI18n()
const { success, error, warning, info } = useToast()

interface User {
  id: number
  uuid: string
  name: string
  email: string
  phone: string
  password?: string
  role: 'admin' | 'user'
  status: 'approved' | 'pending'
  createdAt: string
}

const activeTab = ref<'approved' | 'pending'>('approved')
const searchApproved = ref('')
const searchPending = ref('')
const showUserModal = ref(false)
const editingUser = ref(false)
const editingUserId = ref<number | null>(null)

const showConfirmModal = ref(false)
const confirmModalType = ref<'approve' | 'reject' | 'delete' | 'warning'>('warning')
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmModalConfirmText = ref('Confirmar')
let pendingAction: (() => void) | null = null
let pendingUser: User | null = null

const userForm = ref({
  name: '',
  uuid: '',
  email: '',
  phone: '',
  role: 'user' as 'admin' | 'user',
  password: ''
})

const users = ref<User[]>([])

const approvedUsers = computed(() => users.value.filter(user => user.status === 'approved'))
const pendingUsers = computed(() => users.value.filter(user => user.status === 'pending'))

const filteredApprovedUsers = computed(() => 
  approvedUsers.value.filter(user => 
    user.name.toLowerCase().includes(searchApproved.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchApproved.value.toLowerCase())
  )
)

const filteredPendingUsers = computed(() => 
  pendingUsers.value.filter(user => 
    user.name.toLowerCase().includes(searchPending.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchPending.value.toLowerCase())
  )
)

const formatDate = (dateString: string) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getRoleClass = (role: string) => role === 'admin' ? 'role-admin' : 'role-user'
const getRoleName = (role: string) => role === 'admin' ? t('users.roleAdmin') : t('users.roleUser')

const loadUsers = () => {
  const allUsers = MockUsers.getAll(false)
  users.value = allUsers.map(user => ({
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    phone: user.phone || '—',
    role: user.role,
    status: user.status,
    createdAt: user.createdAt
  }))
}

const openConfirmModal = (type: 'approve' | 'reject' | 'delete', user: User) => {
  confirmModalType.value = type
  pendingUser = user
  
  switch(type) {
    case 'approve':
      confirmModalTitle.value = 'Aprovar Usuário'
      confirmModalMessage.value = `Tem certeza que deseja APROVAR o usuário "${user.name}"?`
      confirmModalConfirmText.value = 'Aprovar'
      pendingAction = () => executeApprove()
      break
    case 'reject':
      confirmModalTitle.value = 'Recusar Usuário'
      confirmModalMessage.value = `Tem certeza que deseja RECUSAR o usuário "${user.name}"?\n\nEsta ação irá remover o usuário do sistema permanentemente.`
      confirmModalConfirmText.value = 'Recusar'
      pendingAction = () => executeReject()
      break
    case 'delete':
      confirmModalTitle.value = 'Excluir Usuário'
      confirmModalMessage.value = `Tem certeza que deseja EXCLUIR o usuário "${user.name}"?\n\n⚠️ Esta ação irá apenas ocultar o usuário da lista. Seus dados permanecem no sistema por questões de auditoria.`
      confirmModalConfirmText.value = 'Excluir'
      pendingAction = () => executeSoftDelete()
      break
  }
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  pendingAction = null
  pendingUser = null
}

const handleConfirmAction = () => {
  if (pendingAction) pendingAction()
  closeConfirmModal()
}

const executeApprove = () => {
  if (!pendingUser) return
  const updated = MockUsers.approve(pendingUser.id)
  if (updated) {
    loadUsers()
    const currentUser = authUsecase.getCurrentUser()
    if (currentUser) {
      LogsMock.registerAction(
        currentUser.uuid,
        currentUser.name,
        currentUser.role,
        'Aprovação de Usuário',
        'approve',
        pendingUser.uuid,
        '127.0.0.1'
      )
    }
    success(`${pendingUser.name} foi aprovado com sucesso!`, 'Usuário Aprovado')
  }
}

const executeReject = () => {
  if (!pendingUser) return
  const deleted = MockUsers.hardDelete(pendingUser.id)
  if (deleted) {
    loadUsers()
    const currentUser = authUsecase.getCurrentUser()
    if (currentUser) {
      LogsMock.registerAction(
        currentUser.uuid,
        currentUser.name,
        currentUser.role,
        'Recusa de Usuário',
        'reject',
        pendingUser.uuid,
        '127.0.0.1'
      )
    }
    warning(`${pendingUser.name} foi recusado e removido do sistema.`, 'Usuário Recusado')
  }
}

const executeSoftDelete = () => {
  if (!pendingUser) return
  const updated = MockUsers.softDelete(pendingUser.id)
  if (updated) {
    loadUsers()
    const currentUser = authUsecase.getCurrentUser()
    if (currentUser) {
      LogsMock.registerAction(
        currentUser.uuid,
        currentUser.name,
        currentUser.role,
        'Exclusão de Usuário',
        'delete',
        pendingUser.uuid,
        '127.0.0.1'
      )
    }
    info(`${pendingUser.name} foi excluído logicamente.`, 'Usuário Excluído')
  }
}

const approveUser = (user: User) => openConfirmModal('approve', user)
const rejectUser = (user: User) => openConfirmModal('reject', user)
const softDeleteUser = (user: User) => openConfirmModal('delete', user)

const openUserModal = (user?: User) => {
  if (user) {
    editingUser.value = true
    editingUserId.value = user.id
    userForm.value = {
      name: user.name,
      uuid: user.uuid,
      email: user.email,
      phone: user.phone === '—' ? '' : user.phone,
      role: user.role,
      password: ''
    }
  } else {
    editingUser.value = false
    editingUserId.value = null
    userForm.value = {
      name: '',
      uuid: '',
      email: '',
      phone: '',
      role: 'user',
      password: ''
    }
  }
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  editingUser.value = false
  editingUserId.value = null
  userForm.value = {
    name: '',
    uuid: '',
    email: '',
    phone: '',
    role: 'user',
    password: ''
  }
}

const saveUser = async () => {
  const currentUser = authUsecase.getCurrentUser()
  
  if (editingUser.value && editingUserId.value) {
    const updated = MockUsers.update(editingUserId.value, {
      name: userForm.value.name,
      phone: userForm.value.phone,
      role: userForm.value.role
    })
    if (updated) {
      loadUsers()
      if (currentUser) {
        LogsMock.registerAction(
          currentUser.uuid,
          currentUser.name,
          currentUser.role,
          'Edição de Usuário',
          'update',
          userForm.value.uuid,
          '127.0.0.1'
        )
      }
      success('As alterações foram salvas com sucesso!', 'Usuário Atualizado')
    }
  } else {
    const existing = MockUsers.getByEmail(userForm.value.email)
    if (existing) {
      error('Já existe um usuário cadastrado com este e-mail.', 'E-mail Existente')
      return
    }
    
    if (!userForm.value.password || userForm.value.password.length < 6) {
      warning('A senha deve ter no mínimo 6 caracteres.', 'Senha Inválida')
      return
    }
    
    const newUser = MockUsers.create({
      name: userForm.value.name,
      email: userForm.value.email,
      password: userForm.value.password,
      phone: userForm.value.phone,
      role: userForm.value.role,
      termsAccepted: true,
      privacyAccepted: true,
      communicationsAccepted: false
    })
    loadUsers()
    
    if (currentUser) {
      LogsMock.registerAction(
        currentUser.uuid,
        currentUser.name,
        currentUser.role,
        'Criação de Usuário',
        'create',
        newUser.uuid,
        '127.0.0.1'
      )
    }
    success(`O usuário ${userForm.value.name} foi criado com sucesso!`, 'Usuário Criado')
  }
  closeUserModal()
}

onMounted(() => {
  loadUsers()
})

const svg = (path: string, size = 16) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.users-page {
  padding: 1rem;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.page-header {
  margin-bottom: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

.tabs-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  flex-wrap: wrap;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.tab:hover {
  color: #FFD700;
}

.tab.active {
  color: #FFD700;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #FFD700;
}

.tab-count {
  background: rgba(255, 215, 0, 0.2);
  padding: 1px 5px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
}

.table-container {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 280px;
  min-width: 180px;
}

.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 6px 10px 6px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.05);
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 5px 12px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: none;
  border-radius: 6px;
  color: #0a0a0a;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(255, 215, 0, 0.3);
}

.table-wrapper {
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
}

.users-table {
  width: 100%;
  min-width: 800px;
  max-width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  table-layout: fixed;
}

.col-name { width: 18%; }
.col-email { width: 25%; }
.col-phone { width: 15%; }
.col-role { width: 10%; }
.col-date { width: 15%; }
.col-actions { width: 17%; }

.col-name-pending { width: 22%; }
.col-email-pending { width: 28%; }
.col-phone-pending { width: 18%; }
.col-date-pending { width: 17%; }
.col-actions-pending { width: 15%; }

.users-table thead {
  background: rgba(255, 215, 0, 0.05);
}

.users-table th {
  padding: 0.6rem;
  text-align: left;
  color: #FFD700;
  font-weight: 600;
  white-space: nowrap;
}

.users-table td {
  padding: 0.6rem;
  color: rgba(255, 255, 255, 0.8);
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  vertical-align: middle;
  word-break: break-word;
  overflow-wrap: break-word;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  flex-shrink: 0;
}

.user-avatar svg {
  width: 24px;
  height: 24px;
  color: #FFD700;
}

.user-name {
  word-break: break-word;
  overflow-wrap: break-word;
}

.role-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}

.role-admin {
  background: rgba(255, 68, 68, 0.2);
  color: #ff4444;
}

.role-user {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.action-buttons {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

.action-btn.edit:hover {
  background: rgba(33, 150, 243, 0.2);
  border-color: #2196f3;
  color: #2196f3;
}

.action-btn.delete:hover {
  background: rgba(244, 67, 54, 0.2);
  border-color: #f44336;
  color: #f44336;
}

.action-btn.approve:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4caf50;
  color: #4caf50;
}

.action-btn.reject:hover {
  background: rgba(244, 67, 54, 0.2);
  border-color: #f44336;
  color: #f44336;
}

.empty-state {
  text-align: center;
  padding: 2rem !important;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-user {
  max-width: 500px;
  width: 90%;
}

.modal-content {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.modal-header h3 {
  color: #FFD700;
  margin: 0;
  font-size: 1.2rem;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #FFD700;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.05);
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.btn-cancel,
.btn-save {
  padding: 6px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-save {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: none;
  color: #0a0a0a;
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(255, 215, 0, 0.3);
}

@media (max-width: 1024px) {
  .users-table {
    min-width: 750px;
  }
}

@media (max-width: 768px) {
  .users-page {
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .table-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: 100%;
    width: 100%;
  }
  
  .btn-add {
    width: 100%;
    justify-content: center;
  }
  
  .users-table {
    min-width: 650px;
    font-size: 0.7rem;
  }
  
  .action-btn svg {
    width: 12px;
    height: 12px;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.4rem;
  }
}
</style>