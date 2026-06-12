<!-- src/components/ToastNotification.vue -->
<template>
  <div v-if="visible" :class="['toast-notification', type]" @click="close">
    <div class="toast-icon">
      <svg v-if="type === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17L4 12" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <svg v-else-if="type === 'error'" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 18L18 6M6 6L18 18" stroke="#ff4444" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <svg v-else-if="type === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 8v4M12 16h.01M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <svg v-else-if="type === 'info'" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2196f3" stroke-width="1.5" fill="none"/>
        <path d="M12 16V12M12 8H12.01" stroke="#2196f3" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="toast-content">
      <div class="toast-title">{{ title }}</div>
      <div class="toast-message">{{ message }}</div>
    </div>
    <button class="toast-close">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M6 18L18 6M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)
let timeout: number | null = null

const close = () => {
  visible.value = false
  emit('close')
}

onMounted(() => {
  timeout = setTimeout(() => {
    close()
  }, props.duration || 5000)
})

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  min-width: 320px;
  max-width: 400px;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  z-index: 10000;
  animation: slideInRight 0.3s ease;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  border-left: 4px solid;
}

.toast-notification:hover {
  transform: translateX(-5px);
}

.toast-notification.success {
  border-left-color: #4CAF50;
}

.toast-notification.error {
  border-left-color: #ff4444;
}

.toast-notification.warning {
  border-left-color: #FFD700;
}

.toast-notification.info {
  border-left-color: #2196f3;
}

.toast-icon {
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.toast-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.toast-close:hover {
  color: white;
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

@media (max-width: 768px) {
  .toast-notification {
    left: 1rem;
    right: 1rem;
    min-width: auto;
    max-width: none;
  }
}
</style>