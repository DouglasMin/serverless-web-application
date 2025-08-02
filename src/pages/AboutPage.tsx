const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">About Our Application</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
          This AI Podcast SaaS application enables users to create professional podcasts using artificial intelligence
          and advanced text-to-speech technology.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Technology Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors">Frontend</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors">
              <li>• React 18 with TypeScript</li>
              <li>• Zustand for state management</li>
              <li>• TailwindCSS for styling</li>
              <li>• React Router for navigation</li>
              <li>• Vite for build tooling</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors">Backend</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors">
              <li>• AWS Lambda with Python 3.13</li>
              <li>• API Gateway for REST APIs</li>
              <li>• Pydantic for data validation</li>
              <li>• AWS Lambda Powertools</li>
              <li>• CloudWatch for monitoring</li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Architecture Benefits</h2>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6 transition-all duration-300">
          <ul className="space-y-3 text-gray-700 dark:text-gray-300 transition-colors">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Serverless:</strong> Automatic scaling and pay-per-use pricing</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Modern Frontend:</strong> Fast, responsive, and type-safe React application</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>CI/CD:</strong> Automated testing and deployment pipeline</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span><strong>Cloud-Native:</strong> Built for reliability and global distribution</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AboutPage