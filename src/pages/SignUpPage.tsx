import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const navigate = useNavigate()
  
  const { signUp, confirmSignUp, isLoading, error, clearError } = useAuthStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setLocalError('') // Clear local error when user types
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { text: '매우 약함', color: 'text-red-500' }
      case 2: return { text: '약함', color: 'text-orange-500' }
      case 3: return { text: '보통', color: 'text-yellow-500' }
      case 4: return { text: '강함', color: 'text-green-500' }
      case 5: return { text: '매우 강함', color: 'text-green-600' }
      default: return { text: '', color: '' }
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLocalError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (formData.password.length < 8) {
      setLocalError('비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name
      })
      setShowConfirmation(true)
    } catch (error) {
      console.error('Sign up failed:', error)
    }
  }

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      await confirmSignUp(formData.email, confirmationCode)
      navigate('/login', { 
        state: { message: '회원가입이 완료되었습니다! 로그인해주세요.' }
      })
    } catch (error) {
      console.error('Confirmation failed:', error)
    }
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-all duration-500">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Podcast
              </h1>
            </Link>
          </div>

          {/* Confirmation Form */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 transform transition-all duration-500">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">이메일 인증</h2>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-blue-600 dark:text-blue-400">{formData.email}</span>로<br />
                전송된 인증 코드를 입력해주세요.
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-shake">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleConfirmSignUp} className="space-y-6">
              <div className="group">
                <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  인증 코드
                </label>
                <input
                  type="text"
                  id="confirmationCode"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-300 group-hover:shadow-md text-center text-lg tracking-widest"
                  placeholder="000000"
                  required
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  6자리 숫자를 입력하세요
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    인증 중...
                  </>
                ) : (
                  '인증 완료'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
              >
                다시 회원가입하기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const passwordStrengthInfo = getPasswordStrengthText(passwordStrength)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Podcast
            </h1>
          </Link>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 transform transition-all duration-500 hover:shadow-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              계정 만들기
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              AI 팟캐스트와 함께 새로운 여정을 시작하세요
            </p>
          </div>
          
          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{error || localError}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Name Field */}
            <div className="group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                이름
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-300 group-hover:shadow-md"
                  placeholder="이름을 입력하세요"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Email Field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                이메일 주소
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-300 group-hover:shadow-md"
                  placeholder="이메일을 입력하세요"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Password Field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-300 group-hover:shadow-md pr-12"
                  placeholder="비밀번호를 입력하세요 (최소 8자)"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">비밀번호 강도</span>
                    <span className={`text-xs font-medium ${passwordStrengthInfo.color}`}>
                      {passwordStrengthInfo.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength <= 1 ? 'bg-red-500' :
                        passwordStrength <= 2 ? 'bg-orange-500' :
                        passwordStrength <= 3 ? 'bg-yellow-500' :
                        passwordStrength <= 4 ? 'bg-green-500' : 'bg-green-600'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-300 group-hover:shadow-md pr-12 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  비밀번호가 일치합니다
                </p>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  가입 중...
                </>
              ) : (
                '회원가입'
              )}
            </button>
          </form>
          
          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              이미 계정이 있으신가요?{' '}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
              >
                로그인하기
              </Link>
            </p>
          </div>
          
          {/* Back to Home */}
          <div className="mt-6">
            <Link
              to="/"
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage