import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AppData, LoadingState, ErrorState } from '../types'

interface AppState {
  // State
  data: AppData
  loading: LoadingState
  errors: ErrorState

  // Actions
  setData: (key: string, value: any) => void
  updateData: (key: string, updates: Partial<any>) => void
  removeData: (key: string) => void
  setLoading: (key: string, loading: boolean) => void
  setError: (key: string, error: string | null) => void
  clearError: (key: string) => void
  clearAllErrors: () => void
  reset: () => void
  
  // Async actions
  fetchData: (key: string, fetcher: () => Promise<any>) => Promise<void>
}

const initialState = {
  data: {},
  loading: {},
  errors: {}
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Synchronous actions
      setData: (key: string, value: any) => {
        set(
          (state) => ({
            data: {
              ...state.data,
              [key]: value
            }
          }),
          false,
          `setData/${key}`
        )
      },

      updateData: (key: string, updates: Partial<any>) => {
        set(
          (state) => ({
            data: {
              ...state.data,
              [key]: {
                ...state.data[key],
                ...updates
              }
            }
          }),
          false,
          `updateData/${key}`
        )
      },

      removeData: (key: string) => {
        set(
          (state) => {
            const newData = { ...state.data }
            delete newData[key]
            return { data: newData }
          },
          false,
          `removeData/${key}`
        )
      },

      setLoading: (key: string, loading: boolean) => {
        set(
          (state) => ({
            loading: {
              ...state.loading,
              [key]: loading
            }
          }),
          false,
          `setLoading/${key}`
        )
      },

      setError: (key: string, error: string | null) => {
        set(
          (state) => ({
            errors: {
              ...state.errors,
              [key]: error
            }
          }),
          false,
          `setError/${key}`
        )
      },

      clearError: (key: string) => {
        set(
          (state) => {
            const newErrors = { ...state.errors }
            delete newErrors[key]
            return { errors: newErrors }
          },
          false,
          `clearError/${key}`
        )
      },

      clearAllErrors: () => {
        set(
          { errors: {} },
          false,
          'clearAllErrors'
        )
      },

      reset: () => {
        set(
          initialState,
          false,
          'reset'
        )
      },

      // Async actions
      fetchData: async (key: string, fetcher: () => Promise<any>) => {
        const { setLoading, setError, setData } = get()
        
        setLoading(key, true)
        setError(key, null)
        
        try {
          const result = await fetcher()
          setData(key, result)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred'
          setError(key, errorMessage)
          throw error
        } finally {
          setLoading(key, false)
        }
      }
    }),
    {
      name: 'app-store'
    }
  )
)

// Selectors for common use cases
export const useAppData = (key: string) => useAppStore((state) => state.data[key])
export const useAppLoading = (key: string) => useAppStore((state) => state.loading[key] || false)
export const useAppError = (key: string) => useAppStore((state) => state.errors[key] || null)