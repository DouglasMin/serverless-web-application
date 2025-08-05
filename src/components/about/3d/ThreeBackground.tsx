/**
 * Three.js Background Component
 * Hero 섹션을 위한 3D 배경 컴포넌트
 */

import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Float, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../../../design/theme'

interface FloatingGeometryProps {
  count?: number
  mouse?: React.MutableRefObject<[number, number]>
}

// Floating geometric shapes component
const FloatingGeometry: React.FC<FloatingGeometryProps> = ({ count = 100, mouse }) => {
  const meshRef = useRef<THREE.Points>(null!)
  const { theme } = useTheme()
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Random positions in a sphere
      const radius = Math.random() * 20 + 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Colors based on theme
      const colorIntensity = Math.random() * 0.5 + 0.5
      if (theme.resolvedTheme === 'dark') {
        colors[i * 3] = 0.3 + colorIntensity * 0.4     // R
        colors[i * 3 + 1] = 0.5 + colorIntensity * 0.3 // G
        colors[i * 3 + 2] = 0.8 + colorIntensity * 0.2 // B
      } else {
        colors[i * 3] = 0.2 + colorIntensity * 0.3     // R
        colors[i * 3 + 1] = 0.4 + colorIntensity * 0.4 // G
        colors[i * 3 + 2] = 0.9 + colorIntensity * 0.1 // B
      }
    }
    
    return [positions, colors]
  }, [count, theme.resolvedTheme])

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      
      // Rotate the entire point cloud
      meshRef.current.rotation.x = time * 0.1
      meshRef.current.rotation.y = time * 0.05
      
      // Mouse interaction
      if (mouse) {
        meshRef.current.rotation.x += mouse.current[1] * 0.1
        meshRef.current.rotation.y += mouse.current[0] * 0.1
      }
      
      // Update individual point positions for floating effect
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i] * 0.01) * 0.01
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={meshRef} positions={positions} colors={colors}>
      <PointMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}

// Floating spheres component
const FloatingSpheres: React.FC = () => {
  const { theme } = useTheme()
  
  const spheres = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.5,
      color: theme.resolvedTheme === 'dark' 
        ? new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.6)
        : new THREE.Color().setHSL(0.55 + Math.random() * 0.3, 0.8, 0.7)
    }))
  }, [theme.resolvedTheme])

  return (
    <>
      {spheres.map((sphere) => (
        <Float
          key={sphere.id}
          speed={1 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <Sphere
            position={sphere.position}
            scale={sphere.scale}
            args={[1, 32, 32]}
          >
            <meshStandardMaterial
              color={sphere.color}
              transparent
              opacity={0.3}
              roughness={0.1}
              metalness={0.1}
            />
          </Sphere>
        </Float>
      ))}
    </>
  )
}

// Animated mesh gradient component
const AnimatedMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { theme } = useTheme()

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.rotation.x = time * 0.2
      meshRef.current.rotation.y = time * 0.1
      meshRef.current.position.y = Math.sin(time * 0.5) * 2
    }
  })

  return (
    <mesh ref={meshRef} position={[8, 0, -5]} scale={[3, 3, 3]}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial
        color={theme.resolvedTheme === 'dark' ? '#4F46E5' : '#6366F1'}
        transparent
        opacity={0.4}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

// Camera controller for mouse interaction
const CameraController: React.FC<{ mouse: React.MutableRefObject<[number, number]> }> = ({ mouse }) => {
  const { camera } = useThree()
  
  useFrame(() => {
    camera.position.x += (mouse.current[0] * 2 - camera.position.x) * 0.05
    camera.position.y += (-mouse.current[1] * 2 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

interface ThreeBackgroundProps {
  backgroundAnimation?: 'particles' | 'mesh' | 'geometric'
  className?: string
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({
  backgroundAnimation = 'geometric',
  className = ''
}) => {
  const mouseRef = useRef<[number, number]>([0, 0])
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        mouseRef.current = [
          (event.clientX - rect.left) / rect.width - 0.5,
          (event.clientY - rect.top) / rect.height - 0.5
        ]
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        {/* Lighting */}
        <ambientLight intensity={theme.resolvedTheme === 'dark' ? 0.3 : 0.5} />
        <pointLight 
          position={[10, 10, 10]} 
          intensity={theme.resolvedTheme === 'dark' ? 0.8 : 1} 
          color={theme.resolvedTheme === 'dark' ? '#4F46E5' : '#6366F1'}
        />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={0.5} 
          color={theme.resolvedTheme === 'dark' ? '#EC4899' : '#F59E0B'}
        />

        {/* Camera Controller */}
        <CameraController mouse={mouseRef} />

        {/* Background Elements based on animation type */}
        {backgroundAnimation === 'particles' && (
          <FloatingGeometry count={200} mouse={mouseRef} />
        )}
        
        {backgroundAnimation === 'geometric' && (
          <>
            <FloatingGeometry count={100} mouse={mouseRef} />
            <FloatingSpheres />
          </>
        )}
        
        {backgroundAnimation === 'mesh' && (
          <>
            <FloatingGeometry count={50} mouse={mouseRef} />
            <AnimatedMesh />
          </>
        )}
      </Canvas>
    </div>
  )
}