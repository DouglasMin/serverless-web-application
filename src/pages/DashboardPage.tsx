import { useState, useEffect } from 'react'
import { usePodcastStore } from '../store/podcastStore'
import { useAuthStore } from '../store/authStore'
import PodcastCreateForm from '../components/PodcastCreateForm'
import PodcastCard from '../components/PodcastCard'

const DashboardPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { 
    podcasts, 
    usageStats, 
    isLoading, 
    error, 
    isDeleting,
    fetchPodcasts, 
    fetchUsageStats,
    deletePodcast,
    clearError 
  } = usePodcastStore()

  const { isAuthenticated, isLoading: authLoading, tokens } = useAuthStore()

  useEffect(() => {
    // Only fetch data if user is authenticated, auth is not loading, and we have tokens
    if (isAuthenticated && !authLoading && tokens?.accessToken) {
      console.log('📊 Fetching dashboard data - auth ready')
      fetchPodcasts()
      fetchUsageStats()
    } else {
      console.log('⏳ Waiting for auth - authenticated:', isAuthenticated, 'loading:', authLoading, 'hasToken:', !!tokens?.accessToken)
    }
  }, [isAuthenticated, authLoading, tokens?.accessToken, fetchPodcasts, fetchUsageStats])

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">로그인이 필요합니다.</p>
          <a href="/login" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            로그인하러 가기
          </a>
        </div>
      </div>
    )
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    fetchPodcasts()
    fetchUsageStats()
  }

  if (showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <PodcastCreateForm 
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">팟캐스트 대시보드</h1>
        <p className="text-gray-600">AI로 생성된 개인 맞춤형 팟캐스트를 관리하세요.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Usage Stats */}
      {usageStats && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">이번 달 사용량</h2>
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {usageStats.used}/{usageStats.limit}
                  </p>
                  <p className="text-sm text-gray-600">팟캐스트 생성</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-green-600">
                    {usageStats.remaining}개 남음
                  </p>
                  <p className="text-sm text-gray-600">
                    {usageStats.tier === 'free' ? 'Free 플랜' : 'Premium 플랜'}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-32 bg-blue-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, usageStats.percentage_used || 0)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{(usageStats.percentage_used || 0).toFixed(1)}% 사용됨</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {podcasts.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">전체 팟캐스트</p>
                <p className="text-xl font-semibold text-gray-900">{podcasts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">완료됨</p>
                <p className="text-xl font-semibold text-gray-900">
                  {podcasts.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">처리 중</p>
                <p className="text-xl font-semibold text-gray-900">
                  {podcasts.filter(p => p.status === 'processing').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">실패</p>
                <p className="text-xl font-semibold text-gray-900">
                  {podcasts.filter(p => p.status === 'failed').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={usageStats?.remaining === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          새 팟캐스트 만들기
        </button>
        {usageStats?.remaining === 0 && (
          <p className="mt-2 text-sm text-gray-500">
            월간 사용량 한도에 도달했습니다. 다음 달에 다시 시도해주세요.
          </p>
        )}
      </div>
      
      {/* Podcasts List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">팟캐스트를 불러오는 중...</p>
        </div>
      ) : podcasts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">아직 팟캐스트가 없습니다</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              AI가 생성하는 개인 맞춤형 팟캐스트를 경험해보세요.<br />
              주제를 입력하거나 이력서를 업로드하면 몇 분 안에 완성됩니다.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowCreateForm(true)}
                disabled={usageStats?.remaining === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                첫 번째 팟캐스트 만들기
              </button>
              
              {usageStats?.remaining === 0 && (
                <p className="text-sm text-gray-500">
                  월간 사용량 한도에 도달했습니다. 다음 달에 다시 시도해주세요.
                </p>
              )}
            </div>

            {/* Feature highlights */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">빠른 생성</p>
                  <p className="text-xs text-gray-600">몇 분 안에 완성</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">개인 맞춤</p>
                  <p className="text-xs text-gray-600">당신만의 콘텐츠</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">다양한 형식</p>
                  <p className="text-xs text-gray-600">주제 또는 이력서</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">쉬운 다운로드</p>
                  <p className="text-xs text-gray-600">MP3 파일 제공</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <PodcastCard
              key={podcast.podcastId}
              podcast={podcast}
              onDelete={async (podcastId: string) => {
                await deletePodcast(podcastId)
                // Refresh the list
                fetchPodcasts()
                fetchUsageStats()
              }}
              isDeleting={isDeleting === podcast.podcastId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage