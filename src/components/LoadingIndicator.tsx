import { useLoadingStore } from '../store/loadingStore'

const LoadingIndicator = () => {
  const { isGlobalLoading } = useLoadingStore()

  if (!isGlobalLoading) return null

  return (
    <>
      <style>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 12.5%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
        .loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-blue-200">
          <div className="h-full bg-blue-600 loading-bar" />
        </div>
      </div>
    </>
  )
}

// Spinner component for local loading states
export const Spinner = ({ size = 'md', className = '' }: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`} />
  )
}

// Loading overlay for specific components
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  message = '로딩 중...',
  className = ''
}: {
  isLoading: boolean
  children: React.ReactNode
  message?: string
  className?: string
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-2">
            <Spinner size="lg" />
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingIndicator