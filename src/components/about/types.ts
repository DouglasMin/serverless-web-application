/**
 * About Page Component Types
 */

// Animation Configuration
export interface AnimationConfig {
  reducedMotion: boolean
  performance: 'low' | 'medium' | 'high'
  effects: {
    parallax: boolean
    particles: boolean
    morphing: boolean
    transitions: boolean
  }
  timing: {
    fast: number
    normal: number
    slow: number
  }
}

// Flow Visualization Types
export interface FlowNode {
  id: string
  label: string
  description: string
  icon: string
  position: { x: number; y: number }
  color: string
}

export interface FlowLink {
  source: string
  target: string
  value: number
  color: string
  animated: boolean
}

export interface SankeyFlowProps {
  nodes: FlowNode[]
  links: FlowLink[]
  animationConfig: {
    particleSpeed: number
    particleCount: number
    flowThickness: number
    colorGradient: string[]
  }
}

// Tech Stack Types
export interface Technology {
  name: string
  description: string
  icon: string
  reason: string
  links: string[]
  stats?: {
    performance: number
    popularity: number
    reliability: number
  }
}

export interface TechCategory {
  name: string
  technologies: Technology[]
  icon: string
  color: string
}

export interface TechStackProps {
  categories: TechCategory[]
  displayMode: 'cards' | 'timeline' | 'interactive'
  hoverEffects: boolean
}

// Team Types
export interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  email?: string
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  avatar: string
  social: SocialLinks
  skills: string[]
}

export interface VisionStatement {
  mission: string
  vision: string
  values: string[]
  goals: string[]
}

export interface RoadmapItem {
  title: string
  description: string
  timeline: string
  status: 'completed' | 'in-progress' | 'planned'
}

export interface TeamSectionProps {
  team: TeamMember[]
  vision: VisionStatement
  roadmap: RoadmapItem[]
  displayStyle: 'cards' | 'carousel' | 'grid'
}

// Security Types
export interface SecurityFeature {
  name: string
  description: string
  icon: string
  implementation: string
  compliance: string[]
}

export interface Certification {
  name: string
  issuer: string
  validUntil?: string
  badge: string
}

export interface PolicyDocument {
  name: string
  description: string
  lastUpdated: string
  url: string
}

export interface SecuritySectionProps {
  features: SecurityFeature[]
  certifications: Certification[]
  policies: PolicyDocument[]
  visualStyle: 'shield' | 'lock' | 'fortress'
}

// Architecture Types
export interface ArchComponent {
  id: string
  name: string
  type: 'frontend' | 'api' | 'service' | 'database' | 'external'
  description: string
  icon: string
  position: { x: number; y: number; z?: number }
  status: 'active' | 'processing' | 'idle'
}

export interface Connection {
  from: string
  to: string
  type: 'data' | 'api' | 'event'
  bidirectional?: boolean
}

export interface ArchitectureDiagramProps {
  components: ArchComponent[]
  connections: Connection[]
  viewMode: '2d' | '3d' | 'layered'
  interactivity: {
    hover: boolean
    click: boolean
    zoom: boolean
  }
}

// Page State Types
export interface AboutPageState {
  currentSection: string
  scrollProgress: number
  animationsEnabled: boolean
  interactionsEnabled: boolean
  performanceMode: 'auto' | 'high' | 'low'
}

// Flow Data Types
export interface FlowData {
  nodes: {
    input: { type: 'text' | 'file', volume: number }
    ai: { model: 'nova-lite' | 'nova-pro', processing: number }
    guardrail: { filtered: number, approved: number }
    tts: { voice: string, duration: number }
    output: { format: 'mp3', size: number }
  }
  metrics: {
    averageProcessingTime: number
    successRate: number
    userSatisfaction: number
  }
}

// Hero Section Types
export interface HeroSectionProps {
  title: string
  subtitle: string
  backgroundAnimation: 'particles' | 'mesh' | 'geometric'
  parallaxIntensity: number
}

// Service Story Types
export interface ServiceStoryProps {
  story: {
    problem: string
    solution: string
    mission: string
  }
  animations: {
    textReveal: boolean
    imageParallax: boolean
    morphingShapes: boolean
  }
}