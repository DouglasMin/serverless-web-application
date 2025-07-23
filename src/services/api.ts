import apiClient from './apiClient'
import type { User, ApiResponse } from '../types'

// User profile API (for authenticated users)
export const userApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiClient.get('/user/profile')
  },

  updateProfile: async (updates: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.put('/user/profile', updates)
  }
}

// Generic CRUD operations
export const createCrudApi = <T extends { id: string }>(resource: string) => ({
  getAll: async (params?: Record<string, any>): Promise<ApiResponse<T[]>> => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return apiClient.get(`/${resource}${queryString}`)
  },

  getById: async (id: string): Promise<ApiResponse<T>> => {
    return apiClient.get(`/${resource}/${id}`)
  },

  create: async (data: Omit<T, 'id'>): Promise<ApiResponse<T>> => {
    return apiClient.post(`/${resource}`, data)
  },

  update: async (id: string, data: Partial<T>): Promise<ApiResponse<T>> => {
    return apiClient.put(`/${resource}/${id}`, data)
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/${resource}/${id}`)
  }
})

// Example usage - Items API (you can create more as needed)
export interface Item {
  id: string
  name: string
  description?: string
  category: string
  createdAt: string
  updatedAt: string
}

export const itemsApi = createCrudApi<Item>('items')

// Health check API
export const healthApi = {
  check: async (): Promise<ApiResponse<{ status: string; timestamp: string }>> => {
    return apiClient.get('/health')
  }
}

// Export all APIs
export const api = {
  user: userApi,
  items: itemsApi,
  health: healthApi,
  // Add more APIs here as needed
}