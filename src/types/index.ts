// User types
export interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

// API types
export interface ApiError {
  message: string
  status: number
  code?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Store types
export interface LoadingState {
  [key: string]: boolean
}

export interface ErrorState {
  [key: string]: string | null
}

// Application data types
export interface AppData {
  [key: string]: any
}

// Podcast types
export interface Podcast {
  podcastId: string
  userId: string
  title: string
  type: 'topic' | 'resume'
  status: 'processing' | 'completed' | 'failed'
  duration: number
  audioUrl: string
  presignedUrl?: string
  urlExpiresIn?: number
  canPlay: boolean
  canDelete: boolean
  createdAt: string
  completedAt?: string
  createdAtFormatted: string
  completedAtFormatted?: string
  estimatedReadingTime: string
  metadata: {
    originalContent: string
    scriptLength: number
    audioSize: number
  }
}

export interface UsageStats {
  used: number
  limit: number
  tier: 'free' | 'premium'
  remaining: number
  percentage_used: number
  tier_limits: {
    monthly_podcasts: number
    max_duration_minutes: number
    max_file_size_mb: number
    max_text_length: number
  }
}

export interface PodcastCreateRequest {
  type: 'topic' | 'resume'
  title: string
  duration: number
  content?: string
  file?: File
}

export interface PodcastSummary {
  total: number
  completed: number
  processing: number
  failed: number
}