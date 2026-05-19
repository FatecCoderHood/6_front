<!-- src/pages/HomePage.vue (com i18n) -->
<template>
  <div class="home-page">
    <!-- Fundo animado -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere second"></div>
      <div class="gradient-sphere third"></div>
    </div>

    <!-- Conteúdo principal -->
    <div class="content">
      <!-- Header com Logo -->
      <div class="header">
        <div class="logo">
          <img 
            src="/src/assets/brand-logo-w-name_512.png" 
            alt="Enersigh Logo" 
            class="logo-img"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Título principal -->
      <div class="hero">
        <h1 class="glow-text">{{ t('home.welcome') }}<br><span class="gold">{{ t('home.title') }}</span></h1>
        <p>{{ t('home.subtitle') }}</p>
      </div>

      <!-- Módulos -->
      <div class="modules-grid">
        <router-link to="/mapa" class="module-card" data-module="mapa">
          <div class="card-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>{{ t('home.modules.map.title') }}</h3>
            <p>{{ t('home.modules.map.description') }}</p>
          </div>
          <div class="card-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </router-link>

        <router-link to="/agente-previsao" class="module-card" data-module="previsao">
          <div class="card-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path d="M3 17V20H21V17M3 10L12 3L21 10M12 3V14" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M7 14V20M12 14V20M17 14V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>{{ t('home.modules.forecast.title') }}</h3>
            <p>{{ t('home.modules.forecast.description') }}</p>
          </div>
          <div class="card-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </router-link>

        <router-link to="/usuarios" class="module-card" data-module="usuarios">
          <div class="card-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path d="M17 21V19C17 16.8 15.2 15 13 15H5C2.8 15 1 16.8 1 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M23 21V19C22.9 16.8 21.3 15 19.2 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M16 3.13C17.9 3.57 19.1 5.42 19 7.5C19 9.58 17.9 11.43 16 11.87" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>{{ t('home.modules.users.title') }}</h3>
            <p>{{ t('home.modules.users.description') }}</p>
          </div>
          <div class="card-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </router-link>

        <router-link to="/logs" class="module-card" data-module="logs">
          <div class="card-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M8 8H16M8 12H14M8 16H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>{{ t('home.modules.logs.title') }}</h3>
            <p>{{ t('home.modules.logs.description') }}</p>
          </div>
          <div class="card-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </router-link>

        <router-link to="/perfil" class="module-card" data-module="perfil">
          <div class="card-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M12 11C9.79 11 8 9.21 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3>{{ t('home.modules.profile.title') }}</h3>
            <p>{{ t('home.modules.profile.description') }}</p>
          </div>
          <div class="card-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn('Logo não encontrada em:', img.src)
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    const fallback = document.createElement('div')
    fallback.className = 'logo-fallback'
    fallback.innerHTML = '<span class="title">Enersigh</span><span class="subtitle">Sistema de Monitoramento</span>'
    parent.appendChild(fallback)
  }
}
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-page {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow-x: hidden;
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

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

/* Conteúdo */
.content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4rem;
  animation: fadeInDown 0.8s ease;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  height: 80px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
  transition: all 0.3s ease;
}

.logo-img:hover {
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
  transform: scale(1.02);
}

.logo-fallback {
  display: flex;
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
  letter-spacing: 1px;
}

.logo-fallback .subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.5px;
}

/* Hero */
.hero {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeInUp 0.8s ease;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
  line-height: 1.2;
}

.glow-text {
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

.hero .gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
}

.hero p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
}

/* Módulos Grid */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.module-card {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  min-height: 140px;
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
  transition: left 0.5s;
}

.module-card:hover::before {
  left: 100%;
}

.module-card:hover {
  border-color: rgba(255, 215, 0, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
  background: rgba(255, 215, 0, 0.05);
}

.card-icon {
  flex-shrink: 0;
}

.card-icon svg {
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.module-card:hover .card-icon svg {
  color: #FFD700;
  transform: scale(1.05);
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5));
}

.card-content {
  flex: 1;
}

.card-content h3 {
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.module-card:hover .card-content h3 {
  color: #FFD700;
}

.card-content p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  line-height: 1.4;
}

.card-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.module-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.card-arrow svg {
  color: #FFD700;
}

/* Responsividade */
@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .modules-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .module-card {
    padding: 1.5rem;
    min-height: 120px;
  }

  .card-icon svg {
    width: 48px;
    height: 48px;
  }

  .card-content h3 {
    font-size: 1.1rem;
  }

  .logo-img {
    height: 60px;
  }
}

/* Efeito de brilho nos cards */
.module-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(135deg, transparent, rgba(255, 215, 0, 0.3), transparent);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.module-card:hover::after {
  opacity: 1;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #FFD700;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #FFA500;
}
</style>