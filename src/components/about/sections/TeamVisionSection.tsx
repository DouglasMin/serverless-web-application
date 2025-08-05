/**
 * Team & Vision Section Component
 * 팀 소개와 비전을 표시하는 섹션
 */

import React from 'react'
import { motion } from 'framer-motion'
import { TeamSectionProps } from '../types'
import { teamData, visionData, roadmapData } from '../data/aboutData'
import { useInView } from '../../../design/animations'
import { 
  TeamMemberCard, 
  VisionCard, 
  RoadmapTimeline, 
  TeamStats 
} from '../animations/TeamAnimations'

interface Props extends Partial<TeamSectionProps> {
  className?: string
}

export const TeamVisionSection: React.FC<Props> = ({
  team = teamData,
  vision = visionData,
  roadmap = roadmapData,
  className = ''
}) => {
  const { ref, isInView } = useInView()

  return (
    <section ref={ref} className={`py-20 bg-gray-50 dark:bg-gray-900/50 w-full ${className}`}>
      <div className="about-content">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            팀 & 비전
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            혁신적인 AI 기술로 더 나은 미래를 만들어가는 우리의 이야기
          </p>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <TeamStats />
        </motion.div>

        {/* Vision & Mission Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <VisionCard vision={vision} className="max-w-4xl mx-auto" />
        </motion.div>

        {/* Team Members */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            팀 소개
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <TeamMemberCard
                key={member.name}
                member={member}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Roadmap Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            로드맵
          </h3>
          <div className="max-w-4xl mx-auto">
            <RoadmapTimeline roadmap={roadmap} />
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              함께 미래를 만들어가요
            </h3>
            <p className="text-lg mb-6 opacity-90">
              우리와 함께 AI 기술의 새로운 가능성을 탐험해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                서비스 시작하기
              </motion.button>
              <motion.button
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                문의하기
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}