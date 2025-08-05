/**
 * Sankey Diagram Component
 * 생키 다이어그램 스타일의 데이터 플로우 시각화
 */

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FlowNode, FlowLink } from '../types'
import { useTheme } from '../../../design/theme'

interface SankeyDiagramProps {
  nodes: FlowNode[]
  links: FlowLink[]
  width?: number
  height?: number
  className?: string
  particleCount?: number
  animationSpeed?: number
  onNodeHover?: (node: FlowNode | null) => void
  onNodeClick?: (node: FlowNode) => void
}

interface ParticleProps {
  path: string
  color: string
  delay: number
  duration: number
  size: number
}

const AnimatedParticle: React.FC<ParticleProps> = ({
  path,
  color,
  delay,
  duration,
  size
}) => {
  return (
    <motion.circle
      r={size}
      fill={color}
      initial={{ offsetDistance: '0%', opacity: 0 }}
      animate={{
        offsetDistance: ['0%', '100%'],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        offsetPath: `path('${path}')`,
        filter: 'blur(0.5px)'
      }}
    />
  )
}

export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
  nodes,
  links,
  width = 1000,
  height = 300,
  className = '',
  particleCount = 20,
  animationSpeed = 1,
  onNodeHover,
  onNodeClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [particles, setParticles] = useState<Array<{
    id: string
    path: string
    color: string
    delay: number
    duration: number
    size: number
  }>>([])
  const { theme } = useTheme()

  // Generate curved path between two points
  const generatePath = (
    x1: number, y1: number,
    x2: number, y2: number,
    thickness: number
  ): string => {
    const midX = (x1 + x2) / 2
    const controlY1 = y1 - thickness * 2
    
    return `M ${x1} ${y1} Q ${midX} ${controlY1} ${x2} ${y2}`
  }

  // Generate particles for animated flow
  useEffect(() => {
    const newParticles: typeof particles = []
    
    links.forEach((link, linkIndex) => {
      const sourceNode = nodes.find(n => n.id === link.source)
      const targetNode = nodes.find(n => n.id === link.target)
      
      if (!sourceNode || !targetNode) return
      
      const path = generatePath(
        sourceNode.position.x + 80,
        sourceNode.position.y + 40,
        targetNode.position.x,
        targetNode.position.y + 40,
        link.value / 10
      )
      
      // Create multiple particles per link
      for (let i = 0; i < particleCount / links.length; i++) {
        newParticles.push({
          id: `${linkIndex}-${i}`,
          path,
          color: link.color,
          delay: (i * 0.5) + (linkIndex * 0.2),
          duration: 3 / animationSpeed,
          size: Math.random() * 3 + 2
        })
      }
    })
    
    setParticles(newParticles)
  }, [nodes, links, particleCount, animationSpeed])

  const handleNodeHover = (node: FlowNode | null) => {
    setHoveredNode(node?.id || null)
    onNodeHover?.(node)
  }

  const getNodeOpacity = (nodeId: string) => {
    if (!hoveredNode) return 1
    
    // Highlight connected nodes
    const isConnected = links.some(
      link => link.source === nodeId || link.target === nodeId
    )
    
    return hoveredNode === nodeId || isConnected ? 1 : 0.3
  }

  const getLinkOpacity = (link: FlowLink) => {
    if (!hoveredNode) return 0.6
    
    return link.source === hoveredNode || link.target === hoveredNode ? 0.9 : 0.2
  }

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Gradient definitions */}
        <defs>
          {links.map((link, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`flow-gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={link.color} stopOpacity="0.8" />
              <stop offset="50%" stopColor={link.color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={link.color} stopOpacity="0.4" />
            </linearGradient>
          ))}
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Drop shadow */}
          <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Flow Links */}
        {links.map((link, index) => {
          const sourceNode = nodes.find(n => n.id === link.source)
          const targetNode = nodes.find(n => n.id === link.target)
          
          if (!sourceNode || !targetNode) return null
          
          const path = generatePath(
            sourceNode.position.x + 80,
            sourceNode.position.y + 40,
            targetNode.position.x,
            targetNode.position.y + 40,
            link.value / 10
          )
          
          return (
            <g key={`link-${index}`}>
              {/* Main flow path */}
              <motion.path
                d={path}
                stroke={`url(#flow-gradient-${index})`}
                strokeWidth={Math.max(link.value / 5, 4)}
                fill="none"
                strokeLinecap="round"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: getLinkOpacity(link)
                }}
                transition={{ 
                  duration: 2, 
                  delay: index * 0.3,
                  ease: 'easeInOut'
                }}
                className="transition-opacity duration-300"
              />
              
              {/* Flow direction indicator */}
              <motion.path
                d={path}
                stroke={link.color}
                strokeWidth="2"
                fill="none"
                strokeDasharray="10 5"
                initial={{ strokeDashoffset: 15 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                opacity={getLinkOpacity(link)}
                className="transition-opacity duration-300"
              />
            </g>
          )
        })}

        {/* Animated Particles */}
        {particles.map((particle) => (
          <AnimatedParticle
            key={particle.id}
            path={particle.path}
            color={particle.color}
            delay={particle.delay}
            duration={particle.duration}
            size={particle.size}
          />
        ))}

        {/* Flow Nodes */}
        {nodes.map((node, index) => (
          <g key={node.id}>
            {/* Node glow effect */}
            <motion.rect
              x={node.position.x - 10}
              y={node.position.y - 10}
              width="270"
              height="140"
              rx="24"
              fill={node.color}
              opacity="0.2"
              filter="url(#glow)"
              initial={{ scale: 0 }}
              animate={{ 
                scale: hoveredNode === node.id ? 1.1 : 1,
                opacity: getNodeOpacity(node.id) * 0.2
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Main node */}
            <motion.rect
              x={node.position.x}
              y={node.position.y}
              width="250"
              height="120"
              rx="16"
              fill={theme.resolvedTheme === 'dark' ? '#1F2937' : '#FFFFFF'}
              stroke={node.color}
              strokeWidth="2"
              filter="url(#dropshadow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: getNodeOpacity(node.id)
              }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                type: 'spring',
                stiffness: 200
              }}
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => handleNodeHover(node)}
              onMouseLeave={() => handleNodeHover(null)}
              onClick={() => onNodeClick?.(node)}
              className="cursor-pointer transition-all duration-300"
            />
            
            {/* Node icon */}
            <motion.text
              x={node.position.x + 35}
              y={node.position.y + 55}
              fontSize="32"
              textAnchor="middle"
              dominantBaseline="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: getNodeOpacity(node.id) }}
              transition={{ duration: 0.3, delay: index * 0.2 + 0.3 }}
              className="pointer-events-none"
            >
              {node.icon}
            </motion.text>
            
            {/* Node text container */}
            <foreignObject
              x={node.position.x + 25}
              y={node.position.y + 15}
              width="200"
              height="90"
              className="pointer-events-none"
            >
              <motion.div
                className="sankey-node-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: getNodeOpacity(node.id), 
                  x: 0 
                }}
                transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
              >
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1">
                    {node.label}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
                    {node.description.length > 20 ? 
                      node.description.substring(0, 20) + '...' : 
                      node.description
                    }
                  </div>
                </div>
              </motion.div>
            </foreignObject>

            {/* Processing indicator */}
            {hoveredNode === node.id && (
              <motion.circle
                cx={node.position.x + 140}
                cy={node.position.y + 20}
                r="6"
                fill={node.color}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <animate
                  attributeName="opacity"
                  values="1;0.3;1"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </motion.circle>
            )}
          </g>
        ))}
      </svg>

      {/* Node tooltip */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs z-10"
        >
          {(() => {
            const node = nodes.find(n => n.id === hoveredNode)
            if (!node) return null
            
            return (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{node.icon}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {node.label}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {node.description}
                </p>
              </div>
            )
          })()}
        </motion.div>
      )}
    </div>
  )
}