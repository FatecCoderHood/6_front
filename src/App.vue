<template>
  <AppSidebar 
    v-if="$route.path !== '/login' && $route.path !== '/cadastro'" 
    :open="sidebarOpen" 
    @toggle="handleToggle" 
  />
  
  <div 
    v-if="$route.path !== '/login' && $route.path !== '/cadastro'" 
    class="sidebar-sensor" 
    @mouseenter="onSensorEnter" 
    @mouseleave="onSensorLeave"
  ></div>
  
  <div :class="['main-content', { 
    'no-sidebar': $route.path === '/login' || $route.path === '/cadastro',
    'sidebar-open': sidebarOpen && $route.path !== '/login' && $route.path !== '/cadastro',
    'sidebar-closed': !sidebarOpen && $route.path !== '/login' && $route.path !== '/cadastro'
  }]">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'

const route = useRoute()
const sidebarOpen = ref(true)

function handleToggle() {
  sidebarOpen.value = !sidebarOpen.value
}

function onSensorEnter() {
  if (!sidebarOpen.value) sidebarOpen.value = true
}

function onSensorLeave() {

}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body { 
  margin: 0; 
  font-family: 'Roboto', Arial, sans-serif;
  background: #0a0a0a;
  overflow-x: hidden;
}

.main-content { 
  transition: margin-left 0.25s ease-in-out; 
  width: 100%;
  min-height: 100vh;
}

/* Quando sidebar está aberta */
.main-content.sidebar-open {
  margin-left: 260px;
}

/* Quando sidebar está fechada */
.main-content.sidebar-closed {
  margin-left: 98px;
}

/* Quando não tem sidebar (página de login ou cadastro) */
.main-content.no-sidebar {
  margin-left: 0 !important;
}

/* Sensor strip na esquerda para capturar hover */
.sidebar-sensor { 
  position: fixed; 
  left: 0; 
  top: 0; 
  bottom: 0; 
  width: 8px; 
  z-index: 2301; 
  background: transparent;
}

/* Responsividade para telas menores */
@media (max-width: 768px) {
  .main-content.sidebar-open,
  .main-content.sidebar-closed {
    margin-left: 0;
  }
}
</style>