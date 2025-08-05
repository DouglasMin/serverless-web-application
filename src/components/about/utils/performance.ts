/**
 * Performance Utilities for About Page
 */

import { AnimationConfig } from '../types'

// Device capability detection
export const detectDeviceCapabilities = () => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  return {
    webgl: !!gl,
    deviceMemory: (navigator as any).deviceMemory || 4,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    connection: (navigator as any).connection?.effectiveType || '4g',
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
}

// Get optimal animation settings based on device
export const getOptimalAnimationConfig = (): AnimationConfig => {
  const capabilities = detectDeviceCapabilities()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  if (prefersReducedMotion) {
    return {
      reducedMotion: true,
      performance: 'low',
      effects: {
        parallax: false,
        particles: false,
        morphing: false,
        transitions: true
      },
      timing: {
        fast: 0,
        normal: 0,
        slow: 0
      }
    }
  }
  
  if (capabilities.isMobile || capabilities.deviceMemory < 4) {
    return {
      reducedMotion: false,
      performance: 'low',
      effects: {
        parallax: false,
        particles: false,
        morphing: false,
        transitions: true
      },
      timing: {
        fast: 150,
        normal: 300,
        slow: 500
      }
    }
  }
  
  if (!capabilities.webgl || capabilities.deviceMemory < 8) {
    return {
      reducedMotion: false,
      performance: 'medium',
      effects: {
        parallax: true,
        particles: false,
        morphing: true,
        transitions: true
      },
      timing: {
        fast: 150,
        normal: 300,
        slow: 500
      }
    }
  }
  
  return {
    reducedMotion: false,
    performance: 'high',
    effects: {
      parallax: true,
      particles: true,
      morphing: true,
      transitions: true
    },
    timing: {
      fast: 150,
      normal: 300,
      slow: 500
    }
  }
}

// FPS monitoring
export class PerformanceMonitor {
  private frameCount = 0
  private lastTime = performance.now()
  private animationId: number | null = null
  private onUpdate: (metrics: { fps: number; memoryUsage: number; renderTime: number }) => void
  
  constructor(onUpdate: (metrics: { fps: number; memoryUsage: number; renderTime: number }) => void) {
    this.onUpdate = onUpdate
    this.start()
  }
  
  private start() {
    const measureFPS = () => {
      this.frameCount++
      const currentTime = performance.now()
      
      if (currentTime - this.lastTime >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
        const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0
        const renderTime = currentTime - this.lastTime
        
        this.onUpdate({ fps, memoryUsage, renderTime })
        
        this.frameCount = 0
        this.lastTime = currentTime
      }
      
      this.animationId = requestAnimationFrame(measureFPS)
    }
    
    this.animationId = requestAnimationFrame(measureFPS)
  }
  
  disconnect() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }
}

// Animation quality adjustment
export const adjustAnimationQuality = (quality: 'low' | 'medium' | 'high') => {
  const root = document.documentElement
  
  switch (quality) {
    case 'low':
      root.style.setProperty('--animation-duration-fast', '0ms')
      root.style.setProperty('--animation-duration-normal', '150ms')
      root.style.setProperty('--animation-duration-slow', '300ms')
      root.style.setProperty('--particle-count', '0')
      break
    case 'medium':
      root.style.setProperty('--animation-duration-fast', '100ms')
      root.style.setProperty('--animation-duration-normal', '250ms')
      root.style.setProperty('--animation-duration-slow', '400ms')
      root.style.setProperty('--particle-count', '50')
      break
    case 'high':
      root.style.setProperty('--animation-duration-fast', '150ms')
      root.style.setProperty('--animation-duration-normal', '300ms')
      root.style.setProperty('--animation-duration-slow', '500ms')
      root.style.setProperty('--particle-count', '200')
      break
  }
}

// Check WebGL support
export const checkWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch (e) {
    return false
  }
}

// Check performance capabilities
export const checkPerformance = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const start = performance.now()
    let frameCount = 0
    
    const testFrame = () => {
      frameCount++
      if (frameCount < 60) {
        requestAnimationFrame(testFrame)
      } else {
        const end = performance.now()
        const fps = 60000 / (end - start)
        resolve(fps > 45) // Consider good performance if > 45 FPS
      }
    }
    
    requestAnimationFrame(testFrame)
  })
}

// Check bandwidth (rough estimate)
export const checkBandwidth = async (): Promise<boolean> => {
  const connection = (navigator as any).connection
  if (!connection) return true
  
  const goodConnections = ['4g', 'wifi']
  return goodConnections.includes(connection.effectiveType)
}