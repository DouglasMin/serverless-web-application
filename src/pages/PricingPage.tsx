import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ScrollAnimation, StaggerContainer } from '../design/animations'

const PricingPage = () => {
  const { isAuthenticated } = useAuthStore()

  const plans = [
    {
      name: '무료',
      price: '0',
      period: '월',
      description: '개인 사용자를 위한 기본 플랜',
      features: [
        '월 3개 팟캐스트 생성',
        '기본 AI 음성',
        '최대 10분 길이',
        '기본 템플릿',
        '커뮤니티 지원'
      ],
      buttonText: '무료로 시작하기',
      buttonStyle: 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
      popular: false
    },
    {
      name: 'Pro',
      price: '20',
      period: '월',
      description: '전문가를 위한 고급 기능',
      features: [
        '무제한 팟캐스트 생성',
        '프리미엄 AI 음성 (20+ 종류)',
        '최대 60분 길이',
        '고급 템플릿 및 커스터마이징',
        '우선 지원',
        '고품질 오디오 (320kbps)',
        '브랜딩 제거',
        '분석 대시보드'
      ],
      buttonText: 'Coming Soon',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-not-allowed opacity-75',
      popular: true,
      comingSoon: true
    },
    {
      name: 'Enterprise',
      price: '문의',
      period: '',
      description: '대규모 조직을 위한 맞춤형 솔루션',
      features: [
        '무제한 팟캐스트 생성',
        '커스텀 AI 음성 훈련',
        '무제한 길이',
        '완전 커스터마이징',
        '전담 지원팀',
        'API 액세스',
        '화이트라벨 솔루션',
        '고급 분석 및 리포팅',
        'SSO 통합',
        '온프레미스 배포 옵션'
      ],
      buttonText: 'Coming Soon',
      buttonStyle: 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 cursor-not-allowed opacity-75',
      popular: false,
      comingSoon: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <ScrollAnimation delay={0}>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  요금제
                </span>
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                당신의 필요에 맞는 완벽한 플랜을 선택하세요
              </p>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <ScrollAnimation key={plan.name} delay={index * 200}>
                <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  plan.popular 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 scale-105' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  {plan.comingSoon && (
                    <div className="absolute -top-3 right-3">
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Coming Soon
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline justify-center mb-2">
                        {plan.price === '문의' ? (
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            문의
                          </span>
                        ) : (
                          <>
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                              ${plan.price}
                            </span>
                            {plan.period && (
                              <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">
                                /{plan.period}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.description}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.slice(0, 6).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                      {plan.features.length > 6 && (
                        <li className="text-sm text-gray-500 dark:text-gray-400 ml-6">
                          +{plan.features.length - 6}개 추가 기능
                        </li>
                      )}
                    </ul>

                    {/* Button */}
                    <div className="text-center">
                      {plan.name === '무료' && !isAuthenticated ? (
                        <Link
                          to="/signup"
                          className={`w-full inline-flex justify-center items-center px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${plan.buttonStyle}`}
                        >
                          {plan.buttonText}
                        </Link>
                      ) : plan.name === '무료' && isAuthenticated ? (
                        <Link
                          to="/dashboard"
                          className={`w-full inline-flex justify-center items-center px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${plan.buttonStyle}`}
                        >
                          대시보드로 이동
                        </Link>
                      ) : (
                        <button
                          disabled={plan.comingSoon}
                          className={`w-full inline-flex justify-center items-center px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${plan.buttonStyle}`}
                        >
                          {plan.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* FAQ Section */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ScrollAnimation delay={600}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              자주 묻는 질문
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              궁금한 점이 있으시면 언제든 문의해주세요
            </p>
          </div>
        </ScrollAnimation>

        <div className="space-y-6">
          {[
            {
              question: '무료 플랜에서 유료 플랜으로 언제든 업그레이드할 수 있나요?',
              answer: '네, 언제든지 업그레이드하실 수 있습니다. 업그레이드 시 즉시 모든 프리미엄 기능을 이용하실 수 있습니다.'
            },
            {
              question: '생성된 팟캐스트의 저작권은 누구에게 있나요?',
              answer: '생성된 모든 콘텐츠의 저작권은 사용자에게 있습니다. 상업적 용도로도 자유롭게 사용하실 수 있습니다.'
            },
            {
              question: '환불 정책은 어떻게 되나요?',
              answer: '모든 유료 플랜은 30일 무조건 환불 보장을 제공합니다. 만족하지 않으시면 전액 환불해드립니다.'
            },
            {
              question: 'Enterprise 플랜은 언제 출시되나요?',
              answer: 'Enterprise 플랜은 현재 개발 중이며, 2024년 하반기 출시 예정입니다. 사전 등록을 원하시면 문의해주세요.'
            }
          ].map((faq, index) => (
            <ScrollAnimation key={index} delay={700 + index * 100}>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ScrollAnimation delay={1000}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 시작해보세요
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              AI의 힘으로 전문적인 팟캐스트를 만들어보세요. 
              무료로 시작하고 언제든 업그레이드하실 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  무료로 시작하기
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  대시보드로 이동
                </Link>
              )}
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                문의하기
              </button>
            </div>
          </div>
        </ScrollAnimation>
      </section>
    </div>
  )
}

export default PricingPage
