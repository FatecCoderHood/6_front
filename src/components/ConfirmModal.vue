<!-- src/components/ConfirmModal.vue -->
<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
    <div class="confirm-modal" :class="type">
      <div class="modal-icon">
        <svg v-if="type === 'approve'" width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="12" r="9" stroke="#4CAF50" stroke-width="2" fill="none"/>
        </svg>
        <svg v-else-if="type === 'reject'" width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M6 18L18 6M6 6L18 18" stroke="#ff4444" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="12" r="9" stroke="#ff4444" stroke-width="2" fill="none"/>
        </svg>
        <svg v-else-if="type === 'delete'" width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M3 6H5H21M8 6V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V6M10 11V16M14 11V16" stroke="#ff4444" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M19 6V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V6" stroke="#ff4444" stroke-width="1.5"/>
        </svg>
        <svg v-else-if="type === 'warning'" width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 8v4M12 16h.01M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <h3 class="modal-title">{{ title }}</h3>
      <p class="modal-message">{{ message }}</p>
      <div class="modal-actions">
        <button class="btn-cancel" @click="handleCancel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Cancelar
        </button>
        <button :class="['btn-confirm', type]" @click="handleConfirm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path v-if="type === 'approve'" d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path v-else-if="type === 'delete'" d="M3 6H5H21M8 6V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path v-else-if="type === 'reject'" d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path v-else d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  type: 'approve' | 'reject' | 'delete' | 'warning'
  title: string
  message: string
  confirmText?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const localVisible = ref(props.visible)

watch(() => props.visible, (newVal) => {
  localVisible.value = newVal
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

.confirm-modal {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  min-width: 380px;
  max-width: 450px;
  text-align: center;
  border: 1px solid rgba(255, 215, 0, 0.2);
  animation: scaleIn 0.2s ease;
}

.modal-icon {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.modal-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.modal-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-cancel,
.btn-confirm {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-confirm {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0a0a0a;
}

.btn-confirm.approve {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.btn-confirm.reject,
.btn-confirm.delete {
  background: linear-gradient(135deg, #ff4444, #cc0000);
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
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

@media (max-width: 480px) {
  .confirm-modal {
    min-width: 300px;
    padding: 1.5rem;
  }
  
  .modal-title {
    font-size: 1.2rem;
  }
  
  .modal-message {
    font-size: 0.8rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-confirm {
    justify-content: center;
  }
}
</style>