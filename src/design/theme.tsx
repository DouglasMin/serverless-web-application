/**
 * Theme Provider System
 * 라이트/다크 모드 지원과 테마 전환 기능
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { colorUtils } from './colors'

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'auto'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeConfig {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  colors: ReturnType<typeof colorUtils.createThemeColors>
  animations: {
    reducedMotion: boolean
    duration: {
      fast: number
      normal: number
      slow: number
      slower: number
    }
    easing: {
      ease: string
      easeIn: string
      easeOut: string
      easeInOut: string
      bounce: string
      elastic: string
    }
  }
  breakpoints: {
    sm: number
    md: number
    lg: number
    xl: number
    '2xl': number
  }
}

export interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
  isLoading: boolean
}



// Theme Context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// Theme Provider Props
interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemeMode
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

// Theme Provider Component
export function ThemeProvider({
  children,
  defaultTheme = 'auto',
  storageKey = 'theme',
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>(() => ({
    mode: defaultTheme,
    resolvedTheme: 'light',
    colors: colorUtils.createThemeColors('light'),
    animations: {
      reducedMotion: false,
      duration: {
        fast: 150,
        normal: 300,
        slow: 500,
        slower: 700,
      },
      easing: {
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  }))
  const [isLoading, setIsLoading] = useState(true)

  // Get system theme preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Get reduced motion preference
  const getReducedMotionPreference = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  // Resolve theme mode to actual theme
  const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
    if (mode === 'auto') {
      return enableSystem ? getSystemTheme() : 'light'
    }
    return mode
  }

  // Update theme configuration
  const updateThemeConfig = (mode: ThemeMode): ThemeConfig => {
    const resolvedTheme = resolveTheme(mode)
    const reducedMotion = getReducedMotionPreference()

    return {
      mode,
      resolvedTheme,
      colors: colorUtils.createThemeColors(resolvedTheme),
      animations: {
        reducedMotion,
        duration: {
          fast: 150,
          normal: 300,
          slow: 500,
          slower: 700,
        },
        easing: {
          ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
          easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
          easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
      },
      breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
      },
    }
  }

  // Apply theme to DOM
  const applyTheme = (resolvedTheme: ResolvedTheme, disableTransition = false) => {
    const root = document.documentElement

    // Disable transitions temporarily if requested
    if (disableTransition) {
      const css = document.createElement('style')
      css.appendChild(
        document.createTextNode(
          `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
        )
      )
      document.head.appendChild(css)

      // Re-enable transitions after a frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.head.removeChild(css)
        })
      })
    }

    // Apply theme class
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Set color scheme for native elements
    root.style.colorScheme = resolvedTheme
  }

  // Set theme function
  const setTheme = (mode: ThemeMode) => {
    const newTheme = updateThemeConfig(mode)
    setThemeState(newTheme)
    
    // Save to localStorage
    try {
      localStorage.setItem(storageKey, mode)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }

    // Apply to DOM
    applyTheme(newTheme.resolvedTheme, disableTransitionOnChange)
  }

  // Toggle theme function
  const toggleTheme = () => {
    const currentMode = theme.mode
    let newMode: ThemeMode

    if (currentMode === 'auto') {
      // If auto, switch to opposite of current resolved theme
      newMode = theme.resolvedTheme === 'light' ? 'dark' : 'light'
    } else {
      // If manual, toggle between light and dark
      newMode = currentMode === 'light' ? 'dark' : 'light'
    }

    setTheme(newMode)
  }

  // Initialize theme on mount
  useEffect(() => {
    let initialMode: ThemeMode = defaultTheme

    // Try to get saved theme from localStorage
    try {
      const savedTheme = localStorage.getItem(storageKey) as ThemeMode | null
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        initialMode = savedTheme
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error)
    }

    // Set initial theme
    const initialTheme = updateThemeConfig(initialMode)
    setThemeState(initialTheme)
    applyTheme(initialTheme.resolvedTheme, true)
    setIsLoading(false)
  }, [defaultTheme, storageKey, enableSystem, disableTransitionOnChange])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme.mode === 'auto') {
        const newTheme = updateThemeConfig('auto')
        setThemeState(newTheme)
        applyTheme(newTheme.resolvedTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme.mode, enableSystem])

  // Listen for reduced motion changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = () => {
      setThemeState(prev => ({
        ...prev,
        animations: {
          ...prev.animations,
          reducedMotion: mediaQuery.matches,
        },
      }))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const contextValue: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
    isLoading,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Theme Hook
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Theme Toggle Component
interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'button' | 'switch'
  showLabel?: boolean
}

export function ThemeToggle({ 
  className = '', 
  size = 'md', 
  variant = 'icon',
  showLabel = false 
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-lg border border-gray-200 dark:border-gray-700
    bg-white dark:bg-gray-800
    text-gray-700 dark:text-gray-300
    hover:bg-gray-50 dark:hover:bg-gray-700
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    transition-all duration-200
    ${sizeClasses[size]}
    ${className}
  `

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          ${theme.resolvedTheme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'}
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${className}
        `}
        role="switch"
        aria-checked={theme.resolvedTheme === 'dark'}
        aria-label="Toggle theme"
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white
            transition-transform duration-200 ease-in-out
            ${theme.resolvedTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
        {showLabel && (
          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {theme.resolvedTheme === 'dark' ? 'Dark' : 'Light'} mode
          </span>
        )}
      </button>
    )
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          ${baseClasses}
          px-3 py-2 text-sm font-medium
          ${showLabel ? 'space-x-2' : ''}
        `}
        aria-label="Toggle theme"
      >
        {theme.resolvedTheme === 'dark' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
        {showLabel && (
          <span>{theme.resolvedTheme === 'dark' ? 'Light' : 'Dark'}</span>
        )}
      </button>
    )
  }

  // Default icon variant
  return (
    <button
      onClick={toggleTheme}
      className={baseClasses}
      aria-label="Toggle theme"
      title={`Switch to ${theme.resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme.resolvedTheme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  )
}

// Theme-aware utility hooks
export function useThemeColors() {
  const { theme } = useTheme()
  return theme.colors
}

export function useReducedMotion() {
  const { theme } = useTheme()
  return theme.animations.reducedMotion
}

export function useThemeBreakpoints() {
  const { theme } = useTheme()
  return theme.breakpoints
}

// Theme utilities
export const themeUtils = {
  /**
   * Get CSS custom properties for current theme
   */
  getCSSCustomProperties: (theme: ResolvedTheme): Record<string, string> => {
    const colors = colorUtils.createThemeColors(theme)
    const properties: Record<string, string> = {}

    // Background colors
    properties['--bg-primary'] = colors.background.primary
    properties['--bg-secondary'] = colors.background.secondary
    properties['--bg-tertiary'] = colors.background.tertiary

    // Text colors
    properties['--text-primary'] = colors.text.primary
    properties['--text-secondary'] = colors.text.secondary
    properties['--text-tertiary'] = colors.text.tertiary

    // Border colors
    properties['--border-primary'] = colors.border.primary
    properties['--border-secondary'] = colors.border.secondary

    // Brand colors
    properties['--color-primary'] = colors.primary
    properties['--color-secondary'] = colors.secondary
    properties['--color-accent'] = colors.accent

    // Semantic colors
    properties['--color-success'] = colors.success
    properties['--color-warning'] = colors.warning
    properties['--color-error'] = colors.error
    properties['--color-info'] = colors.info

    return properties
  },

  /**
   * Apply theme CSS custom properties to document
   */
  applyCSSCustomProperties: (theme: ResolvedTheme) => {
    const properties = themeUtils.getCSSCustomProperties(theme)
    const root = document.documentElement

    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  },

  /**
   * Get theme-aware class names
   */
  getThemeClasses: (theme: ResolvedTheme): Record<string, string> => {
    return {
      background: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
      text: theme === 'dark' ? 'text-white' : 'text-gray-900',
      border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
      card: theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      input: theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    }
  },
}