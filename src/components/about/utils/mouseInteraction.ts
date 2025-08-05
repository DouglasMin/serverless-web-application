/**
 * Mouse Interaction Utilities
 * 마우스 움직임 기반 패럴랙스 및 인터랙션 효과
 */

import { useEffect, useRef, useState } from 'react'

export interface MousePosition {
  x: number
  y: number
  normalizedX: number // -1 to 1
  normalizedY: number // -1 to 1
}

// Mouse position tracking hook
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0
  })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX
      const y = event.clientY
      const normalizedX = (x / window.innerWidth) * 2 - 1
      const normalizedY = (y / window.innerHeight) * 2 - 1

      setMousePosition({
        x,
        y,
        normalizedX,
        normalizedY
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return mousePosition
}

// Parallax effect hook
export const useParallax = (intensity: number = 0.1) => {
  const mousePosition = useMousePosition()
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (elementRef.current) {
      const x = mousePosition.normalizedX * intensity * 50
      const y = mousePosition.normalizedY * intensity * 50
      
      elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
  }, [mousePosition, intensity])

  return elementRef
}

// Mouse following effect hook
export const useMouseFollow = (speed: number = 0.1) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const mousePosition = useMousePosition()
  const animationRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      setPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * speed,
        y: prev.y + (mousePosition.y - prev.y) * speed
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition, speed])

  return position
}

// Magnetic effect hook
export const useMagneticEffect = (strength: number = 0.3) => {
  const elementRef = useRef<HTMLElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => {
      setIsHovered(false)
      element.style.transform = 'translate3d(0, 0, 0)'
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isHovered) return

      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (event.clientX - centerX) * strength
      const deltaY = (event.clientY - centerY) * strength
      
      element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mousemove', handleMouseMove)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mousemove', handleMouseMove)
    }
  }, [strength, isHovered])

  return elementRef
}

// Tilt effect hook
export const useTiltEffect = (maxTilt: number = 15) => {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (event.clientX - centerX) / (rect.width / 2)
      const deltaY = (event.clientY - centerY) / (rect.height / 2)
      
      const tiltX = deltaY * maxTilt
      const tiltY = -deltaX * maxTilt
      
      element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
    }

    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [maxTilt])

  return elementRef
}

// Cursor trail effect
export const useCursorTrail = (trailLength: number = 10) => {
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([])
  const mousePosition = useMousePosition()
  const idRef = useRef(0)

  useEffect(() => {
    const newPoint = {
      x: mousePosition.x,
      y: mousePosition.y,
      id: idRef.current++
    }

    setTrail(prev => {
      const newTrail = [newPoint, ...prev]
      return newTrail.slice(0, trailLength)
    })
  }, [mousePosition, trailLength])

  return trail
}

// Smooth mouse position with easing
export const useSmoothMouse = (easing: number = 0.1) => {
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const mousePosition = useMousePosition()
  const animationRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      setSmoothPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * easing,
        y: prev.y + (mousePosition.y - prev.y) * easing
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition, easing])

  return smoothPosition
}