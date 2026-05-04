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
          <router-link to="/dashboard" class="nav-item" @click="closeSidebar">
            <span class="icon" v-html="svg(mdiViewDashboard)"></span>
            <span v-if="open">{{ t('sidebar.dashboard') }}</span>
          </router-link>
          <router-link to="/usuarios" class="nav-item" @click="closeSidebar">
            <span class="icon" v-html="svg(mdiAccount)"></span>
            <span v-if="open">{{ t('sidebar.users') }}</span>
          </router-link>
          <router-link to="/logs" class="nav-item" @click="closeSidebar">
            <span class="icon" v-html="svg(mdiHistory)"></span>
            <span v-if="open">{{ t('sidebar.logs') }}</span>
          </router-link>
          <router-link to="/reserva" class="nav-item" @click="closeSidebar">
            <span class="icon" v-html="svg(mdiCalendar)"></span>
            <span v-if="open">{{ t('sidebar.reserve') }}</span>
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
        </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiHome, mdiMap, mdiViewDashboard, mdiAccount, mdiHistory, mdiCalendar } from '@mdi/js'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['toggle'])

let timeoutId: any = null

const { t, locale } = useI18n()

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
  background: rgba(25, 118, 210, 0.4);
  border-left: 3px solid #1976d2;
}

.app-sidebar:not(.open) .nav-item.router-link-active {
  border-left: none;
  background: rgba(25, 118, 210, 0.5);
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
.slider.on { transform: translateX(20px); background: #1976d2 }

.language-switch:not(.open) { justify-content: center }
.language-switch:not(.open) .lang-left, .language-switch:not(.open) .lang-name { display: none }
</style>