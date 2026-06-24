<!-- src/pages/CadastroPage.vue -->
<template>
  <div class="cadastro-page">
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere second"></div>
      <div class="gradient-sphere third"></div>
      <div class="energy-particles">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <div class="cadastro-container">
      <div class="cadastro-card">
        <button class="back-button" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <div class="logo-section">
          <img 
            src="/src/assets/logo_512.png" 
            alt="Enersigh Logo" 
            class="cadastro-logo"
            @error="handleImageError"
          />
          <div class="logo-fallback" style="display: none;">
            <span class="title">Enersigh</span>
            <span class="subtitle">Sistema de Monitoramento</span>
          </div>
        </div>

        <h2 class="cadastro-title">Criar Conta</h2>
        <p class="cadastro-subtitle">Preencha os dados para se cadastrar</p>

        <form @submit.prevent="handleCadastro" class="cadastro-form">
          <div class="input-group">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
            <input
              type="text"
              v-model="formData.name"
              placeholder="Nome completo (opcional)"
              class="cadastro-input"
            />
          </div>

          <div class="input-group">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <input
              type="email"
              v-model="formData.email"
              placeholder="E-mail"
              required
              class="cadastro-input"
            />
          </div>

          <div class="input-group">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92V19.93C22.0001 20.4514 21.8587 20.9624 21.5931 21.4035C21.3274 21.8446 20.9495 22.1964 20.5 22.42C20.0832 22.6228 19.6279 22.7313 19.166 22.7377C18.7041 22.7441 18.246 22.6484 17.824 22.457C14.8477 21.1583 12.2647 19.1455 10.32 16.59C9.92205 16.0489 9.57215 15.4706 9.27499 14.86C9.06189 14.4161 8.96173 13.9271 8.98199 13.4358C9.00225 12.9445 9.14231 12.4651 9.38999 12.04C9.84733 11.2516 10.5381 10.621 11.366 10.24C11.9281 9.97246 12.5517 9.85721 13.1687 9.90524C13.7856 9.95326 14.3742 10.1626 14.871 10.51C15.4815 10.967 15.9631 11.5682 16.262 12.25C16.5629 12.9375 16.7656 13.6665 16.862 14.41C16.9378 14.9491 16.9033 15.4982 16.761 16.025C16.6409 16.4371 16.4258 16.8166 16.132 17.13C15.9383 17.3476 15.7715 17.5884 15.636 17.846L15.319 18.375C15.2267 18.5315 15.1617 18.7036 15.127 18.883C15.0978 19.0574 15.0945 19.2353 15.117 19.41C15.1327 19.556 15.1803 19.6964 15.2561 19.8216C15.3319 19.9469 15.434 20.054 15.555 20.135C15.6569 20.2075 15.7741 20.2577 15.8981 20.282C16.0222 20.3062 16.1503 20.3039 16.274 20.275L19.05 19.67C19.2772 19.6279 19.4971 19.552 19.7012 19.445C19.8925 19.3459 20.0634 19.2139 20.205 19.055C20.3756 18.8589 20.5086 18.6324 20.596 18.387C20.6715 18.1785 20.7114 17.9585 20.714 17.736L20.72 16.96C20.7173 16.7348 20.7639 16.5117 20.8567 16.3059C20.9495 16.1001 21.0862 15.9163 21.257 15.767C21.4293 15.6186 21.6319 15.5089 21.8512 15.445C22.0705 15.3812 22.3017 15.3649 22.528 15.397C22.7553 15.4284 22.9725 15.5086 23.166 15.632C23.3595 15.7555 23.5251 15.9194 23.651 16.112C23.7769 16.3047 23.8603 16.5222 23.8958 16.75C23.9314 16.9778 23.9185 17.211 23.858 17.434" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <input
              type="tel"
              v-model="formData.phone"
              placeholder="Telefone (opcional)"
              class="cadastro-input"
            />
          </div>

          <div class="input-group">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M7 11V7C7 4.2 9.2 2 12 2C14.8 2 17 4.2 17 7V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="formData.password"
              placeholder="Senha (mínimo 6 caracteres)"
              required
              class="cadastro-input"
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 2L22 22M6.7 6.7C4.2 8.2 2.5 10.9 1 12C2.5 13.1 6 16 12 16C13.4 16 14.7 15.7 15.9 15.3M9.3 9.3L14.7 14.7M17 10.7C17.6 10.2 18.2 9.7 18.7 9.3C20.2 8.2 21.5 10.9 23 12C22.1 13 20.8 14.2 19 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="terms-group required-group">
            <label class="checkbox-label required">
              <input type="checkbox" v-model="acceptTerms" required />
              <span>
                Li e aceito os 
                <button type="button" class="terms-link" @click="showTermsModal = true">
                  Termos de Uso
                </button>
                <span class="required-badge">(Obrigatório)</span>
              </span>
            </label>
          </div>

          <div class="terms-group required-group">
            <label class="checkbox-label required">
              <input type="checkbox" v-model="acceptPrivacy" required />
              <span>
                Li e aceito a 
                <button type="button" class="terms-link" @click="showPrivacyModal = true">
                  Política de Privacidade
                </button>
                <span class="required-badge">(Obrigatório)</span>
              </span>
            </label>
          </div>

          <div class="terms-group optional-group">
            <label class="checkbox-label optional">
              <input type="checkbox" v-model="acceptCommunications" />
              <span>
                Aceito receber comunicações sobre o sistema
                <span class="optional-badge">(Opcional)</span>
              </span>
            </label>
          </div>

          <button type="submit" class="cadastro-button" :disabled="loading || !acceptTerms || !acceptPrivacy">
            <span v-if="!loading">Cadastrar</span>
            <div v-else class="spinner"></div>
          </button>
        </form>

        <div class="cadastro-footer">
          <p>Já tem uma conta? <router-link to="/login" class="login-link">Faça login</router-link></p>
        </div>
      </div>
    </div>

    <!-- Modal de Termos de Uso -->
    <div v-if="showTermsModal" class="modal" @click.self="closeTermsModal">
      <div class="modal-content terms-modal">
        <div class="modal-header">
          <div class="modal-header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="#FFD700" stroke-width="1.5" fill="none"/>
              <path d="M3 17L12 22L21 17" stroke="#FFD700" stroke-width="1.5" fill="none"/>
              <path d="M3 12L12 17L21 12" stroke="#FFD700" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <h2 class="modal-header-title">Termos de Uso - Enersigh</h2>
        </div>
        <div class="modal-body terms-content">
          <div class="terms-section">
            <h3>1. Aceitação dos Termos</h3>
            <p>Ao acessar e usar o sistema Enersigh, você concorda em cumprir estes Termos de Uso.</p>
          </div>
          
          <div class="terms-section">
            <h3>2. Uso do Sistema</h3>
            <p>O sistema é destinado ao monitoramento e previsão de indicadores de energia. Você concorda em usar o sistema apenas para fins legais e autorizados.</p>
          </div>
          
          <div class="terms-section">
            <h3>3. Dados e Privacidade</h3>
            <p>Seus dados serão tratados conforme nossa Política de Privacidade. Você é responsável pela veracidade das informações fornecidas.</p>
          </div>
          
          <div class="terms-section">
            <h3>4. Responsabilidades</h3>
            <p>O Enersigh não se responsabiliza por decisões tomadas com base nos dados fornecidos pelo sistema sem validação adequada.</p>
          </div>
          
          <div class="terms-section">
            <h3>5. Modificações</h3>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento, com notificação prévia.</p>
          </div>
          
          <div class="terms-section">
            <h3>6. Cancelamento</h3>
            <p>Você pode cancelar sua conta a qualquer momento, o que resultará na exclusão de seus dados.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-button" @click="closeTermsModal">Entendi</button>
        </div>
      </div>
    </div>

    <!-- Modal de Política de Privacidade -->
    <div v-if="showPrivacyModal" class="modal" @click.self="closePrivacyModal">
      <div class="modal-content terms-modal">
        <div class="modal-header">
          <div class="modal-header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="#FFD700" stroke-width="1.5" fill="none"/>
              <path d="M3 17L12 22L21 17" stroke="#FFD700" stroke-width="1.5" fill="none"/>
              <path d="M12 2V12" stroke="#FFD700" stroke-width="1.5"/>
            </svg>
          </div>
          <h2 class="modal-header-title">Política de Privacidade - Enersigh</h2>
        </div>
        <div class="modal-body terms-content">
          <div class="terms-section">
            <h3>1. Coleta de Dados</h3>
            <p>Coletamos informações como nome, email e dados de uso do sistema para melhorar nossa prestação de serviços.</p>
          </div>
          
          <div class="terms-section">
            <h3>2. Uso das Informações</h3>
            <p>Seus dados são utilizados exclusivamente para monitoramento e previsão de indicadores de energia.</p>
          </div>
          
          <div class="terms-section">
            <h3>3. Compartilhamento</h3>
            <p>Não compartilhamos seus dados pessoais com terceiros sem seu consentimento explícito.</p>
          </div>
          
          <div class="terms-section">
            <h3>4. Segurança</h3>
            <p>Implementamos medidas de segurança para proteger seus dados contra acesso não autorizado.</p>
          </div>
          
          <div class="terms-section">
            <h3>5. Seus Direitos</h3>
            <p>Você tem direito a acessar, corrigir ou solicitar a exclusão de seus dados a qualquer momento.</p>
          </div>
          
          <div class="terms-section">
            <h3>6. Cookies</h3>
            <p>Utilizamos cookies para melhorar sua experiência de navegação no sistema.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-button" @click="closePrivacyModal">Entendi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { MockUsers } from '../service/UsersMock'
import usersApi from '../api/users.api'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { success, error, warning } = useToast()

const loading = ref(false)
const showPassword = ref(false)
const acceptTerms = ref(false)
const acceptPrivacy = ref(false)
const acceptCommunications = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: ''
})

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    const fallback = parent.querySelector('.logo-fallback') as HTMLElement
    if (fallback) fallback.style.display = 'flex'
  }
}

const goBack = () => {
  router.push('/login')
}

const closeTermsModal = () => {
  showTermsModal.value = false
}

const closePrivacyModal = () => {
  showPrivacyModal.value = false
}

const handleCadastro = async () => {
  if (!formData.value.email || !formData.value.password) {
    warning('Por favor, preencha todos os campos obrigatórios!', 'Campos Obrigatórios')
    return
  }

  if (formData.value.password.length < 6) {
    warning('A senha deve ter no mínimo 6 caracteres!', 'Senha Inválida')
    return
  }

  if (!acceptTerms.value) {
    warning('Você precisa aceitar os Termos de Uso para se cadastrar!', 'Termos Obrigatórios')
    return
  }

  if (!acceptPrivacy.value) {
    warning('Você precisa aceitar a Política de Privacidade para se cadastrar!', 'Política Obrigatória')
    return
  }

  loading.value = true

  try {
    await registerWithFallback()

    success(
      `Cadastro realizado com sucesso!\n\n⏳ Seu cadastro foi enviado para aprovação do administrador.`,
      'Cadastro Realizado!'
    )

    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (err: any) {
    console.error('Erro no cadastro', err)
    error(err?.message || 'Erro ao cadastrar usuário', 'Erro no Cadastro')
  } finally {
    loading.value = false
  }
}

const registerWithFallback = async () => {
  try {
    await usersApi.register(formData.value.email, formData.value.password, formData.value.name, formData.value.phone)
  } catch (err: any) {
    if (!err.response) {
      // enersight-auth unreachable — fall back to the mocked registry.
      registerWithMock()
      return
    }
    if (err.response.status === 409) {
      throw new Error('Este e-mail já está cadastrado!')
    }
    throw new Error('Não foi possível concluir o cadastro. Tente novamente.')
  }
}

const registerWithMock = () => {
  const existingUser = MockUsers.getByEmail(formData.value.email)
  if (existingUser) {
    throw new Error('Este e-mail já está cadastrado!')
  }

  MockUsers.create({
    name: formData.value.name,
    email: formData.value.email,
    password: formData.value.password,
    phone: formData.value.phone,
    role: 'user',
    termsAccepted: acceptTerms.value,
    privacyAccepted: acceptPrivacy.value,
    communicationsAccepted: acceptCommunications.value
  })
}

const getParticleStyle = (i: number) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${5 + Math.random() * 10}s`,
    opacity: 0.1 + Math.random() * 0.3
  }
}
</script>

<style scoped>
/* Mantenha todo o CSS existente e adicione/atualize: */

.required-group {
  margin-top: 0.5rem;
}

.optional-group {
  margin-top: 0.25rem;
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

.checkbox-label.required {
  color: rgba(255, 255, 255, 0.9);
}

.checkbox-label.optional {
  opacity: 0.8;
}

/* Estilos para os modais de termos */
.terms-modal {
  max-width: 700px;
  width: 90%;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.modal-header-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-header-title {
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

.terms-content {
  text-align: left;
  padding: 1rem 1.5rem;
}

.terms-section {
  margin-bottom: 1.25rem;
}

.terms-section:last-child {
  margin-bottom: 0;
}

.terms-section h3 {
  color: #FFD700;
  margin: 0 0 0.5rem 0;
  font-size: 1.05rem;
  font-weight: 600;
}

.terms-section p {
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  line-height: 1.5;
  font-size: 0.9rem;
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  display: flex;
  justify-content: flex-end;
}

.modal-button {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0a0a0a;
  border: none;
  padding: 8px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

/* Restante do CSS existente */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.cadastro-page {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', 'Poppins', sans-serif;
}

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

.energy-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #FFD700;
  border-radius: 50%;
  animation: floatParticle linear infinite;
}

@keyframes floatParticle {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
}

.cadastro-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.cadastro-card {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 30px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  animation: fadeInUp 0.8s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  position: relative;
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

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: translateX(-3px);
}

.logo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.cadastro-logo {
  height: 120px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.3));
}

.cadastro-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cadastro-subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.cadastro-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  transition: color 0.3s ease;
}

.cadastro-input {
  width: 100%;
  padding: 12px 45px 12px 45px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.cadastro-input:focus {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.05);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.cadastro-input:focus + .input-icon {
  color: #FFD700;
}

.password-toggle {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #FFD700;
}

.terms-group {
  margin: 0.25rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.85rem;
}

.checkbox-label input {
  cursor: pointer;
  accent-color: #FFD700;
  width: 16px;
  height: 16px;
}

.terms-link {
  background: none;
  border: none;
  color: #FFD700;
  cursor: pointer;
  font-size: 0.85rem;
  text-decoration: underline;
  padding: 0;
  margin: 0;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: #FFA500;
}

.cadastro-button {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0a0a0a;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
}

.cadastro-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.cadastro-button:hover::before {
  left: 100%;
}

.cadastro-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
}

.cadastro-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(10, 10, 10, 0.3);
  border-top-color: #0a0a0a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.cadastro-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cadastro-footer p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.login-link {
  color: #FFD700;
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 600;
}

.login-link:hover {
  color: #FFA500;
  text-decoration: underline;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: scaleIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .cadastro-card {
    padding: 2rem;
  }
  
  .cadastro-title {
    font-size: 1.5rem;
  }
  
  .cadastro-logo {
    height: 90px;
  }
  
  .terms-modal {
    max-width: 95%;
  }
  
  .modal-header-title {
    font-size: 1.1rem;
  }
  
  .terms-section h3 {
    font-size: 0.95rem;
  }
  
  .terms-section p {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .cadastro-card {
    padding: 1.5rem;
  }
  
  .back-button {
    top: 10px;
    left: 10px;
    width: 35px;
    height: 35px;
  }
}
</style>