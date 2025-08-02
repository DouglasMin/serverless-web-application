/**
 * Color Palette System
 * 50-900 스케일의 완전한 색상 팔레트와 유틸리티 함수들
 */

// Base Color Palettes
export const colorPalettes = {
  // Primary - Blue (Brand Color)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Base
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary - Indigo
  secondary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Base
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  
  // Accent - Purple
  accent: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Base
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Neutral - Gray
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280', // Base
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const

// Semantic Colors
export const semanticColors = {
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Base
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Base
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Base
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Base
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
} as const

// Combined Colors
export const colors = {
  ...colorPalettes,
  ...semanticColors,
} as const

// Color Types
export type ColorName = keyof typeof colors
export type ColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
export type ColorPalette = typeof colors.primary
export type SemanticColorName = keyof typeof semanticColors

// Color Utility Functions
export class ColorSystem {
  /**
   * Get color value by name and shade
   */
  static getColor(colorName: ColorName, shade: ColorShade = '500'): string {
    return colors[colorName][shade]
  }

  /**
   * Get CSS custom property for color
   */
  static getCSSVar(colorName: ColorName, shade: ColorShade = '500'): string {
    return `rgb(var(--color-${colorName}-${shade}))`
  }

  /**
   * Get Tailwind class for color
   */
  static getTailwindClass(
    colorName: ColorName, 
    shade: ColorShade = '500', 
    type: 'bg' | 'text' | 'border' | 'ring' = 'bg'
  ): string {
    return `${type}-${colorName}-${shade}`
  }

  /**
   * Generate gradient from two colors
   */
  static createGradient(
    fromColor: { name: ColorName; shade: ColorShade },
    toColor: { name: ColorName; shade: ColorShade },
    direction: string = '135deg'
  ): string {
    const from = this.getColor(fromColor.name, fromColor.shade)
    const to = this.getColor(toColor.name, toColor.shade)
    return `linear-gradient(${direction}, ${from}, ${to})`
  }

  /**
   * Get contrasting text color for background
   */
  static getContrastingTextColor(_colorName: ColorName, shade: ColorShade): 'white' | 'black' {
    const lightShades: ColorShade[] = ['50', '100', '200', '300', '400']
    return lightShades.includes(shade) ? 'black' : 'white'
  }

  /**
   * Get color palette as CSS custom properties
   */
  static generateCSSCustomProperties(): Record<string, string> {
    const properties: Record<string, string> = {}
    
    Object.entries(colors).forEach(([colorName, palette]) => {
      Object.entries(palette).forEach(([shade, value]) => {
        // Convert hex to RGB values for CSS custom properties
        const rgb = this.hexToRgb(value)
        if (rgb) {
          properties[`--color-${colorName}-${shade}`] = `${rgb.r} ${rgb.g} ${rgb.b}`
        }
      })
    })
    
    return properties
  }

  /**
   * Convert hex to RGB
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  /**
   * Get accessible color combinations
   */
  static getAccessibleCombinations(): Array<{
    background: { name: ColorName; shade: ColorShade }
    text: { name: ColorName; shade: ColorShade }
    contrast: 'AA' | 'AAA'
  }> {
    // Pre-defined accessible combinations
    return [
      // Light backgrounds
      { background: { name: 'neutral', shade: '50' }, text: { name: 'neutral', shade: '900' }, contrast: 'AAA' },
      { background: { name: 'neutral', shade: '100' }, text: { name: 'neutral', shade: '800' }, contrast: 'AAA' },
      { background: { name: 'primary', shade: '50' }, text: { name: 'primary', shade: '900' }, contrast: 'AAA' },
      
      // Dark backgrounds
      { background: { name: 'neutral', shade: '900' }, text: { name: 'neutral', shade: '50' }, contrast: 'AAA' },
      { background: { name: 'neutral', shade: '800' }, text: { name: 'neutral', shade: '100' }, contrast: 'AAA' },
      { background: { name: 'primary', shade: '900' }, text: { name: 'primary', shade: '50' }, contrast: 'AAA' },
      
      // Colored backgrounds
      { background: { name: 'primary', shade: '600' }, text: { name: 'neutral', shade: '50' }, contrast: 'AA' },
      { background: { name: 'success', shade: '600' }, text: { name: 'neutral', shade: '50' }, contrast: 'AA' },
      { background: { name: 'warning', shade: '500' }, text: { name: 'neutral', shade: '900' }, contrast: 'AA' },
      { background: { name: 'error', shade: '600' }, text: { name: 'neutral', shade: '50' }, contrast: 'AA' },
    ]
  }

  /**
   * Generate theme-aware color object
   */
  static createThemeColors(theme: 'light' | 'dark') {
    const baseColors = {
      primary: this.getColor('primary', '600'),
      secondary: this.getColor('secondary', '600'),
      accent: this.getColor('accent', '600'),
      success: this.getColor('success', '600'),
      warning: this.getColor('warning', '500'),
      error: this.getColor('error', '600'),
      info: this.getColor('info', '600'),
    }

    if (theme === 'light') {
      return {
        ...baseColors,
        background: {
          primary: this.getColor('neutral', '50'),
          secondary: this.getColor('neutral', '100'),
          tertiary: this.getColor('neutral', '200'),
        },
        text: {
          primary: this.getColor('neutral', '900'),
          secondary: this.getColor('neutral', '600'),
          tertiary: this.getColor('neutral', '400'),
        },
        border: {
          primary: this.getColor('neutral', '200'),
          secondary: this.getColor('neutral', '300'),
        },
      }
    } else {
      return {
        ...baseColors,
        background: {
          primary: this.getColor('neutral', '900'),
          secondary: this.getColor('neutral', '800'),
          tertiary: this.getColor('neutral', '700'),
        },
        text: {
          primary: this.getColor('neutral', '50'),
          secondary: this.getColor('neutral', '300'),
          tertiary: this.getColor('neutral', '500'),
        },
        border: {
          primary: this.getColor('neutral', '700'),
          secondary: this.getColor('neutral', '600'),
        },
      }
    }
  }
}

// Export color utilities
export const colorUtils = {
  getColor: ColorSystem.getColor.bind(ColorSystem),
  getCSSVar: ColorSystem.getCSSVar.bind(ColorSystem),
  getTailwindClass: ColorSystem.getTailwindClass.bind(ColorSystem),
  createGradient: ColorSystem.createGradient.bind(ColorSystem),
  getContrastingTextColor: ColorSystem.getContrastingTextColor.bind(ColorSystem),
  generateCSSCustomProperties: ColorSystem.generateCSSCustomProperties.bind(ColorSystem),
  getAccessibleCombinations: ColorSystem.getAccessibleCombinations.bind(ColorSystem),
  createThemeColors: ColorSystem.createThemeColors.bind(ColorSystem),
}

// Pre-defined color combinations for common use cases
export const colorCombinations = {
  // Button variants
  buttons: {
    primary: {
      background: colorUtils.getColor('primary', '600'),
      hover: colorUtils.getColor('primary', '700'),
      text: 'white',
      ring: colorUtils.getColor('primary', '500'),
    },
    secondary: {
      background: colorUtils.getColor('secondary', '600'),
      hover: colorUtils.getColor('secondary', '700'),
      text: 'white',
      ring: colorUtils.getColor('secondary', '500'),
    },
    success: {
      background: colorUtils.getColor('success', '600'),
      hover: colorUtils.getColor('success', '700'),
      text: 'white',
      ring: colorUtils.getColor('success', '500'),
    },
    warning: {
      background: colorUtils.getColor('warning', '500'),
      hover: colorUtils.getColor('warning', '600'),
      text: colorUtils.getColor('neutral', '900'),
      ring: colorUtils.getColor('warning', '400'),
    },
    error: {
      background: colorUtils.getColor('error', '600'),
      hover: colorUtils.getColor('error', '700'),
      text: 'white',
      ring: colorUtils.getColor('error', '500'),
    },
  },
  
  // Status indicators
  status: {
    success: {
      background: colorUtils.getColor('success', '50'),
      border: colorUtils.getColor('success', '200'),
      text: colorUtils.getColor('success', '800'),
      icon: colorUtils.getColor('success', '600'),
    },
    warning: {
      background: colorUtils.getColor('warning', '50'),
      border: colorUtils.getColor('warning', '200'),
      text: colorUtils.getColor('warning', '800'),
      icon: colorUtils.getColor('warning', '600'),
    },
    error: {
      background: colorUtils.getColor('error', '50'),
      border: colorUtils.getColor('error', '200'),
      text: colorUtils.getColor('error', '800'),
      icon: colorUtils.getColor('error', '600'),
    },
    info: {
      background: colorUtils.getColor('info', '50'),
      border: colorUtils.getColor('info', '200'),
      text: colorUtils.getColor('info', '800'),
      icon: colorUtils.getColor('info', '600'),
    },
  },
  
  // Gradients
  gradients: {
    primary: colorUtils.createGradient(
      { name: 'primary', shade: '500' },
      { name: 'primary', shade: '700' }
    ),
    secondary: colorUtils.createGradient(
      { name: 'secondary', shade: '500' },
      { name: 'secondary', shade: '700' }
    ),
    accent: colorUtils.createGradient(
      { name: 'accent', shade: '500' },
      { name: 'accent', shade: '700' }
    ),
    rainbow: colorUtils.createGradient(
      { name: 'primary', shade: '500' },
      { name: 'accent', shade: '500' }
    ),
    sunset: colorUtils.createGradient(
      { name: 'warning', shade: '400' },
      { name: 'error', shade: '500' }
    ),
  },
}