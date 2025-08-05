/**
 * Micro Interactions and Hover Effects
 * 세밀한 사용자 인터랙션과 호버 효과 컴포넌트들
 */

import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useAnimationContext } from './AdvancedAnimationSystem'

// Magnetic Button Effect
interface MagneticButtonProps {
  children: React.ReactNode
  strength?: number
  className?: string
  onClick?: () => void
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.3,
  className = '',
  onClick
}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const { isReducedMotion } = useAnimationContext()
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isReducedMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    
    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={isReducedMotion ? {} : { scale: 1.05 }}
      whileTap={isReducedMotion ? {} : { scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

// Ripple Effect
interface RippleEffectProps {
  children: React.ReactNode
  color?: string
  duration?: number
  className?: string
  onClick?: () => void
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  color = 'rgba(255, 255, 255, 0.6)',
  duration = 0.6,
  className = '',
  onClick
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const { isReducedMotion } = useAnimationContext()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) {
      onClick?.()
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, duration * 1000)
    
    onClick?.()
  }

  return (
    <div
      className={`relative overflow-hidden cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: color
            }}
            initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Tilt Effect
interface TiltEffectProps {
  children: React.ReactNode
  maxTilt?: number
  perspective?: number
  scale?: number
  className?: string
}

export const TiltEffect: React.FC<TiltEffectProps> = ({
  children,
  maxTilt = 15,
  perspective = 1000,
  scale = 1.05,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { isReducedMotion } = useAnimationContext()
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isReducedMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = (e.clientX - centerX) / (rect.width / 2)
    const mouseY = (e.clientY - centerY) / (rect.height / 2)
    
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: perspective
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={isReducedMotion ? {} : { scale }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

// Morphing Shape
interface MorphingShapeProps {
  shapes: string[]
  duration?: number
  className?: string
}

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  shapes,
  duration = 2,
  className = ''
}) => {
  const [currentShape, setCurrentShape] = useState(0)
  const { isReducedMotion } = useAnimationContext()

  useEffect(() => {
    if (isReducedMotion) return

    const interval = setInterval(() => {
      setCurrentShape(prev => (prev + 1) % shapes.length)
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [shapes.length, duration, isReducedMotion])

  return (
    <svg className={className} viewBox="0 0 100 100">
      <motion.path
        d={shapes[currentShape]}
        fill="currentColor"
        animate={{ d: shapes[currentShape] }}
        transition={{ duration: duration * 0.8, ease: 'easeInOut' }}
      />
    </svg>
  )
}

// Floating Action Button
interface FloatingActionButtonProps {
  children: React.ReactNode
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
  onClick?: () => void
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  children,
  position = 'bottom-right',
  className = '',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const { isReducedMotion } = useAnimationContext()

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  return (
    <motion.button
      className={`fixed z-50 w-14 h-14 rounded-full shadow-lg ${positionClasses[position]} ${className}`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={isReducedMotion ? {} : { scale: 1.1 }}
      whileTap={isReducedMotion ? {} : { scale: 0.9 }}
      animate={isReducedMotion ? {} : {
        y: isHovered ? -5 : 0,
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.button>
  )
}

// Elastic Scale
interface ElasticScaleProps {
  children: React.ReactNode
  trigger?: 'hover' | 'tap' | 'focus'
  scale?: number
  className?: string
}

export const ElasticScale: React.FC<ElasticScaleProps> = ({
  children,
  trigger = 'hover',
  scale = 1.1,
  className = ''
}) => {
  const { isReducedMotion } = useAnimationContext()

  const getAnimationProps = () => {
    if (isReducedMotion) return {}

    const animation = { scale }
    const transition = { type: 'spring' as const, stiffness: 400, damping: 10 }

    switch (trigger) {
      case 'hover':
        return { whileHover: animation, transition }
      case 'tap':
        return { whileTap: animation, transition }
      case 'focus':
        return { whileFocus: animation, transition }
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

// Pulse Effect
interface PulseEffectProps {
  children: React.ReactNode
  intensity?: number
  duration?: number
  className?: string
}

export const PulseEffect: React.FC<PulseEffectProps> = ({
  children,
  intensity = 1.05,
  duration = 1,
  className = ''
}) => {
  const { isReducedMotion } = useAnimationContext()

  return (
    <motion.div
      className={className}
      animate={isReducedMotion ? {} : {
        scale: [1, intensity, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Glow Effect
interface GlowEffectProps {
  children: React.ReactNode
  color?: string
  intensity?: number
  className?: string
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  color = '#3B82F6',
  intensity = 20,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const { isReducedMotion } = useAnimationContext()

  return (
    <motion.div
      className={className}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={isReducedMotion ? {} : {
        boxShadow: isHovered 
          ? `0 0 ${intensity}px ${color}40, 0 0 ${intensity * 2}px ${color}20`
          : '0 0 0px transparent'
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// Shake Effect
interface ShakeEffectProps {
  children: React.ReactNode
  trigger?: boolean
  intensity?: number
  duration?: number
  className?: string
}

export const ShakeEffect: React.FC<ShakeEffectProps> = ({
  children,
  trigger = false,
  intensity = 10,
  duration = 0.5,
  className = ''
}) => {
  const { isReducedMotion } = useAnimationContext()

  return (
    <motion.div
      className={className}
      animate={isReducedMotion || !trigger ? {} : {
        x: [0, -intensity, intensity, -intensity, intensity, 0],
        transition: { duration, ease: 'easeInOut' }
      }}
    >
      {children}
    </motion.div>
  )
}