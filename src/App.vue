
<template>
  <AppSidebar :open="sidebarOpen" @toggle="handleToggle" />
  <div class="sidebar-sensor" @mouseenter="onSensorEnter" @mouseleave="onSensorLeave"></div>
  <div class="main-content">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
const sidebarOpen = ref(true)

function handleToggle() {
  sidebarOpen.value = !sidebarOpen.value
}

function onSensorEnter() {
  if (!sidebarOpen.value) sidebarOpen.value = true
}

function onSensorLeave() {
  if (!sidebarOpen.value) return
  // when mouse leaves the sensor area, if it was closed before, close it again
  // we don't track manual state — keep it simple: close only if previously closed by toggle
}
</script>

<style>
body { margin: 0; font-family: 'Roboto', Arial, sans-serif; }
.main-content { transition: all 0.2s ease; width: 100%; height: 100vh; }

/* invisible sensor strip on the far left to capture hover */
.sidebar-sensor { position: fixed; left: 0; top: 0; bottom: 0; width: 8px; z-index: 2301; background: transparent }
</style>
