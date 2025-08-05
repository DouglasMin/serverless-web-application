/**
 * About Page - Redesigned with Advanced Animation System
 * 혁신적인 디자인과 3D 요소, 고급 애니메이션 시스템이 포함된 About 페이지
 */

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import {
  HeroSection,
  ServiceStorySection,
  FlowVisualizationSection,
  TechStackSection,
  TeamVisionSection,
  SecuritySection
} from '../components/about/sections'
import { getOptimalAnimationConfig, PerformanceMonitor } from '../components/about/utils/performance'
import { AboutPageState, AnimationConfig } from '../components/about/types'
import {
  AnimationProvider,
  PerformanceMonitor as AnimationPerformanceMonitor
} from '../components/about/animations/AdvancedAnimationSystem'
import { AdvancedPageTransition } from '../components/about/animations/PageTransitions'
import { ScrollProgress } from '../components/about/animations/ParallaxScrolling'


const AboutPage: React.FC = () => {
  const [_pageState, setPageState] = useState<AboutPageState>({
    currentSection: 'hero',
    scrollProgress: 0,
    animationsEnabled: true,
    interactionsEnabled: true,
    performanceMode: 'auto'
  })

  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(() =>
    getOptimalAnimationConfig()
  )

  // Performance monitoring
  useEffect(() => {
    const monitor = new PerformanceMonitor((metrics) => {
      // Adjust animation quality based on performance
      if (metrics.fps < 30 && animationConfig.performance !== 'low') {
        setAnimationConfig(prev => ({
          ...prev,
          performance: 'low',
          effects: {
            ...prev.effects,
            particles: false,
            morphing: false
          }
        }))
      }
    })

    return () => monitor.disconnect()
  }, [animationConfig.performance])

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = Math.min(scrollTop / docHeight, 1)

      setPageState(prev => ({
        ...prev,
        scrollProgress
      }))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Section visibility tracking
  useEffect(() => {
    const sections = ['hero', 'story', 'flow', 'tech', 'team', 'security']
    const observers = sections.map(sectionId => {
      const element = document.getElementById(sectionId)
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setPageState(prev => ({
              ...prev,
              currentSection: sectionId
            }))
          }
        },
        { threshold: 0.3 }
      )

      observer.observe(element)
      return observer
    })

    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [])

  return (
    <AnimationProvider>
      <AnimationPerformanceMonitor>
        <AdvancedPageTransition type="fade" duration={0.8}>
          <div className="about-page min-h-screen bg-white dark:bg-gray-900">
            {/* Header */}
            <Header />

            {/* Enhanced Progress Indicator */}
            <ScrollProgress color="#3B82F6" />

            {/* Hero Section */}
            <section id="hero" className="about-section">
              <HeroSection />
            </section>

            {/* Service Story Section */}
            <section id="story" className="about-section">
              <ServiceStorySection />
            </section>

            {/* Flow Visualization Section */}
            <section id="flow" className="about-section">
              <FlowVisualizationSection />
            </section>

            {/* Tech Stack Section */}
            <section id="tech" className="about-section">
              <TechStackSection />
            </section>

            {/* Team & Vision Section */}
            <section id="team" className="about-section">
              <TeamVisionSection />
            </section>

            {/* Security Section */}
            <section id="security" className="about-section">
              <SecuritySection />
            </section>
          </div>
        </AdvancedPageTransition>
      </AnimationPerformanceMonitor>
    </AnimationProvider>
  )
}

export default AboutPage