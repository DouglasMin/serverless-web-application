/**
 * Flow Visualization Section Component
 * 생키 다이어그램 스타일의 시스템 플로우 시각화 섹션
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SankeyFlowProps, FlowNode } from '../types'
import { flowData } from '../data/aboutData'
import { useInView } from '../../../design/animations'
import { SankeyDiagram } from '../animations/SankeyDiagram'
import { ParticleFlow, FlowMetrics } from '../animations/ParticleFlow'
import { TextReveal, AnimatedCounter } from '../animations/TypewriterText'

interface Props extends Partial<SankeyFlowProps> {
  className?: string
}

export const FlowVisualizationSection: React.FC<Props> = ({
  nodes = flowData.nodes,
  links = flowData.links,
  animationConfig = {
    particleSpeed: 1,
    particleCount: 30,
    flowThickness: 4,
    colorGradient: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']
  },
  className = ''
}) => {
  const { ref, isInView } = useInView()
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const [viewMode, setViewMode] = useState<'sankey' | 'particles'>('sankey')

  const handleNodeHover = (node: FlowNode | null) => {
    setSelectedNode(node)
  }

  const handleNodeClick = (node: FlowNode) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node)
  }

  return (
    <section ref={ref} className={`py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden w-full ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />
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
            시스템 오케스트레이션
          </TextReveal>
          <TextReveal delay={0.4} className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            사용자의 입력부터 완성된 팟캐스트까지, 
            <span className="text-purple-600 dark:text-purple-400 font-semibold"> AWS Bedrock Nova</span>를 
            중심으로 한 데이터 플로우를 확인해보세요.
          </TextReveal>

          {/* View Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center space-x-4 mb-8"
          >
            <button
              onClick={() => setViewMode('sankey')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                viewMode === 'sankey'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              📊 플로우 다이어그램
            </button>
            <button
              onClick={() => setViewMode('particles')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                viewMode === 'particles'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              ✨ 파티클 플로우
            </button>
          </motion.div>
        </motion.div>

        {/* Flow Visualization Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mb-16"
        >
          {/* Desktop Flow */}
          <div className="hidden md:block">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden p-8">
              {viewMode === 'sankey' ? (
                <SankeyDiagram
                  nodes={nodes}
                  links={links}
                  particleCount={animationConfig.particleCount}
                  animationSpeed={animationConfig.particleSpeed}
                  onNodeHover={handleNodeHover}
                  onNodeClick={handleNodeClick}
                  className="w-full"
                />
              ) : (
                <div className="relative h-80">
                  <SankeyDiagram
                    nodes={nodes}
                    links={links}
                    particleCount={0}
                    animationSpeed={0}
                    onNodeHover={handleNodeHover}
                    onNodeClick={handleNodeClick}
                    className="w-full opacity-30"
                  />
                  <ParticleFlow
                    nodes={nodes}
                    links={links}
                    particleCount={animationConfig.particleCount * 2}
                    particleSpeed={animationConfig.particleSpeed}
                    showTrails={true}
                    className="absolute inset-0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Flow (Vertical) */}
          <div className="md:hidden space-y-6">
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative cursor-pointer"
                onClick={() => handleNodeClick(node)}
              >
                <div 
                  className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 transition-all duration-300 ${
                    selectedNode?.id === node.id ? 'ring-2 ring-blue-500 shadow-xl' : ''
                  }`}
                  style={{ borderLeftColor: node.color }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg"
                      style={{ backgroundColor: `${node.color}20` }}
                    >
                      {node.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {node.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {node.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Processing indicator for mobile */}
                  <motion.div
                    className="absolute top-4 right-4 w-3 h-3 rounded-full"
                    style={{ backgroundColor: node.color }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                </div>
                
                {/* Flow arrow for mobile */}
                {index < nodes.length - 1 && (
                  <div className="flex justify-center py-4">
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl text-gray-400 dark:text-gray-600"
                    >
                      ↓
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Selected Node Details */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
          >
            <div className="flex items-start space-x-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                style={{ backgroundColor: `${selectedNode.color}20` }}
              >
                {selectedNode.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedNode.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
                  {selectedNode.description}
                </p>
                
                {/* Additional details based on node type */}
                {selectedNode.id === 'bedrock' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">
                        AI 모델
                      </div>
                      <div className="text-gray-900 dark:text-white font-bold">
                        Nova Lite
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">
                        처리 속도
                      </div>
                      <div className="text-gray-900 dark:text-white font-bold">
                        ~2분
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
                        품질 점수
                      </div>
                      <div className="text-gray-900 dark:text-white font-bold">
                        95/100
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Real-time Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              실시간 성능 지표
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              시스템의 현재 상태와 성능을 실시간으로 모니터링합니다
            </p>
          </div>
          
          <FlowMetrics nodes={nodes} links={links} />
        </motion.div>

        {/* Key Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl">
            <div className="text-4xl mb-4">⚡</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              <AnimatedCounter from={0} to={180} suffix="초" />
            </div>
            <div className="text-gray-700 dark:text-gray-300 font-medium">
              평균 처리 시간
            </div>
          </div>
          
          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl">
            <div className="text-4xl mb-4">✅</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              <AnimatedCounter from={0} to={99.5} suffix="%" />
            </div>
            <div className="text-gray-700 dark:text-gray-300 font-medium">
              성공률
            </div>
          </div>
          
          <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl">
            <div className="text-4xl mb-4">⭐</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              <AnimatedCounter from={0} to={4.8} suffix="/5" />
            </div>
            <div className="text-gray-700 dark:text-gray-300 font-medium">
              사용자 만족도
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}