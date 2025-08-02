/**
 * Design System - Main Export File
 */

// Tokens
export * from './tokens'

// Colors
export { 
  colorPalettes, 
  colors, 
  semanticColors, 
  ColorSystem, 
  colorUtils 
} from './colors'
export type { 
  ColorName, 
  ColorShade, 
  SemanticColorName 
} from './colors'

// Typography
export * from './typography'

// Theme System
export * from './theme'

// Animation System
export * from './animations'

// Utilities
export * from './utils'

// Re-export commonly used utilities
export { cn, designUtils } from './utils'
export { designTokens, typography, spacing, animations } from './tokens'
export { 
  ThemeProvider, 
  ThemeToggle, 
  useTheme, 
  useThemeColors, 
  useReducedMotion, 
  useThemeBreakpoints,
  themeUtils 
} from './theme'
export {
  animationVariants,
  cssAnimations,
  useInView,
  useStaggerAnimation,
  useAnimationPerformance,
  animationUtils,
  ScrollAnimation,
  StaggerContainer
} from './animations'