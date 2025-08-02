import { useState, useRef } from 'react'
import { usePodcastStore } from '../store/podcastStore'
import podcastService from '../services/podcastService'
import type { PodcastCreateRequest } from '../types'
import ErrorDisplay, { FieldError } from './ErrorDisplay'
import { useToastStore } from '../store/toastStore'
import {
  validateFile,
  validatePodcastForm,
  sanitizeInput,
  formatFileSize,
  FILE_VALIDATION,
  TEXT_VALIDATION
} from '../utils/validation'

interface PodcastCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

const PodcastCreateForm = ({ onSuccess, onCancel }: PodcastCreateFormProps) => {
  const [formData, setFormData] = useState({
    type: 'topic' as 'topic' | 'resume',
    title: '',
    duration: 5,
    content: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    title?: string | null
    content?: string | null
    file?: string | null
    form?: string | null
  }>({})
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToastStore()

  const {
    createPodcast,
    isCreating,
    error,
    uploadProgress,
    clearError,
    usageStats
  } = usePodcastStore()

  const durationOptions = podcastService.getDurationOptions()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Sanitize input for security
    const sanitizedValue = name === 'title' || name === 'content' ? sanitizeInput(value) : value

    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(sanitizedValue) : sanitizedValue
    }))

    // Clear validation errors for this field
    setValidationErrors(prev => ({
      ...prev,
      [name]: null,
      form: null
    }))
    clearError()
  }

  const handleTypeChange = (type: 'topic' | 'resume') => {
    setFormData(prev => ({
      ...prev,
      type
    }))
    setSelectedFile(null)
    clearError()
  }

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file)
    if (!validation.valid) {
      setValidationErrors(prev => ({
        ...prev,
        file: validation.error || null,
        form: null
      }))
      toast.addToast({
        type: 'error',
        title: '파일 검증 실패',
        message: validation.error || '파일 검증에 실패했습니다.',
        duration: 5000
      })
      return
    }

    setSelectedFile(file)
    setValidationErrors(prev => ({
      ...prev,
      file: null,
      form: null
    }))
    clearError()
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setValidationErrors({})

    // Rate limiting check
    const now = Date.now()
    if (now - lastSubmitTime < 2000) { // 2 second minimum between submissions
      toast.addToast({
        type: 'warning',
        title: '너무 빠른 요청',
        message: '2초 후에 다시 시도해주세요.',
        duration: 3000
      })
      return
    }

    // Comprehensive form validation
    const formValidation = validatePodcastForm({
      type: formData.type,
      title: formData.title,
      duration: formData.duration,
      content: formData.content,
      file: selectedFile || undefined
    })

    if (!formValidation.valid) {
      const errors: typeof validationErrors = {}

      // Determine which field has the error based on the error message or code
      const errorMessage = formValidation.error || '입력값이 올바르지 않습니다.'
      const errorCode = formValidation.code || ''

      if (errorCode.includes('TITLE') || errorMessage.includes('제목')) {
        errors.title = errorMessage
      } else if (errorCode.includes('CONTENT') || errorMessage.includes('내용') || errorMessage.includes('주제')) {
        errors.content = errorMessage
      } else if (errorCode.includes('FILE') || errorMessage.includes('파일')) {
        errors.file = errorMessage
      } else {
        errors.form = errorMessage
      }

      setValidationErrors(errors)
      toast.addToast({
        type: 'error',
        title: '입력 검증 실패',
        message: errorMessage,
        duration: 5000
      })
      return
    }

    setLastSubmitTime(now)

    // Check usage limits
    if (usageStats && usageStats.remaining <= 0) {
      alert('월간 팟캐스트 생성 한도에 도달했습니다. 다음 달에 다시 시도해주세요.')
      return
    }

    // Check duration limits
    if (usageStats && !podcastService.isDurationAllowed(formData.duration, usageStats)) {
      const maxDuration = podcastService.getMaxDuration(usageStats)
      alert(`현재 플랜에서는 최대 ${maxDuration}분까지만 생성 가능합니다.`)
      return
    }

    try {
      const createRequest: PodcastCreateRequest = {
        type: formData.type,
        title: formData.title,
        duration: formData.duration,
        ...(formData.type === 'topic' && { content: formData.content }),
        ...(formData.type === 'resume' && selectedFile && { file: selectedFile })
      }

      await createPodcast(createRequest)

      // Reset form
      setFormData({
        type: 'topic',
        title: '',
        duration: 5,
        content: ''
      })
      setSelectedFile(null)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      // Error is handled by the store
      console.error('Failed to create podcast:', error)
    }
  }

  const getFilteredDurationOptions = () => {
    const maxDuration = podcastService.getMaxDuration(usageStats)
    return durationOptions.filter(option => option.value <= maxDuration)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">새 팟캐스트 만들기</h2>
        <p className="text-gray-600">주제를 입력하거나 이력서를 업로드해서 개인화된 팟캐스트를 생성하세요.</p>
      </div>

      {error && (
        <ErrorDisplay error={error || null} className="mb-4" onDismiss={clearError} />
      )}

      {validationErrors.form && (
        <ErrorDisplay error={validationErrors.form || null} className="mb-4" />
      )}

      {/* Usage Stats */}
      {usageStats && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">
                이번 달 사용량: {usageStats.used}/{usageStats.limit}
              </p>
              <p className="text-xs text-blue-700">
                {usageStats.tier === 'free' ? 'Free 플랜' : 'Premium 플랜'} •
                남은 팟캐스트: {usageStats.remaining}개
              </p>
            </div>
            <div className="text-right">
              <div className="w-20 bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, usageStats.percentage_used)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            팟캐스트 유형
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleTypeChange('topic')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${formData.type === 'topic'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
                </svg>
                <span className="font-medium text-gray-900">주제 기반</span>
              </div>
              <p className="text-sm text-gray-600">관심 있는 주제를 입력하면 맞춤형 팟캐스트를 생성합니다.</p>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('resume')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${formData.type === 'resume'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium text-gray-900">이력서 기반</span>
              </div>
              <p className="text-sm text-gray-600">이력서를 업로드하면 개인 경험을 바탕으로 격려 팟캐스트를 생성합니다.</p>
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            팟캐스트 제목 *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            placeholder="예: 나의 성장 이야기, 개발자로서의 여정"
            required
            maxLength={TEXT_VALIDATION.TITLE_MAX_LENGTH}
          />
          <div className="flex justify-between items-start mt-1">
            <FieldError error={validationErrors.title || null} />
            <p className="text-xs text-gray-500">
              {formData.title.length}/{TEXT_VALIDATION.TITLE_MAX_LENGTH}자
            </p>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            재생 시간
          </label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {getFilteredDurationOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {usageStats && usageStats.tier === 'free' && (
            <p className="mt-1 text-xs text-gray-500">
              Free 플랜은 최대 {podcastService.getMaxDuration(usageStats)}분까지 생성 가능합니다.
            </p>
          )}
        </div>

        {/* Content based on type */}
        {formData.type === 'topic' ? (
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              주제 내용 *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.content ? 'border-red-300' : 'border-gray-300'
                }`}
              placeholder="어떤 주제로 팟캐스트를 만들고 싶으신가요? 자세히 설명해주세요.&#10;&#10;예시:&#10;- 개발자로서 성장하는 방법&#10;- 새로운 기술을 배우는 즐거움&#10;- 팀워크의 중요성과 협업 경험"
              required
              maxLength={usageStats?.tier_limits?.max_text_length || TEXT_VALIDATION.MAX_LENGTH}
            />
            <div className="flex justify-between items-start mt-1">
              <FieldError error={validationErrors.content || null} />
              <p className="text-xs text-gray-500">
                {formData.content.length}/{usageStats?.tier_limits?.max_text_length || TEXT_VALIDATION.MAX_LENGTH}자
              </p>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이력서 파일 *
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${validationErrors.file
                ? 'border-red-400 bg-red-50'
                : dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : selectedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                accept=".pdf,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="text-center">
                {selectedFile ? (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2 text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="mt-2 text-xs text-red-600 hover:text-red-700"
                    >
                      파일 제거
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                        파일을 선택하거나
                      </span>{' '}
                      드래그해서 업로드하세요
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX 파일만 지원 (최대 {formatFileSize(FILE_VALIDATION.MAX_SIZE)})
                    </p>
                  </div>
                )}
              </div>
            </div>
            <FieldError error={validationErrors.file || null} className="mt-2" />
          </div>
        )}

        {/* Progress Bar */}
        {isCreating && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">팟캐스트 생성 중...</span>
              <span className="text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              {uploadProgress < 30 ? '파일 업로드 중...' :
                uploadProgress < 70 ? 'AI가 스크립트를 생성하고 있습니다...' :
                  uploadProgress < 90 ? '음성으로 변환하고 있습니다...' :
                    '마무리 중...'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isCreating || (usageStats?.remaining === 0)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {isCreating ? '생성 중...' : '팟캐스트 생성하기'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isCreating}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              취소
            </button>
          )}
        </div>

        {/* Usage Limit Warning */}
        {usageStats && usageStats.remaining === 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">월간 사용량 한도 도달</p>
                <p className="text-sm text-yellow-700">
                  이번 달 팟캐스트 생성 한도에 도달했습니다. 다음 달에 다시 시도하거나 프리미엄 플랜으로 업그레이드하세요.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default PodcastCreateForm