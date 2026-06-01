<template>
  <div class="cadastro-page">
    <!-- Fundo animado -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere second"></div>
      <div class="gradient-sphere third"></div>
      <div class="energy-particles">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- Container do Cadastro -->
    <div class="cadastro-container">
      <div class="cadastro-card">
        <!-- Botão voltar -->
        <button class="back-button" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Logo -->
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

        <!-- Título -->
        <h2 class="cadastro-title">Criar Conta</h2>
        <p class="cadastro-subtitle">Preencha os dados para se cadastrar</p>

        <!-- Formulário -->
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
              placeholder="Nome completo"
              required
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
              placeholder="Telefone"
              required
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
              placeholder="Senha"
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

          <!-- Termos de Uso -->
          <div class="terms-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="acceptTerms" required />
              <span>
                Li e aceito os 
                <button type="button" class="terms-link" @click="showTermsModal = true">
                  Termos de Uso
                </button>
              </span>
            </label>
          </div>

          <button type="submit" class="cadastro-button" :disabled="loading || !acceptTerms">
            <span v-if="!loading">Cadastrar</span>
            <div v-else class="spinner"></div>
          </button>
        </form>

        <!-- Link para login -->
        <div class="cadastro-footer">
          <p>Já tem uma conta? <router-link to="/login" class="login-link">Faça login</router-link></p>
        </div>
      </div>
    </div>

    <!-- Modal de Termos de Uso -->
    <div v-if="showTermsModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Termos de Uso</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <p>Em desenvolvimento...</p>
          <p style="margin-top: 1rem; color: rgba(255,255,255,0.6);">
            Os termos de uso serão adicionados em breve.
          </p>
        </div>
        <div class="modal-footer">
          <button class="modal-button" @click="closeModal">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import usersApi from '../api/users.api'

const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)
const acceptTerms = ref(false)
const showTermsModal = ref(false)

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

const closeModal = () => {
  showTermsModal.value = false
}

const handleCadastro = async () => {
  // Validar todos os campos
  if (!formData.value.name || !formData.value.email || !formData.value.phone || !formData.value.password) {
    alert('Por favor, preencha todos os campos!')
    return
  }

  if (!acceptTerms.value) {
    alert('Você precisa aceitar os Termos de Uso para se cadastrar!')
    return
  }

  loading.value = true

  try {
    const payload = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      password: formData.value.password
    }
    await usersApi.register(payload)
    alert('Cadastro realizado com sucesso! Aguarde aprovação do administrador ou faça login quando disponível.')
    router.push('/login')
  } catch (err: any) {
    console.error('Erro no cadastro', err)
    alert(err?.response?.data?.message || 'Erro ao cadastrar usuário')
  } finally {
    loading.value = false
  }
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

/* Fundo animado (mesmo do login) */
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
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0));
}

.gradient-sphere.third {
  width: 600px;
  height: 600px;
  top: 20%;
  left: -10%;
  animation-delay: -10s;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.08), rgba(255, 215, 0, 0));
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

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
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
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.9rem;
}

.checkbox-label input {
  cursor: pointer;
  accent-color: #FFD700;
  width: 18px;
  height: 18px;
}

.terms-link {
  background: none;
  border: none;
  color: #FFD700;
  cursor: pointer;
  font-size: 0.9rem;
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

/* Modal */
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
  max-width: 500px;
  animation: scaleIn 0.3s ease;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.modal-header h3 {
  color: #FFD700;
  font-size: 1.5rem;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #FFD700;
}

.modal-body {
  padding: 1.5rem;
  color: white;
  min-height: 200px;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  display: flex;
  justify-content: flex-end;
}

.modal-button {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0a0a0a;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
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

/* Responsividade */
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