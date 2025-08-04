import { useState } from 'react'
import type { Podcast } from '../types'
import AudioPlayer from './AudioPlayer'
import podcastService from '../services/podcastService'

interface PodcastCardProps {
  podcast: Podcast
  onDelete: (podcastId: string) => Promise<void>
  isDeleting: boolean
}

const PodcastCard = ({ podcast, onDelete, isDeleting }: PodcastCardProps) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleDelete = async () => {
    try {
      await onDelete(podcast.podcastId)
      setShowConfirmDelete(false)
    } catch (error) {
      console.error('Failed to delete podcast:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료'
      case 'processing':
        return '처리중'
      case 'failed':
        return '실패'
      default:
        return '알 수 없음'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {podcast.title}
          </h3>
          <p className="text-sm text-gray-600">
            {new Date(podcast.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ml-2 ${getStatusColor(podcast.status)}`}>
          {getStatusText(podcast.status)}
        </span>
      </div>

      {/* Metadata */}
      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {podcast.duration}분
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {podcast.type === 'topic' ? '주제 기반' : '이력서 기반'}
        </div>
      </div>

      {/* Content based on status */}
      {podcast.status === 'completed' && (
        <div className="space-y-4">
          <AudioPlayer 
            podcast={podcast}
            onDownload={async () => {
              try {
                await podcastService.downloadPodcast(podcast)
              } catch (error) {
                console.error('Download failed:', error)
                if (podcast.presignedUrl || podcast.audioUrl) {
                  window.open(podcast.presignedUrl || podcast.audioUrl, '_blank')
                }
              }
            }}
          />
          
          {/* Delete Button */}
          <div className="flex justify-end">
            {!showConfirmDelete ? (
              <button 
                onClick={() => setShowConfirmDelete(true)}
                disabled={isDeleting}
                className="px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm transition-colors"
              >
                삭제
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm transition-colors"
                >
                  {isDeleting ? '삭제 중...' : '확인'}
                </button>
                <button 
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                  className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm transition-colors"
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {podcast.status === 'processing' && (
        <div className="bg-yellow-50 p-4 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
            <div>
              <p className="text-sm font-medium text-yellow-800">팟캐스트 생성 중...</p>
              <p className="text-xs text-yellow-700 mt-1">
                AI가 스크립트를 생성하고 음성으로 변환하고 있습니다. 잠시만 기다려주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {podcast.status === 'failed' && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">생성에 실패했습니다</p>
              <p className="text-xs text-red-700 mt-1">
                다시 시도하거나 다른 내용으로 팟캐스트를 생성해보세요.
              </p>
            </div>
          </div>
          
          <div className="mt-3 flex justify-end">
            <button 
              onClick={() => setShowConfirmDelete(true)}
              disabled={isDeleting}
              className="px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PodcastCard