// src/composables/useToast.ts
import { ref } from 'vue'

export interface ToastData {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

const toasts = ref<ToastData[]>([])
let nextId = 0

export const useToast = () => {
  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = nextId++
    toasts.value.push({ ...toast, id })
    
    // Auto-remover após duração (padrão 5 segundos)
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)
    
    return id
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearToasts = () => {
    toasts.value = []
  }

  // Helper methods
  const success = (message: string, title: string = 'Sucesso') => {
    return addToast({ type: 'success', title, message })
  }

  const error = (message: string, title: string = 'Erro') => {
    return addToast({ type: 'error', title, message })
  }

  const warning = (message: string, title: string = 'Atenção') => {
    return addToast({ type: 'warning', title, message })
  }

  const info = (message: string, title: string = 'Informação') => {
    return addToast({ type: 'info', title, message })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  }
}