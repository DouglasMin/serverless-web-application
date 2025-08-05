/**
 * Animation Utilities for About Page
 */

import { Variants } from 'framer-motion'

// Enhanced animation variants
export const aboutAnimationVariants = {
  // Hero section animations
  heroTitle: {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  },

  heroSubtitle: {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: 'easeOut'
      }
    }
  },

  // Text reveal animations
  textReveal: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  },

  // Stagger animations for lists
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  },

  // Card animations
  cardHover: {
    rest: { 
      scale: 1,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    hover: { 
      scale: 1.05,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  },

  // Flow diagram animations
  flowNode: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  },

  flowLink: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: 'easeInOut'
      }
    }
  },

  // Morphing shapes
  morphingShape: {
    animate: {
      d: [
        'M20,20 Q40,10 60,20 T100,20 L100,80 Q80,90 60,80 T20,80 Z',
        'M20,30 Q50,5 80,30 T100,30 L100,70 Q70,95 40,70 T20,70 Z',
        'M20,20 Q40,10 60,20 T100,20 L100,80 Q80,90 60,80 T20,80 Z'
      ],
      transition: {
        duration: 4,
        ease: 'easeInOut',
        repeat: Infinity
      }
    }
  },

  // Parallax scroll animations
  parallaxSlow: {
    animate: {
      y: [0, -50],
      transition: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'reverse' as const
      }
    }
  },

  parallaxFast: {
    animate: {
      y: [0, -100],
      transition: {
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'reverse' as const
      }
    }
  }
} as const

// Scroll-triggered animation variants
export const scrollAnimationVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

// Create stagger animation with custom delay
export const createStaggerAnimation = (_itemCount: number, baseDelay: number = 0.1) => ({
  container: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: baseDelay,
        delayChildren: 0.1
      }
    }
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }
})

// Typewriter effect utility
export const createTypewriterEffect = (_text: string, _speed: number = 50) => {
  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.1
      }
    }
  }
}

// Particle animation configurations
export const particleConfigs = {
  light: {
    count: 50,
    speed: 0.5,
    size: { min: 1, max: 3 },
    opacity: { min: 0.3, max: 0.7 }
  },
  medium: {
    count: 100,
    speed: 0.8,
    size: { min: 1, max: 4 },
    opacity: { min: 0.2, max: 0.8 }
  },
  heavy: {
    count: 200,
    speed: 1.2,
    size: { min: 1, max: 5 },
    opacity: { min: 0.1, max: 0.9 }
  }
}

// GSAP timeline configurations
export const gsapConfigs = {
  heroTimeline: {
    duration: 2,
    ease: 'power3.out',
    stagger: 0.2
  },
  flowTimeline: {
    duration: 3,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true
  },
  morphTimeline: {
    duration: 4,
    ease: 'sine.inOut',
    repeat: -1
  }
}

// Animation cleanup utility
export const cleanupAnimations = (animations: any[]) => {
  animations.forEach(animation => {
    if (animation && typeof animation.kill === 'function') {
      animation.kill()
    }
  })
}
// Enhanced Animation System Integration
import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

// Enhanced Intersection Observer를 활용한 뷰포트 감지
export const useInViewAnimation = (threshold = 0.1, triggerOnce = true) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: triggerOnce, 
    margin: '-100px',
    amount: threshold 
  })
  
  return { ref, isInView }
}

// Performance-aware animation variants
export const createResponsiveVariants = (performanceLevel: 'high' | 'medium' | 'low' = 'high') => {
  const baseVariants = {
    high: {
      hidden: { 
        opacity: 0, 
        y: 50,
        scale: 0.95,
        filter: 'blur(10px)'
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
    medium: {
      hidden: { 
        opacity: 0, 
        y: 30,
        scale: 0.98
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: 'easeOut'
        }
      }
    },
    low: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.3 }
      }
    }
  }

  return baseVariants[performanceLevel]
}

// Enhanced 스태거 애니메이션
export const createStaggerContainer = (staggerDelay = 0.1, delayChildren = 0.2) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren
    }
  }
})

export const createStaggerItem = (direction: 'up' | 'down' | 'left' | 'right' | 'scale' = 'up') => {
  const directions = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    scale: { scale: 0.9 }
  }

  return {
    hidden: { 
      opacity: 0, 
      ...directions[direction]
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }
}

// Enhanced 호버 애니메이션
export const createHoverEffect = (type: 'scale' | 'lift' | 'glow' | 'tilt' = 'scale', intensity = 1) => {
  const effects = {
    scale: {
      scale: 1 + (0.05 * intensity),
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    lift: {
      y: -10 * intensity,
      boxShadow: `0 ${20 * intensity}px ${25 * intensity}px -5px rgba(0, 0, 0, 0.1), 0 ${10 * intensity}px ${10 * intensity}px -5px rgba(0, 0, 0, 0.04)`,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    glow: {
      boxShadow: `0 0 ${20 * intensity}px rgba(59, 130, 246, 0.5)`,
      transition: { duration: 0.3 }
    },
    tilt: {
      rotateX: 5 * intensity,
      rotateY: 5 * intensity,
      scale: 1 + (0.02 * intensity),
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  }

  return effects[type]
}

// Reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Adaptive animation variants based on user preferences
export const useAdaptiveVariants = () => {
  const prefersReducedMotion = useReducedMotion()
  
  return prefersReducedMotion 
    ? createResponsiveVariants('low')
    : createResponsiveVariants('high')
}

// Scroll-triggered animation hook
export const useScrollTrigger = (threshold = 0.1) => {
  const [isTriggered, setIsTriggered] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTriggered(true)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [threshold])

  return { ref, isTriggered }
}

// Animation sequence helper
export const createAnimationSequence = (_steps: Array<{
  delay: number
  duration: number
  animation: any
}>) => {
  return {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
}

// Enhanced legacy support
export const enhancedScrollVariants = createResponsiveVariants('high')
export const enhancedStaggerContainer = createStaggerContainer()
export const enhancedStaggerItem = createStaggerItem()
export const enhancedHoverScale = createHoverEffect('scale')
export const enhancedHoverLift = createHoverEffect('lift')