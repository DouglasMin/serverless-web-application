/**
 * Security Animations Component
 * 보안 및 신뢰성을 위한 애니메이션 컴포넌트들
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../../design/theme'

interface SecurityShieldProps {
  className?: string
  isActive?: boolean
  size?: number
}

export const SecurityShield: React.FC<SecurityShieldProps> = ({
  className = '',
  isActive = true,
  size = 100
}) => {
  const { theme } = useTheme()
  const [pulseCount, setPulseCount] = useState(0)

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setPulseCount(prev => prev + 1)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isActive])

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="relative z-10"
      >
        {/* Shield background */}
        <motion.path
          d="M50 10 L20 25 L20 50 Q20 75 50 90 Q80 75 80 50 L80 25 Z"
          fill={theme.resolvedTheme === 'dark' ? '#1F2937' : '#FFFFFF'}
          stroke="#10B981"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        />

        {/* Shield pattern */}
        <motion.path
          d="M50 20 L30 30 L30 50 Q30 65 50 75 Q70 65 70 50 L70 30 Z"
          fill="url(#shieldGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Lock icon */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <rect x="42" y="45" width="16" height="12" rx="2" fill="#10B981" />
          <path
            d="M45 45 V40 Q45 35 50 35 Q55 35 55 40 V45"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
          />
        </motion.g>

        {/* Gradient definition */}
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Pulse rings */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key={pulseCount}
            className="absolute inset-0 border-2 border-green-400 rounded-full"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Glow effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-green-400/20 rounded-full blur-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </div>
  )
}

interface EncryptionVisualizationProps {
  className?: string
  isAnimating?: boolean
}

export const EncryptionVisualization: React.FC<EncryptionVisualizationProps> = ({
  className = '',
  isAnimating = true
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ['원본 데이터', '암호화 중...', '암호화 완료']

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % steps.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isAnimating, steps.length])

  return (
    <div className={`relative p-6 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Input data */}
        <motion.div
          className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg"
          animate={{
            scale: currentStep === 0 ? 1.05 : 1,
            boxShadow: currentStep === 0 ? '0 0 20px rgba(59, 130, 246, 0.3)' : '0 0 0px rgba(59, 130, 246, 0)'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
            사용자 데이터
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-blue-300 dark:bg-blue-600 rounded w-16" />
            <div className="h-2 bg-blue-300 dark:bg-blue-600 rounded w-12" />
            <div className="h-2 bg-blue-300 dark:bg-blue-600 rounded w-14" />
          </div>
        </motion.div>

        {/* Encryption process */}
        <motion.div
          className="flex-1 mx-6 relative"
          animate={{
            opacity: currentStep === 1 ? 1 : 0.5
          }}
        >
          <div className="flex items-center justify-center">
            <motion.div
              className="w-16 h-16 border-4 border-green-500 rounded-full flex items-center justify-center"
              animate={{
                rotate: currentStep === 1 ? 360 : 0,
                scale: currentStep === 1 ? 1.1 : 1
              }}
              transition={{
                rotate: { duration: 1, repeat: currentStep === 1 ? Infinity : 0, ease: 'linear' },
                scale: { duration: 0.3 }
              }}
            >
              <span className="text-2xl">🔐</span>
            </motion.div>
          </div>
          
          {/* Encryption particles */}
          {currentStep === 1 && (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-green-400 rounded-full"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${30 + (i % 2) * 40}%`
                  }}
                  animate={{
                    y: [-5, -15, -5],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Encrypted output */}
        <motion.div
          className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg"
          animate={{
            scale: currentStep === 2 ? 1.05 : 1,
            boxShadow: currentStep === 2 ? '0 0 20px rgba(16, 185, 129, 0.3)' : '0 0 0px rgba(16, 185, 129, 0)'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
            암호화된 데이터
          </div>
          <div className="space-y-1">
            <motion.div
              className="h-2 bg-green-300 dark:bg-green-600 rounded"
              animate={{
                width: currentStep === 2 ? '4rem' : '2rem'
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="h-2 bg-green-300 dark:bg-green-600 rounded"
              animate={{
                width: currentStep === 2 ? '3rem' : '1.5rem'
              }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            <motion.div
              className="h-2 bg-green-300 dark:bg-green-600 rounded"
              animate={{
                width: currentStep === 2 ? '3.5rem' : '1.75rem'
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Status text */}
      <motion.div
        className="text-center mt-4 text-sm font-medium text-gray-600 dark:text-gray-300"
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {steps[currentStep]}
      </motion.div>
    </div>
  )
}

interface TrustIndicatorProps {
  value: number
  label: string
  icon: string
  color: string
  className?: string
}

export const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  value,
  label,
  icon,
  color,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = value / 50
      const interval = setInterval(() => {
        setDisplayValue(prev => {
          const next = prev + increment
          if (next >= value) {
            clearInterval(interval)
            return value
          }
          return next
        })
      }, 20)
      return () => clearInterval(interval)
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 rounded-xl opacity-10"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className="text-4xl mb-4 text-center">{icon}</div>

        {/* Value */}
        <div className="text-center mb-2">
          <motion.span
            className="text-3xl font-bold"
            style={{ color }}
            animate={{ scale: displayValue === value ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(displayValue)}
            {label.includes('%') ? '%' : ''}
          </motion.span>
        </div>

        {/* Label */}
        <div className="text-sm text-gray-600 dark:text-gray-300 text-center font-medium">
          {label}
        </div>

        {/* Progress ring */}
        <div className="absolute top-4 right-4 w-8 h-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="16"
              cy="16"
              r="12"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: displayValue / 100 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                strokeDasharray: '75.4',
                strokeDashoffset: '75.4'
              }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

interface ComplianceBadgeProps {
  name: string
  issuer: string
  isVerified?: boolean
  className?: string
}

export const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({
  name,
  issuer,
  isVerified = true,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative p-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-blue-200 dark:border-blue-700 cursor-pointer ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Verification checkmark */}
      {isVerified && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          animate={{
            scale: isHovered ? 1.2 : 1,
            rotate: isHovered ? 10 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}

      {/* Badge content */}
      <div className="text-center">
        <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {name}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {issuer}
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}