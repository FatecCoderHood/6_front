<!-- src/components/AppSidebar.vue -->
<template>
  <aside :class="['app-sidebar', { open: open }]" @mouseleave="handleMouseLeave">
    <button class="collapse-btn" @click="toggle">{{ open ? '×' : '☰' }}</button>
    <nav class="nav">
      <router-link to="/" class="nav-item" @click="closeSidebar">
        <span class="icon" v-html="svg(mdiHome)"></span>
        <span v-if="open">{{ t('sidebar.home') }}</span>
      </router-link>
      <router-link to="/mapa" class="nav-item" @click="closeSidebar">
        <span class="icon" v-html="svg(mdiMap)"></span>
        <span v-if="open">{{ t('sidebar.map') }}</span>
      </router-link>
      <router-link to="/agente-previsao" class="nav-item" @click="closeSidebar">
        <span class="icon" v-html="svg(mdiChartLine)"></span>
        <span v-if="open">{{ t('sidebar.forecast') }}</span>
      </router-link>
      
      <!-- Menu ADMIN only -->
      <template v-if="userRole === 'admin'">
        <router-link to="/usuarios" class="nav-item" @click="closeSidebar">
          <span class="icon" v-html="svg(mdiAccount)"></span>
          <span v-if="open">{{ t('sidebar.users') }}</span>
        </router-link>
        <router-link to="/logs" class="nav-item" @click="closeSidebar">
          <span class="icon" v-html="svg(mdiHistory)"></span>
          <span v-if="open">{{ t('sidebar.logs') }}</span>
        </router-link>
      </template>

      <router-link to="/minha-conta" class="nav-item" @click="closeSidebar">
        <span class="icon" v-html="svg(mdiAccountCircle)"></span>
        <span v-if="open">{{ t('sidebar.myAccount') }}</span>
      </router-link>

      <div class="language-switch" :class="{ open: open }">
        <div class="lang-left">
          <span v-if="open" class="lang-label">{{ t('sidebar.language') }}</span>
        </div>
        <div class="lang-right">
          <div class="switch" @click="toggleLang" role="button" :aria-pressed="isEnglishComputed">
            <div class="slider" :class="{ on: isEnglishComputed }"></div>
          </div>
          <span v-if="open" class="lang-name">{{ localLocale === 'pt' ? t('sidebar.portuguese') : t('sidebar.english') }}</span>
        </div>
      </div>

      <div class="logout-divider" v-if="open"></div>
      <button class="logout-btn nav-item" @click="handleLogout">
        <span class="icon" v-html="svg(mdiLogout)"></span>
        <span v-if="open">{{ t('sidebar.logout') }}</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { 
  mdiHome, 
  mdiMap, 
  mdiChartLine,
  mdiAccount, 
  mdiHistory, 
  mdiAccountCircle,
  mdiLogout 
} from '@mdi/js'
import authUsecase from '../service/auth.usecase'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['toggle'])
const router = useRouter()

let timeoutId: any = null

const { t, locale } = useI18n()
const userRole = ref('user')

onMounted(() => {
  userRole.value = authUsecase.getUserRole()
})

const localLocale = computed(() => locale.value)

const isEnglishComputed = computed({
  get: () => locale.value === 'en',
  set: (v: boolean) => { locale.value = v ? 'en' : 'pt' }
})

function toggleLang() {
  locale.value = locale.value === 'pt' ? 'en' : 'pt'
}

function toggle() { 
  emit('toggle') 
}

function closeSidebar() {
  if (props.open) {
    emit('toggle')
  }
}

function handleMouseLeave() {
  if (props.open) {
    timeoutId = setTimeout(() => {
      emit('toggle')
    }, 300)
  }
}

function handleLogout() {
  authUsecase.logout()
  router.push('/login')
}

function svg(path: string, size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="currentColor"/></svg>`
}
</script>

<style scoped>
.app-sidebar {
  width: 98px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 8px;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
  transition: width 0.25s ease-in-out;
  z-index: 2001;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.app-sidebar.open {
  width: 260px;
  align-items: flex-start;
  padding: 20px 16px;
  background: rgba(0, 0, 0, 0.45);
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: none;
  margin: 0 0 20px 0;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.app-sidebar.open .collapse-btn {
  align-self: flex-start;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.nav { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
  width: 100%;
  flex: 1;
}

.nav-item { 
  color: #fff; 
  padding: 10px 12px; 
  text-decoration: none; 
  border-radius: 8px; 
  display: flex; 
  gap: 12px; 
  align-items: center;
  transition: all 0.2s;
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
}

.app-sidebar:not(.open) .nav-item {
  justify-content: center;
  padding: 10px;
}

.app-sidebar:not(.open) .nav-item span:not(.icon) {
  display: none;
}

.nav-item:hover { 
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(2px);
}

.app-sidebar:not(.open) .nav-item:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.2);
}

.nav-item .icon { 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
}

.nav-item .icon svg { 
  width: 22px; 
  height: 22px; 
  color: #fff;
}

.nav-item.router-link-active { 
  background: rgba(255, 215, 0, 0.2);
  border-left: 3px solid #FFD700;
}

.app-sidebar:not(.open) .nav-item.router-link-active {
  border-left: none;
  background: rgba(255, 215, 0, 0.3);
}

.app-sidebar .nav-item span:not(.icon) {
  transition: opacity 0.2s ease;
}

.language-switch {
  margin-top: 12px;
  margin-left: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 8px);
  position: relative;
  padding: 8px 4px;
}

.language-switch .lang-left { flex: 1 }
.language-switch .lang-right { display: flex; gap: 10px; align-items: center }
.language-switch .lang-label { font-size: 0.85rem; color: rgba(255,255,255,0.9); font-weight:600 }
.language-switch .lang-name { font-size: 0.85rem; color: rgba(255,255,255,0.8) }

.switch { width: 44px; height: 24px; background: rgba(255,255,255,0.12); border-radius: 999px; display:flex; align-items:center; padding:3px; cursor:pointer }
.slider { width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: transform 0.2s }
.slider.on { transform: translateX(20px); background: #FFD700 }

.language-switch:not(.open) { justify-content: center }
.language-switch:not(.open) .lang-left, .language-switch:not(.open) .lang-name { display: none }

.logout-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px 0 8px 0;
}

.logout-btn {
  color: #fff;
  margin-top: auto;
}

.logout-btn:hover {
  background: rgba(255, 82, 82, 0.2);
  color: #ff5252;
}

.logout-btn:hover .icon svg {
  color: #ff5252;
}
</style>