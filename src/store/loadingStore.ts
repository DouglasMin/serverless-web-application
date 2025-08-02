import { create } from 'zustand'

interface LoadingState {
  // Global loading states
  isGlobalLoading: boolean
  loadingTasks: Set<string>
  
  // Specific loading states
  loadingStates: Record<string, boolean>
  
  // Actions
  setGlobalLoading: (loading: boolean) => void
  addLoadingTask: (taskId: string) => void
  removeLoadingTask: (taskId: string) => void
  setLoading: (key: string, loading: boolean) => void
  isLoading: (key: string) => boolean
  clearAllLoading: () => void
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  isGlobalLoading: false,
  loadingTasks: new Set(),
  loadingStates: {},

  setGlobalLoading: (loading: boolean) => {
    set({ isGlobalLoading: loading })
  },

  addLoadingTask: (taskId: string) => {
    set((state) => {
      const newTasks = new Set(state.loadingTasks)
      newTasks.add(taskId)
      return {
        loadingTasks: newTasks,
        isGlobalLoading: newTasks.size > 0
      }
    })
  },

  removeLoadingTask: (taskId: string) => {
    set((state) => {
      const newTasks = new Set(state.loadingTasks)
      newTasks.delete(taskId)
      return {
        loadingTasks: newTasks,
        isGlobalLoading: newTasks.size > 0
      }
    })
  },

  setLoading: (key: string, loading: boolean) => {
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading
      }
    }))
  },

  isLoading: (key: string) => {
    return get().loadingStates[key] || false
  },

  clearAllLoading: () => {
    set({
      isGlobalLoading: false,
      loadingTasks: new Set(),
      loadingStates: {}
    })
  }
}))

// Convenience hook for managing loading states
export const useLoading = () => {
  const { setLoading, isLoading, addLoadingTask, removeLoadingTask } = useLoadingStore()

  const withLoading = async <T>(
    key: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    setLoading(key, true)
    addLoadingTask(key)
    
    try {
      const result = await asyncFn()
      return result
    } finally {
      setLoading(key, false)
      removeLoadingTask(key)
    }
  }

  return {
    setLoading,
    isLoading,
    withLoading,
    addLoadingTask,
    removeLoadingTask
  }
}

export default useLoadingStore