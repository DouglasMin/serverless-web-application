/**
 * Hero Section Component
 * 3D 배경과 타이포그래피 애니메이션이 포함된 히어로 섹션
 */

import React, { Suspense, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeroSectionProps } from '../types'
import { aboutAnimationVariants } from '../utils/animations'
import { getOptimalAnimationConfig } from '../utils/performance'
import { ThreeBackground } from '../3d'
import { TypewriterText, WordByWordReveal } from '../animations'

interface Props extends Partial<HeroSectionProps> {
  className?: string
}

// Fallback component for 3D background
const FallbackBackground: React.FC = () => (
  <div className="absolute inset-0 opacity-30">
    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
    <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000" />
    <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-2000" />
  </div>
)

export const HeroSection: React.FC<Props> = ({
  title = "AI 팟캐스트의 새로운 경험",
  subtitle = "AWS Bedrock Nova와 최신 기술로 만드는 개인화된 오디오 콘텐츠",
  backgroundAnimation = 'geometric',
  parallaxIntensity: _parallaxIntensity = 0.5,
  className = ''
}) => {
  const [animationConfig] = useState(() => getOptimalAnimationConfig())
  const [titleComplete, setTitleComplete] = useState(false)
  const [use3D, setUse3D] = useState(false)

  // Check if 3D should be enabled
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        return !!gl && animationConfig.performance !== 'low'
      } catch (e) {
        return false
      }
    }

    setUse3D(checkWebGL())
  }, [animationConfig.performance])

  return (
    <section className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        
        {/* 3D Background or Fallback */}
        {use3D ? (
          <Suspense fallback={<FallbackBackground />}>
            <ThreeBackground 
              backgroundAnimation={backgroundAnimation}
              className="absolute inset-0"
            />
          </Suspense>
        ) : (
          <FallbackBackground />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center about-content">
        {/* Main Title with Typewriter Effect */}
        <motion.h1
          variants={aboutAnimationVariants.heroTitle}
          initial="initial"
          animate="animate"
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          {animationConfig.effects.transitions ? (
            <TypewriterText
              text={title}
              speed={100}
              delay={500}
              onComplete={() => setTitleComplete(true)}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            />
          ) : (
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {title}
            </span>
          )}
        </motion.h1>
        
        {/* Subtitle with Word-by-Word Reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: titleComplete ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
        >
          {animationConfig.effects.transitions && titleComplete ? (
            <WordByWordReveal
              text={subtitle}
              delay={0.2}
              wordDelay={0.1}
            />
          ) : (
            <span>{subtitle}</span>
          )}
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: titleComplete ? 1 : 0, y: titleComplete ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            { icon: '🧠', text: 'AWS Bedrock Nova' },
            { icon: '🎧', text: '개인화된 콘텐츠' },
            { icon: '⚡', text: '빠른 생성' },
            { icon: '🔒', text: '안전한 처리' }
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
              className="flex items-center space-x-2 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 dark:border-gray-700/50"
            >
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: titleComplete ? 1 : 0, y: titleComplete ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300"
            onClick={() => {
              document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            더 알아보기 →
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">스크롤하여 더 알아보기</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      {animationConfig.effects.parallax && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute top-1/4 left-1/6 w-4 h-4 bg-blue-400/30 rounded-full blur-sm"
          />
          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
            className="absolute top-1/3 right-1/5 w-6 h-6 bg-purple-400/30 rounded-full blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2
            }}
            className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-pink-400/30 rounded-full blur-sm"
          />
        </div>
      )}
    </section>
  )
}