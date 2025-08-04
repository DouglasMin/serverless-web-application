import React, { useState, useEffect } from 'react';
import enhancedApiClient from '../services/apiClient';
import { 
  getRandomMessage, 
  getStatusColor, 
  getProgressBarColor, 
  getStatusDisplayName,
  formatEstimatedTime,
  getMotivationalMessage 
} from '../utils/progressMessages';


interface PodcastProgress {
  podcastId: string;
  status: string;
  progressPercentage: number;
  currentStep: string;
  updatedAt: string;
  errorMessage?: string;
  estimatedCompletion?: string;
}

interface PodcastProgressTrackerProps {
  podcastId: string;
  onComplete?: (podcast: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

const PodcastProgressTracker: React.FC<PodcastProgressTrackerProps> = ({
  podcastId,
  onComplete,
  onError,
  className = ''
}) => {
  const [progress, setProgress] = useState<PodcastProgress | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!podcastId || !isPolling) return;

    const fetchProgress = async () => {
      try {
        const response = await enhancedApiClient.get(`/api/podcasts/${podcastId}/status`);
        
        // API 응답이 직접 JSON 객체로 오므로 response.data가 아닌 response를 사용
        if (response.success) {
          const progressData: PodcastProgress = {
            podcastId: response.podcastId,
            status: response.status,
            progressPercentage: response.progressPercentage,
            currentStep: response.currentStep,
            updatedAt: response.updatedAt,
            errorMessage: response.errorMessage,
            estimatedCompletion: response.estimatedCompletion
          };
          
          setProgress(progressData);
          setError(null);

          // Stop polling if completed or failed
          if (progressData.status === 'completed') {
            setIsPolling(false);
            if (onComplete) {
              // Fetch full podcast data
              try {
                const podcastResponse = await enhancedApiClient.get('/api/podcasts');
                const podcast = podcastResponse.podcasts?.find(
                  (p: any) => p.podcastId === podcastId
                );
                onComplete(podcast);
              } catch (err) {
                console.error('Failed to fetch completed podcast:', err);
                onComplete(progressData);
              }
            }
          } else if (progressData.status === 'failed') {
            setIsPolling(false);
            const errorMsg = progressData.errorMessage || '팟캐스트 생성 중 오류가 발생했습니다';
            setError(errorMsg);
            if (onError) {
              onError(errorMsg);
            }
          }
        } else {
          throw new Error(response.data.error || 'Failed to fetch progress');
        }
      } catch (err: any) {
        console.error('Error fetching podcast progress:', err);
        const errorMessage = err.response?.data?.error || err.message || '상태 확인 중 오류가 발생했습니다';
        setError(errorMessage);
        
        // Stop polling on persistent errors
        if (err.response?.status === 404 || err.response?.status === 403) {
          setIsPolling(false);
          if (onError) {
            onError(errorMessage);
          }
        }
      }
    };

    // Initial fetch
    fetchProgress();

    // Set up polling interval
    const interval = setInterval(fetchProgress, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [podcastId, isPolling, onComplete, onError]);

  // 랜덤 메시지를 위한 상태
  const [displayMessage, setDisplayMessage] = useState<string>('');

  // 메시지 업데이트 효과
  useEffect(() => {
    if (progress?.status) {
      // 사용자가 제공한 currentStep이 있으면 사용, 없으면 랜덤 메시지 사용
      if (progress.currentStep) {
        setDisplayMessage(progress.currentStep);
      } else {
        setDisplayMessage(getRandomMessage(progress.status));
      }
    }
  }, [progress?.status, progress?.currentStep]);

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center">
          <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-red-800">처리 실패</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
          <p className="text-gray-600">상태를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
      <div className="space-y-4">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">팟캐스트 생성 중</h3>
          <span className={`text-sm font-medium ${getStatusColor(progress.status)}`}>
            {getStatusDisplayName(progress.status)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">진행률</span>
            <span className="font-medium text-gray-900">{progress.progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(progress.status)}`}
              style={{ width: `${progress.progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="space-y-2">
          <p className="text-gray-900 font-medium">{displayMessage}</p>
          
          {/* Motivational Message */}
          {progress.status !== 'completed' && progress.status !== 'failed' && (
            <p className="text-sm text-blue-600 font-medium">
              {getMotivationalMessage(progress.progressPercentage)}
            </p>
          )}
          
          {/* Estimated Completion Time */}
          {progress.estimatedCompletion && progress.status !== 'completed' && progress.status !== 'failed' && (
            <p className="text-sm text-gray-500">
              {formatEstimatedTime(progress.estimatedCompletion)}
            </p>
          )}
        </div>

        {/* Processing Animation */}
        {progress.status !== 'completed' && progress.status !== 'failed' && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>AI가 열심히 작업하고 있어요</span>
          </div>
        )}

        {/* Completion Message */}
        {progress.status === 'completed' && (
          <div className="flex items-center space-x-2 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">팟캐스트가 성공적으로 생성되었습니다!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastProgressTracker;