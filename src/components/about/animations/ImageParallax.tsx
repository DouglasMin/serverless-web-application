/**
 * Image Parallax Component
 * 이미지와 시각적 요소들의 패럴랙스 효과
 */

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from '../../../design/theme'

interface ImageParallaxProps {
  className?: string
  intensity?: number
  children?: React.ReactNode
}

export const ImageParallax: React.FC<ImageParallaxProps> = ({
  className = '',
  intensity = 0.5,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${intensity * 100}%`])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y, opacity }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}

interface FloatingElementProps {
  className?: string
  delay?: number
  duration?: number
  range?: number
  children: React.ReactNode
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  className = '',
  delay = 0,
  duration = 4,
  range = 20,
  children
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-range, range, -range],
        rotate: [-2, 2, -2]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
    >
      {children}
    </motion.div>
  )
}

interface PodcastVisualizationProps {
  className?: string
  isPlaying?: boolean
}

export const PodcastVisualization: React.FC<PodcastVisualizationProps> = ({
  className = '',
  isPlaying = true
}) => {
  const { theme } = useTheme()
  const [audioLevels, setAudioLevels] = useState<number[]>([])

  // Generate random audio levels for visualization
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      const levels = Array.from({ length: 12 }, () => Math.random() * 100 + 20)
      setAudioLevels(levels)
    }, 150)

    return () => clearInterval(interval)
  }, [isPlaying])

  const baseColor = theme.resolvedTheme === 'dark' ? '#6366F1' : '#3B82F6'

  return (
    <div className={`flex items-end justify-center space-x-1 h-24 ${className}`}>
      {audioLevels.map((level, index) => (
        <motion.div
          key={index}
          className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
          animate={{
            height: isPlaying ? `${level}%` : '20%',
            opacity: isPlaying ? [0.6, 1, 0.6] : 0.3
          }}
          transition={{
            duration: 0.3,
            repeat: isPlaying ? Infinity : 0,
            repeatType: 'reverse',
            delay: index * 0.05
          }}
          style={{
            background: `linear-gradient(to top, ${baseColor}, #8B5CF6)`
          }}
        />
      ))}
    </div>
  )
}

interface StoryTimelineProps {
  className?: string
  steps: Array<{
    title: string
    description: string
    icon: string
    color: string
  }>
}

export const StoryTimeline: React.FC<StoryTimelineProps> = ({
  className = '',
  steps
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  })

  const lineProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-8 top-0 w-0.5 h-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="w-full bg-gradient-to-b from-blue-500 to-purple-500 origin-top"
          style={{ height: lineProgress }}
        />
      </div>

      {/* Timeline steps */}
      <div className="space-y-12">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
            className="relative flex items-start space-x-6"
          >
            {/* Timeline dot */}
            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg"
                style={{ backgroundColor: step.color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {step.icon}
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <motion.h3
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                viewport={{ once: true }}
              >
                {step.title}
              </motion.h3>
              <motion.p
                className="text-gray-600 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                viewport={{ once: true }}
              >
                {step.description}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface InteractiveCardProps {
  className?: string
  children: React.ReactNode
  hoverScale?: number
  clickScale?: number
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  className = '',
  children,
  hoverScale = 1.02,
  clickScale = 0.98
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: clickScale }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? 2 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

interface GlowingOrbProps {
  className?: string
  size?: number
  color?: string
  intensity?: number
}

export const GlowingOrb: React.FC<GlowingOrbProps> = ({
  className = '',
  size = 100,
  color = '#3B82F6',
  intensity = 0.5
}) => {
  return (
    <motion.div
      className={`rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        filter: 'blur(1px)'
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [intensity, intensity * 1.5, intensity]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}