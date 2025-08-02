import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { ThemeProvider } from './design/theme'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import NotFoundPage from './pages/NotFoundPage'
import ToastContainer from './components/Toast'
import LoadingIndicator from './components/LoadingIndicator'

function App() {
  const { initializeAuth, isLoading: authLoading } = useAuthStore()

  useEffect(() => {
    // Initialize authentication on app startup
    initializeAuth()
  }, [initializeAuth])

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="auto" storageKey="theme" enableSystem={true}>
      <LoadingIndicator />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </ThemeProvider>
  )
}

export default App