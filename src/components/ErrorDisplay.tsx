

interface ErrorDisplayProps {
  error: string | null
  className?: string
  variant?: 'inline' | 'banner' | 'card'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  onDismiss?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

const ErrorDisplay = ({
  error,
  className = '',
  variant = 'inline',
  size = 'md',
  showIcon = true,
  onDismiss,
  action
}: ErrorDisplayProps) => {
  if (!error) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'banner':
        return 'w-full p-4 bg-red-50 border border-red-200 rounded-lg'
      case 'card':
        return 'p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm'
      case 'inline':
      default:
        return 'p-3 bg-red-50 border border-red-200 rounded-md'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs'
      case 'lg':
        return 'text-base'
      case 'md':
      default:
        return 'text-sm'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-6 h-6'
      case 'md':
      default:
        return 'w-5 h-5'
    }
  }

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      <div className="flex items-start">
        {showIcon && (
          <svg 
            className={`${getIconSize()} text-red-600 mr-3 flex-shrink-0 mt-0.5`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        )}
        
        <div className="flex-1 min-w-0">
          <p className={`text-red-800 font-medium ${getSizeStyles()}`}>
            {error}
          </p>
          
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-2 text-red-700 underline hover:no-underline focus:outline-none ${getSizeStyles()}`}
            >
              {action.label}
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600 focus:outline-none focus:text-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// Field-specific error display
export const FieldError = ({ 
  error, 
  className = '' 
}: { 
  error: string | null
  className?: string 
}) => {
  if (!error) return null

  return (
    <p className={`text-red-600 text-xs mt-1 ${className}`}>
      {error}
    </p>
  )
}

// Success message display
export const SuccessDisplay = ({
  message,
  className = '',
  variant = 'inline',
  showIcon = true,
  onDismiss
}: {
  message: string | null
  className?: string
  variant?: 'inline' | 'banner' | 'card'
  showIcon?: boolean
  onDismiss?: () => void
}) => {
  if (!message) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'banner':
        return 'w-full p-4 bg-green-50 border border-green-200 rounded-lg'
      case 'card':
        return 'p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm'
      case 'inline':
      default:
        return 'p-3 bg-green-50 border border-green-200 rounded-md'
    }
  }

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      <div className="flex items-start">
        {showIcon && (
          <svg 
            className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-green-800 font-medium text-sm">
            {message}
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 text-green-400 hover:text-green-600 focus:outline-none focus:text-green-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// Warning message display
export const WarningDisplay = ({
  message,
  className = '',
  variant = 'inline',
  showIcon = true,
  onDismiss
}: {
  message: string | null
  className?: string
  variant?: 'inline' | 'banner' | 'card'
  showIcon?: boolean
  onDismiss?: () => void
}) => {
  if (!message) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'banner':
        return 'w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg'
      case 'card':
        return 'p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm'
      case 'inline':
      default:
        return 'p-3 bg-yellow-50 border border-yellow-200 rounded-md'
    }
  }

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      <div className="flex items-start">
        {showIcon && (
          <svg 
            className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-yellow-800 font-medium text-sm">
            {message}
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 text-yellow-400 hover:text-yellow-600 focus:outline-none focus:text-yellow-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// Generic message display component
export const MessageDisplay = ({
  type,
  message,
  className = '',
  variant = 'inline',
  showIcon = true,
  onDismiss,
  action
}: {
  type: 'error' | 'success' | 'warning' | 'info'
  message: string | null
  className?: string
  variant?: 'inline' | 'banner' | 'card'
  showIcon?: boolean
  onDismiss?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}) => {
  if (!message) return null

  switch (type) {
    case 'success':
      return <SuccessDisplay message={message} className={className} variant={variant} showIcon={showIcon} onDismiss={onDismiss} />
    case 'warning':
      return <WarningDisplay message={message} className={className} variant={variant} showIcon={showIcon} onDismiss={onDismiss} />
    case 'error':
      return <ErrorDisplay error={message} className={className} variant={variant} showIcon={showIcon} onDismiss={onDismiss} action={action} />
    case 'info':
    default:
      return (
        <div className={`p-3 bg-blue-50 border border-blue-200 rounded-md ${className}`}>
          <div className="flex items-start">
            {showIcon && (
              <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-blue-800 font-medium text-sm">{message}</p>
              {action && (
                <button
                  onClick={action.onClick}
                  className="mt-2 text-blue-700 underline hover:no-underline focus:outline-none text-sm"
                >
                  {action.label}
                </button>
              )}
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="ml-3 flex-shrink-0 text-blue-400 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )
  }
}

export default ErrorDisplay