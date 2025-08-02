// Remove unused imports

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
const DEFAULT_TIMEOUT = 60000  // 60 seconds for AI processing

// Custom error class for API errors
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

// Request configuration interface
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
  retryDelay?: number
}

// API Client class
class ApiClient {
  protected baseURL: string
  private defaultHeaders: Record<string, string>
  private timeout: number

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL.replace(/\/$/, '') // Remove trailing slash
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
    this.timeout = DEFAULT_TIMEOUT
  }

  // Set authentication token
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`
      console.log('🔑 Auth token set in API client')
    } else {
      delete this.defaultHeaders['Authorization']
      console.log('🚫 Auth token removed from API client')
    }
  }

  // Get current auth token status
  hasAuthToken(): boolean {
    return !!this.defaultHeaders['Authorization']
  }

  // Set default headers
  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers }
  }

  // Protected method to make HTTP requests with retry logic
  protected async makeRequest<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<T> {
    const maxRetries = config.retries || 0
    const retryDelay = config.retryDelay || 1000
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeRequest<T>(endpoint, config)
      } catch (error) {
        // Don't retry on client errors (4xx) or if it's the last attempt
        if (error instanceof ApiClientError && 
            (error.status >= 400 && error.status < 500) || 
            attempt === maxRetries) {
          throw error
        }
        
        // Wait before retrying
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
        }
      }
    }
    
    throw new ApiClientError('Max retries exceeded', 0)
  }

  // Execute the actual HTTP request
  private async executeRequest<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    
    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
    }

    const requestInit: RequestInit = {
      method: config.method,
      headers,
      signal: AbortSignal.timeout(config.timeout || this.timeout),
    }

    // Add body for non-GET requests
    if (config.body && config.method !== 'GET') {
      if (config.body instanceof FormData) {
        // For FormData, don't set Content-Type - let browser set it with boundary
        delete headers['Content-Type']
        requestInit.body = config.body
      } else if (headers['Content-Type'] === 'application/json') {
        requestInit.body = JSON.stringify(config.body)
      } else {
        requestInit.body = config.body
      }
    }

    try {
      const response = await fetch(url, requestInit)
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      let responseData: any

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = responseData?.error || responseData?.message || `HTTP ${response.status}`
        const errorCode = responseData?.code
        
        throw new ApiClientError(
          errorMessage,
          response.status,
          errorCode,
          responseData
        )
      }

      return responseData
    } catch (error) {
      // Handle network errors, timeouts, etc.
      if (error instanceof ApiClientError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiClientError('Request timeout', 408)
        }
        throw new ApiClientError(`Network error: ${error.message}`, 0)
      }

      throw new ApiClientError('Unknown error occurred', 0)
    }
  }

  // HTTP method implementations
  async get<T = any>(
    endpoint: string, 
    headers?: Record<string, string>,
    options?: { retries?: number; retryDelay?: number }
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      headers,
      retries: options?.retries || 2, // Default 2 retries for GET requests
      retryDelay: options?.retryDelay
    })
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>,
    options?: { retries?: number; retryDelay?: number }
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data,
      headers,
      retries: options?.retries || 1, // Default 1 retry for POST requests
      retryDelay: options?.retryDelay
    })
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>,
    options?: { retries?: number; retryDelay?: number }
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data,
      headers,
      retries: options?.retries || 1,
      retryDelay: options?.retryDelay
    })
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>,
    options?: { retries?: number; retryDelay?: number }
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data,
      headers,
      retries: options?.retries || 1,
      retryDelay: options?.retryDelay
    })
  }

  async delete<T = any>(
    endpoint: string, 
    headers?: Record<string, string>,
    options?: { retries?: number; retryDelay?: number }
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      headers,
      retries: options?.retries || 1,
      retryDelay: options?.retryDelay
    })
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient()

// Export the class for testing and custom instances
export { ApiClient }
// Request and Response interceptor types
type RequestInterceptor = (config: RequestConfig & { url: string }) => RequestConfig & { url: string }
type ResponseInterceptor = <T>(response: T, config: RequestConfig & { url: string }) => T
type ErrorInterceptor = (error: ApiClientError, config: RequestConfig & { url: string }) => Promise<never>

// Enhanced API Client with interceptors
class EnhancedApiClient extends ApiClient {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  // Add error interceptor
  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor)
  }

  // Override makeRequest to include interceptors
  protected async makeRequest<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<T> {
    let requestConfig = {
      ...config,
      url: `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    }

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      requestConfig = interceptor(requestConfig)
    }

    try {
      // Make the actual request using parent method
      const response = await super.makeRequest<T>(endpoint, config)

      // Apply response interceptors
      let processedResponse = response
      for (const interceptor of this.responseInterceptors) {
        processedResponse = interceptor(processedResponse, requestConfig)
      }

      return processedResponse
    } catch (error) {
      // Apply error interceptors
      if (error instanceof ApiClientError) {
        for (const interceptor of this.errorInterceptors) {
          await interceptor(error, requestConfig)
        }
      }
      throw error
    }
  }
}

// Create enhanced API client instance
export const enhancedApiClient = new EnhancedApiClient()

// Setup default interceptors
enhancedApiClient.addRequestInterceptor((config) => {
  // Add timestamp to requests for debugging
  console.log(`[API Request] ${config.method} ${config.url}`, {
    timestamp: new Date().toISOString(),
    headers: config.headers
  })
  return config
})

enhancedApiClient.addResponseInterceptor((response, config) => {
  // Log successful responses
  console.log(`[API Response] ${config.method} ${config.url}`, {
    timestamp: new Date().toISOString(),
    response
  })
  return response
})

enhancedApiClient.addErrorInterceptor(async (error, config) => {
  // Log errors
  console.error(`[API Error] ${config.method} ${config.url}`, {
    timestamp: new Date().toISOString(),
    status: error.status,
    message: error.message,
    code: error.code
  })

  // Handle specific error cases
  if (error.status === 401) {
    // Token might be expired, could trigger refresh here
    console.warn('Authentication error - token may be expired')
    
    // Import toast store dynamically to avoid circular dependencies
    const { useToastStore } = await import('../store/toastStore')
    useToastStore.getState().addToast({
      type: 'warning',
      title: '인증 만료',
      message: '로그인이 만료되었습니다. 다시 로그인해주세요.',
      duration: 6000
    })
  } else if (error.status === 403) {
    const { useToastStore } = await import('../store/toastStore')
    useToastStore.getState().addToast({
      type: 'error',
      title: '접근 권한 없음',
      message: '이 작업을 수행할 권한이 없습니다.',
      duration: 5000
    })
  } else if (error.status === 429) {
    const { useToastStore } = await import('../store/toastStore')
    useToastStore.getState().addToast({
      type: 'warning',
      title: '요청 한도 초과',
      message: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.',
      duration: 6000
    })
  } else if (error.status >= 500) {
    const { useToastStore } = await import('../store/toastStore')
    useToastStore.getState().addToast({
      type: 'error',
      title: '서버 오류',
      message: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      duration: 7000
    })
  } else if (error.status === 0) {
    const { useToastStore } = await import('../store/toastStore')
    useToastStore.getState().addToast({
      type: 'error',
      title: '네트워크 오류',
      message: '인터넷 연결을 확인해주세요.',
      duration: 6000
    })
  }

  // Re-throw the error to maintain error handling flow
  throw error
})

// Export the enhanced client as the default
export default enhancedApiClient