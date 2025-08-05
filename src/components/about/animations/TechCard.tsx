/**
 * Interactive Tech Card Component
 * 기술 스택을 위한 인터랙티브 카드 컴포넌트
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Technology } from '../types'
import { useTiltEffect } from '../utils/mouseInteraction'

interface TechCardProps {
  tech: Technology
  category: string
  categoryColor: string
  isExpanded?: boolean
  onExpand?: (tech: Technology) => void
  onCollapse?: () => void
  className?: string
  variant?: 'default' | 'featured' | 'compact'
}

export const TechCard: React.FC<TechCardProps> = ({
  tech,
  category,
  categoryColor,
  isExpanded = false,
  onExpand,
  onCollapse,
  className = '',
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const tiltRef = useTiltEffect(8)

  const handleClick = () => {
    if (isExpanded) {
      onCollapse?.()
    } else {
      onExpand?.(tech)
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'featured':
        return 'p-8 min-h-[300px]'
      case 'compact':
        return 'p-4 min-h-[200px]'
      default:
        return 'p-6 min-h-[250px]'
    }
  }

  const isFeatured = tech.name === 'AWS Bedrock Nova'

  return (
    <motion.div
      ref={tiltRef as any}
      layout
      className={`relative cursor-pointer ${getVariantStyles()} ${className}`}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Background with gradient */}
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${categoryColor} opacity-5`}
        animate={{
          opacity: isHovered ? 0.1 : 0.05
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Main card background */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full overflow-hidden">
        {/* Featured badge */}
        {isFeatured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 z-10"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              핵심 AI
            </div>
          </motion.div>
        )}

        {/* Glow effect for featured card */}
        {isFeatured && isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                className="text-3xl"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? 5 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {tech.icon}
              </motion.div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {tech.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category}
                </p>
              </div>
            </div>

            {/* Expand indicator */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400 dark:text-gray-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 flex-1">
            {tech.description}
          </p>

          {/* Stats */}
          {tech.stats && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">성능</div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${tech.stats.performance}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                    {tech.stats.performance}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">인기도</div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${tech.stats.popularity}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {tech.stats.popularity}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">안정성</div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${tech.stats.reliability}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    {tech.stats.reliability}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hover indicator */}
          <motion.div
            className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400"
            animate={{
              opacity: isHovered ? 1 : 0.6,
              y: isHovered ? 0 : 5
            }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? '접기' : '자세히 보기'}
          </motion.div>
        </div>

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-transparent"
          animate={{
            borderColor: isHovered 
              ? (isFeatured ? '#8B5CF6' : '#3B82F6')
              : 'transparent'
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Particle effect for featured card */}
        {isFeatured && isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
                animate={{
                  y: [-10, -20, -10],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface TechCardExpandedProps {
  tech: Technology
  category: string
  categoryColor: string
  onClose: () => void
}

export const TechCardExpanded: React.FC<TechCardExpandedProps> = ({
  tech,
  category,
  categoryColor,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${categoryColor} p-6 text-white rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{tech.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{tech.name}</h2>
                <p className="opacity-90">{category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              상세 설명
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {tech.description}
            </p>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              선택 이유
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {tech.reason}
            </p>
          </div>

          {/* Stats */}
          {tech.stats && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                성능 지표
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-sm text-green-600 dark:text-green-400 font-semibold mb-2">
                    성능
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {tech.stats.performance}%
                  </div>
                  <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${tech.stats.performance}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">
                    인기도
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {tech.stats.popularity}%
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${tech.stats.popularity}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">
                    안정성
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {tech.stats.reliability}%
                  </div>
                  <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${tech.stats.reliability}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Links */}
          {tech.links && tech.links.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                참고 링크
              </h3>
              <div className="space-y-2">
                {tech.links.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span>공식 문서</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}