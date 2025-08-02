import { create } from 'zustand'
import type { Podcast, UsageStats, PodcastSummary, PodcastCreateRequest } from '../types'
import podcastService from '../services/podcastService'
import { useToastStore } from './toastStore'
import { useLoadingStore } from './loadingStore'

interface PodcastState {
  // State
  podcasts: Podcast[]
  usageStats: UsageStats | null
  summary: PodcastSummary | null
  isLoading: boolean
  isCreating: boolean
  isDeleting: string | null // podcast ID being deleted
  error: string | null
  uploadProgress: number

  // Actions
  fetchPodcasts: () => Promise<void>
  fetchUsageStats: () => Promise<void>
  createPodcast: (data: PodcastCreateRequest, onProgress?: (progress: number) => void) => Promise<Podcast>
  deletePodcast: (podcastId: string) => Promise<void>
  setError: (error: string | null) => void
  clearError: () => void
  setUploadProgress: (progress: number) => void
  resetUploadProgress: () => void
}

export const usePodcastStore = create<PodcastState>((set, get) => ({
  // Initial state
  podcasts: [],
  usageStats: null,
  summary: null,
  isLoading: false,
  isCreating: false,
  isDeleting: null,
  error: null,
  uploadProgress: 0,

  // Actions
  fetchPodcasts: async () => {
    set({ isLoading: true, error: null })
    useLoadingStore.getState().addLoadingTask('fetch-podcasts')
    
    try {
      const response = await podcastService.getPodcasts()
      
      set({
        podcasts: response.podcasts,
        usageStats: response.usage_stats,
        summary: response.summary,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch podcasts'
      set({
        isLoading: false,
        error: errorMessage
      })
      
      // Show error toast
      useToastStore.getState().addToast({
        type: 'error',
        title: '팟캐스트 목록 로드 실패',
        message: errorMessage,
        duration: 5000
      })
      
      throw error
    } finally {
      useLoadingStore.getState().removeLoadingTask('fetch-podcasts')
    }
  },

  fetchUsageStats: async () => {
    try {
      const response = await podcastService.getPodcasts()
      set({
        usageStats: response.usage_stats,
        error: null
      })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch usage stats'
      set({ error: errorMessage })
      throw error
    }
  },

  createPodcast: async (data: PodcastCreateRequest, onProgress?: (progress: number) => void) => {
    set({ isCreating: true, error: null, uploadProgress: 0 })
    useLoadingStore.getState().addLoadingTask('create-podcast')
    
    try {
      // Simulate upload progress for better UX
      if (onProgress) {
        onProgress(10)
        set({ uploadProgress: 10 })
      }

      // Validate input based on type
      if (data.type === 'topic' && data.content) {
        const validation = podcastService.validateTextContent(data.content)
        if (!validation.valid) {
          throw new Error(validation.error)
        }
      }

      if (data.type === 'resume' && data.file) {
        const validation = podcastService.validateFile(data.file)
        if (!validation.valid) {
          throw new Error(validation.error)
        }
      }

      if (onProgress) {
        onProgress(30)
        set({ uploadProgress: 30 })
      }

      const response = await podcastService.createPodcast(data)
      
      if (onProgress) {
        onProgress(100)
        set({ uploadProgress: 100 })
      }

      // Update local state with new podcast
      const currentState = get()
      set({
        podcasts: [response.podcast, ...currentState.podcasts],
        usageStats: response.usage_stats,
        isCreating: false,
        error: null,
        uploadProgress: 0
      })

      // Update summary
      if (currentState.summary) {
        const newSummary = {
          ...currentState.summary,
          total: currentState.summary.total + 1,
          processing: currentState.summary.processing + 1
        }
        set({ summary: newSummary })
      }

      // Show success toast
      useToastStore.getState().addToast({
        type: 'success',
        title: '팟캐스트 생성 시작',
        message: `"${data.title}" 팟캐스트 생성이 시작되었습니다. 완료되면 알림을 받으실 수 있습니다.`,
        duration: 6000
      })

      return response.podcast
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create podcast'
      set({
        isCreating: false,
        error: errorMessage,
        uploadProgress: 0
      })
      
      // Show error toast
      useToastStore.getState().addToast({
        type: 'error',
        title: '팟캐스트 생성 실패',
        message: errorMessage,
        duration: 7000
      })
      
      throw error
    } finally {
      useLoadingStore.getState().removeLoadingTask('create-podcast')
    }
  },

  deletePodcast: async (podcastId: string) => {
    set({ isDeleting: podcastId, error: null })
    useLoadingStore.getState().addLoadingTask(`delete-podcast-${podcastId}`)
    
    try {
      const response = await podcastService.deletePodcast(podcastId)
      
      // Update local state
      const currentState = get()
      const updatedPodcasts = currentState.podcasts.filter(p => p.podcastId !== podcastId)
      const deletedPodcast = currentState.podcasts.find(p => p.podcastId === podcastId)
      
      set({
        podcasts: updatedPodcasts,
        usageStats: response.usage_stats || currentState.usageStats,
        isDeleting: null,
        error: null
      })

      // Update summary
      if (currentState.summary && deletedPodcast) {
        const newSummary = {
          ...currentState.summary,
          total: currentState.summary.total - 1
        }
        
        // Decrease the appropriate status count
        if (deletedPodcast.status === 'completed') {
          newSummary.completed = Math.max(0, newSummary.completed - 1)
        } else if (deletedPodcast.status === 'processing') {
          newSummary.processing = Math.max(0, newSummary.processing - 1)
        } else if (deletedPodcast.status === 'failed') {
          newSummary.failed = Math.max(0, newSummary.failed - 1)
        }
        
        set({ summary: newSummary })
      }

      // Show success toast
      useToastStore.getState().addToast({
        type: 'success',
        title: '팟캐스트 삭제 완료',
        message: '팟캐스트가 성공적으로 삭제되었습니다.',
        duration: 4000
      })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete podcast'
      set({
        isDeleting: null,
        error: errorMessage
      })
      
      // Show error toast
      useToastStore.getState().addToast({
        type: 'error',
        title: '팟캐스트 삭제 실패',
        message: errorMessage,
        duration: 5000
      })
      
      throw error
    } finally {
      useLoadingStore.getState().removeLoadingTask(`delete-podcast-${podcastId}`)
    }
  },

  setError: (error: string | null) => {
    set({ error })
  },

  clearError: () => {
    set({ error: null })
  },

  setUploadProgress: (progress: number) => {
    set({ uploadProgress: Math.min(100, Math.max(0, progress)) })
  },

  resetUploadProgress: () => {
    set({ uploadProgress: 0 })
  }
}))

export default usePodcastStore