/**
 * Tech Stack Section Component
 * 기술 스택을 인터랙티브 카드로 표시하는 섹션
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TechStackProps, Technology } from '../types'
import { techStackData } from '../data/aboutData'
import { useInView } from '../../../design/animations'
import { TechCard, TechCardExpanded } from '../animations/TechCard'
import { TechCategoryHeader, TechCategoryTimeline } from '../animations/TechCategoryHeader'
import { TextReveal } from '../animations/TypewriterText'

interface Props extends Partial<TechStackProps> {
  className?: string
}

export const TechStackSection: React.FC<Props> = ({
  categories = techStackData,
  className = ''
}) => {
  const { ref, isInView } = useInView()
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(cat => cat.name))
  )
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards')

  const handleTechExpand = (tech: Technology) => {
    setSelectedTech(tech)
  }

  const handleTechCollapse = () => {
    setSelectedTech(null)
  }

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName)
    } else {
      newExpanded.add(categoryName)
    }
    setExpandedCategories(newExpanded)
  }

  const featuredTech = categories
    .flatMap(cat => cat.technologies)
    .find(tech => tech.name === 'AWS Bedrock Nova')

  return (
    <section ref={ref} className={`py-20 relative overflow-hidden w-full ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100 to-transparent dark:from-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-transparent dark:from-purple-900/20 rounded-full blur-3xl" />
      </div>

      <div className="about-content relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <TextReveal delay={0.2} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            기술적 차별점
          </TextReveal>
          <TextReveal delay={0.4} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            최신 기술 스택으로 구축된 안정적이고 확장 가능한 AI 팟캐스트 플랫폼
          </TextReveal>

          {/* View Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center space-x-4 mb-8"
          >
            <button
              onClick={() => setViewMode('cards')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                viewMode === 'cards'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              🃏 카드 뷰
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                viewMode === 'timeline'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              📊 타임라인 뷰
            </button>
          </motion.div>
        </motion.div>

        {/* Featured Technology Highlight */}
        {featuredTech && viewMode === 'cards' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🌟 핵심 AI 기술
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                우리 서비스의 중심이 되는 AI 기술을 소개합니다
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <TechCard
                tech={featuredTech}
                category="AI & Machine Learning"
                categoryColor="from-purple-500 to-pink-500"
                onExpand={handleTechExpand}
                variant="featured"
                className="transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </motion.div>
        )}

        {/* Technology Categories */}
        <AnimatePresence mode="wait">
          {viewMode === 'cards' ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              {categories.map((category, categoryIndex) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
                >
                  {/* Category Header */}
                  <TechCategoryHeader
                    category={category}
                    index={categoryIndex}
                    isExpanded={expandedCategories.has(category.name)}
                    onToggle={() => toggleCategory(category.name)}
                  />

                  {/* Technology Cards */}
                  <AnimatePresence>
                    {expandedCategories.has(category.name) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {category.technologies
                          .filter(tech => tech.name !== 'AWS Bedrock Nova') // Exclude featured tech
                          .map((tech, techIndex) => (
                          <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ 
                              duration: 0.4, 
                              delay: techIndex * 0.1 
                            }}
                          >
                            <TechCard
                              tech={tech}
                              category={category.name}
                              categoryColor={category.color}
                              onExpand={handleTechExpand}
                              className="h-full"
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <TechCategoryTimeline categories={categories} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technology Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              📊 기술 스택 비교
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              각 카테고리별 평균 성능 지표를 비교해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const avgPerformance = Math.round(
                category.technologies.reduce((acc, tech) => 
                  acc + (tech.stats?.performance || 0), 0) / category.technologies.length
              )
              const avgPopularity = Math.round(
                category.technologies.reduce((acc, tech) => 
                  acc + (tech.stats?.popularity || 0), 0) / category.technologies.length
              )
              const avgReliability = Math.round(
                category.technologies.reduce((acc, tech) => 
                  acc + (tech.stats?.reliability || 0), 0) / category.technologies.length
              )

              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-lg`}>
                      {category.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">성능</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {avgPerformance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-green-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${avgPerformance}%` }}
                          transition={{ duration: 1, delay: 1.6 + index * 0.1 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">인기도</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {avgPopularity}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${avgPopularity}%` }}
                          transition={{ duration: 1, delay: 1.8 + index * 0.1 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">안정성</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {avgReliability}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${avgReliability}%` }}
                          transition={{ duration: 1, delay: 2 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Expanded Tech Card Modal */}
      <AnimatePresence>
        {selectedTech && (
          <TechCardExpanded
            tech={selectedTech}
            category={categories.find(cat => 
              cat.technologies.some(t => t.name === selectedTech.name)
            )?.name || ''}
            categoryColor={categories.find(cat => 
              cat.technologies.some(t => t.name === selectedTech.name)
            )?.color || 'from-blue-500 to-purple-500'}
            onClose={handleTechCollapse}
          />
        )}
      </AnimatePresence>
    </section>
  )
}