import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ThemeToggle } from '../design/theme'
import { useScrollHeader } from '../design/animations'

const Header = () => {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { isVisible } = useScrollHeader(50) // Hide header after 50px scroll

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
              AI Podcast
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800'
              }`}
            >
              About
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800'
              }`}
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle size="sm" />
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  회원가입
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header