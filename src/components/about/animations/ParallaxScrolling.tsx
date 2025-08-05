/**
 * Parallax Scrolling Effects
 * framer-motion을 활용한 고급 패럴랙스 스크롤링 효과
 */

import React, { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useAnimationContext } from './AdvancedAnimationSystem'

// Multi-layer Parallax Container
interface MultiLayerParallaxProps {
  children: React.ReactNode
  layers?: Array<{
    speed: number
    zIndex?: number
    opacity?: number
  }>
  className?: string
}

export const MultiLayerParallax: React.FC<MultiLayerParallaxProps> = ({
  children,
  layers = [
    { speed: 0.2, zIndex: 1, opacity: 0.3 },
    { speed: 0.5, zIndex: 2, opacity: 0.6 },
    { speed: 0.8, zIndex: 3, opacity: 1 }
  ],
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })
  const { isReducedMotion } = useAnimationContext()

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {layers.map((layer, index) => {
        const y = isReducedMotion 
          ? 0 
          : useTransform(scrollYProgress, [0, 1], [0, -200 * layer.speed])
        
        return (
          <motion.div
            key={index}
            style={{
              y,
              zIndex: layer.zIndex,
              opacity: layer.opacity
            }}
            className="absolute inset-0"
          >
            {children}
          </motion.div>
        )
      })}
    </div>
  )
}

// Horizontal Parallax Scroller
interface HorizontalParallaxProps {
  children: React.ReactNode[]
  speed?: number
  direction?: 'left' | 'right'
  className?: string
}

export const HorizontalParallax: React.FC<HorizontalParallaxProps> = ({
  children,
  speed = 1,
  direction = 'left',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })
  const { isReducedMotion } = useAnimationContext()

  const x = isReducedMotion 
    ? 0 
    : useTransform(
        scrollYProgress, 
        [0, 1], 
        direction === 'left' ? [0, -300 * speed] : [0, 300 * speed]
      )

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div
        style={{ x }}
        className="flex space-x-8 w-max"
      >
        {children.map((child, index) => (
          <div key={index} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// Depth Parallax Effect
interface DepthParallaxProps {
  children: React.ReactNode
  depth?: number
  className?: string
}

export const DepthParallax: React.FC<DepthParallaxProps> = ({
  children,
  depth = 1,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const { isReducedMotion } = useAnimationContext()

  const y = isReducedMotion 
    ? 0 
    : useTransform(scrollYProgress, [0, 1], [0, -100 * depth])
  const scale = isReducedMotion 
    ? 1 
    : useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Sticky Parallax Section
interface StickyParallaxProps {
  children: React.ReactNode
  stickyHeight?: string
  className?: string
}

export const StickyParallax: React.FC<StickyParallaxProps> = ({
  children,
  stickyHeight = '200vh',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })
  const { isReducedMotion } = useAnimationContext()

  const y = isReducedMotion 
    ? 0 
    : useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ height: stickyHeight }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ y }}
          className="h-[150%] flex items-center justify-center"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

// Mouse Parallax Effect
interface MouseParallaxProps {
  children: React.ReactNode
  intensity?: number
  className?: string
}

export const MouseParallax: React.FC<MouseParallaxProps> = ({
  children,
  intensity = 0.1,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const { isReducedMotion } = useAnimationContext()

  const x = useSpring(0, { stiffness: 300, damping: 30 })
  const y = useSpring(0, { stiffness: 300, damping: 30 })

  useEffect(() => {
    if (isReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * intensity
      const deltaY = (e.clientY - centerY) * intensity

      x.set(deltaX)
      y.set(deltaY)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    const element = ref.current
    if (element) {
      element.addEventListener('mousemove', handleMouseMove)
      element.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        element.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [x, y, intensity, isReducedMotion])

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ x, y }}>
        {children}
      </motion.div>
    </div>
  )
}

// Scroll-based Text Reveal
interface ScrollTextRevealProps {
  text: string
  className?: string
  staggerDelay?: number
}

export const ScrollTextReveal: React.FC<ScrollTextRevealProps> = ({
  text,
  className = '',
  staggerDelay: _staggerDelay = 0.05
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2']
  })
  const { isReducedMotion } = useAnimationContext()

  const words = text.split(' ')

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => {
        const start = index / words.length
        const end = (index + 1) / words.length
        
        const opacity = isReducedMotion 
          ? 1 
          : useTransform(scrollYProgress, [start, end], [0.3, 1])
        const y = isReducedMotion 
          ? 0 
          : useTransform(scrollYProgress, [start, end], [20, 0])

        return (
          <motion.span
            key={index}
            style={{ opacity, y }}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        )
      })}
    </div>
  )
}

// Parallax Image Gallery
interface ParallaxImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    speed?: number
  }>
  className?: string
}

export const ParallaxImageGallery: React.FC<ParallaxImageGalleryProps> = ({
  images,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })
  const { isReducedMotion } = useAnimationContext()

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {images.map((image, index) => {
        const speed = image.speed || (index + 1) * 0.2
        const y = isReducedMotion 
          ? 0 
          : useTransform(scrollYProgress, [0, 1], [0, -100 * speed])
        
        return (
          <motion.div
            key={index}
            style={{ y }}
            className={`absolute inset-0 ${index === 0 ? 'z-10' : `z-${index}`}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )
      })}
    </div>
  )
}

// Scroll Progress Indicator
interface ScrollProgressProps {
  className?: string
  color?: string
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className = '',
  color = '#3B82F6'
}) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 z-50 origin-left ${className}`}
      style={{
        scaleX,
        backgroundColor: color
      }}
    />
  )
}

// Infinite Scroll Parallax
interface InfiniteScrollParallaxProps {
  children: React.ReactNode
  speed?: number
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export const InfiniteScrollParallax: React.FC<InfiniteScrollParallaxProps> = ({
  children,
  speed = 1,
  direction = 'horizontal',
  className = ''
}) => {
  const { scrollY } = useScroll()
  const { isReducedMotion } = useAnimationContext()

  const transform = isReducedMotion 
    ? {} 
    : direction === 'horizontal'
      ? { x: useTransform(scrollY, [0, 1000], [0, -1000 * speed]) }
      : { y: useTransform(scrollY, [0, 1000], [0, -1000 * speed]) }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        style={transform}
        className={direction === 'horizontal' ? 'flex whitespace-nowrap' : ''}
      >
        {children}
        {children} {/* Duplicate for infinite effect */}
      </motion.div>
    </div>
  )
}