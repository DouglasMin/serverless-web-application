/**
 * Security Section Component
 * 보안 및 신뢰성 정보를 표시하는 섹션
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SecuritySectionProps } from '../types'
import { securityData } from '../data/aboutData'
import { useInView } from '../../../design/animations'
import { 
  SecurityShield, 
  EncryptionVisualization, 
  TrustIndicator, 
  ComplianceBadge 
} from '../animations/SecurityAnimations'
import { TextReveal, AnimatedCounter } from '../animations/TypewriterText'
import { InteractiveCard } from '../animations/ImageParallax'

interface Props extends Partial<SecuritySectionProps> {
  className?: string
}

export const SecuritySection: React.FC<Props> = ({
  features = securityData,
  className = ''
}) => {
  const { ref, isInView } = useInView()
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const trustMetrics = [
    { value: 99.9, label: '서비스 가동률', icon: '⚡', color: '#3B82F6' },
    { value: 24, label: '시간 자동 삭제', icon: '🗑️', color: '#10B981' },
    { value: 256, label: 'AES 암호화', icon: '🔐', color: '#8B5CF6' },
    { value: 100, label: '규정 준수율', icon: '✅', color: '#F59E0B' }
  ]

  const complianceStandards = [
    { name: 'SOC 2', issuer: 'AICPA', isVerified: true },
    { name: 'ISO 27001', issuer: 'ISO', isVerified: true },
    { name: 'GDPR', issuer: 'EU', isVerified: true },
    { name: 'CCPA', issuer: 'California', isVerified: true }
  ]

  return (
    <section ref={ref} className={`py-20 relative overflow-hidden w-full ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 via-transparent to-green-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-green-900/10" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl" />
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
            신뢰성 & 보안
          </TextReveal>
          <TextReveal delay={0.4} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">AWS 엔터프라이즈급 보안</span>으로 
            여러분의 데이터를 안전하게 보호합니다
          </TextReveal>

          {/* Security Shield Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex justify-center mb-8"
          >
            <SecurityShield size={120} isActive={isInView} />
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {trustMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
            >
              <TrustIndicator
                value={metric.value}
                label={metric.label}
                icon={metric.icon}
                color={metric.color}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Encryption Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              🔐 데이터 암호화 과정
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              업로드된 모든 데이터는 AES-256 암호화로 안전하게 보호됩니다
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <EncryptionVisualization isAnimating={isInView} />
          </div>
        </motion.div>

        {/* Security Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              🛡️ 보안 기능
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              다층 보안 시스템으로 완벽한 데이터 보호를 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.6 + index * 0.2 }}
              >
                <InteractiveCard
                  className="h-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                  hoverScale={1.02}
                >
                  {/* Feature Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {feature.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Implementation Details */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      구현 방식
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {feature.implementation}
                    </p>
                  </div>

                  {/* Compliance Badges */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      준수 표준
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {feature.compliance.map((standard) => (
                        <motion.span
                          key={standard}
                          className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {standard}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Expand button */}
                  <motion.button
                    className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                    onClick={() => setActiveFeature(
                      activeFeature === feature.name ? null : feature.name
                    )}
                    whileHover={{ x: 5 }}
                  >
                    {activeFeature === feature.name ? '접기' : '자세히 보기'} →
                  </motion.button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {activeFeature === feature.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                      >
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                          <div>
                            <strong>보안 수준:</strong> 엔터프라이즈급
                          </div>
                          <div>
                            <strong>모니터링:</strong> 24/7 실시간 감시
                          </div>
                          <div>
                            <strong>업데이트:</strong> 자동 보안 패치 적용
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Compliance Standards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              📋 규정 준수 인증
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              국제 보안 표준을 준수하여 최고 수준의 신뢰성을 보장합니다
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {complianceStandards.map((standard, index) => (
              <motion.div
                key={standard.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 2 + index * 0.1 }}
              >
                <ComplianceBadge
                  name={standard.name}
                  issuer={standard.issuer}
                  isVerified={standard.isVerified}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Promise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="text-center"
        >
          <InteractiveCard className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700 max-w-4xl mx-auto">
            <motion.div
              className="text-6xl mb-4"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              🔒
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              개인정보 보호 약속
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 max-w-2xl mx-auto">
              업로드하신 파일과 생성된 콘텐츠는 처리 완료 후 
              <span className="font-semibold text-green-600 dark:text-green-400"> 24시간 이내 자동 삭제</span>됩니다. 
              개인정보는 서비스 제공 목적으로만 사용되며, 제3자와 공유되지 않습니다.
            </p>
            
            {/* Privacy metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  <AnimatedCounter from={0} to={0} suffix="%" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  데이터 영구 저장
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  <AnimatedCounter from={0} to={100} suffix="%" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  자동 삭제율
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  <AnimatedCounter from={0} to={0} suffix="건" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  데이터 유출 사고
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {['GDPR 준수', '개인정보보호법 준수', 'CCPA 준수'].map((compliance, index) => (
                <motion.span
                  key={compliance}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium shadow-sm border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 2.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {compliance}
                </motion.span>
              ))}
            </div>
          </InteractiveCard>
        </motion.div>
      </div>
    </section>
  )
}