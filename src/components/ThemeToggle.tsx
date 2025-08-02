import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { mode, actualTheme, toggleTheme } = useTheme()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative rounded-full p-2 
        bg-gray-100 dark:bg-gray-800 
        hover:bg-gray-200 dark:hover:bg-gray-700
        border border-gray-200 dark:border-gray-700
        transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${sizeClasses[size]} ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: actualTheme === 'dark' ? 180 : 0,
          scale: actualTheme === 'dark' ? 0.8 : 1
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 10 
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {actualTheme === 'light' ? (
          <SunIcon className={`${iconSizes[size]} text-yellow-500`} />
        ) : (
          <MoonIcon className={`${iconSizes[size]} text-blue-400`} />
        )}
      </motion.div>
      
      {/* Mode indicator */}
      {mode === 'auto' && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
          title="Auto mode"
        />
      )}
    </motion.button>
  )
}

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
)

export default ThemeToggle