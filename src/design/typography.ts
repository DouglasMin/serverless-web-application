/**
 * Typography System
 * 완전한 타이포그래피 스케일과 반응형 유틸리티
 */

// Font Families
export const fontFamilies = {
  sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
} as const

// Font Weights
export const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const

// Font Sizes with Line Heights
export const fontSizes = {
  xs: {
    fontSize: '0.75rem',    // 12px
    lineHeight: '1rem',     // 16px
  },
  sm: {
    fontSize: '0.875rem',   // 14px
    lineHeight: '1.25rem',  // 20px
  },
  base: {
    fontSize: '1rem',       // 16px
    lineHeight: '1.5rem',   // 24px
  },
  lg: {
    fontSize: '1.125rem',   // 18px
    lineHeight: '1.75rem',  // 28px
  },
  xl: {
    fontSize: '1.25rem',    // 20px
    lineHeight: '1.75rem',  // 28px
  },
  '2xl': {
    fontSize: '1.5rem',     // 24px
    lineHeight: '2rem',     // 32px
  },
  '3xl': {
    fontSize: '1.875rem',   // 30px
    lineHeight: '2.25rem',  // 36px
  },
  '4xl': {
    fontSize: '2.25rem',    // 36px
    lineHeight: '2.5rem',   // 40px
  },
  '5xl': {
    fontSize: '3rem',       // 48px
    lineHeight: '1',        // 48px
  },
  '6xl': {
    fontSize: '3.75rem',    // 60px
    lineHeight: '1',        // 60px
  },
  '7xl': {
    fontSize: '4.5rem',     // 72px
    lineHeight: '1',        // 72px
  },
  '8xl': {
    fontSize: '6rem',       // 96px
    lineHeight: '1',        // 96px
  },
  '9xl': {
    fontSize: '8rem',       // 128px
    lineHeight: '1',        // 128px
  },
} as const

// Letter Spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

// Typography Scales for Different Contexts
export const typographyScales = {
  // Headings
  headings: {
    h1: {
      fontSize: fontSizes['5xl'].fontSize,
      lineHeight: fontSizes['5xl'].lineHeight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
      responsive: {
        sm: fontSizes['4xl'],
        md: fontSizes['5xl'],
        lg: fontSizes['6xl'],
      },
    },
    h2: {
      fontSize: fontSizes['4xl'].fontSize,
      lineHeight: fontSizes['4xl'].lineHeight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
      responsive: {
        sm: fontSizes['3xl'],
        md: fontSizes['4xl'],
        lg: fontSizes['5xl'],
      },
    },
    h3: {
      fontSize: fontSizes['3xl'].fontSize,
      lineHeight: fontSizes['3xl'].lineHeight,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacing.tight,
      responsive: {
        sm: fontSizes['2xl'],
        md: fontSizes['3xl'],
        lg: fontSizes['4xl'],
      },
    },
    h4: {
      fontSize: fontSizes['2xl'].fontSize,
      lineHeight: fontSizes['2xl'].lineHeight,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacing.normal,
      responsive: {
        sm: fontSizes['xl'],
        md: fontSizes['2xl'],
        lg: fontSizes['3xl'],
      },
    },
    h5: {
      fontSize: fontSizes.xl.fontSize,
      lineHeight: fontSizes.xl.lineHeight,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacing.normal,
      responsive: {
        sm: fontSizes.lg,
        md: fontSizes.xl,
        lg: fontSizes['2xl'],
      },
    },
    h6: {
      fontSize: fontSizes.lg.fontSize,
      lineHeight: fontSizes.lg.lineHeight,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacing.normal,
      responsive: {
        sm: fontSizes.base,
        md: fontSizes.lg,
        lg: fontSizes.xl,
      },
    },
  },
  
  // Body Text
  body: {
    large: {
      fontSize: fontSizes.lg.fontSize,
      lineHeight: fontSizes.lg.lineHeight,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    },
    base: {
      fontSize: fontSizes.base.fontSize,
      lineHeight: fontSizes.base.lineHeight,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    },
    small: {
      fontSize: fontSizes.sm.fontSize,
      lineHeight: fontSizes.sm.lineHeight,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    },
    xs: {
      fontSize: fontSizes.xs.fontSize,
      lineHeight: fontSizes.xs.lineHeight,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.wide,
    },
  },
  
  // UI Elements
  ui: {
    button: {
      fontSize: fontSizes.sm.fontSize,
      lineHeight: fontSizes.sm.lineHeight,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.wide,
    },
    label: {
      fontSize: fontSizes.sm.fontSize,
      lineHeight: fontSizes.sm.lineHeight,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.normal,
    },
    caption: {
      fontSize: fontSizes.xs.fontSize,
      lineHeight: fontSizes.xs.lineHeight,
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.wide,
    },
    overline: {
      fontSize: fontSizes.xs.fontSize,
      lineHeight: fontSizes.xs.lineHeight,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacing.widest,
      textTransform: 'uppercase' as const,
    },
  },
  
  // Display Text (Hero sections, etc.)
  display: {
    large: {
      fontSize: fontSizes['8xl'].fontSize,
      lineHeight: fontSizes['8xl'].lineHeight,
      fontWeight: fontWeights.black,
      letterSpacing: letterSpacing.tighter,
      responsive: {
        sm: fontSizes['5xl'],
        md: fontSizes['7xl'],
        lg: fontSizes['8xl'],
        xl: fontSizes['9xl'],
      },
    },
    medium: {
      fontSize: fontSizes['6xl'].fontSize,
      lineHeight: fontSizes['6xl'].lineHeight,
      fontWeight: fontWeights.extrabold,
      letterSpacing: letterSpacing.tighter,
      responsive: {
        sm: fontSizes['4xl'],
        md: fontSizes['5xl'],
        lg: fontSizes['6xl'],
        xl: fontSizes['7xl'],
      },
    },
    small: {
      fontSize: fontSizes['4xl'].fontSize,
      lineHeight: fontSizes['4xl'].lineHeight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
      responsive: {
        sm: fontSizes['3xl'],
        md: fontSizes['4xl'],
        lg: fontSizes['5xl'],
      },
    },
  },
} as const

// Typography Utility Class
export class TypographySystem {
  /**
   * Get font family CSS value
   */
  static getFontFamily(family: keyof typeof fontFamilies): string {
    return fontFamilies[family].join(', ')
  }

  /**
   * Get typography styles for a specific scale
   */
  static getTypographyStyles(
    category: keyof typeof typographyScales,
    variant: string
  ): Record<string, string | number> {
    const scale = typographyScales[category] as any
    const styles = scale[variant]
    
    if (!styles) {
      throw new Error(`Typography variant "${variant}" not found in category "${category}"`)
    }

    return {
      fontSize: styles.fontSize,
      lineHeight: styles.lineHeight,
      fontWeight: styles.fontWeight,
      letterSpacing: styles.letterSpacing,
      ...(styles.textTransform && { textTransform: styles.textTransform }),
    }
  }

  /**
   * Get responsive typography styles
   */
  static getResponsiveStyles(
    category: keyof typeof typographyScales,
    variant: string
  ): Record<string, Record<string, string | number>> {
    const scale = typographyScales[category] as any
    const styles = scale[variant]
    
    if (!styles || !styles.responsive) {
      return {}
    }

    const responsiveStyles: Record<string, Record<string, string | number>> = {}
    
    Object.entries(styles.responsive).forEach(([breakpoint, size]) => {
      const sizeObj = size as { fontSize: string; lineHeight: string }
      responsiveStyles[breakpoint] = {
        fontSize: sizeObj.fontSize,
        lineHeight: sizeObj.lineHeight,
      }
    })

    return responsiveStyles
  }

  /**
   * Generate CSS classes for typography
   */
  static generateCSSClasses(): Record<string, Record<string, string | number>> {
    const classes: Record<string, Record<string, string | number>> = {}

    // Generate heading classes
    Object.entries(typographyScales.headings).forEach(([variant, styles]) => {
      classes[`heading-${variant}`] = {
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight,
        fontWeight: styles.fontWeight,
        letterSpacing: styles.letterSpacing,
      }
    })

    // Generate body classes
    Object.entries(typographyScales.body).forEach(([variant, styles]) => {
      classes[`body-${variant}`] = {
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight,
        fontWeight: styles.fontWeight,
        letterSpacing: styles.letterSpacing,
      }
    })

    // Generate UI classes
    Object.entries(typographyScales.ui).forEach(([variant, styles]) => {
      classes[`ui-${variant}`] = {
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight,
        fontWeight: styles.fontWeight,
        letterSpacing: styles.letterSpacing,
        ...((styles as any).textTransform && { textTransform: (styles as any).textTransform }),
      }
    })

    // Generate display classes
    Object.entries(typographyScales.display).forEach(([variant, styles]) => {
      classes[`display-${variant}`] = {
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight,
        fontWeight: styles.fontWeight,
        letterSpacing: styles.letterSpacing,
      }
    })

    return classes
  }

  /**
   * Get Tailwind CSS classes for typography
   */
  static getTailwindClasses(
    category: keyof typeof typographyScales,
    variant: string
  ): string {
    const scale = typographyScales[category] as any
    const styles = scale[variant]
    
    if (!styles) {
      return ''
    }

    const classes: string[] = []

    // Font size mapping
    const fontSizeMap: Record<string, string> = {
      '0.75rem': 'text-xs',
      '0.875rem': 'text-sm',
      '1rem': 'text-base',
      '1.125rem': 'text-lg',
      '1.25rem': 'text-xl',
      '1.5rem': 'text-2xl',
      '1.875rem': 'text-3xl',
      '2.25rem': 'text-4xl',
      '3rem': 'text-5xl',
      '3.75rem': 'text-6xl',
      '4.5rem': 'text-7xl',
      '6rem': 'text-8xl',
      '8rem': 'text-9xl',
    }

    // Font weight mapping
    const fontWeightMap: Record<number, string> = {
      100: 'font-thin',
      200: 'font-extralight',
      300: 'font-light',
      400: 'font-normal',
      500: 'font-medium',
      600: 'font-semibold',
      700: 'font-bold',
      800: 'font-extrabold',
      900: 'font-black',
    }

    // Letter spacing mapping
    const letterSpacingMap: Record<string, string> = {
      '-0.05em': 'tracking-tighter',
      '-0.025em': 'tracking-tight',
      '0em': 'tracking-normal',
      '0.025em': 'tracking-wide',
      '0.05em': 'tracking-wider',
      '0.1em': 'tracking-widest',
    }

    // Add classes
    if (fontSizeMap[styles.fontSize]) {
      classes.push(fontSizeMap[styles.fontSize])
    }
    
    if (fontWeightMap[styles.fontWeight]) {
      classes.push(fontWeightMap[styles.fontWeight])
    }
    
    if (letterSpacingMap[styles.letterSpacing]) {
      classes.push(letterSpacingMap[styles.letterSpacing])
    }

    if (styles.textTransform === 'uppercase') {
      classes.push('uppercase')
    }

    return classes.join(' ')
  }

  /**
   * Calculate optimal line height for given font size
   */
  static calculateLineHeight(fontSize: number, ratio: number = 1.5): number {
    return Math.round(fontSize * ratio)
  }

  /**
   * Get reading-optimized typography settings
   */
  static getReadingOptimized(): Record<string, string | number> {
    return {
      fontSize: fontSizes.lg.fontSize,
      lineHeight: '1.7',
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      maxWidth: '65ch', // Optimal reading width
    }
  }

  /**
   * Get accessibility-compliant typography settings
   */
  static getAccessibilityCompliant(): Record<string, string | number> {
    return {
      fontSize: fontSizes.base.fontSize, // Minimum 16px
      lineHeight: '1.5', // Minimum 1.5
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    }
  }
}

// Export typography utilities
export const typographyUtils = {
  getFontFamily: TypographySystem.getFontFamily.bind(TypographySystem),
  getTypographyStyles: TypographySystem.getTypographyStyles.bind(TypographySystem),
  getResponsiveStyles: TypographySystem.getResponsiveStyles.bind(TypographySystem),
  generateCSSClasses: TypographySystem.generateCSSClasses.bind(TypographySystem),
  getTailwindClasses: TypographySystem.getTailwindClasses.bind(TypographySystem),
  calculateLineHeight: TypographySystem.calculateLineHeight.bind(TypographySystem),
  getReadingOptimized: TypographySystem.getReadingOptimized.bind(TypographySystem),
  getAccessibilityCompliant: TypographySystem.getAccessibilityCompliant.bind(TypographySystem),
}

// Pre-defined typography combinations
export const typographyCombinations = {
  // Hero section
  hero: {
    title: typographyUtils.getTailwindClasses('display', 'large'),
    subtitle: typographyUtils.getTailwindClasses('body', 'large'),
    description: typographyUtils.getTailwindClasses('body', 'base'),
  },
  
  // Card components
  card: {
    title: typographyUtils.getTailwindClasses('headings', 'h4'),
    subtitle: typographyUtils.getTailwindClasses('body', 'small'),
    description: typographyUtils.getTailwindClasses('body', 'base'),
    caption: typographyUtils.getTailwindClasses('ui', 'caption'),
  },
  
  // Form elements
  form: {
    label: typographyUtils.getTailwindClasses('ui', 'label'),
    input: typographyUtils.getTailwindClasses('body', 'base'),
    helper: typographyUtils.getTailwindClasses('ui', 'caption'),
    error: typographyUtils.getTailwindClasses('ui', 'caption'),
  },
  
  // Navigation
  navigation: {
    primary: typographyUtils.getTailwindClasses('ui', 'button'),
    secondary: typographyUtils.getTailwindClasses('body', 'small'),
    breadcrumb: typographyUtils.getTailwindClasses('ui', 'caption'),
  },
  
  // Content sections
  content: {
    heading: typographyUtils.getTailwindClasses('headings', 'h2'),
    subheading: typographyUtils.getTailwindClasses('headings', 'h3'),
    body: typographyUtils.getTailwindClasses('body', 'base'),
    caption: typographyUtils.getTailwindClasses('ui', 'caption'),
    overline: typographyUtils.getTailwindClasses('ui', 'overline'),
  },
}

// Export all typography tokens
export const typography = {
  fontFamilies,
  fontWeights,
  fontSizes,
  letterSpacing,
  typographyScales,
  typographyUtils,
  typographyCombinations,
}