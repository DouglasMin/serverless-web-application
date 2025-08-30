import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, LoginCredentials, AuthTokens } from '../types'
import cognitoService from '../services/cognitoService'
import apiClient from '../services/apiClient'

interface AuthState {
  // State
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  signUp: (userData: { email: string; password: string; name?: string }) => Promise<{ userSub: string; codeDeliveryDetails: any }>
  confirmSignUp: (email: string, code: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  confirmPassword: (email: string, code: string, newPassword: string) => Promise<void>
  initializeAuth: () => Promise<void>
  setUser: (user: User) => void
  setTokens: (tokens: AuthTokens) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const { user, tokens } = await cognitoService.signIn(credentials)
          
          // Set auth token in API client for future requests
          apiClient.setAuthToken(tokens.accessToken)
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          const errorMessage = error.message || 'Login failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      logout: async () => {
        try {
          // Sign out from Cognito
          await cognitoService.signOut()
        } catch (error) {
          // Continue with logout even if Cognito call fails
          console.warn('Cognito logout failed:', error)
        } finally {
          // Clear auth token from API client
          apiClient.setAuthToken(null)
          
          // Clear local state
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: null
          })
        }
      },

      refreshToken: async () => {
        const { tokens } = get()
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available')
        }

        set({ isLoading: true, error: null })
        
        try {
          const newTokens = await cognitoService.refreshTokens(tokens.refreshToken)
          
          // Update auth token in API client
          apiClient.setAuthToken(newTokens.accessToken)
          
          set({
            tokens: newTokens,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          const errorMessage = error.message || 'Token refresh failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          // If refresh fails, logout user
          get().logout()
          throw error
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: !!user })
      },

      setTokens: (tokens: AuthTokens) => {
        set({ tokens })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      signUp: async (userData: { email: string; password: string; name?: string }) => {
        console.log('🏪 AuthStore.signUp 호출:', userData)
        set({ isLoading: true, error: null })
        
        try {
          const result = await cognitoService.signUp(userData)
          console.log('✅ AuthStore.signUp 성공:', result)
          set({ isLoading: false })
          return result
        } catch (error: any) {
          console.error('❌ AuthStore.signUp 실패:', error)
          const errorMessage = error.message || 'Sign up failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      confirmSignUp: async (email: string, code: string) => {
        console.log('🏪 AuthStore.confirmSignUp 호출:', { email, code })
        set({ isLoading: true, error: null })
        
        try {
          await cognitoService.confirmSignUp(email, code)
          console.log('✅ AuthStore.confirmSignUp 성공')
          set({ isLoading: false })
        } catch (error: any) {
          console.error('❌ AuthStore.confirmSignUp 실패:', error)
          const errorMessage = error.message || 'Confirmation failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null })
        
        try {
          await cognitoService.forgotPassword(email)
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.message || 'Password reset request failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      confirmPassword: async (email: string, code: string, newPassword: string) => {
        set({ isLoading: true, error: null })
        
        try {
          await cognitoService.confirmPassword(email, code, newPassword)
          set({ isLoading: false })
        } catch (error: any) {
          const errorMessage = error.message || 'Password confirmation failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      initializeAuth: async () => {
        set({ isLoading: true, error: null })
        
        try {
          // Check if user has a valid session
          const session = await cognitoService.getCurrentSession()
          
          if (session && session.isValid()) {
            // Get current user profile
            const user = await cognitoService.getCurrentUser()
            
            if (user) {
              const tokens: AuthTokens = {
                accessToken: session.getAccessToken().getJwtToken(),
                refreshToken: session.getRefreshToken().getToken(),
                expiresAt: session.getAccessToken().getExpiration() * 1000
              }
              
              // Set auth token in API client FIRST
              console.log('🔑 Setting auth token from Cognito session')
              apiClient.setAuthToken(tokens.accessToken)
              
              set({
                user,
                tokens,
                isAuthenticated: true,
                isLoading: false,
                error: null
              })
            } else {
              // Clear any existing token if user not found
              apiClient.setAuthToken(null)
              set({ 
                user: null,
                tokens: null,
                isAuthenticated: false,
                isLoading: false 
              })
            }
          } else {
            // Clear any existing token if session invalid
            apiClient.setAuthToken(null)
            set({ 
              user: null,
              tokens: null,
              isAuthenticated: false,
              isLoading: false 
            })
          }
        } catch (error: any) {
          console.warn('Auth initialization failed:', error)
          // Clear token on error
          apiClient.setAuthToken(null)
          set({ 
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false 
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        // When state is rehydrated from localStorage, set the token in API client
        if (state?.tokens?.accessToken && state?.isAuthenticated) {
          console.log('🔄 Rehydrating auth token from localStorage')
          apiClient.setAuthToken(state.tokens.accessToken)
          
          // Check if token is expired
          const now = Date.now()
          if (state.tokens.expiresAt && state.tokens.expiresAt < now) {
            console.warn('⚠️ Stored token is expired, will refresh on next auth check')
          }
        } else {
          console.log('🚫 No valid token to rehydrate')
          apiClient.setAuthToken(null)
        }
      }
    }
  )
)