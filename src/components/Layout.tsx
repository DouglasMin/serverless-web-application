import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Header />
      <main className={`flex-1 ${isHomePage ? 'pt-16' : 'container mx-auto px-4 py-8 pt-24'}`}>
        <Outlet />
      </main>
      {!isHomePage && <Footer />}
    </div>
  )
}

export default Layout