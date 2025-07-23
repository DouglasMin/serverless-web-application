import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>
      
      <div className="flex justify-center space-x-4">
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go Back
        </button>
      </div>
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">What can you do?</h3>
        <ul className="text-left space-y-2 text-gray-600">
          <li>• Check the URL for typos</li>
          <li>• Return to the homepage</li>
          <li>• Use the navigation menu</li>
          <li>• Contact support if you believe this is an error</li>
        </ul>
      </div>
    </div>
  )
}

export default NotFoundPage