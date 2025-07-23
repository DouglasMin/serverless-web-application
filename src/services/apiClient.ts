// Remove unused imports

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
const DEFAULT_TIMEOUT = 10000

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
    } else {
      delete this.defaultHeaders['Authorization']
    }
  }

  // Set default headers
  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers }
  }

  // Protected method to make HTTP requests
  protected async makeRequest<T>(
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
      if (headers['Content-Type'] === 'application/json') {
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
  async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      headers,
    })
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data,
      headers,
    })
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data,
      headers,
    })
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data,
      headers,
    })
  }

  async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      headers,
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
  }

  // Re-throw the error to maintain error handling flow
  throw error
})

// Export the enhanced client as the default
export default enhancedApiClient