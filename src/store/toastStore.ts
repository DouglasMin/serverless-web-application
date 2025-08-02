import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast
    }

    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, newToast.duration)
    }

    return id
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }))
  },

  clearAllToasts: () => {
    set({ toasts: [] })
  }
}))

// Convenience functions for different toast types
export const useToast = () => {
  const { addToast, removeToast, clearAllToasts } = useToastStore()

  return {
    success: (title: string, message?: string, options?: Partial<Toast>) => 
      addToast({ type: 'success', title, message, ...options }),
    
    error: (title: string, message?: string, options?: Partial<Toast>) => 
      addToast({ type: 'error', title, message, duration: 7000, ...options }),
    
    warning: (title: string, message?: string, options?: Partial<Toast>) => 
      addToast({ type: 'warning', title, message, ...options }),
    
    info: (title: string, message?: string, options?: Partial<Toast>) => 
      addToast({ type: 'info', title, message, ...options }),
    
    custom: (toast: Omit<Toast, 'id'>) => addToast(toast),
    
    remove: removeToast,
    clearAll: clearAllToasts
  }
}

export default useToastStore