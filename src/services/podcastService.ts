import apiClient from './apiClient'
import type { Podcast, PodcastCreateRequest, UsageStats, PodcastSummary } from '../types'
import {
  validateFile,
  validateTextContent,
  validateTitle,
  validatePodcastForm,
  type ValidationResult
} from '../utils/validation'

export interface PodcastListResponse {
  success: boolean
  podcasts: Podcast[]
  count: number
  usage_stats: UsageStats
  summary: PodcastSummary
}

export interface PodcastCreateResponse {
  success: boolean
  message: string
  podcast: Podcast
  generation_info: {
    script_metadata: any
    tts_service: string
    audio_metadata: any
    processing_time: number
  }
  usage_stats: UsageStats
}

export interface PodcastDeleteResponse {
  success: boolean
  message: string
  podcast_id: string
  cleanup_status: {
    s3_deletion: {
      success: boolean
      error: string | null
    }
    usage_update: {
      success: boolean
      error: string | null
      applied: boolean
    }
  }
  usage_stats?: UsageStats
}

class PodcastService {
  /**
   * Get all podcasts for the authenticated user
   */
  async getPodcasts(): Promise<PodcastListResponse> {
    const response = await apiClient.get<PodcastListResponse>('/api/podcasts')
    return response
  }

  /**
   * Create a new podcast
   */
  async createPodcast(data: PodcastCreateRequest): Promise<PodcastCreateResponse> {
    // Create FormData for multipart upload
    const formData = new FormData()
    formData.append('type', data.type)
    formData.append('title', data.title)
    formData.append('duration', data.duration.toString())

    if (data.type === 'topic' && data.content) {
      formData.append('content', data.content)
    }

    if (data.type === 'resume' && data.file) {
      formData.append('file', data.file)
    }

    // Don't set Content-Type header manually for FormData - let browser set it with boundary
    const response = await apiClient.post<PodcastCreateResponse>('/api/podcasts', formData, {})

    return response
  }

  /**
   * Delete a podcast
   */
  async deletePodcast(podcastId: string): Promise<PodcastDeleteResponse> {
    const response = await apiClient.delete<PodcastDeleteResponse>(`/api/podcasts/${podcastId}`)
    return response
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<{ usage_stats: UsageStats }> {
    // This will be included in getPodcasts response, but can be called separately if needed
    const response = await this.getPodcasts()
    return { usage_stats: response.usage_stats }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): ValidationResult {
    return validateFile(file)
  }

  /**
   * Validate text content
   */
validateTextContent(content: string, maxLength?: number): ValidationResult {
  // maxLength가 undefined이면 전달하지 않아서 기본값이 적용되도록 함
  if (maxLength === undefined) {
    return validateTextContent(content)
  }
  return validateTextContent(content, maxLength)
}

  /**
   * Validate podcast title
   */
  validateTitle(title: string): ValidationResult {
    return validateTitle(title)
  }

  /**
   * Validate entire podcast form
   */
  validatePodcastForm(data: {
    type: 'topic' | 'resume'
    title: string
    content?: string
    file?: File | null
    duration: number
  }): ValidationResult {
    // Convert null to undefined to match the expected type
    const formData = {
      ...data,
      file: data.file || undefined
    }
    return validatePodcastForm(formData)
  }

  /**
   * Format duration for display
   */
  formatDuration(minutes: number): string {
    return `${minutes}분`
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)}MB`
  }

  /**
   * Get available duration options
   */
  getDurationOptions(): Array<{ value: number; label: string }> {
    return [
      { value: 3, label: '3분' },
      { value: 5, label: '5분' },
      { value: 10, label: '10분' },
      { value: 15, label: '15분' },
      { value: 20, label: '20분' }
    ]
  }

  /**
   * Check if duration is allowed for user's tier
   */
  isDurationAllowed(duration: number, usageStats: UsageStats | null): boolean {
    if (!usageStats || !usageStats.tier_limits) {
      return duration <= 10 // Default max duration for free tier
    }
    return duration <= usageStats.tier_limits.max_duration_minutes
  }

  /**
   * Get maximum allowed duration for user's tier
   */
  getMaxDuration(usageStats: UsageStats | null): number {
    if (!usageStats || !usageStats.tier_limits) {
      return 10 // Default max duration for free tier
    }
    return usageStats.tier_limits.max_duration_minutes
  }

  /**
   * Download podcast audio file
   */
  async downloadPodcast(podcast: Podcast): Promise<void> {
    if (!podcast.audioUrl) {
      throw new Error('오디오 파일 URL이 없습니다.')
    }

    try {
      // Create a temporary link element and trigger download
      const link = document.createElement('a')
      link.href = podcast.audioUrl
      link.download = `${podcast.title}.mp3`
      link.target = '_blank'

      // Add to DOM temporarily
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
    } catch (error) {
      throw new Error('다운로드에 실패했습니다.')
    }
  }

  /**
   * Get presigned URL for audio download (if needed)
   */
  async getDownloadUrl(podcastId: string): Promise<string> {
    const response = await apiClient.get<{ download_url: string }>(`/api/podcasts/${podcastId}/download`)
    return response.download_url
  }
}

// Export singleton instance
export const podcastService = new PodcastService()
export default podcastService