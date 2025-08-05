/**
 * Particle System Component
 * 고성능 파티클 애니메이션 시스템
 */

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../../../design/theme'

interface ParticleSystemProps {
  count?: number
  size?: number
  speed?: number
  opacity?: number
  colors?: string[]
  mouse?: React.MutableRefObject<[number, number]>
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 1000,
  size = 0.02,
  speed = 0.5,
  opacity = 0.6,
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'],
  mouse
}) => {
  const pointsRef = useRef<THREE.Points>(null!)
  const { theme } = useTheme()
  
  // Generate particle data
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const particleColors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      // Random positions in a large sphere
      const radius = Math.random() * 50 + 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Random velocities
      velocities[i * 3] = (Math.random() - 0.5) * speed
      velocities[i * 3 + 1] = (Math.random() - 0.5) * speed
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed
      
      // Random colors from palette
      const colorIndex = Math.floor(Math.random() * colors.length)
      const color = new THREE.Color(colors[colorIndex])
      
      // Adjust colors based on theme
      if (theme.resolvedTheme === 'dark') {
        color.multiplyScalar(1.2)
      } else {
        color.multiplyScalar(0.8)
      }
      
      particleColors[i * 3] = color.r
      particleColors[i * 3 + 1] = color.g
      particleColors[i * 3 + 2] = color.b
      
      // Random sizes
      sizes[i] = Math.random() * size + size * 0.5
    }
    
    return { positions, velocities, particleColors, sizes }
  }, [count, speed, size, colors, theme.resolvedTheme])

  // Create geometry and material
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(particleData.particleColors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(particleData.sizes, 1))
    return geo
  }, [particleData])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: opacity },
        mouse: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vSize;
        uniform float time;
        uniform vec2 mouse;
        
        void main() {
          vColor = color;
          vSize = size;
          
          vec3 pos = position;
          
          // Mouse interaction
          vec2 mouseInfluence = mouse * 5.0;
          pos.x += sin(time + pos.y * 0.01) * mouseInfluence.x * 0.1;
          pos.y += cos(time + pos.x * 0.01) * mouseInfluence.y * 0.1;
          
          // Floating animation
          pos.y += sin(time * 0.5 + pos.x * 0.01) * 2.0;
          pos.x += cos(time * 0.3 + pos.z * 0.01) * 1.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vSize;
        uniform float opacity;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - (dist * 2.0);
          alpha = pow(alpha, 2.0);
          
          gl_FragColor = vec4(vColor, alpha * opacity);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }, [opacity])

  // Animation loop
  useFrame((state) => {
    if (pointsRef.current && material.uniforms) {
      const time = state.clock.getElapsedTime()
      material.uniforms.time.value = time
      
      // Update mouse position
      if (mouse) {
        material.uniforms.mouse.value.set(mouse.current[0], mouse.current[1])
      }
      
      // Update particle positions
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        
        // Apply velocities
        positions[i3] += particleData.velocities[i3] * 0.1
        positions[i3 + 1] += particleData.velocities[i3 + 1] * 0.1
        positions[i3 + 2] += particleData.velocities[i3 + 2] * 0.1
        
        // Boundary checking - wrap around
        if (Math.abs(positions[i3]) > 60) {
          positions[i3] = -positions[i3] * 0.5
        }
        if (Math.abs(positions[i3 + 1]) > 60) {
          positions[i3 + 1] = -positions[i3 + 1] * 0.5
        }
        if (Math.abs(positions[i3 + 2]) > 60) {
          positions[i3 + 2] = -positions[i3 + 2] * 0.5
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  )
}

// Simplified particle system for low-performance devices
export const SimpleParticleSystem: React.FC<Partial<ParticleSystemProps>> = ({
  count = 100,
  size = 0.05,
  opacity = 0.4
}) => {
  const pointsRef = useRef<THREE.Points>(null!)
  const { theme } = useTheme()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime()
      pointsRef.current.rotation.y = time * 0.1
      pointsRef.current.rotation.x = time * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={theme.resolvedTheme === 'dark' ? '#6366F1' : '#3B82F6'}
        transparent
        opacity={opacity}
        sizeAttenuation={true}
      />
    </points>
  )
}