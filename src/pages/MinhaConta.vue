<!-- src/pages/MinhaConta.vue -->
<template>
  <div class="minha-conta-page">
    <!-- Fundo animado -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere second"></div>
      <div class="gradient-sphere third"></div>
    </div>

    <!-- Conteúdo principal -->
    <div class="content">
      <div class="profile-container">
        <!-- Header do perfil -->
        <div class="profile-header">
          <div class="avatar-container">
            <div class="avatar">
              <span class="avatar-initials">{{ userInitials }}</span>
            </div>
          </div>
          <div class="profile-info">
            <h1>{{ user.name }}</h1>
            <p class="user-email">{{ user.email }}</p>
            <p class="user-role">{{ user.role === 'admin' ? t('users.roleAdmin') : t('users.roleUser') }}</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="profile-tabs">
          <button 
            class="tab" 
            :class="{ active: activeTab === 'info' }"
            @click="activeTab = 'info'"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
            {{ t('profile.tabs.info') }}
          </button>
          <button 
            class="tab" 
            :class="{ active: activeTab === 'security' }"
            @click="activeTab = 'security'"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M3 17L12 22L21 17" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M3 12L12 17L21 12" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
            {{ t('profile.tabs.security') }}
          </button>
          <button 
            class="tab" 
            :class="{ active: activeTab === 'consent' }"
            @click="activeTab = 'consent'"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            {{ t('profile.tabs.consent') }}
          </button>
        </div>

        <!-- Tab: Informações Pessoais -->
        <div v-if="activeTab === 'info'" class="tab-content">
          <form @submit.prevent="saveUserInfo" class="profile-form">
            <div class="form-group">
              <label>{{ t('users.fullName') }}</label>
              <input 
                v-model="editUser.name" 
                type="text" 
                required
                :placeholder="t('users.fullName')"
              />
            </div>

            <div class="form-group">
              <label>{{ t('users.email') }}</label>
              <input 
                v-model="editUser.email" 
                type="email" 
                required
                :placeholder="t('users.email')"
              />
            </div>

            <div class="form-group">
              <label>{{ t('users.phone') }}</label>
              <input 
                v-model="editUser.phone" 
                type="tel" 
                :placeholder="t('users.phone')"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ t('users.save') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Tab: Segurança -->
        <div v-if="activeTab === 'security'" class="tab-content">
          <form @submit.prevent="changePassword" class="profile-form">
            <div class="form-group">
              <label>{{ t('profile.currentPassword') }}</label>
              <input 
                v-model="passwordData.currentPassword" 
                type="password" 
                required
                :placeholder="t('profile.currentPassword')"
              />
            </div>

            <div class="form-group">
              <label>{{ t('profile.newPassword') }}</label>
              <input 
                v-model="passwordData.newPassword" 
                type="password" 
                required
                :placeholder="t('profile.newPassword')"
              />
            </div>

            <div class="form-group">
              <label>{{ t('profile.confirmNewPassword') }}</label>
              <input 
                v-model="passwordData.confirmPassword" 
                type="password" 
                required
                :placeholder="t('profile.confirmNewPassword')"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save" :disabled="!isPasswordValid">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15V3M15 6L12 3L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ t('profile.changePassword') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Tab: Consentimento -->
        <div v-if="activeTab === 'consent'" class="tab-content">
          <div class="consent-section">
            <div class="consent-card">
              <div class="consent-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="#FFD700" stroke-width="1.5" fill="none"/>
                  <path d="M3 17L12 22L21 17" stroke="#FFD700" stroke-width="1.5" fill="none"/>
                  <path d="M3 12L12 17L21 12" stroke="#FFD700" stroke-width="1.5" fill="none"/>
                </svg>
                <h3>{{ t('profile.termsAndConsent') }}</h3>
              </div>
              <div class="consent-content">
                <div class="consent-options">
                  <label class="checkbox-label required disabled">
                    <input type="checkbox" v-model="consent.termsAccepted" disabled />
                    <span>{{ t('profile.acceptTerms') }} <strong class="terms-link" @click="openTermsModal">{{ t('profile.termsOfUse') }}</strong> <span class="required-badge">({{ t('profile.requiredCannotUncheck') }})</span></span>
                  </label>
                  <label class="checkbox-label required disabled">
                    <input type="checkbox" v-model="consent.privacyAccepted" disabled />
                    <span>{{ t('profile.acceptPrivacy') }} <strong class="terms-link" @click="openPrivacyModal">{{ t('profile.privacyPolicy') }}</strong> <span class="required-badge">({{ t('profile.requiredCannotUncheck') }})</span></span>
                  </label>
                  <label class="checkbox-label optional">
                    <input type="checkbox" v-model="consent.communicationsAccepted" />
                    <span>{{ t('profile.acceptCommunications') }} <span class="optional-badge">({{ t('profile.optional') }})</span></span>
                  </label>
                </div>
                <div class="consent-buttons">
                  <button class="btn-save-consent" @click="saveConsent">
                    {{ t('users.save') }}
                  </button>
                </div>
              </div>
            </div>

            <div class="revoke-section">
              <div class="revoke-card">
                <div class="revoke-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4l3 3M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#ff4444" stroke-width="1.5" fill="none"/>
                  </svg>
                  <h3>{{ t('profile.revokeConsent') }}</h3>
                </div>
                <div class="revoke-content">
                  <div class="warning-text">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4M12 16h.01M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#ff4444" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <span>{{ t('profile.revokeWarning') }}</span>
                  </div>
                  <button class="btn-revoke" @click="openRevokeModal">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H5H21M8 6V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V6M10 11V16M14 11V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M19 6V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V6" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    {{ t('profile.revokeAndDelete') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Termos de Uso -->
    <div v-if="showTermsModal" class="modal-overlay" @click.self="closeTermsModal">
      <div class="modal-content terms-modal">
        <div class="modal-header">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="#FFD700" stroke-width="1.5" fill="none"/>
            <path d="M3 17L12 22L21 17" stroke="#FFD700" stroke-width="1.5" fill="none"/>
            <path d="M3 12L12 17L21 12" stroke="#FFD700" stroke-width="1.5" fill="none"/>
          </svg>
          <h2>{{ t('profile.termsOfUseTitle') }}</h2>
        </div>
        <div class="modal-body terms-content">
          <h3>1. {{ t('profile.termsSection1') }}</h3>
          <p>{{ t('profile.termsSection1Text') }}</p>
          
          <h3>2. {{ t('profile.termsSection2') }}</h3>
          <p>{{ t('profile.termsSection2Text') }}</p>
          
          <h3>3. {{ t('profile.termsSection3') }}</h3>
          <p>{{ t('profile.termsSection3Text') }}</p>
          
          <h3>4. {{ t('profile.termsSection4') }}</h3>
          <p>{{ t('profile.termsSection4Text') }}</p>
          
          <h3>5. {{ t('profile.termsSection5') }}</h3>
          <p>{{ t('profile.termsSection5Text') }}</p>
          
          <h3>6. {{ t('profile.termsSection6') }}</h3>
          <p>{{ t('profile.termsSection6Text') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-primary-modal" @click="closeTermsModal">{{ t('profile.understood') }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de Política de Privacidade -->
    <div v-if="showPrivacyModal" class="modal-overlay" @click.self="closePrivacyModal">
      <div class="modal-content terms-modal">
        <div class="modal-header">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="#FFD700" stroke-width="1.5" fill="none"/>
            <path d="M3 17L12 22L21 17" stroke="#FFD700" stroke-width="1.5" fill="none"/>
            <path d="M12 2V12" stroke="#FFD700" stroke-width="1.5"/>
          </svg>
          <h2>{{ t('profile.privacyPolicyTitle') }}</h2>
        </div>
        <div class="modal-body terms-content">
          <h3>1. {{ t('profile.privacySection1') }}</h3>
          <p>{{ t('profile.privacySection1Text') }}</p>
          
          <h3>2. {{ t('profile.privacySection2') }}</h3>
          <p>{{ t('profile.privacySection2Text') }}</p>
          
          <h3>3. {{ t('profile.privacySection3') }}</h3>
          <p>{{ t('profile.privacySection3Text') }}</p>
          
          <h3>4. {{ t('profile.privacySection4') }}</h3>
          <p>{{ t('profile.privacySection4Text') }}</p>
          
          <h3>5. {{ t('profile.privacySection5') }}</h3>
          <p>{{ t('profile.privacySection5Text') }}</p>
          
          <h3>6. {{ t('profile.privacySection6') }}</h3>
          <p>{{ t('profile.privacySection6Text') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-primary-modal" @click="closePrivacyModal">{{ t('profile.understood') }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Revogação -->
    <div v-if="showRevokeModal" class="modal-overlay" @click.self="closeRevokeModal">
      <div class="modal-content">
        <div class="modal-header">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4l3 3M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#ff4444" stroke-width="1.5" fill="none"/>
          </svg>
          <h2>{{ t('profile.attention') }}</h2>
        </div>
        <div class="modal-body">
          <p>{{ t('profile.revokeConfirmation') }}</p>
          <p class="warning">{{ t('profile.thisActionWill') }}</p>
          <ul>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6L18 18" stroke="#ff4444" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ t('profile.removeAllData') }}
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6L18 18" stroke="#ff4444" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ t('profile.revokeAccess') }}
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6L18 18" stroke="#ff4444" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ t('profile.deleteHistory') }}
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6L18 18" stroke="#ff4444" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ t('profile.cannotUndo') }}
            </li>
          </ul>
          <p class="confirm-text">{{ t('profile.typeToConfirm') }} <strong>"{{ t('profile.confirmDeleteText') }}"</strong>:</p>
          <input 
            v-model="confirmDeleteText" 
            type="text" 
            :placeholder="t('profile.confirmDeleteText')"
            class="confirm-input"
          />
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeRevokeModal">{{ t('users.cancel') }}</button>
          <button 
            class="btn-confirm-revoke" 
            @click="confirmRevokeConsent"
            :disabled="confirmDeleteText !== t('profile.confirmDeleteText')"
          >
            {{ t('profile.confirmRevoke') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de sucesso -->
    <div v-if="showToast" class="toast">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17L4 12" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import authUsecase from '../service/auth.usecase'
import { MockUsers } from '../service/UsersMock'
import LogsMock from '../service/LogsMock'

const router = useRouter()
const { t } = useI18n()

// Dados do usuário - serão preenchidos pelo loadUserData
const user = reactive({
  id: 0,
  name: '',
  email: '',
  phone: '',
  role: ''
})

const editUser = reactive({
  name: '',
  email: '',
  phone: ''
})

// Dados de senha
const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Consentimento - termos obrigatórios sempre true e desabilitados
const consent = reactive({
  termsAccepted: true,
  privacyAccepted: true,
  communicationsAccepted: false
})

// UI State
const activeTab = ref('info')
const showRevokeModal = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const confirmDeleteText = ref('')

// Computed
const userInitials = computed(() => {
  if (!user.name) return '?'
  return user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const isPasswordValid = computed(() => {
  return passwordData.currentPassword && 
         passwordData.newPassword && 
         passwordData.confirmPassword &&
         passwordData.newPassword === passwordData.confirmPassword &&
         passwordData.newPassword.length >= 6
})

// Carregar dados do usuário logado
const loadUserData = () => {
  const currentUser = authUsecase.getCurrentUser()
  if (currentUser) {
    const fullUser = MockUsers.getByEmail(currentUser.email)
    if (fullUser) {
      user.id = fullUser.id
      user.name = fullUser.name
      user.email = fullUser.email
      user.phone = fullUser.phone || ''
      user.role = fullUser.role
      
      Object.assign(editUser, {
        name: user.name,
        email: user.email,
        phone: user.phone
      })
      
      consent.termsAccepted = fullUser.termsAccepted
      consent.privacyAccepted = fullUser.privacyAccepted
      consent.communicationsAccepted = fullUser.communicationsAccepted
    }
  } else {
    // Fallback para dados mockados caso não haja usuário logado
    const mockUser = MockUsers.getByEmail('admin@tecsys.com')
    if (mockUser) {
      user.id = mockUser.id
      user.name = mockUser.name
      user.email = mockUser.email
      user.phone = mockUser.phone || ''
      user.role = mockUser.role
      
      Object.assign(editUser, {
        name: user.name,
        email: user.email,
        phone: user.phone
      })
      
      consent.termsAccepted = mockUser.termsAccepted
      consent.privacyAccepted = mockUser.privacyAccepted
      consent.communicationsAccepted = mockUser.communicationsAccepted
    }
  }
}

// Funções de notificação
const showSuccessToast = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Salvar informações do usuário
const saveUserInfo = () => {
  const currentUser = authUsecase.getCurrentUser()
  if (currentUser && user.id) {
    MockUsers.update(user.id, {
      name: editUser.name,
      email: editUser.email,
      phone: editUser.phone
    })
    Object.assign(user, editUser)
    
    // Atualizar também no auth storage
    const updatedUser = { ...currentUser, name: editUser.name, email: editUser.email }
    const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage
    storage.setItem('user_data', JSON.stringify(updatedUser))
    
    showSuccessToast(t('profile.infoUpdated'))
  } else {
    showSuccessToast(t('profile.infoUpdated'))
  }
}

// Alterar senha
const changePassword = () => {
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    showSuccessToast(t('profile.passwordsDoNotMatch'))
    return
  }
  
  if (passwordData.newPassword.length < 6) {
    showSuccessToast(t('profile.passwordMinLength'))
    return
  }
  
  if (user.id) {
    MockUsers.update(user.id, {
      password: passwordData.newPassword
    })
  }
  
  showSuccessToast(t('profile.passwordChanged'))
  passwordData.currentPassword = ''
  passwordData.newPassword = ''
  passwordData.confirmPassword = ''
}

// Salvar consentimento (apenas a opção de comunicações)
const saveConsent = () => {
  if (user.id) {
    MockUsers.update(user.id, {
      communicationsAccepted: consent.communicationsAccepted
    })
  }
  showSuccessToast(t('profile.preferencesSaved'))
}

// Abrir modais
const openTermsModal = () => {
  showTermsModal.value = true
}

const closeTermsModal = () => {
  showTermsModal.value = false
}

const openPrivacyModal = () => {
  showPrivacyModal.value = true
}

const closePrivacyModal = () => {
  showPrivacyModal.value = false
}

// Revogar consentimento
const openRevokeModal = () => {
  showRevokeModal.value = true
  confirmDeleteText.value = ''
}

const closeRevokeModal = () => {
  showRevokeModal.value = false
  confirmDeleteText.value = ''
}

const confirmRevokeConsent = () => {
  if (confirmDeleteText.value === t('profile.confirmDeleteText')) {
    if (user.id) {
      // Registrar log de exclusão da própria conta
      const currentUser = authUsecase.getCurrentUser()
      if (currentUser && currentUser.uuid) {
        LogsMock.registerAction(
          currentUser.uuid,
          currentUser.name,
          currentUser.role,
          'Exclusão de Conta Própria',
          'delete',
          currentUser.uuid,
          '127.0.0.1'
        )
      }
      // Excluir o usuário
      MockUsers.hardDelete(user.id)
    }
    authUsecase.logout()
    showSuccessToast(t('profile.accountDeleted'))
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
    closeRevokeModal()
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
/* Mantenha todo o CSS anterior igual */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.minha-conta-page {
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
  max-width: 800px;
  margin: 0 auto;
}

.profile-container {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  overflow: hidden;
  animation: fadeInUp 0.8s ease;
}

/* Header do perfil */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: rgba(255, 215, 0, 0.05);
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0a0a0a;
}

.profile-info h1 {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 0.5rem;
}

.user-email {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}

.user-role {
  color: #FFD700;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Tabs */
.profile-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 2rem;
}

.tab {
  padding: 1rem 2rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab:hover {
  color: white;
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

/* Tab Content */
.tab-content {
  padding: 2rem;
}

/* Formulário */
.profile-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.05);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-actions {
  margin-top: 2rem;
}

.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 24px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: none;
  border-radius: 12px;
  color: #0a0a0a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-save:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
}

/* Consentimento */
.consent-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.consent-card, .revoke-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 1.5rem;
}

.consent-header, .revoke-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.consent-header h3, .revoke-header h3 {
  color: white;
  font-size: 1.2rem;
}

.consent-content p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.terms-link {
  color: #FFD700;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
}

.consent-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #FFD700;
}

.checkbox-label.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.checkbox-label.disabled input {
  cursor: not-allowed;
}

.required-badge {
  font-size: 0.7rem;
  color: #ff8888;
  background: rgba(255, 68, 68, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
}

.optional-badge {
  font-size: 0.7rem;
  color: #888;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
}

.consent-buttons {
  display: flex;
  gap: 1rem;
}

.btn-save-consent {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0a0a0a;
  font-weight: 600;
}

.btn-save-consent:hover {
  transform: translateY(-2px);
}

/* Revoke */
.warning-text {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #ff8888;
  background: rgba(255, 68, 68, 0.1);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border-left: 3px solid #ff4444;
}

.warning-text svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.warning-text span {
  flex: 1;
  line-height: 1.4;
}

.btn-revoke {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 24px;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: 12px;
  color: #ff8888;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-revoke:hover {
  background: rgba(255, 68, 68, 0.2);
  border-color: #ff4444;
  transform: translateY(-2px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 24px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 215, 0, 0.2);
  animation: scaleIn 0.3s ease;
}

.terms-modal {
  max-width: 700px;
}

.terms-content {
  text-align: left;
}

.terms-content h3 {
  color: #FFD700;
  margin: 1rem 0 0.5rem;
  font-size: 1.1rem;
}

.terms-content p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  color: white;
  margin-top: 0.5rem;
  font-size: 1.5rem;
}

.modal-body p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.modal-body ul {
  margin: 1rem 0;
  padding-left: 0;
  list-style: none;
}

.modal-body ul li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.75rem 0;
  color: rgba(255, 255, 255, 0.8);
}

.modal-body ul li svg {
  flex-shrink: 0;
}

.warning {
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.confirm-text {
  margin: 1rem 0 0.5rem;
  font-weight: 600;
}

.confirm-input {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  text-align: center;
  font-family: monospace;
  letter-spacing: 1px;
}

.confirm-input:focus {
  outline: none;
  border-color: #FFD700;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-confirm-revoke, .btn-primary-modal {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-confirm-revoke {
  background: #ff4444;
  color: white;
}

.btn-confirm-revoke:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-confirm-revoke:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 68, 68, 0.3);
}

.btn-primary-modal {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0a0a0a;
  font-weight: 600;
}

.btn-primary-modal:hover {
  transform: translateY(-2px);
}

/* Toast */
.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border-left: 3px solid #4CAF50;
  color: white;
  z-index: 1001;
  animation: slideInRight 0.3s ease;
}

/* Animações */
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .minha-conta-page {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-tabs {
    padding: 0 1rem;
  }

  .tab {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }

  .tab svg {
    display: none;
  }

  .tab-content {
    padding: 1rem;
  }

  .consent-buttons {
    flex-direction: column;
  }

  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>