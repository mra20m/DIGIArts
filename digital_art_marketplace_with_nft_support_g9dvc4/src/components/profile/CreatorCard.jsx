import { Link } from 'react-router-dom'
import { FiUser, FiImage } from 'react-icons/fi'

const CreatorCard = ({ creator, artworks = 0, followers = 0 }) => {
  return (
    <div className="card p-6 flex flex-col items-center text-center">
      <img
        src={creator.avatar}
        alt={creator.name}
        className="w-20 h-20 rounded-full object-cover mb-4"
      />
      
      <Link to={`/profile/${creator.id}`}>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{creator.name}</h3>
      </Link>
      
      {creator.bio && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{creator.bio}</p>
      )}
      
      <div className="flex justify-center space-x-4 mb-4 text-sm">
        <div className="flex items-center">
          <FiImage className="mr-1 text-gray-400" />
          <span>{artworks} artworks</span>
        </div>
        <div className="flex items-center">
          <FiUser className="mr-1 text-gray-400" />
          <span>{followers} followers</span>
        </div>
      </div>
      
      <Link
        to={`/profile/${creator.id}`}
        className="btn btn-outline w-full"
      >
        View Profile
      </Link>
    </div>
  )
}

export default CreatorCard
