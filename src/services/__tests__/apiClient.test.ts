import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ApiClient, ApiClientError } from '../apiClient'

// Mock fetch globally
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('ApiClient', () => {
  let apiClient: ApiClient

  beforeEach(() => {
    apiClient = new ApiClient('https://api.test.com')
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })

      const result = await apiClient.get('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle GET request with custom headers', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })

      await apiClient.get('/test', { 'Custom-Header': 'value' })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Custom-Header': 'value'
          })
        })
      )
    })
  })

  describe('POST requests', () => {
    it('should make successful POST request with JSON body', async () => {
      const mockResponse = { success: true }
      const requestData = { name: 'test' }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })

      const result = await apiClient.post('/test', requestData)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(requestData)
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const mockResponse = { updated: true }
      const requestData = { name: 'updated' }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })

      const result = await apiClient.put('/test/1', requestData)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(requestData)
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = { deleted: true }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })

      const result = await apiClient.delete('/test/1')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('Error handling', () => {
    it('should handle HTTP 400 error', async () => {
      const errorResponse = { error: 'Bad Request', code: 'VALIDATION_ERROR' }
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(errorResponse)
      })

      await expect(apiClient.get('/test')).rejects.toThrow(ApiClientError)
      
      try {
        await apiClient.get('/test')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError)
        expect((error as ApiClientError).status).toBe(400)
        expect((error as ApiClientError).message).toBe('Bad Request')
        expect((error as ApiClientError).code).toBe('VALIDATION_ERROR')
      }
    })

    it('should handle HTTP 500 error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve({ error: 'Internal Server Error' })
      })

      await expect(apiClient.get('/test')).rejects.toThrow(ApiClientError)
    })

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(apiClient.get('/test')).rejects.toThrow(ApiClientError)
      
      try {
        await apiClient.get('/test')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError)
        expect((error as ApiClientError).message).toContain('Network error')
        expect((error as ApiClientError).status).toBe(0)
      }
    })

    it('should handle non-JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'text/plain']]),
        text: () => Promise.resolve('Plain text response')
      })

      const result = await apiClient.get('/test')
      expect(result).toBe('Plain text response')
    })
  })

  describe('Authentication', () => {
    it('should set auth token in headers', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })

      apiClient.setAuthToken('test-token')
      await apiClient.get('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      )
    })

    it('should remove auth token when set to null', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })

      apiClient.setAuthToken('test-token')
      apiClient.setAuthToken(null)
      await apiClient.get('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.anything()
          })
        })
      )
    })
  })

  describe('Configuration', () => {
    it('should handle base URL with trailing slash', () => {
      const client = new ApiClient('https://api.test.com/')
      expect(client['baseURL']).toBe('https://api.test.com')
    })

    it('should set default headers', async () => {
      const mockResponse = { data: 'test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: () => Promise.resolve(mockResponse)
      })

      apiClient.setDefaultHeaders({ 'X-Custom': 'value' })
      await apiClient.get('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom': 'value'
          })
        })
      )
    })
  })
})