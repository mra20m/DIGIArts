import { Link } from 'react-router-dom'
import { FiHome, FiSearch } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page not found</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/" className="btn btn-primary">
            <FiHome className="mr-2" />
            Go to Home
          </Link>
          <Link to="/explore" className="btn btn-outline">
            <FiSearch className="mr-2" />
            Explore NFTs
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
