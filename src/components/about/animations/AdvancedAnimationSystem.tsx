/**
 * Advanced Animation System
 * 기존 framer-motion과 새로운 3D 애니메이션을 통합하는 고급 애니메이션 시스템
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

// Animation Context
interface AnimationContextType {
  scrollY: any
  scrollProgress: any
  isReducedMotion: boolean
  animationQuality: 'high' | 'medium' | 'low'
  registerScrollElement: (id: string, element: HTMLElement) => void
  unregisterScrollElement: (id: string) => void
}

const AnimationContext = createContext<AnimationContextType | null>(null)

export const useAnimationContext = () => {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimationContext must be used within AnimationProvider')
  }
  return context
}

// Animation Provider
interface AnimationProviderProps {
  children: React.ReactNode
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [animationQuality, setAnimationQuality] = useState<'high' | 'medium' | 'low'>('high')
  const scrollElementsRef = useRef<Map<string, HTMLElement>>(new Map())
  
  const { scrollY } = useScroll()
  const scrollProgress = useTransform(scrollY, [0, 1000], [0, 1])

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    
    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount
        frameCount = 0
        lastTime = currentTime
        
        // Adjust animation quality based on FPS
        if (fps < 30) {
          setAnimationQuality('low')
        } else if (fps < 50) {
          setAnimationQuality('medium')
        } else {
          setAnimationQuality('high')
        }
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    const rafId = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const registerScrollElement = (id: string, element: HTMLElement) => {
    scrollElementsRef.current.set(id, element)
  }

  const unregisterScrollElement = (id: string) => {
    scrollElementsRef.current.delete(id)
  }

  const contextValue: AnimationContextType = {
    scrollY,
    scrollProgress,
    isReducedMotion,
    animationQuality,
    registerScrollElement,
    unregisterScrollElement
  }

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  )
}

// Enhanced Parallax Component
interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className = ''
}) => {
  const { scrollProgress, isReducedMotion } = useAnimationContext()
  const ref = useRef<HTMLDivElement>(null)
  
  const getTransform = () => {
    if (isReducedMotion) return {}
    
    switch (direction) {
      case 'up':
        return { y: useTransform(scrollProgress, [0, 1], [0, -1000 * speed]) }
      case 'down':
        return { y: useTransform(scrollProgress, [0, 1], [0, 1000 * speed]) }
      case 'left':
        return { x: useTransform(scrollProgress, [0, 1], [0, -1000 * speed]) }
      case 'right':
        return { x: useTransform(scrollProgress, [0, 1], [0, 1000 * speed]) }
      default:
        return {}
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={getTransform()}
    >
      {children}
    </motion.div>
  )
}

// Micro Interaction Component
interface MicroInteractionProps {
  children: React.ReactNode
  type?: 'hover' | 'tap' | 'focus' | 'scroll'
  intensity?: 'subtle' | 'medium' | 'strong'
  className?: string
}

export const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  type = 'hover',
  intensity = 'medium',
  className = ''
}) => {
  const { isReducedMotion, animationQuality } = useAnimationContext()
  
  const getAnimationProps = () => {
    if (isReducedMotion) return {}
    
    const intensityMap = {
      subtle: { scale: 1.02, rotate: 1 },
      medium: { scale: 1.05, rotate: 2 },
      strong: { scale: 1.1, rotate: 5 }
    }
    
    const qualityMap = {
      low: { duration: 0.1 },
      medium: { duration: 0.2 },
      high: { duration: 0.3, type: 'spring' as const, stiffness: 300 }
    }
    
    const animation = intensityMap[intensity]
    const timing = qualityMap[animationQuality]
    
    switch (type) {
      case 'hover':
        return {
          whileHover: animation,
          transition: timing
        }
      case 'tap':
        return {
          whileTap: { scale: 0.95 },
          transition: timing
        }
      case 'focus':
        return {
          whileFocus: animation,
          transition: timing
        }
      default:
        return {}
    }
  }

  return (
    <motion.div
      className={className}
      {...getAnimationProps()}
    >
      {children}
    </motion.div>
  )
}

// Stagger Animation Component
interface StaggerAnimationProps {
  children: React.ReactNode[]
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
  className?: string
}

export const StaggerAnimation: React.FC<StaggerAnimationProps> = ({
  children,
  staggerDelay = 0.1,
  direction = 'up',
  className = ''
}) => {
  const { isReducedMotion } = useAnimationContext()
  
  const getVariants = () => {
    if (isReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    }
    
    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }
      case 'down':
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 }
        }
      case 'left':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 }
        }
      case 'right':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        }
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }
    }
  }

  return (
    <motion.div
      className={className}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={getVariants()}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Page Transition Component
interface PageTransitionProps {
  children: React.ReactNode
  type?: 'fade' | 'slide' | 'scale' | 'rotate'
  duration?: number
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  duration = 0.5
}) => {
  const { isReducedMotion } = useAnimationContext()
  
  const getTransitionVariants = () => {
    if (isReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    }
    
    switch (type) {
      case 'slide':
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -100 }
        }
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 }
        }
      case 'rotate':
        return {
          initial: { opacity: 0, rotate: -10 },
          animate: { opacity: 1, rotate: 0 },
          exit: { opacity: 0, rotate: 10 }
        }
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        {...getTransitionVariants()}
        transition={{ duration, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Scroll-triggered Animation Hook
export const useScrollAnimation = (threshold = 0.1) => {
  const { scrollY } = useAnimationContext()
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [threshold])

  return { ref, isInView, scrollY }
}

// 3D Integration Component
interface ThreeDIntegrationProps {
  children: React.ReactNode
  enableParallax?: boolean
  parallaxIntensity?: number
}

export const ThreeDIntegration: React.FC<ThreeDIntegrationProps> = ({
  children,

}) => {
  const { isReducedMotion } = useAnimationContext()
  const mousePosition = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      }
    }
    
    if (!isReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isReducedMotion])

  return (
    <div className="relative">
      {children}
    </div>
  )
}

// Performance Monitor Component
export const PerformanceMonitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { animationQuality } = useAnimationContext()
  
  return (
    <div data-animation-quality={animationQuality}>
      {children}
    </div>
  )
}