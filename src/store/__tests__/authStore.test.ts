import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../authStore'
import type { LoginCredentials } from '../../types'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.getState().logout()
    vi.clearAllMocks()
  })

  it('should have initial state', () => {
    const state = useAuthStore.getState()
    
    expect(state.user).toBeNull()
    expect(state.tokens).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should set loading state', () => {
    const { setLoading } = useAuthStore.getState()
    
    setLoading(true)
    expect(useAuthStore.getState().isLoading).toBe(true)
    
    setLoading(false)
    expect(useAuthStore.getState().isLoading).toBe(false)
  })

  it('should set and clear error', () => {
    const { setError, clearError } = useAuthStore.getState()
    
    setError('Test error')
    expect(useAuthStore.getState().error).toBe('Test error')
    
    clearError()
    expect(useAuthStore.getState().error).toBeNull()
  })

  it('should login successfully', async () => {
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    }
    
    const { login } = useAuthStore.getState()
    
    await login(credentials)
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).not.toBeNull()
    expect(state.user?.email).toBe(credentials.email)
    expect(state.tokens).not.toBeNull()
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should logout successfully', async () => {
    // First login
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    }
    
    await useAuthStore.getState().login(credentials)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    
    // Then logout
    useAuthStore.getState().logout()
    
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.tokens).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should refresh token successfully', async () => {
    // First login to get tokens
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    }
    
    await useAuthStore.getState().login(credentials)
    const originalTokens = useAuthStore.getState().tokens
    
    // Refresh token
    await useAuthStore.getState().refreshToken()
    
    const state = useAuthStore.getState()
    expect(state.tokens).not.toBeNull()
    expect(state.tokens?.accessToken).not.toBe(originalTokens?.accessToken)
    expect(state.tokens?.refreshToken).toBe(originalTokens?.refreshToken)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should handle refresh token failure', async () => {
    // Try to refresh without being logged in
    const { refreshToken } = useAuthStore.getState()
    
    await expect(refreshToken()).rejects.toThrow('No refresh token available')
  })

  it('should set user directly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
    
    useAuthStore.getState().setUser(mockUser)
    
    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should set tokens directly', () => {
    const mockTokens = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      expiresAt: Date.now() + 3600000
    }
    
    useAuthStore.getState().setTokens(mockTokens)
    
    const state = useAuthStore.getState()
    expect(state.tokens).toEqual(mockTokens)
  })
})