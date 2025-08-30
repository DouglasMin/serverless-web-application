/**
 * Service Story Section Component
 * 서비스의 스토리와 미션을 설명하는 섹션
 */

import React from 'react'
import { motion } from 'framer-motion'
import { ServiceStoryProps } from '../types'
import { useInView } from '../../../design/animations'
import {
  MorphingShapes,
  AnimatedBlob,
  ParallaxLayer
} from '../animations/MorphingShapes'
import {
  FloatingElement,
  PodcastVisualization,
  StoryTimeline,
  InteractiveCard,
  GlowingOrb
} from '../animations/ImageParallax'
import { TextReveal } from '../animations/TypewriterText'
import { useTiltEffect } from '../utils/mouseInteraction'

interface Props extends Partial<ServiceStoryProps> {
  className?: string
}

export const ServiceStorySection: React.FC<Props> = ({
  story = {
    problem: "매일 반복되는 출근길, 의미 있는 콘텐츠를 찾기 어려웠습니다.",
    solution: "AI 기술로 개인화된 긍정적인 팟캐스트를 자동 생성합니다.",
    mission: "모든 사람의 일상에 긍정적인 변화를 만들어갑니다."
  },
  animations = {
    textReveal: true,
    imageParallax: true,
    morphingShapes: true
  },
  className = ''
}) => {
  const { ref, isInView } = useInView()
  const tiltRef = useTiltEffect(10) as React.RefObject<HTMLDivElement>

  const storySteps = [
    {
      title: "문제 인식",
      description: story.problem,
      icon: "🤔",
      color: "#EF4444"
    },
    {
      title: "해결책 발견",
      description: story.solution,
      icon: "💡",
      color: "#3B82F6"
    },
    {
      title: "미션 수립",
      description: story.mission,
      icon: "🎯",
      color: "#10B981"
    }
  ]

  return (
    <section ref={ref} className={`py-20 relative overflow-hidden w-full ${className}`}>
      {/* Background Elements */}
      {animations.morphingShapes && (
        <ParallaxLayer speed={0.2} className="absolute inset-0 opacity-30">
          <MorphingShapes intensity="medium" />
        </ParallaxLayer>
      )}

      <div className="about-content relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <TextReveal delay={0.2} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            우리의 이야기
          </TextReveal>
          <TextReveal delay={0.4} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            AI 기술로 개인화된 팟캐스트를 만들어가는 여정
          </TextReveal>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Story Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <StoryTimeline steps={storySteps} />
          </motion.div>

          {/* Interactive Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div
              ref={tiltRef}
              className="relative w-full h-96"
            >
              <InteractiveCard
                className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* Morphing Background */}
                {animations.morphingShapes && (
                  <div className="absolute inset-0">
                    <MorphingShapes intensity="low" />
                  </div>
                )}

                {/* Main Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center z-10 w-full max-w-sm">
                    {/* Podcast Icon with Animation - 위쪽에 배치 */}
                    <div className="mb-6">
                      <FloatingElement delay={0} duration={3} range={10}>
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl">🎧</span>
                        </div>
                      </FloatingElement>
                    </div>

                    {/* Audio Visualization - 정확히 중앙에 배치 */}
                    <div className="mb-6">
                      <PodcastVisualization isPlaying={isInView} />
                    </div>

                    {/* Feature Tags - 아래쪽에 배치 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="flex flex-wrap justify-center gap-2"
                    >
                      {['AI 생성', '개인화', '긍정적 톤'].map((tag, index) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                          className="px-3 py-1 text-xs bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Floating Orbs */}
                <FloatingElement delay={1} duration={4} range={15} className="absolute top-4 right-4">
                  <GlowingOrb size={60} color="#3B82F6" intensity={0.4} />
                </FloatingElement>

                <FloatingElement delay={2} duration={5} range={12} className="absolute bottom-4 left-4">
                  <GlowingOrb size={40} color="#8B5CF6" intensity={0.3} />
                </FloatingElement>

                <FloatingElement delay={0.5} duration={6} range={8} className="absolute top-1/2 left-4">
                  <GlowingOrb size={30} color="#EC4899" intensity={0.2} />
                </FloatingElement>
              </InteractiveCard>
            </div>
          </motion.div>
        </div>

        {/* Key Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: "🧠",
              title: "AI 기반 생성",
              description: "AWS Bedrock Nova를 활용한 고품질 콘텐츠 생성",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: "🎯",
              title: "개인화 맞춤",
              description: "사용자의 관심사와 선호도를 반영한 맞춤형 콘텐츠",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: "⚡",
              title: "빠른 처리",
              description: "몇 분 만에 완성되는 고품질 팟캐스트",
              color: "from-green-500 to-emerald-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300"
            onClick={() => {
              document.getElementById('flow')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            기술적 구현 보기 →
          </motion.button>
        </motion.div>
      </div>

      {/* Background Blobs */}
      {animations.morphingShapes && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <ParallaxLayer speed={0.1} className="absolute -top-32 -left-32">
            <AnimatedBlob size={300} color="#3B82F1" animationDuration={12} />
          </ParallaxLayer>
          <ParallaxLayer speed={0.15} className="absolute -bottom-32 -right-32">
            <AnimatedBlob size={250} color="#8B5CF6" animationDuration={10} />
          </ParallaxLayer>
        </div>
      )}
    </section>
  )
}