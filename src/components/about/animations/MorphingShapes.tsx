/**
 * Morphing Shapes Animation Component
 * SVG 기반 모핑 애니메이션과 배경 효과
 */

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../../design/theme'

interface MorphingShapesProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  colors?: string[]
}

export const MorphingShapes: React.FC<MorphingShapesProps> = ({
  className = '',
  intensity = 'medium',
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B']
}) => {
  const { theme } = useTheme()
  
  // Adjust colors based on theme
  const themeColors = colors.map(color => {
    if (theme.resolvedTheme === 'dark') {
      return color + '40' // Add opacity for dark mode
    }
    return color + '30' // Add opacity for light mode
  })

  const morphingPaths = {
    shape1: [
      'M20,20 Q40,10 60,20 T100,20 L100,80 Q80,90 60,80 T20,80 Z',
      'M20,30 Q50,5 80,30 T100,30 L100,70 Q70,95 40,70 T20,70 Z',
      'M25,25 Q45,15 65,25 T95,25 L95,75 Q75,85 55,75 T25,75 Z',
      'M20,20 Q40,10 60,20 T100,20 L100,80 Q80,90 60,80 T20,80 Z'
    ],
    shape2: [
      'M10,50 Q30,20 50,50 Q70,80 90,50 Q70,20 50,50 Q30,80 10,50 Z',
      'M15,45 Q35,25 55,45 Q75,65 85,45 Q65,25 45,45 Q25,65 15,45 Z',
      'M12,48 Q32,28 52,48 Q72,68 88,48 Q68,28 48,48 Q28,68 12,48 Z',
      'M10,50 Q30,20 50,50 Q70,80 90,50 Q70,20 50,50 Q30,80 10,50 Z'
    ],
    shape3: [
      'M50,10 L90,30 L90,70 L50,90 L10,70 L10,30 Z',
      'M50,15 L85,35 L85,65 L50,85 L15,65 L15,35 Z',
      'M50,12 L88,32 L88,68 L50,88 L12,68 L12,32 Z',
      'M50,10 L90,30 L90,70 L50,90 L10,70 L10,30 Z'
    ]
  }

  const getAnimationDuration = () => {
    switch (intensity) {
      case 'low': return 8
      case 'medium': return 6
      case 'high': return 4
      default: return 6
    }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background gradient definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={themeColors[0]} />
            <stop offset="100%" stopColor={themeColors[1]} />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={themeColors[1]} />
            <stop offset="100%" stopColor={themeColors[2]} />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={themeColors[2]} />
            <stop offset="100%" stopColor={themeColors[3]} />
          </linearGradient>
          
          {/* Blur filter */}
          <filter id="blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Morphing Shape 1 */}
        <motion.path
          d={morphingPaths.shape1[0]}
          fill="url(#gradient1)"
          filter="url(#blur)"
          animate={{
            d: morphingPaths.shape1
          }}
          transition={{
            duration: getAnimationDuration(),
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            transformOrigin: '50px 50px',
            transform: 'translate(50px, 50px) scale(1.5)'
          }}
        />

        {/* Morphing Shape 2 */}
        <motion.path
          d={morphingPaths.shape2[0]}
          fill="url(#gradient2)"
          filter="url(#blur)"
          animate={{
            d: morphingPaths.shape2
          }}
          transition={{
            duration: getAnimationDuration() + 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
          style={{
            transformOrigin: '50px 50px',
            transform: 'translate(200px, 100px) scale(1.2)'
          }}
        />

        {/* Morphing Shape 3 */}
        <motion.path
          d={morphingPaths.shape3[0]}
          fill="url(#gradient3)"
          filter="url(#blur)"
          animate={{
            d: morphingPaths.shape3
          }}
          transition={{
            duration: getAnimationDuration() + 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
          style={{
            transformOrigin: '50px 50px',
            transform: 'translate(100px, 150px) scale(1.3)'
          }}
        />

        {/* Floating circles */}
        <motion.circle
          cx="300"
          cy="80"
          r="20"
          fill={themeColors[0]}
          filter="url(#blur)"
          animate={{
            cy: [80, 60, 80],
            r: [20, 25, 20],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        <motion.circle
          cx="80"
          cy="200"
          r="15"
          fill={themeColors[2]}
          filter="url(#blur)"
          animate={{
            cx: [80, 100, 80],
            cy: [200, 180, 200],
            r: [15, 20, 15]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />

        <motion.circle
          cx="320"
          cy="220"
          r="12"
          fill={themeColors[3]}
          filter="url(#blur)"
          animate={{
            cx: [320, 300, 320],
            r: [12, 18, 12],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
      </svg>
    </div>
  )
}

interface AnimatedBlobProps {
  className?: string
  size?: number
  color?: string
  animationDuration?: number
}

export const AnimatedBlob: React.FC<AnimatedBlobProps> = ({
  className = '',
  size = 200,
  color = '#3B82F6',
  animationDuration = 8
}) => {
  const { theme } = useTheme()
  
  const blobPaths = [
    'M60,-60C80,-40,100,-20,100,0C100,20,80,40,60,60C40,80,20,100,0,100C-20,100,-40,80,-60,60C-80,40,-100,20,-100,0C-100,-20,-80,-40,-60,-60C-40,-80,-20,-100,0,-100C20,-100,40,-80,60,-60Z',
    'M65,-55C85,-35,95,-15,95,5C95,25,85,45,65,55C45,75,25,85,5,85C-15,85,-35,75,-55,55C-75,45,-85,25,-85,5C-85,-15,-75,-35,-55,-55C-35,-75,-15,-85,5,-85C25,-85,45,-75,65,-55Z',
    'M55,-65C75,-45,95,-25,95,-5C95,15,75,35,55,65C35,85,15,95,-5,95C-25,95,-45,85,-65,65C-85,35,-95,15,-95,-5C-95,-25,-85,-45,-65,-65C-45,-85,-25,-95,-5,-95C15,-95,35,-85,55,-65Z',
    'M60,-60C80,-40,100,-20,100,0C100,20,80,40,60,60C40,80,20,100,0,100C-20,100,-40,80,-60,60C-80,40,-100,20,-100,0C-100,-20,-80,-40,-60,-60C-40,-80,-20,-100,0,-100C20,-100,40,-80,60,-60Z'
  ]

  const adjustedColor = theme.resolvedTheme === 'dark' 
    ? color + '60' 
    : color + '40'

  return (
    <div className={`${className}`} style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox="-100 -100 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <motion.path
          d={blobPaths[0]}
          fill={adjustedColor}
          filter="url(#glow)"
          animate={{
            d: blobPaths
          }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </svg>
    </div>
  )
}

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const scrolled = window.pageYOffset
        const parallax = scrolled * speed
        elementRef.current.style.transform = `translateY(${parallax}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}