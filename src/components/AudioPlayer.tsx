import { useState, useRef, useEffect } from 'react'
import type { Podcast } from '../types'

interface AudioPlayerProps {
  podcast: Podcast
  onDownload?: () => void
}

const AudioPlayer = ({ podcast, onDownload }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => {
      setError('오디오를 로드할 수 없습니다.')
      setIsLoading(false)
    }
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
      setError(null)
    } catch (err) {
      setError('재생에 실패했습니다.')
      setIsPlaying(false)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleDownload = async () => {
    if (onDownload) {
      onDownload()
    } else if (podcast.audioUrl) {
      try {
        // Direct download using the presigned URL
        const link = document.createElement('a')
        link.href = podcast.audioUrl
        link.download = `${podcast.title}.mp3`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        setError('다운로드에 실패했습니다.')
      }
    } else {
      setError('다운로드할 수 있는 오디오 파일이 없습니다.')
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={podcast.audioUrl}
        preload="metadata"
      />

      {/* Podcast Info */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
          {podcast.title}
        </h3>
        <p className="text-xs text-gray-500">
          {new Date(podcast.createdAt).toLocaleDateString('ko-KR')} • {podcast.duration}분
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          disabled={!duration || isLoading}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: duration > 0 
              ? `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(currentTime / duration) * 100}%, #E5E7EB ${(currentTime / duration) * 100}%, #E5E7EB 100%)`
              : '#E5E7EB'
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            disabled={isLoading || !!error}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6 10l4-4v3h4v2H10v3l-4-4z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${volume * 100}%, #E5E7EB ${volume * 100}%, #E5E7EB 100%)`
              }}
            />
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          title="다운로드"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>

      {/* Custom CSS for sliders */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider:disabled::-webkit-slider-thumb {
          background: #9CA3AF;
          cursor: not-allowed;
        }

        .slider:disabled::-moz-range-thumb {
          background: #9CA3AF;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default AudioPlayer