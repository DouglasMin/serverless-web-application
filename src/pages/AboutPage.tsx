const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Our Application</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          This serverless web application demonstrates modern full-stack development using cutting-edge technologies
          and cloud-native architecture patterns.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• React 18 with TypeScript</li>
              <li>• Zustand for state management</li>
              <li>• TailwindCSS for styling</li>
              <li>• React Router for navigation</li>
              <li>• Vite for build tooling</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Backend</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• AWS Lambda with Python 3.13</li>
              <li>• API Gateway for REST APIs</li>
              <li>• Pydantic for data validation</li>
              <li>• AWS Lambda Powertools</li>
              <li>• CloudWatch for monitoring</li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Architecture Benefits</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <ul className="space-y-3 text-gray-700">
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