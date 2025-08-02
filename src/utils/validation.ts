// File validation constants
export const FILE_VALIDATION = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.docx']
} as const

// Text validation constants
export const TEXT_VALIDATION = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 5000,
  TITLE_MAX_LENGTH: 100,
  TITLE_MIN_LENGTH: 3
}

// Validation result interface
export interface ValidationResult {
  valid: boolean
  error?: string
  code?: string
}

// File validation functions
export const validateFile = (file: File): ValidationResult => {
  // Check file size
  if (file.size > FILE_VALIDATION.MAX_SIZE) {
    return {
      valid: false,
      error: `파일 크기가 너무 큽니다. 최대 ${formatFileSize(FILE_VALIDATION.MAX_SIZE)}까지 업로드 가능합니다.`,
      code: 'FILE_TOO_LARGE'
    }
  }

  // Check file type
  if (!(FILE_VALIDATION.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    return {
      valid: false,
      error: 'PDF 또는 DOCX 파일만 업로드 가능합니다.',
      code: 'INVALID_FILE_TYPE'
    }
  }

  // Check file extension as fallback
  const extension = getFileExtension(file.name)
  if (!(FILE_VALIDATION.ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
    return {
      valid: false,
      error: 'PDF 또는 DOCX 파일만 업로드 가능합니다.',
      code: 'INVALID_FILE_EXTENSION'
    }
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      valid: false,
      error: '빈 파일은 업로드할 수 없습니다.',
      code: 'EMPTY_FILE'
    }
  }

  return { valid: true }
}

// Text content validation
export const validateTextContent = (content: string, maxLength = TEXT_VALIDATION.MAX_LENGTH): ValidationResult => {
  const trimmedContent = content.trim()

  if (!trimmedContent) {
    return {
      valid: false,
      error: '내용을 입력해주세요.',
      code: 'EMPTY_CONTENT'
    }
  }

  if (trimmedContent.length < TEXT_VALIDATION.MIN_LENGTH) {
    return {
      valid: false,
      error: `최소 ${TEXT_VALIDATION.MIN_LENGTH}자 이상 입력해주세요.`,
      code: 'CONTENT_TOO_SHORT'
    }
  }

  if (trimmedContent.length > maxLength) {
    return {
      valid: false,
      error: `최대 ${maxLength.toLocaleString()}자까지 입력 가능합니다.`,
      code: 'CONTENT_TOO_LONG'
    }
  }

  return { valid: true }
}

// Title validation
export const validateTitle = (title: string): ValidationResult => {
  const trimmedTitle = title.trim()

  if (!trimmedTitle) {
    return {
      valid: false,
      error: '제목을 입력해주세요.',
      code: 'EMPTY_TITLE'
    }
  }

  if (trimmedTitle.length < TEXT_VALIDATION.TITLE_MIN_LENGTH) {
    return {
      valid: false,
      error: `제목은 최소 ${TEXT_VALIDATION.TITLE_MIN_LENGTH}자 이상이어야 합니다.`,
      code: 'TITLE_TOO_SHORT'
    }
  }

  if (trimmedTitle.length > TEXT_VALIDATION.TITLE_MAX_LENGTH) {
    return {
      valid: false,
      error: `제목은 최대 ${TEXT_VALIDATION.TITLE_MAX_LENGTH}자까지 입력 가능합니다.`,
      code: 'TITLE_TOO_LONG'
    }
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/g
  if (invalidChars.test(trimmedTitle)) {
    return {
      valid: false,
      error: '제목에 특수문자 < > : " / \\ | ? * 는 사용할 수 없습니다.',
      code: 'INVALID_TITLE_CHARS'
    }
  }

  return { valid: true }
}

// Duration validation
export const validateDuration = (duration: number, maxDuration = 20): ValidationResult => {
  if (!Number.isInteger(duration) || duration <= 0) {
    return {
      valid: false,
      error: '유효한 재생 시간을 선택해주세요.',
      code: 'INVALID_DURATION'
    }
  }

  if (duration > maxDuration) {
    return {
      valid: false,
      error: `최대 ${maxDuration}분까지 선택 가능합니다.`,
      code: 'DURATION_TOO_LONG'
    }
  }

  return { valid: true }
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    return {
      valid: false,
      error: '이메일을 입력해주세요.',
      code: 'EMPTY_EMAIL'
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    return {
      valid: false,
      error: '유효한 이메일 주소를 입력해주세요.',
      code: 'INVALID_EMAIL'
    }
  }

  return { valid: true }
}

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return {
      valid: false,
      error: '비밀번호를 입력해주세요.',
      code: 'EMPTY_PASSWORD'
    }
  }

  if (password.length < 8) {
    return {
      valid: false,
      error: '비밀번호는 최소 8자 이상이어야 합니다.',
      code: 'PASSWORD_TOO_SHORT'
    }
  }

  if (password.length > 128) {
    return {
      valid: false,
      error: '비밀번호는 최대 128자까지 입력 가능합니다.',
      code: 'PASSWORD_TOO_LONG'
    }
  }

  // Check for at least one uppercase, lowercase, number, and special character
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
    return {
      valid: false,
      error: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.',
      code: 'PASSWORD_WEAK'
    }
  }

  return { valid: true }
}

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.toLowerCase().substring(filename.lastIndexOf('.'))
}

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Validate form data
export const validatePodcastForm = (data: {
  type: 'topic' | 'resume'
  title: string
  duration: number
  content?: string
  file?: File
}): ValidationResult => {
  // Validate title
  const titleValidation = validateTitle(data.title)
  if (!titleValidation.valid) {
    return titleValidation
  }

  // Validate duration
  const durationValidation = validateDuration(data.duration)
  if (!durationValidation.valid) {
    return durationValidation
  }

  // Validate content based on type
  if (data.type === 'topic') {
    if (!data.content) {
      return {
        valid: false,
        error: '주제 내용을 입력해주세요.',
        code: 'MISSING_CONTENT'
      }
    }

    const contentValidation = validateTextContent(data.content)
    if (!contentValidation.valid) {
      return contentValidation
    }
  } else if (data.type === 'resume') {
    if (!data.file) {
      return {
        valid: false,
        error: '이력서 파일을 선택해주세요.',
        code: 'MISSING_FILE'
      }
    }

    const fileValidation = validateFile(data.file)
    if (!fileValidation.valid) {
      return fileValidation
    }
  }

  return { valid: true }
}

// Rate limiting validation
export const validateRateLimit = (lastRequestTime: number, minInterval = 1000): ValidationResult => {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime

  if (timeSinceLastRequest < minInterval) {
    const remainingTime = Math.ceil((minInterval - timeSinceLastRequest) / 1000)
    return {
      valid: false,
      error: `너무 빠른 요청입니다. ${remainingTime}초 후에 다시 시도해주세요.`,
      code: 'RATE_LIMITED'
    }
  }

  return { valid: true }
}