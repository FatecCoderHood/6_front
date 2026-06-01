<template>
  <div class="not-found-page">
    <!-- Fundo animado -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere second"></div>
      <div class="gradient-sphere third"></div>
      <div class="energy-particles">
        <div class="particle" v-for="i in 30" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- Conteúdo 404 -->
    <div class="content">
      <div class="error-container">
        <!-- Número 404 animado -->
        <div class="error-code">
          <span class="digit">4</span>
          <span class="digit">0</span>
          <span class="digit">4</span>
        </div>

        <!-- Ícone de erro -->
        <div class="error-icon">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#FFD700"/>
          </svg>
        </div>

        <!-- Mensagem de erro -->
        <h1 class="error-title">Página Não Encontrada</h1>
        <p class="error-message">
          Ops! A página que você está procurando pode ter sido removida, 
          teve o nome alterado ou está temporariamente indisponível.
        </p>

        <!-- Botão único -->
        <div class="action-buttons">
          <button class="btn-primary" @click="goHome">
            <span class="btn-icon" v-html="svg(mdiHome)"></span>
            Voltar para o Início
          </button>
        </div>

        <!-- Footer -->
        <div class="error-footer">
          <p>© 2026 Enersigh - Sistema de Monitoramento</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { mdiHome } from '@mdi/js'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const getParticleStyle = (i: number) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${5 + Math.random() * 15}s`,
    opacity: 0.1 + Math.random() * 0.4,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`
  }
}

const svg = (path: string, size = 20) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.not-found-page {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
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
  bottom: -10px;
  background: #FFD700;
  border-radius: 50%;
  animation: floatParticle linear infinite;
}

@keyframes floatParticle {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
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
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  animation: fadeInUp 0.8s ease;
}

.error-container {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 30px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.5s ease;
}

/* Código 404 animado */
.error-code {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 6rem;
  font-weight: 800;
}

.digit {
  color: #FFD700;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  animation: bounce 2s ease-in-out infinite;
  display: inline-block;
}

.digit:nth-child(1) { animation-delay: 0s; }
.digit:nth-child(2) { animation-delay: 0.2s; }
.digit:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Ícone de erro */
.error-icon {
  margin-bottom: 1.5rem;
  animation: rotate 3s ease-in-out infinite;
}

.error-icon svg {
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.3));
}

@keyframes rotate {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}

/* Títulos */
.error-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.error-message {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

/* Botões */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0a0a0a;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
}

.btn-icon svg {
  width: 20px;
  height: 20px;
}

/* Footer */
.error-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.error-footer p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
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

/* Responsividade */
@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
  
  .error-container {
    padding: 2rem;
  }
  
  .error-code {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-message {
    font-size: 0.9rem;
  }
  
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .error-container {
    padding: 1.5rem;
  }
  
  .error-code {
    font-size: 3rem;
  }
  
  .error-icon svg {
    width: 80px;
    height: 80px;
  }
}
</style>