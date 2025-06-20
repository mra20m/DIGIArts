import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiClock, FiHeart, FiEye, FiShare2, FiFlag, FiExternalLink } from 'react-icons/fi'
import Countdown from 'react-countdown'
import { useNFTStore } from '../store/nftStore'
import { useAuthStore } from '../store/authStore'
import BidHistory from '../components/auction/BidHistory'
import PlaceBidForm from '../components/auction/PlaceBidForm'
import { toast } from 'react-toastify'

const ArtworkDetails = () => {
  const { id } = useParams()
  const { currentNFT, isLoading, error, fetchNFTById } = useNFTStore()
  const { isAuthenticated, user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('details')
  
  useEffect(() => {
    if (id) {
      fetchNFTById(id)
    }
  }, [id, fetchNFTById])
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-300 dark:bg-gray-700 rounded-xl aspect-square"></div>
            <div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !currentNFT) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Artwork Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The artwork you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/explore" className="btn btn-primary">
          Explore other artworks
        </Link>
      </div>
    )
  }
  
  const { 
    title, 
    description, 
    image, 
    price, 
    currency, 
    creator, 
    owner, 
    createdAt, 
    likes, 
    views, 
    tokenId, 
    blockchain,
    auction
  } = currentNFT
  
  const isOwner = isAuthenticated && user?.id === owner.id
  
  const handleLike = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to like this artwork')
      return
    }
    
    toast.success('Artwork added to your favorites!')
  }
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }
  
  const handleBuy = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to purchase this artwork')
      return
    }
    
    toast.success('Purchase initiated! Check your wallet to confirm the transaction.')
  }
  
  const handleReport = () => {
    toast.info('Report submitted. Our team will review this content.')
  }
  
  // Countdown renderer
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span className="text-red-500">Auction ended</span>
    } else {
      return (
        <span>
          {days > 0 && <span className="mr-1">{days}d</span>}
          <span>{hours.toString().padStart(2, '0')}:</span>
          <span>{minutes.toString().padStart(2, '0')}:</span>
          <span>{seconds.toString().padStart(2, '0')}</span>
        </span>
      )
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left column - Image */}
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
              >
                <FiHeart className={isAuthenticated ? 'text-red-500' : ''} />
                <span>{likes}</span>
              </button>
              <div className="flex items-center space-x-1 text-gray-500">
                <FiEye />
                <span>{views}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FiShare2 />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={handleReport}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FiFlag />
                <span className="hidden sm:inline">Report</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Right column - Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
          
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <Link to={`/profile/${creator.id}`} className="flex items-center">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created by</p>
                  <p className="font-medium text-gray-900 dark:text-white">{creator.name}</p>
                </div>
              </Link>
            </div>
            
            {creator.id !== owner.id && (
              <div className="ml-6 flex items-center">
                <Link to={`/profile/${owner.id}`} className="flex items-center">
                  <img
                    src={owner.avatar}
                    alt={owner.name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Owned by</p>
                    <p className="font-medium text-gray-900 dark:text-white">{owner.name}</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
          
          {/* Price and auction info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
            {auction.isActive ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current bid</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {auction.highestBid || price} {currency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Auction ending in</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <FiClock className="mr-2 text-red-500" />
                      <Countdown date={new Date(auction.endTime)} renderer={countdownRenderer} />
                    </p>
                  </div>
                </div>
                
                {!isOwner && (
                  <PlaceBidForm nft={currentNFT} />
                )}
                
                {isOwner && (
                  <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 p-4 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      You own this NFT. You can view the bidding activity below.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {price} {currency}
                    </p>
                  </div>
                </div>
                
                {!isOwner && (
                  <button
                    onClick={handleBuy}
                    className="btn btn-primary w-full py-3 text-lg"
                  >
                    Buy Now
                  </button>
                )}
                
                {isOwner && (
                  <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 p-4 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      You own this NFT. You can list it for sale or create an auction.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-4 text-sm font-medium ${
                  activeTab === 'details'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                Details
              </button>
              
              {auction.isActive && (
                <button
                  onClick={() => setActiveTab('bids')}
                  className={`pb-4 text-sm font-medium ${
                    activeTab === 'bids'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  Bids
                </button>
              )}
              
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-4 text-sm font-medium ${
                  activeTab === 'history'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                History
              </button>
            </nav>
          </div>
          
          {/* Tab content */}
          <div>
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Token ID</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center">
                      {tokenId.substring(0, 6)}...{tokenId.substring(tokenId.length - 4)}
                      <a href="#" className="ml-1 text-primary-600">
                        <FiExternalLink />
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Blockchain</p>
                    <p className="font-medium text-gray-900 dark:text-white">{blockchain}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium text-gray-900 dark:text-white">Digital Art</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-gray-200">
                      Digital
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-gray-200">
                      Abstract
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-gray-200">
                      Modern
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'bids' && (
              <BidHistory bids={auction.bids} />
            )}
            
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Minted by {creator.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{price} {currency}</p>
                  </div>
                </div>
                
                {creator.id !== owner.id && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={owner.avatar}
                        alt={owner.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Purchased by {owner.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">1 week ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">{price} {currency}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* More from this creator */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">More from this creator</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.filter(nft => nft.creator.id === creator.id && nft.id !== id).slice(0, 4).map((nft) => (
            <Link key={nft.id} to={`/artwork/${nft.id}`} className="card group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-xl bg-gray-200">
                <img
                  src={nft.image}
                  alt={nft.title}
                  className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 truncate">{nft.title}</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {nft.price} {nft.currency}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ArtworkDetails
