/**
 * Design System Utility Functions
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with Tailwind CSS merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Color utility functions
 */
export const colorUtils = {
  /**
   * Get CSS custom property for color
   */
  getCSSVar: (colorName: string, shade?: number) => {
    if (shade) {
      return `rgb(var(--color-${colorName}-${shade}))`
    }
    return `rgb(var(--color-${colorName}))`
  },

  /**
   * Get Tailwind class for color
   */
  getTailwindClass: (colorName: string, shade: number, type: 'bg' | 'text' | 'border' = 'bg') => {
    return `${type}-${colorName}-${shade}`
  },

  /**
   * Generate color palette object
   */
  generatePalette: (baseColor: string) => {
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    return shades.reduce((acc, shade) => {
      acc[shade] = `rgb(var(--color-${baseColor}-${shade}))`
      return acc
    }, {} as Record<number, string>)
  },
}

/**
 * Animation utility functions
 */
export const animationUtils = {
  /**
   * Get CSS custom property for animation duration
   */
  getDuration: (speed: 'fast' | 'normal' | 'slow' | 'slower') => {
    return `var(--duration-${speed})`
  },

  /**
   * Get CSS custom property for easing
   */
  getEasing: (type: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic') => {
    return `var(--easing-${type})`
  },

  /**
   * Create stagger delay for animations
   */
  createStaggerDelay: (index: number, baseDelay: number = 100) => {
    return `${index * baseDelay}ms`
  },

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
}

/**
 * Responsive utility functions
 */
export const responsiveUtils = {
  /**
   * Get breakpoint value
   */
  getBreakpoint: (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    }
    return breakpoints[size]
  },

  /**
   * Check if screen is above breakpoint
   */
  isAboveBreakpoint: (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    return window.innerWidth >= responsiveUtils.getBreakpoint(size)
  },

  /**
   * Get responsive class
   */
  getResponsiveClass: (baseClass: string, breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    return breakpoint ? `${breakpoint}:${baseClass}` : baseClass
  },
}

/**
 * Theme utility functions
 */
export const themeUtils = {
  /**
   * Toggle theme
   */
  toggleTheme: () => {
    const html = document.documentElement
    const isDark = html.classList.contains('dark')
    
    if (isDark) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  },

  /**
   * Set theme
   */
  setTheme: (theme: 'light' | 'dark' | 'auto') => {
    const html = document.documentElement
    
    if (theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      html.classList.toggle('dark', systemTheme === 'dark')
      localStorage.setItem('theme', 'auto')
    } else {
      html.classList.toggle('dark', theme === 'dark')
      localStorage.setItem('theme', theme)
    }
  },

  /**
   * Get current theme
   */
  getCurrentTheme: (): 'light' | 'dark' => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  },

  /**
   * Initialize theme from localStorage or system preference
   */
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null
    
    if (savedTheme === 'auto' || !savedTheme) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      themeUtils.setTheme(systemTheme)
    } else {
      themeUtils.setTheme(savedTheme)
    }
  },
}

/**
 * Accessibility utility functions
 */
export const a11yUtils = {
  /**
   * Generate unique ID for accessibility
   */
  generateId: (prefix: string = 'id') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  },

  /**
   * Create ARIA attributes object
   */
  createAriaAttributes: (options: {
    label?: string
    labelledBy?: string
    describedBy?: string
    expanded?: boolean
    selected?: boolean
    disabled?: boolean
    required?: boolean
  }) => {
    const attrs: Record<string, string | boolean> = {}
    
    if (options.label) attrs['aria-label'] = options.label
    if (options.labelledBy) attrs['aria-labelledby'] = options.labelledBy
    if (options.describedBy) attrs['aria-describedby'] = options.describedBy
    if (options.expanded !== undefined) attrs['aria-expanded'] = options.expanded
    if (options.selected !== undefined) attrs['aria-selected'] = options.selected
    if (options.disabled !== undefined) attrs['aria-disabled'] = options.disabled
    if (options.required !== undefined) attrs['aria-required'] = options.required
    
    return attrs
  },

  /**
   * Focus management
   */
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }
    
    element.addEventListener('keydown', handleTabKey)
    firstElement?.focus()
    
    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  },
}

/**
 * Performance utility functions
 */
export const performanceUtils = {
  /**
   * Debounce function
   */
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: number
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait) as unknown as number
    }
  },

  /**
   * Throttle function
   */
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  /**
   * Request animation frame with fallback
   */
  raf: (callback: () => void) => {
    if (typeof requestAnimationFrame !== 'undefined') {
      return requestAnimationFrame(callback)
    } else {
      return setTimeout(callback, 16) // ~60fps fallback
    }
  },

  /**
   * Cancel animation frame with fallback
   */
  cancelRaf: (id: number) => {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(id)
    } else {
      clearTimeout(id)
    }
  },
}

/**
 * Export all utilities
 */
export const designUtils = {
  cn,
  color: colorUtils,
  animation: animationUtils,
  responsive: responsiveUtils,
  theme: themeUtils,
  a11y: a11yUtils,
  performance: performanceUtils,
}