import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAppStore } from '../appStore'

describe('AppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.getState().reset()
  })

  it('should have initial state', () => {
    const state = useAppStore.getState()
    
    expect(state.data).toEqual({})
    expect(state.loading).toEqual({})
    expect(state.errors).toEqual({})
  })

  it('should set data', () => {
    const { setData } = useAppStore.getState()
    const testData = { id: 1, name: 'Test' }
    
    setData('test', testData)
    
    const state = useAppStore.getState()
    expect(state.data.test).toEqual(testData)
  })

  it('should update data', () => {
    const { setData, updateData } = useAppStore.getState()
    const initialData = { id: 1, name: 'Test', count: 0 }
    
    setData('test', initialData)
    updateData('test', { count: 5, newField: 'added' })
    
    const state = useAppStore.getState()
    expect(state.data.test).toEqual({
      id: 1,
      name: 'Test',
      count: 5,
      newField: 'added'
    })
  })

  it('should remove data', () => {
    const { setData, removeData } = useAppStore.getState()
    
    setData('test', { id: 1 })
    expect(useAppStore.getState().data.test).toBeDefined()
    
    removeData('test')
    expect(useAppStore.getState().data.test).toBeUndefined()
  })

  it('should set loading state', () => {
    const { setLoading } = useAppStore.getState()
    
    setLoading('test', true)
    expect(useAppStore.getState().loading.test).toBe(true)
    
    setLoading('test', false)
    expect(useAppStore.getState().loading.test).toBe(false)
  })

  it('should set and clear error', () => {
    const { setError, clearError } = useAppStore.getState()
    
    setError('test', 'Test error')
    expect(useAppStore.getState().errors.test).toBe('Test error')
    
    clearError('test')
    expect(useAppStore.getState().errors.test).toBeUndefined()
  })

  it('should clear all errors', () => {
    const { setError, clearAllErrors } = useAppStore.getState()
    
    setError('test1', 'Error 1')
    setError('test2', 'Error 2')
    expect(Object.keys(useAppStore.getState().errors)).toHaveLength(2)
    
    clearAllErrors()
    expect(useAppStore.getState().errors).toEqual({})
  })

  it('should reset store', () => {
    const { setData, setLoading, setError, reset } = useAppStore.getState()
    
    // Add some data
    setData('test', { id: 1 })
    setLoading('test', true)
    setError('test', 'Test error')
    
    // Verify data exists
    const stateBeforeReset = useAppStore.getState()
    expect(Object.keys(stateBeforeReset.data)).toHaveLength(1)
    expect(Object.keys(stateBeforeReset.loading)).toHaveLength(1)
    expect(Object.keys(stateBeforeReset.errors)).toHaveLength(1)
    
    // Reset
    reset()
    
    // Verify reset
    const stateAfterReset = useAppStore.getState()
    expect(stateAfterReset.data).toEqual({})
    expect(stateAfterReset.loading).toEqual({})
    expect(stateAfterReset.errors).toEqual({})
  })

  it('should fetch data successfully', async () => {
    const { fetchData } = useAppStore.getState()
    const mockData = { id: 1, name: 'Fetched Data' }
    const mockFetcher = vi.fn().mockResolvedValue(mockData)
    
    await fetchData('test', mockFetcher)
    
    const state = useAppStore.getState()
    expect(mockFetcher).toHaveBeenCalledOnce()
    expect(state.data.test).toEqual(mockData)
    expect(state.loading.test).toBe(false)
    expect(state.errors.test).toBeNull()
  })

  it('should handle fetch data error', async () => {
    const { fetchData } = useAppStore.getState()
    const mockError = new Error('Fetch failed')
    const mockFetcher = vi.fn().mockRejectedValue(mockError)
    
    await expect(fetchData('test', mockFetcher)).rejects.toThrow('Fetch failed')
    
    const state = useAppStore.getState()
    expect(mockFetcher).toHaveBeenCalledOnce()
    expect(state.data.test).toBeUndefined()
    expect(state.loading.test).toBe(false)
    expect(state.errors.test).toBe('Fetch failed')
  })

  describe('Selectors', () => {
    it('should select data correctly', () => {
      const { setData } = useAppStore.getState()
      const testData = { id: 1, name: 'Test' }
      
      setData('test', testData)
      
      // Note: In a real test environment, you'd need to render a component
      // that uses these hooks. For unit testing, we'll test the store directly.
      const state = useAppStore.getState()
      expect(state.data.test).toEqual(testData)
    })

    it('should select loading state correctly', () => {
      const { setLoading } = useAppStore.getState()
      
      setLoading('test', true)
      
      const state = useAppStore.getState()
      expect(state.loading.test).toBe(true)
    })

    it('should select error correctly', () => {
      const { setError } = useAppStore.getState()
      
      setError('test', 'Test error')
      
      const state = useAppStore.getState()
      expect(state.errors.test).toBe('Test error')
    })

    it('should return default values for non-existent keys', () => {
      const state = useAppStore.getState()
      expect(state.data.nonexistent).toBeUndefined()
      expect(state.loading.nonexistent).toBeUndefined()
      expect(state.errors.nonexistent).toBeUndefined()
    })
  })
})