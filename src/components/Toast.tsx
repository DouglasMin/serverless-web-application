import { useEffect, useState } from 'react'
import { useToastStore, type Toast, type ToastType } from '../store/toastStore'

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => onRemove(toast.id), 300) // Wait for exit animation
  }

  const getToastStyles = (type: ToastType) => {
    const baseStyles = "border-l-4 shadow-lg"
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-400 text-green-800`
      case 'error':
        return `${baseStyles} bg-red-50 border-red-400 text-red-800`
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800`
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800`
      default:
        return `${baseStyles} bg-gray-50 border-gray-400 text-gray-800`
    }
  }

  const getIcon = (type: ToastType) => {
    const iconClass = "w-5 h-5 mr-3 flex-shrink-0"
    
    switch (type) {
      case 'success':
        return (
          <svg className={`${iconClass} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'error':
        return (
          <svg className={`${iconClass} text-red-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'warning':
        return (
          <svg className={`${iconClass} text-yellow-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'info':
        return (
          <svg className={`${iconClass} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={`
        max-w-sm w-full rounded-lg p-4 mb-3 transition-all duration-300 ease-in-out transform
        ${getToastStyles(toast.type)}
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isRemoving ? 'scale-95' : 'scale-100'}
      `}
    >
      <div className="flex items-start">
        {getIcon(toast.type)}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-sm mt-1 opacity-90">
              {toast.message}
            </p>
          )}
          
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium underline mt-2 hover:no-underline focus:outline-none"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleRemove}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  )
}

export default ToastContainer