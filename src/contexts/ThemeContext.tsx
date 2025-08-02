import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  mode: ThemeMode
  actualTheme: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultMode?: ThemeMode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = 'auto' 
}) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    // Get saved theme from localStorage
    const saved = localStorage.getItem('theme-mode')
    return (saved as ThemeMode) || defaultMode
  })

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  // Detect system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Update actual theme based on mode
  useEffect(() => {
    const updateActualTheme = () => {
      if (mode === 'auto') {
        setActualTheme(getSystemTheme())
      } else {
        setActualTheme(mode)
      }
    }

    updateActualTheme()

    // Listen for system theme changes when in auto mode
    if (mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => updateActualTheme()
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [mode])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Add current theme class
    root.classList.add(actualTheme)
    
    // Update CSS custom properties for smooth transitions
    root.style.setProperty('--theme-transition', 'all 0.3s ease-in-out')
  }, [actualTheme])

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    localStorage.setItem('theme-mode', newMode)
  }

  const toggleTheme = () => {
    if (mode === 'auto') {
      // If auto, switch to opposite of current system theme
      const systemTheme = getSystemTheme()
      setMode(systemTheme === 'light' ? 'dark' : 'light')
    } else {
      // Toggle between light and dark
      setMode(mode === 'light' ? 'dark' : 'light')
    }
  }

  const value: ThemeContextType = {
    mode,
    actualTheme,
    setMode,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}