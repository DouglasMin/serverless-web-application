import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ScrollAnimation, StaggerContainer } from '../design/animations'

const HomePage = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 scroll-container">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <ScrollAnimation delay={0}>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Podify
                </span>
                <span className="block text-4xl md:text-5xl mt-2">
                  AI로 만드는 나만의 팟캐스트
                </span>
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Podify와 함께 주제나 이력서를 입력하면 AI가 자동으로 스크립트를 생성하고, 
                고품질 음성으로 변환해 전문적인 팟캐스트를 만들어드립니다.
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    대시보드로 이동
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    무료로 시작하기
                  </Link>
                )}
                <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  데모 보기
                </button>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation delay={0}>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                왜 AI 팟캐스트인가요?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                복잡한 편집 과정 없이 몇 분 만에 전문적인 팟캐스트를 제작할 수 있습니다.
              </p>
            </div>
          </ScrollAnimation>
          
          <StaggerContainer staggerDelay={150} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI 스크립트 생성</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                주제만 입력하면 AI가 자동으로 매력적이고 전문적인 팟캐스트 스크립트를 생성합니다.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">고품질 음성 합성</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                최신 TTS 기술로 자연스럽고 전문적인 음성으로 팟캐스트를 제작합니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">빠른 제작</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                몇 분 만에 완성되는 빠른 제작 과정으로 시간을 절약하고 효율성을 높입니다.
              </p>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation delay={0}>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                간단한 3단계
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                복잡한 과정 없이 누구나 쉽게 팟캐스트를 만들 수 있습니다.
              </p>
            </div>
          </ScrollAnimation>

          <StaggerContainer staggerDelay={200} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-blue-500 to-transparent hidden md:block"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">주제 입력</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                팟캐스트로 만들고 싶은 주제나 이력서를 업로드하세요.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-purple-500 to-transparent hidden md:block"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI 생성</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                AI가 자동으로 스크립트를 생성하고 음성으로 변환합니다.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">다운로드</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                완성된 팟캐스트를 다운로드하고 어디든 공유하세요.
              </p>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimation delay={0}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              지금 바로 시작해보세요
            </h2>
          </ScrollAnimation>
          
          <ScrollAnimation delay={200}>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              무료로 첫 번째 팟캐스트를 만들어보고 AI의 놀라운 능력을 경험해보세요.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/signup"
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    무료 회원가입
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    로그인
                  </Link>
                </>
              )}
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
}

export default HomePage