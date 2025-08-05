/**
 * Page Transition Animations
 * 기존 시스템을 확장한 고급 페이지 전환 애니메이션
 */

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnimationContext } from './AdvancedAnimationSystem'

// Advanced Page Transition Wrapper
interface AdvancedPageTransitionProps {
  children: React.ReactNode
  type?: 'fade' | 'slide' | 'scale' | 'rotate' | 'flip' | 'curtain' | 'wave' | 'morph'
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  delay?: number
  className?: string
}

export const AdvancedPageTransition: React.FC<AdvancedPageTransitionProps> = ({
  children,
  type = 'fade',
  direction = 'right',
  duration = 0.6,
  delay = 0,
  className = ''
}) => {
  const { isReducedMotion } = useAnimationContext()

  const getTransitionVariants = () => {
    if (isReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    }

    switch (type) {
      case 'slide':
        const slideDistance = 100
        const slideDirections = {
          up: { y: slideDistance },
          down: { y: -slideDistance },
          left: { x: slideDistance },
          right: { x: -slideDistance }
        }
        return {
          initial: { opacity: 0, ...slideDirections[direction] },
          animate: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, ...slideDirections[direction] }
        }

      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 }
        }

      case 'rotate':
        return {
          initial: { opacity: 0, rotate: -90, scale: 0.8 },
          animate: { opacity: 1, rotate: 0, scale: 1 },
          exit: { opacity: 0, rotate: 90, scale: 0.8 }
        }

      case 'flip':
        return {
          initial: { opacity: 0, rotateY: -90 },
          animate: { opacity: 1, rotateY: 0 },
          exit: { opacity: 0, rotateY: 90 }
        }

      case 'curtain':
        return {
          initial: { opacity: 0, scaleY: 0, transformOrigin: 'top' },
          animate: { opacity: 1, scaleY: 1 },
          exit: { opacity: 0, scaleY: 0, transformOrigin: 'bottom' }
        }

      case 'wave':
        return {
          initial: { opacity: 0, x: -100, skewX: -10 },
          animate: { opacity: 1, x: 0, skewX: 0 },
          exit: { opacity: 0, x: 100, skewX: 10 }
        }

      case 'morph':
        return {
          initial: { opacity: 0, borderRadius: '50%', scale: 0 },
          animate: { opacity: 1, borderRadius: '0%', scale: 1 },
          exit: { opacity: 0, borderRadius: '50%', scale: 0 }
        }

      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        {...getTransitionVariants()}
        transition={{
          duration,
          delay,
          ease: 'easeInOut',
          type: type === 'flip' ? 'spring' : 'tween'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Section Transition
interface SectionTransitionProps {
  children: React.ReactNode
  isVisible: boolean
  type?: 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'fade' | 'scale' | 'blur'
  duration?: number
  delay?: number
  className?: string
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  isVisible,
  type = 'slideUp',
  duration = 0.8,
  delay = 0,
  className = ''
}) => {
  const { isReducedMotion } = useAnimationContext()

  const getVariants = () => {
    if (isReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    }

    switch (type) {
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }
      case 'slideDown':
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 }
        }
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 }
        }
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        }
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        }
      case 'blur':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)' },
          visible: { opacity: 1, filter: 'blur(0px)' }
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }
    }
  }

  return (
    <motion.div
      className={className}
      variants={getVariants()}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Staggered Container Transition
interface StaggeredContainerProps {
  children: React.ReactNode[]
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  staggerDelay = 0.1,
  direction = 'up',
  className = ''
}) => {
  const { isReducedMotion } = useAnimationContext()

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay
      }
    }
  }

  const itemVariants = () => {
    if (isReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    }

    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 }
        }
      case 'down':
        return {
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0 }
        }
      case 'left':
        return {
          hidden: { opacity: 0, x: 30 },
          visible: { opacity: 1, x: 0 }
        }
      case 'right':
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0 }
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }
    }
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants()}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Loading Transition
interface LoadingTransitionProps {
  isLoading: boolean
  children: React.ReactNode
  loadingComponent?: React.ReactNode
  type?: 'fade' | 'scale' | 'slide'
  className?: string
}

export const LoadingTransition: React.FC<LoadingTransitionProps> = ({
  isLoading,
  children,
  loadingComponent,
  type = 'fade',
  className = ''
}) => {
  const { isReducedMotion } = useAnimationContext()

  const getTransitionProps = () => {
    if (isReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    }

    switch (type) {
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 }
        }
      case 'slide':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 }
        }
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        }
    }
  }

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            {...getTransitionProps()}
            transition={{ duration: 0.3 }}
          >
            {loadingComponent || defaultLoadingComponent}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            {...getTransitionProps()}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Modal Transition
interface ModalTransitionProps {
  isOpen: boolean
  children: React.ReactNode
  onClose?: () => void
  type?: 'scale' | 'slide' | 'fade' | 'blur'
  className?: string
}

export const ModalTransition: React.FC<ModalTransitionProps> = ({
  isOpen,
  children,
  onClose,
  type = 'scale',
  className = ''
}) => {
  const { isReducedMotion } = useAnimationContext()

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const getModalVariants = () => {
    if (isReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    }

    switch (type) {
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        }
      case 'slide':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }
      case 'blur':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)' },
          visible: { opacity: 1, filter: 'blur(0px)' }
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal Content */}
          <motion.div
            className={`relative z-10 ${className}`}
            variants={getModalVariants()}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Route Transition Hook
export const useRouteTransition = (pathname: string) => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsTransitioning(true)
      
      const timer = setTimeout(() => {
        setCurrentPath(pathname)
        setIsTransitioning(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [pathname, currentPath])

  return { isTransitioning, currentPath }
}