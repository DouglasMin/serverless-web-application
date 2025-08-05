/**
 * Team Animations Component
 * 팀 및 비전을 위한 애니메이션 컴포넌트들
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TeamMember, VisionStatement, RoadmapItem } from '../types'

interface TeamMemberCardProps {
  member: TeamMember
  index: number
  className?: string
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  index,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -10 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
        animate={{
          opacity: isHovered ? 0.8 : 0.3
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 p-6">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <motion.div
            className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl shadow-lg"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            👥
          </motion.div>
        </div>

        {/* Member info */}
        <div className="text-center">
          <motion.h3
            className="text-xl font-bold text-gray-900 dark:text-white mb-2"
            animate={{
              scale: isHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            {member.name}
          </motion.h3>
          <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">
            {member.role}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
            {member.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {member.skills.map((skill, skillIndex) => (
            <motion.span
              key={skill}
              className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.2 + skillIndex * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>

        {/* Social links */}
        <div className="flex justify-center space-x-4">
          {member.social.github && (
            <motion.a
              href={member.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              GitHub
            </motion.a>
          )}
          {member.social.email && (
            <motion.a
              href={`mailto:${member.social.email}`}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              whileHover={{ scale: 1.2, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
            >
              Email
            </motion.a>
          )}
        </div>

        {/* Expand indicator */}
        <motion.div
          className="absolute top-4 right-4 text-gray-400"
          animate={{ rotate: showDetails ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

interface VisionCardProps {
  vision: VisionStatement
  className?: string
}

export const VisionCard: React.FC<VisionCardProps> = ({
  vision,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'values' | 'goals'>('mission')

  const tabs = [
    { key: 'mission' as const, label: '미션', icon: '🎯', content: vision.mission },
    { key: 'vision' as const, label: '비전', icon: '🌟', content: vision.vision },
    { key: 'values' as const, label: '가치', icon: '💎', content: vision.values },
    { key: 'goals' as const, label: '목표', icon: '🚀', content: vision.goals }
  ]

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab(tab.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'mission' && (
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  우리의 미션
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {vision.mission}
                </p>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  우리의 비전
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {vision.vision}
                </p>
              </div>
            )}

            {activeTab === 'values' && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    핵심 가치
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vision.values.map((value, index) => (
                    <motion.div
                      key={value}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    목표
                  </h3>
                </div>
                <div className="space-y-3">
                  {vision.goals.map((goal, index) => (
                    <motion.div
                      key={goal}
                      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-900 dark:text-white">
                        {goal}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

interface RoadmapTimelineProps {
  roadmap: RoadmapItem[]
  className?: string
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  roadmap,
  className = ''
}) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleItems(prev => {
        const next = new Set(prev)
        if (next.size < roadmap.length) {
          next.add(next.size)
        }
        return next
      })
    }, 500)

    return () => clearInterval(timer)
  }, [roadmap.length])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981'
      case 'in-progress': return '#3B82F6'
      case 'planned': return '#6B7280'
      default: return '#6B7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in-progress': return '🔄'
      case 'planned': return '📅'
      default: return '📅'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-8 top-0 w-0.5 h-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="w-full bg-gradient-to-b from-green-500 via-blue-500 to-gray-400 origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </div>

      {/* Timeline items */}
      <div className="space-y-8">
        {roadmap.map((item, index) => (
          <AnimatePresence key={index}>
            {visibleItems.has(index) && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative flex items-start space-x-6"
              >
                {/* Timeline dot */}
                <motion.div
                  className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg"
                  style={{ backgroundColor: getStatusColor(item.status) }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  {getStatusIcon(item.status)}
                </motion.div>

                {/* Content */}
                <motion.div
                  className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h4>
                    <span 
                      className="px-3 py-1 text-xs rounded-full font-medium"
                      style={{
                        backgroundColor: `${getStatusColor(item.status)}20`,
                        color: getStatusColor(item.status)
                      }}
                    >
                      {item.status === 'completed' ? '완료' : 
                       item.status === 'in-progress' ? '진행중' : '예정'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium" style={{ color: getStatusColor(item.status) }}>
                      {item.timeline}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  )
}

interface TeamStatsProps {
  className?: string
}

export const TeamStats: React.FC<TeamStatsProps> = ({
  className = ''
}) => {
  const stats = [
    { label: '팀 멤버', value: 1, icon: '👥', color: '#3B82F6' },
    { label: '프로젝트 경험', value: 5, suffix: '+', icon: '🚀', color: '#10B981' },
    { label: '기술 스택', value: 15, suffix: '+', icon: '⚡', color: '#8B5CF6' },
    { label: '서비스 가동률', value: 99.9, suffix: '%', icon: '📊', color: '#F59E0B' }
  ]

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <motion.div
            className="text-2xl font-bold mb-1"
            style={{ color: stat.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          >
            {stat.value}{stat.suffix || ''}
          </motion.div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}