<template>
  <div class="login-page">
    <!-- Fundo animado -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere second"></div>
      <div class="gradient-sphere third"></div>
      <div class="energy-particles">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- Container do Login -->
    <div class="login-container">
      <div class="login-card">
        <!-- Logo -->
        <div class="logo-section">
          <img 
            src="/src/assets/logo_512.png" 
            alt="Enersigh Logo" 
            class="login-logo"
            @error="handleImageError"
          />
          <div class="logo-fallback" style="display: none;">
            <span class="title">Enersigh</span>
            <span class="subtitle">Sistema de Monitoramento</span>
          </div>
        </div>

        <!-- Título -->
        <h2 class="login-title">Bem-vindo de volta</h2>
        <p class="login-subtitle">Faça login para acessar o sistema</p>

        <!-- Formulário -->
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-group">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
            <input 
              type="email" 
              v-model="credentials.email"
              placeholder="E-mail"
              required
              class="login-input"
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
              v-model="credentials.password"
              placeholder="Senha"
              required
              class="login-input"
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

          <!-- ALTERAÇÃO AQUI: Troquei "Esqueceu a senha?" por link de cadastro -->
          <div class="options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" />
              <span>Lembrar-me</span>
            </label>
            <router-link to="/cadastro" class="register-link">Não tem conta? Cadastre-se</router-link>
          </div>

          <button type="submit" class="login-button" :disabled="loading">
            <span v-if="!loading">Entrar</span>
            <div v-else class="spinner"></div>
          </button>
        </form>

        <!-- Rodapé -->
        <div class="login-footer">
          <p>© 2026 Enersigh - Sistema de Monitoramento</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authUsecase from '../service/auth.usecase'

const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

const credentials = ref({
  email: '',
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

const handleLogin = async () => {
  loading.value = true
  try {
    const auth = await authUsecase.login(credentials.value.email, credentials.value.password)
    if (!auth || !auth.token) {
      alert('Falha ao autenticar. Verifique suas credenciais.')
      loading.value = false
      return
    }

    authUsecase.persist(auth, rememberMe.value)

    // reload to ensure interceptors pick token OR just navigate
    router.push('/')
  } catch (err: any) {
    console.error('Login error', err)
    alert(err?.response?.data?.message || 'Erro ao fazer login')
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
/* TODO O SEU CSS PERMANECE EXATAMENTE IGUAL */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', 'Poppins', sans-serif;
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

/* Partículas de energia */
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

/* Container do Login */
.login-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

/* Card de Login */
.login-card {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 30px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  animation: fadeInUp 0.8s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
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

/* Logo - AUMENTADO */
.logo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 0.25rem; /* REDUZIDO: era 2rem, agora 1rem */
}

.login-logo {
  height: 120px; /* AUMENTADO: era 100px, agora 180px */
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.3));
  transition: all 0.3s ease;
}

.login-logo:hover {
  filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.5));
  transform: scale(1.02);
}

.logo-fallback {
  display: none;
  flex-direction: column;
  align-items: center;
}

.logo-fallback .title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.logo-fallback .subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Títulos */
.login-title {
  text-align: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.login-subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

/* Formulário */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.login-input {
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

.login-input:focus {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.05);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.login-input:focus + .input-icon {
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

/* Opções */
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.checkbox-label input {
  cursor: pointer;
  accent-color: #FFD700;
}

/* ESTILO NOVO PARA O LINK DE CADASTRO */
.register-link {
  color: #FFD700;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.85rem;
}

.register-link:hover {
  color: #FFA500;
  text-decoration: underline;
}

/* Botão de Login */
.login-button {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0a0a0a;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spinner */
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

/* Rodapé */
.login-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.login-footer p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .login-card {
    padding: 2rem;
    margin: 1rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
  
  .login-logo {
    height: 140px; /* Ajustado para telas menores */
  }
  
  .logo-section {
    margin-bottom: 0.75rem; /* Reduzido em telas menores */
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .login-logo {
    height: 120px; /* Ajustado para telas muito pequenas */
  }
  
  .logo-section {
    margin-bottom: 0.5rem;
  }
  
  .options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>