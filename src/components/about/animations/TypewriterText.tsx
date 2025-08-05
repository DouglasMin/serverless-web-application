/**
 * Typewriter Text Animation Component
 * 타이핑 효과와 텍스트 reveal 애니메이션
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  onComplete?: () => void
  cursor?: boolean
  loop?: boolean
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  onComplete,
  cursor = true,
  loop = false
}) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const timeoutRef = useRef<number>()

  useEffect(() => {
    if (currentIndex < text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, currentIndex === 0 ? delay : speed)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
      
      if (loop) {
        setTimeout(() => {
          setDisplayText('')
          setCurrentIndex(0)
          setIsComplete(false)
        }, 2000)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, text, speed, delay, onComplete, loop, isComplete])

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor) return

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [cursor])

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <motion.span
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0.1 }}
          className="inline-block w-0.5 h-[1em] bg-current ml-1"
        />
      )}
    </span>
  )
}

interface TextRevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  className = ''
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 50, x: 0 }
      case 'down': return { y: -50, x: 0 }
      case 'left': return { y: 0, x: 50 }
      case 'right': return { y: 0, x: -50 }
      default: return { y: 50, x: 0 }
    }
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition()
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        x: 0 
      }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  delay?: number
  suffix?: string
  className?: string
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  duration = 2,
  delay = 0,
  suffix = '',
  className = ''
}) => {
  const [count, setCount] = useState(from)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now() + delay * 1000
    const endTime = startTime + duration * 1000

    const updateCount = () => {
      const now = Date.now()
      
      if (now < startTime) {
        requestAnimationFrame(updateCount)
        return
      }

      if (now >= endTime) {
        setCount(to)
        return
      }

      const progress = (now - startTime) / (endTime - startTime)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.round(from + (to - from) * easeOutQuart)
      
      setCount(currentCount)
      requestAnimationFrame(updateCount)
    }

    requestAnimationFrame(updateCount)
  }, [isVisible, from, to, duration, delay])

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: number
  speed?: number
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  intensity = 0.1,
  speed = 100
}) => {
  const [glitchedText, setGlitchedText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const createGlitch = () => {
    let result = ''
    for (let i = 0; i < text.length; i++) {
      if (Math.random() < intensity && text[i] !== ' ') {
        result += glitchChars[Math.floor(Math.random() * glitchChars.length)]
      } else {
        result += text[i]
      }
    }
    return result
  }

  const startGlitch = () => {
    if (isGlitching) return
    
    setIsGlitching(true)
    let glitchCount = 0
    const maxGlitches = 5

    const glitchInterval = setInterval(() => {
      setGlitchedText(createGlitch())
      glitchCount++

      if (glitchCount >= maxGlitches) {
        clearInterval(glitchInterval)
        setGlitchedText(text)
        setIsGlitching(false)
      }
    }, speed)
  }

  return (
    <span
      className={`cursor-pointer ${className}`}
      onMouseEnter={startGlitch}
      style={{
        fontFamily: 'monospace',
        textShadow: isGlitching ? '2px 0 #ff0000, -2px 0 #00ff00' : 'none'
      }}
    >
      {glitchedText}
    </span>
  )
}

interface WordByWordRevealProps {
  text: string
  delay?: number
  wordDelay?: number
  className?: string
}

export const WordByWordReveal: React.FC<WordByWordRevealProps> = ({
  text,
  delay = 0,
  wordDelay = 0.1,
  className = ''
}) => {
  const words = text.split(' ')

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * wordDelay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}