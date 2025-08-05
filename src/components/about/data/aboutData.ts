/**
 * Static data for About Page components
 */

import { 
  TechCategory, 
  TeamMember, 
  VisionStatement, 
  RoadmapItem, 
  SecurityFeature,
  FlowNode,
  FlowLink,
  ArchComponent,
  Connection
} from '../types'

// Technology Stack Data
export const techStackData: TechCategory[] = [
  {
    name: 'AI & Machine Learning',
    icon: '🤖',
    color: 'from-purple-500 to-pink-500',
    technologies: [
      {
        name: 'AWS Bedrock Nova',
        description: '최신 생성형 AI 모델로 고품질 팟캐스트 스크립트 생성',
        icon: '🧠',
        reason: '뛰어난 한국어 지원과 개인화된 콘텐츠 생성 능력',
        links: ['https://aws.amazon.com/bedrock/'],
        stats: {
          performance: 95,
          popularity: 88,
          reliability: 92
        }
      },
      {
        name: 'Guardrails',
        description: 'AI 생성 콘텐츠의 안전성과 품질을 보장하는 필터링 시스템',
        icon: '🛡️',
        reason: '긍정적이고 안전한 콘텐츠만 사용자에게 제공',
        links: ['https://aws.amazon.com/bedrock/guardrails/'],
        stats: {
          performance: 90,
          popularity: 75,
          reliability: 98
        }
      }
    ]
  },
  {
    name: 'Frontend',
    icon: '💻',
    color: 'from-blue-500 to-cyan-500',
    technologies: [
      {
        name: 'React 18',
        description: '최신 React 기능을 활용한 현대적인 사용자 인터페이스',
        icon: '⚛️',
        reason: '컴포넌트 기반 아키텍처와 뛰어난 개발자 경험',
        links: ['https://react.dev/'],
        stats: {
          performance: 92,
          popularity: 95,
          reliability: 90
        }
      },
      {
        name: 'TypeScript',
        description: '타입 안전성을 보장하는 JavaScript 슈퍼셋',
        icon: '📘',
        reason: '런타임 오류 방지와 개발 생산성 향상',
        links: ['https://www.typescriptlang.org/'],
        stats: {
          performance: 88,
          popularity: 90,
          reliability: 95
        }
      },
      {
        name: 'Vite',
        description: '빠른 개발 서버와 최적화된 빌드 도구',
        icon: '⚡',
        reason: '개발 속도 향상과 효율적인 번들링',
        links: ['https://vitejs.dev/'],
        stats: {
          performance: 98,
          popularity: 85,
          reliability: 88
        }
      },
      {
        name: 'Tailwind CSS',
        description: '유틸리티 우선 CSS 프레임워크',
        icon: '🎨',
        reason: '빠른 UI 개발과 일관된 디자인 시스템',
        links: ['https://tailwindcss.com/'],
        stats: {
          performance: 90,
          popularity: 92,
          reliability: 85
        }
      }
    ]
  },
  {
    name: 'Backend',
    icon: '🔧',
    color: 'from-green-500 to-emerald-500',
    technologies: [
      {
        name: 'AWS Lambda',
        description: '서버리스 컴퓨팅으로 자동 스케일링과 비용 효율성 제공',
        icon: 'λ',
        reason: '무한 확장성과 사용한 만큼만 지불하는 비용 구조',
        links: ['https://aws.amazon.com/lambda/'],
        stats: {
          performance: 90,
          popularity: 88,
          reliability: 95
        }
      },
      {
        name: 'Python 3.13',
        description: '최신 Python으로 빠르고 안정적인 백엔드 로직 구현',
        icon: '🐍',
        reason: 'AI/ML 라이브러리와의 뛰어난 호환성',
        links: ['https://www.python.org/'],
        stats: {
          performance: 85,
          popularity: 95,
          reliability: 92
        }
      },
      {
        name: 'Pydantic',
        description: '데이터 검증과 설정 관리를 위한 라이브러리',
        icon: '✅',
        reason: '타입 안전성과 자동 데이터 검증',
        links: ['https://pydantic.dev/'],
        stats: {
          performance: 88,
          popularity: 80,
          reliability: 90
        }
      }
    ]
  },
  {
    name: 'Infrastructure',
    icon: '☁️',
    color: 'from-orange-500 to-red-500',
    technologies: [
      {
        name: 'AWS API Gateway',
        description: 'RESTful API 관리와 보안, 모니터링 제공',
        icon: '🚪',
        reason: '완전 관리형 API 서비스로 높은 가용성 보장',
        links: ['https://aws.amazon.com/api-gateway/'],
        stats: {
          performance: 92,
          popularity: 85,
          reliability: 98
        }
      },
      {
        name: 'DynamoDB',
        description: '완전 관리형 NoSQL 데이터베이스',
        icon: '🗄️',
        reason: '밀리초 단위 지연 시간과 무제한 확장성',
        links: ['https://aws.amazon.com/dynamodb/'],
        stats: {
          performance: 95,
          popularity: 82,
          reliability: 99
        }
      },
      {
        name: 'Amazon S3',
        description: '오디오 파일 저장을 위한 객체 스토리지',
        icon: '📦',
        reason: '99.999999999% 내구성과 글로벌 접근성',
        links: ['https://aws.amazon.com/s3/'],
        stats: {
          performance: 90,
          popularity: 95,
          reliability: 99
        }
      },
      {
        name: 'Amazon Polly',
        description: '자연스러운 음성 합성 서비스',
        icon: '🗣️',
        reason: '다양한 언어와 음성 옵션 지원',
        links: ['https://aws.amazon.com/polly/'],
        stats: {
          performance: 88,
          popularity: 75,
          reliability: 92
        }
      }
    ]
  }
]

// Team Data
export const teamData: TeamMember[] = [
  {
    name: 'AI Podcast Team',
    role: 'Full-Stack Development',
    bio: '혁신적인 AI 기술로 개인화된 팟캐스트 경험을 만들어가는 개발팀입니다.',
    avatar: '/api/placeholder/150/150',
    social: {
      github: 'https://github.com',
      email: 'team@aipodcast.com'
    },
    skills: ['React', 'Python', 'AWS', 'AI/ML', 'TypeScript']
  }
]

// Vision Statement
export const visionData: VisionStatement = {
  mission: 'AI 기술로 모든 사람의 일상에 긍정적인 변화를 만들어갑니다.',
  vision: '개인화된 AI 콘텐츠로 더 나은 하루를 시작할 수 있는 세상을 꿈꿉니다.',
  values: [
    '사용자 중심의 혁신',
    '기술의 인간적 활용',
    '지속 가능한 성장',
    '개인정보 보호 우선'
  ],
  goals: [
    '글로벌 서비스 확장',
    '다국어 지원 강화',
    'AI 모델 성능 향상',
    '사용자 경험 개선'
  ]
}

// Roadmap Data
export const roadmapData: RoadmapItem[] = [
  {
    title: 'MVP 출시',
    description: '기본 팟캐스트 생성 기능과 한국어 지원',
    timeline: '2025 8',
    status: 'completed'
  },
  {
    title: '고급 개인화',
    description: '사용자 선호도 TTS 서비스 확장 및 고도화 (연예인 목소리 등)',
    timeline: '2025 Q4',
    status: 'in-progress'
  },
  {
    title: '다국어 확장',
    description: '영어, 일본어, 중국어 지원 추가',
    timeline: '2025 Q4',
    status: 'planned'
  },
  {
    title: '프리미엄 기능',
    description: '고급 음성 옵션과 긴 형식 콘텐츠 지원, 및 통화 상담 기능',
    timeline: 'Soon',
    status: 'planned'
  }
]

// Security Features
export const securityData: SecurityFeature[] = [
  {
    name: 'AWS 엔터프라이즈급 보안',
    description: '세계 최고 수준의 클라우드 보안 인프라 활용',
    icon: '🏢',
    implementation: 'AWS 보안 모범 사례 준수',
    compliance: ['SOC 2', 'ISO 27001', 'GDPR']
  },
  {
    name: '데이터 암호화',
    description: '전송 중과 저장 시 모든 데이터 암호화',
    icon: '🔐',
    implementation: 'AES-256 암호화 및 TLS 1.3',
    compliance: ['FIPS 140-2', 'Common Criteria']
  },
  {
    name: '자동 데이터 삭제',
    description: '업로드된 파일은 처리 후 자동으로 안전하게 삭제',
    icon: '🗑️',
    implementation: '24시간 후 자동 삭제 정책',
    compliance: ['GDPR Article 17', 'CCPA']
  },
  {
    name: '접근 제어',
    description: 'AWS Cognito를 통한 안전한 사용자 인증',
    icon: '🔑',
    implementation: 'Multi-factor authentication 지원',
    compliance: ['OAuth 2.0', 'OpenID Connect']
  }
]

// Flow Visualization Data
export const flowData: { nodes: FlowNode[], links: FlowLink[] } = {
  nodes: [
    {
      id: 'input',
      label: '사용자 입력',
      description: '텍스트 주제 또는 이력서 파일',
      icon: '📝',
      position: { x: 0, y: 50 },
      color: '#3B82F6'
    },
    {
      id: 'bedrock',
      label: 'AWS Bedrock Nova',
      description: 'AI 스크립트 생성 및 개인화',
      icon: '🧠',
      position: { x: 200, y: 50 },
      color: '#8B5CF6'
    },
    {
      id: 'guardrail',
      label: 'Guardrail 시스템',
      description: '콘텐츠 안전성 검증',
      icon: '🛡️',
      position: { x: 400, y: 50 },
      color: '#10B981'
    },
    {
      id: 'tts',
      label: 'TTS 엔진',
      description: '자연스러운 음성 변환',
      icon: '🗣️',
      position: { x: 600, y: 50 },
      color: '#F59E0B'
    },
    {
      id: 'output',
      label: '팟캐스트 출력',
      description: '완성된 오디오 파일',
      icon: '🎧',
      position: { x: 800, y: 50 },
      color: '#EF4444'
    }
  ],
  links: [
    {
      source: 'input',
      target: 'bedrock',
      value: 100,
      color: '#3B82F6',
      animated: true
    },
    {
      source: 'bedrock',
      target: 'guardrail',
      value: 90,
      color: '#8B5CF6',
      animated: true
    },
    {
      source: 'guardrail',
      target: 'tts',
      value: 85,
      color: '#10B981',
      animated: true
    },
    {
      source: 'tts',
      target: 'output',
      value: 80,
      color: '#F59E0B',
      animated: true
    }
  ]
}

// Architecture Components
export const architectureData: { components: ArchComponent[], connections: Connection[] } = {
  components: [
    {
      id: 'frontend',
      name: 'React Frontend',
      type: 'frontend',
      description: 'React 18 + TypeScript 사용자 인터페이스',
      icon: '⚛️',
      position: { x: 100, y: 100 },
      status: 'active'
    },
    {
      id: 'api-gateway',
      name: 'API Gateway',
      type: 'api',
      description: 'RESTful API 엔드포인트 관리',
      icon: '🚪',
      position: { x: 300, y: 100 },
      status: 'active'
    },
    {
      id: 'lambda',
      name: 'Lambda Functions',
      type: 'service',
      description: '서버리스 비즈니스 로직',
      icon: 'λ',
      position: { x: 500, y: 100 },
      status: 'processing'
    },
    {
      id: 'bedrock',
      name: 'AWS Bedrock',
      type: 'external',
      description: 'AI 모델 서비스',
      icon: '🧠',
      position: { x: 700, y: 50 },
      status: 'active'
    },
    {
      id: 'dynamodb',
      name: 'DynamoDB',
      type: 'database',
      description: 'NoSQL 데이터베이스',
      icon: '🗄️',
      position: { x: 700, y: 150 },
      status: 'active'
    },
    {
      id: 's3',
      name: 'Amazon S3',
      type: 'database',
      description: '오디오 파일 저장소',
      icon: '📦',
      position: { x: 500, y: 200 },
      status: 'active'
    }
  ],
  connections: [
    { from: 'frontend', to: 'api-gateway', type: 'api' },
    { from: 'api-gateway', to: 'lambda', type: 'api' },
    { from: 'lambda', to: 'bedrock', type: 'api' },
    { from: 'lambda', to: 'dynamodb', type: 'data' },
    { from: 'lambda', to: 's3', type: 'data' }
  ]
}