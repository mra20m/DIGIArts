import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiEdit2, FiShare2, FiGrid, FiClock, FiHeart, FiUser } from 'react-icons/fi'
import NFTGrid from '../components/nft/NFTGrid'
import { useNFTStore } from '../store/nftStore'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-toastify'

const Profile = () => {
  const { id } = useParams()
  const { nfts, fetchNFTs } = useNFTStore()
  const { user, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState('created')
  const [profileUser, setProfileUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      
      try {
        await fetchNFTs()
        
        // In a real app, we would fetch the user profile from an API
        // For now, we'll use the current user if IDs match, or create a mock user
        if (isAuthenticated && user.id === id) {
          setProfileUser(user)
        } else {
          // Find a creator from the NFTs that matches the ID
          const creators = [...new Map(nfts.map(nft => [nft.creator.id, nft.creator])).values()]
          const foundCreator = creators.find(creator => creator.id === id)
          
          if (foundCreator) {
            setProfileUser({
              ...foundCreator,
              bio: 'Digital artist specializing in abstract and surreal art. Creating unique NFTs since 2020.',
              walletAddress: '0x1234...5678',
              website: 'https://artistwebsite.com',
              twitter: '@artist',
              instagram: '@artist'
            })
          } else {
            // Fallback to a default profile
            setProfileUser({
              id,
              name: 'Unknown Artist',
              avatar: 'https://images.pexels.com/photos/1699159/pexels-photo-1699159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              bio: 'Artist information not available',
              walletAddress: '0x0000...0000'
            })
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProfile()
  }, [id, fetchNFTs, isAuthenticated, user, nfts])
  
  const isOwnProfile = isAuthenticated && user?.id === id
  
  // Filter NFTs based on active tab
  const getFilteredNFTs = () => {
    if (!profileUser) return []
    
    switch (activeTab) {
      case 'created':
        return nfts.filter(nft => nft.creator.id === profileUser.id)
      case 'collected':
        return nfts.filter(nft => nft.owner.id === profileUser.id && nft.creator.id !== profileUser.id)
      case 'auctions':
        return nfts.filter(nft => nft.owner.id === profileUser.id && nft.auction.isActive)
      case 'favorites':
        // In a real app, we would have a favorites list
        // For now, return a subset of NFTs as "favorites"
        return nfts.filter((_, index) => index % 3 === 0).slice(0, 2)
      default:
        return []
    }
  }
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Profile link copied to clipboard!')
  }
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl mb-8"></div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="h-24 w-24 bg-gray-300 dark:bg-gray-700 rounded-full -mt-12 md:-mt-16 border-4 border-white dark:border-gray-900 mb-4 md:mb-0"></div>
              <div className="md:ml-6">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-4"></div>
              </div>
            </div>
          </div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (!profileUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/explore" className="btn btn-primary">
          Explore Artists
        </Link>
      </div>
    )
  }
  
  return (
    <div>
      {/* Cover image */}
      <div className="h-64 bg-gradient-to-r from-primary-600 to-secondary-600 relative">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="h-24 w-24 md:h-32 md:w-32 rounded-full -mt-12 md:-mt-16 border-4 border-white dark:border-gray-900 object-cover mb-4 md:mb-0"
            />
            
            <div className="md:ml-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{profileUser.name}</h1>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full mr-2">
                  {profileUser.walletAddress}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profileUser.walletAddress)
                    toast.success('Wallet address copied!')
                  }}
                  className="text-primary-600 hover:text-primary-700 text-xs"
                >
                  Copy
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                {profileUser.bio}
              </p>
            </div>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-3">
            {isOwnProfile && (
              <Link to="/dashboard" className="btn btn-primary">
                <FiEdit2 className="mr-2" />
                Edit Profile
              </Link>
            )}
            
            <button onClick={handleShare} className="btn btn-outline">
              <FiShare2 className="mr-2" />
              Share
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center text-primary-600 mb-1">
              <FiGrid className="mr-2" />
              <span className="text-sm font-medium">Created</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {nfts.filter(nft => nft.creator.id === profileUser.id).length}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center text-green-600 mb-1">
              <FiClock className="mr-2" />
              <span className="text-sm font-medium">Active Auctions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {nfts.filter(nft => nft.owner.id === profileUser.id && nft.auction.isActive).length}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center text-red-600 mb-1">
              <FiHeart className="mr-2" />
              <span className="text-sm font-medium">Favorites</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.floor(Math.random() * 50) + 10}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center text-blue-600 mb-1">
              <FiUser className="mr-2" />
              <span className="text-sm font-medium">Followers</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.floor(Math.random() * 1000) + 100}
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('created')}
              className={`whitespace-nowrap pb-4 px-1 text-sm font-medium ${
                activeTab === 'created'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              Created
            </button>
            
            <button
              onClick={() => setActiveTab('collected')}
              className={`whitespace-nowrap pb-4 px-1 text-sm font-medium ${
                activeTab === 'collected'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              Collected
            </button>
            
            <button
              onClick={() => setActiveTab('auctions')}
              className={`whitespace-nowrap pb-4 px-1 text-sm font-medium ${
                activeTab === 'auctions'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              Auctions
            </button>
            
            <button
              onClick={() => setActiveTab('favorites')}
              className={`whitespace-nowrap pb-4 px-1 text-sm font-medium ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              Favorites
            </button>
          </nav>
        </div>
        
        {/* NFT Grid */}
        <div className="pb-12">
          <NFTGrid nfts={getFilteredNFTs()} loading={false} />
          
          {getFilteredNFTs().length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {activeTab === 'created' && "This user hasn't created any NFTs yet."}
                {activeTab === 'collected' && "This user hasn't collected any NFTs yet."}
                {activeTab === 'auctions' && "This user doesn't have any active auctions."}
                {activeTab === 'favorites' && "This user hasn't favorited any NFTs yet."}
              </p>
              
              {isOwnProfile && activeTab === 'created' && (
                <Link to="/create" className="btn btn-primary">
                  Create your first NFT
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
