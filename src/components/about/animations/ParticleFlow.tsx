/**
 * Particle Flow Component
 * 데이터 플로우를 시각화하는 파티클 시스템
 */

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FlowNode, FlowLink } from '../types'

interface ParticleFlowProps {
  nodes: FlowNode[]
  links: FlowLink[]
  className?: string
  particleCount?: number
  particleSpeed?: number
  particleSize?: number
  showTrails?: boolean
}

interface Particle {
  id: string
  x: number
  y: number
  targetX: number
  targetY: number
  color: string
  size: number
  speed: number
  trail: Array<{ x: number; y: number; opacity: number }>
  linkIndex: number
  progress: number
}

export const ParticleFlow: React.FC<ParticleFlowProps> = ({
  nodes,
  links,
  className = '',
  particleCount = 50,
  particleSpeed = 1,
  particleSize = 3,
  showTrails = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [particles, setParticles] = useState<Particle[]>([])
  const [isVisible, setIsVisible] = useState(false)

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = []
    
    links.forEach((link, linkIndex) => {
      const sourceNode = nodes.find(n => n.id === link.source)
      const targetNode = nodes.find(n => n.id === link.target)
      
      if (!sourceNode || !targetNode) return
      
      const particlesPerLink = Math.floor(particleCount / links.length)
      
      for (let i = 0; i < particlesPerLink; i++) {
        newParticles.push({
          id: `${linkIndex}-${i}`,
          x: sourceNode.position.x + 80,
          y: sourceNode.position.y + 40,
          targetX: targetNode.position.x,
          targetY: targetNode.position.y + 40,
          color: link.color,
          size: particleSize + Math.random() * 2,
          speed: particleSpeed * (0.5 + Math.random() * 0.5),
          trail: [],
          linkIndex,
          progress: Math.random() // Random starting position
        })
      }
    })
    
    setParticles(newParticles)
  }, [nodes, links, particleCount, particleSpeed, particleSize])

  // Animation loop
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const link = links[particle.linkIndex]
          if (!link) return particle
          
          // Update progress
          let newProgress = particle.progress + particle.speed * 0.01
          if (newProgress > 1) {
            newProgress = 0 // Reset to start
          }
          
          // Calculate position along curve
          const sourceNode = nodes.find(n => n.id === link.source)
          const targetNode = nodes.find(n => n.id === link.target)
          
          if (!sourceNode || !targetNode) return particle
          
          const startX = sourceNode.position.x + 80
          const startY = sourceNode.position.y + 40
          const endX = targetNode.position.x
          const endY = targetNode.position.y + 40
          
          // Bezier curve calculation
          const controlX = (startX + endX) / 2
          const controlY = Math.min(startY, endY) - 50
          
          const t = newProgress
          const newX = Math.pow(1 - t, 2) * startX + 
                     2 * (1 - t) * t * controlX + 
                     Math.pow(t, 2) * endX
          const newY = Math.pow(1 - t, 2) * startY + 
                     2 * (1 - t) * t * controlY + 
                     Math.pow(t, 2) * endY
          
          // Update trail
          const newTrail = showTrails ? [
            { x: newX, y: newY, opacity: 1 },
            ...particle.trail.slice(0, 8).map((point, index) => ({
              ...point,
              opacity: 1 - (index + 1) * 0.15
            }))
          ] : []
          
          return {
            ...particle,
            x: newX,
            y: newY,
            progress: newProgress,
            trail: newTrail
          }
        })
      )
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible, nodes, links, showTrails])

  // Draw particles on canvas
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    particles.forEach(particle => {
      // Draw trail
      if (showTrails && particle.trail.length > 1) {
        particle.trail.forEach((point, index) => {
          if (index === 0) return
          
          const prevPoint = particle.trail[index - 1]
          ctx.beginPath()
          ctx.moveTo(prevPoint.x, prevPoint.y)
          ctx.lineTo(point.x, point.y)
          ctx.strokeStyle = particle.color + Math.floor(point.opacity * 255).toString(16).padStart(2, '0')
          ctx.lineWidth = particle.size * (point.opacity * 0.5)
          ctx.stroke()
        })
      }
      
      // Draw particle
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.shadowColor = particle.color
      ctx.shadowBlur = particle.size * 2
      ctx.fill()
      ctx.shadowBlur = 0
    })
  }, [particles, showTrails])

  // Intersection observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    
    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={300}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

interface FlowMetricsProps {
  nodes: FlowNode[]
  links: FlowLink[]
  className?: string
}

export const FlowMetrics: React.FC<FlowMetricsProps> = ({
  nodes: _nodes,
  links,
  className = ''
}) => {
  const [metrics, setMetrics] = useState({
    totalThroughput: 0,
    averageLatency: 0,
    successRate: 0,
    activeConnections: 0
  })

  useEffect(() => {
    // Simulate real-time metrics
    const interval = setInterval(() => {
      setMetrics({
        totalThroughput: Math.floor(Math.random() * 1000 + 500),
        averageLatency: Math.floor(Math.random() * 100 + 50),
        successRate: Math.floor(Math.random() * 5 + 95),
        activeConnections: links.length
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [links.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}
    >
      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <motion.div
          key={metrics.totalThroughput}
          initial={{ scale: 1.2, color: '#3B82F6' }}
          animate={{ scale: 1, color: 'inherit' }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          {metrics.totalThroughput.toLocaleString()}
        </motion.div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          처리량/분
        </div>
      </div>

      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <motion.div
          key={metrics.averageLatency}
          initial={{ scale: 1.2, color: '#10B981' }}
          animate={{ scale: 1, color: 'inherit' }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-green-600 dark:text-green-400"
        >
          {metrics.averageLatency}ms
        </motion.div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          평균 지연시간
        </div>
      </div>

      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <motion.div
          key={metrics.successRate}
          initial={{ scale: 1.2, color: '#8B5CF6' }}
          animate={{ scale: 1, color: 'inherit' }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-purple-600 dark:text-purple-400"
        >
          {metrics.successRate}%
        </motion.div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          성공률
        </div>
      </div>

      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <motion.div
          key={metrics.activeConnections}
          initial={{ scale: 1.2, color: '#F59E0B' }}
          animate={{ scale: 1, color: 'inherit' }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-orange-600 dark:text-orange-400"
        >
          {metrics.activeConnections}
        </motion.div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          활성 연결
        </div>
      </div>
    </motion.div>
  )
}