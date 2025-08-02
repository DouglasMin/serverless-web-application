/**
 * Animation System
 * 재사용 가능한 애니메이션 유틸리티와 훅들
 */

import React, { useEffect, useState, useRef } from 'react'

// Animation Variants
export const animationVariants = {
    // Fade animations
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3, ease: 'easeOut' }
    },

    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.4, ease: 'easeOut' }
    },

    fadeInDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.4, ease: 'easeOut' }
    },

    // Scale animations
    scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.3, ease: 'easeOut' }
    },

    // Slide animations
    slideInLeft: {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 30 },
        transition: { duration: 0.4, ease: 'easeOut' }
    },

    slideInRight: {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
        transition: { duration: 0.4, ease: 'easeOut' }
    },

    // Bounce animation
    bounce: {
        initial: { opacity: 0, scale: 0.3 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 260,
                damping: 20
            }
        },
        exit: { opacity: 0, scale: 0.3 }
    },

    // Stagger container
    staggerContainer: {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    },

    // Stagger item
    staggerItem: {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: 'easeOut' }
        }
    }
}

// CSS Animation Classes
export const cssAnimations = {
    // Entrance animations
    'animate-fade-in': 'animate-fade-in',
    'animate-slide-up': 'animate-slide-up',
    'animate-slide-down': 'animate-slide-down',
    'animate-slide-left': 'animate-slide-left',
    'animate-slide-right': 'animate-slide-right',
    'animate-scale-in': 'animate-scale-in',
    'animate-bounce-in': 'animate-bounce-in',

    // Hover animations
    'hover-lift': 'hover:transform hover:scale-105 hover:shadow-lg transition-all duration-300',
    'hover-glow': 'hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300',
    'hover-rotate': 'hover:rotate-3 transition-transform duration-300',

    // Loading animations
    'animate-pulse-slow': 'animate-pulse-slow',
    'animate-spin-slow': 'animate-spin-slow',

    // Micro-interactions
    'animate-wiggle': 'animate-wiggle',
    'animate-heartbeat': 'animate-heartbeat'
}

// Intersection Observer Hook for scroll animations
export function useInView(options: IntersectionObserverInit = {}) {
    const [isInView, setIsInView] = useState(false)
    const [hasBeenInView, setHasBeenInView] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                const inView = entry.isIntersecting
                setIsInView(inView)

                if (inView && !hasBeenInView) {
                    setHasBeenInView(true)
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
                ...options
            }
        )

        observer.observe(element)

        return () => {
            observer.unobserve(element)
        }
    }, [hasBeenInView, options])

    return { ref, isInView, hasBeenInView }
}

// Reduced Motion Hook
export function useReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    return prefersReducedMotion
}

// Header scroll animation hook
export function useScrollHeader(threshold: number = 10) {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY < threshold) {
                setIsVisible(true)
            } else if (currentScrollY > lastScrollY && currentScrollY > threshold) {
                // Scrolling down
                setIsVisible(false)
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                setIsVisible(true)
            }

            setLastScrollY(currentScrollY)
        }

        const throttledHandleScroll = throttle(handleScroll, 100)
        window.addEventListener('scroll', throttledHandleScroll, { passive: true })

        return () => window.removeEventListener('scroll', throttledHandleScroll)
    }, [lastScrollY, threshold])

    return { isVisible, scrollY: lastScrollY }
}

// Throttle utility for performance
function throttle(func: Function, limit: number) {
    let inThrottle: boolean
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}

// Stagger Animation Hook
export function useStaggerAnimation(itemCount: number, delay: number = 100) {
    const [visibleItems, setVisibleItems] = useState<number[]>([])
    const { ref, isInView } = useInView()

    useEffect(() => {
        if (isInView && visibleItems.length === 0) {
            for (let i = 0; i < itemCount; i++) {
                setTimeout(() => {
                    setVisibleItems(prev => [...prev, i])
                }, i * delay)
            }
        }
    }, [isInView, itemCount, delay, visibleItems.length])

    return { ref, visibleItems }
}

// Performance monitoring for animations
export function useAnimationPerformance() {
    const [fps, setFps] = useState(60)
    const frameCount = useRef(0)
    const lastTime = useRef(performance.now())

    useEffect(() => {
        let animationId: number

        const measureFPS = () => {
            frameCount.current++
            const currentTime = performance.now()

            if (currentTime - lastTime.current >= 1000) {
                setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)))
                frameCount.current = 0
                lastTime.current = currentTime
            }

            animationId = requestAnimationFrame(measureFPS)
        }

        animationId = requestAnimationFrame(measureFPS)

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId)
            }
        }
    }, [])

    return { fps }
}

// Animation utilities
export const animationUtils = {
    // Create stagger delay
    createStaggerDelay: (index: number, baseDelay: number = 100) => ({
        animationDelay: `${index * baseDelay}ms`
    }),

    // Get animation duration based on performance
    getOptimalDuration: (baseDuration: number, fps: number) => {
        if (fps < 30) return baseDuration * 1.5 // Slower animations for low FPS
        if (fps < 45) return baseDuration * 1.2
        return baseDuration
    },

    // Check if animations should be disabled
    shouldDisableAnimations: (prefersReducedMotion: boolean, fps: number) => {
        return prefersReducedMotion || fps < 20
    }
}

// Scroll-triggered animation component
interface ScrollAnimationProps {
    children: React.ReactNode
    delay?: number
    className?: string
}

export function ScrollAnimation({
    children,
    delay = 0,
    className = ''
}: ScrollAnimationProps) {
    const { ref, hasBeenInView } = useInView()
    const prefersReducedMotion = useReducedMotion()

    if (prefersReducedMotion) {
        return <div ref={ref} className={className}>{children}</div>
    }

    return (
        <div
            ref={ref}
            className={`transition-all duration-500 ${hasBeenInView
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95'
                } ${className}`}
            style={{
                transitionDelay: `${delay}ms`,
                willChange: hasBeenInView ? 'auto' : 'transform, opacity'
            }}
        >
            {children}
        </div>
    )
}

// Stagger animation container
interface StaggerContainerProps {
    children: React.ReactNode
    staggerDelay?: number
    className?: string
}

export function StaggerContainer({
    children,
    staggerDelay = 100,
    className = ''
}: StaggerContainerProps) {
    const childrenArray = React.Children.toArray(children)
    const { ref, hasBeenInView } = useInView()
    const prefersReducedMotion = useReducedMotion()

    if (prefersReducedMotion) {
        return <div ref={ref} className={className}>{children}</div>
    }

    return (
        <div ref={ref} className={className}>
            {childrenArray.map((child, index) => (
                <div
                    key={index}
                    className={`transition-all duration-500 ${hasBeenInView
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                        }`}
                    style={{
                        transitionDelay: hasBeenInView ? `${index * staggerDelay}ms` : '0ms',
                        willChange: hasBeenInView ? 'auto' : 'transform, opacity'
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    )
}