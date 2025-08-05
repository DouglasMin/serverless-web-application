/**
 * Tech Category Header Component
 * 기술 스택 카테고리 헤더 컴포넌트
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TechCategory } from '../types'
import { useInView } from '../../../design/animations'

interface TechCategoryHeaderProps {
  category: TechCategory
  index: number
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
}

export const TechCategoryHeader: React.FC<TechCategoryHeaderProps> = ({
  category,
  index,
  isExpanded = true,
  onToggle,
  className = ''
}) => {
  const { ref, isInView } = useInView()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`mb-8 ${className}`}
    >
      {/* Category Header */}
      <div 
        className="flex items-center space-x-4 mb-6 cursor-pointer group"
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icon Container */}
        <motion.div 
          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl shadow-lg relative overflow-hidden`}
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background animation */}
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              scale: isHovered ? [1, 1.5, 1] : 1,
              opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2
            }}
            transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
          />
          
          <span className="relative z-10">{category.icon}</span>
          
          {/* Sparkle effects */}
          {isHovered && (
            <div className="absolute inset-0">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${25 + i * 20}%`,
                    top: `${25 + (i % 2) * 50}%`
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Title and Description */}
        <div className="flex-1">
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"
            animate={{
              x: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            {category.name}
          </motion.h3>
          
          <motion.div 
            className={`h-1 bg-gradient-to-r ${category.color} rounded-full mt-2 origin-left`}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
            whileHover={{ scaleX: 1.1 }}
          />
          
          <motion.p
            className="text-gray-600 dark:text-gray-300 mt-2 text-sm"
            animate={{
              opacity: isHovered ? 1 : 0.8,
              x: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            {category.technologies.length}개의 기술 스택
          </motion.p>
        </div>

        {/* Expand/Collapse Indicator */}
        {onToggle && (
          <motion.div
            className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
            animate={{ 
              rotate: isExpanded ? 180 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Category Stats */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isInView ? 1 : 0, 
          height: isInView ? 'auto' : 0 
        }}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {category.technologies.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">
            기술 수
          </div>
        </div>
        
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {Math.round(category.technologies.reduce((acc, tech) => 
              acc + (tech.stats?.performance || 0), 0) / category.technologies.length)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">
            평균 성능
          </div>
        </div>
        
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {Math.round(category.technologies.reduce((acc, tech) => 
              acc + (tech.stats?.popularity || 0), 0) / category.technologies.length)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">
            평균 인기도
          </div>
        </div>
        
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {Math.round(category.technologies.reduce((acc, tech) => 
              acc + (tech.stats?.reliability || 0), 0) / category.technologies.length)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300">
            평균 안정성
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface TechCategoryTimelineProps {
  categories: TechCategory[]
  className?: string
}

export const TechCategoryTimeline: React.FC<TechCategoryTimelineProps> = ({
  categories,
  className = ''
}) => {
  const { ref, isInView } = useInView()

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-8 top-0 w-0.5 h-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 origin-top"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </div>

      {/* Timeline items */}
      <div className="space-y-12">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="relative flex items-start space-x-6"
          >
            {/* Timeline dot */}
            <div className="relative z-10">
              <motion.div
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.technologies.slice(0, 4).map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.2 + techIndex * 0.1 + 0.3 
                    }}
                    className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <span className="text-lg">{tech.icon}</span>
                    <span>{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}