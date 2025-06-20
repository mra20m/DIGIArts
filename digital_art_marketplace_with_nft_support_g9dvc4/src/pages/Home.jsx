import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiTrendingUp, FiStar, FiClock } from 'react-icons/fi'
import NFTCard from '../components/nft/NFTCard'
import AuctionCard from '../components/auction/AuctionCard'
import CreatorCard from '../components/profile/CreatorCard'
import { useNFTStore } from '../store/nftStore'

const Home = () => {
  const { 
    nfts, 
    featuredNFTs, 
    trendingNFTs, 
    isLoading, 
    error, 
    fetchNFTs, 
    initializeStore 
  } = useNFTStore()
  
  useEffect(() => {
    if (nfts.length === 0) {
      initializeStore()
    }
  }, [nfts.length, initializeStore])
  
  // Filter active auctions
  const activeAuctions = nfts.filter(nft => nft.auction.isActive)
  
  // Get unique creators
  const uniqueCreators = [...new Map(nfts.map(nft => [nft.creator.id, nft.creator])).values()]
  const topCreators = uniqueCreators.slice(0, 4)
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-hero-pattern bg-cover bg-center py-24 md:py-32">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Discover, Collect, and Sell <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">Extraordinary NFTs</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            ArtVerse is the world's first and largest digital marketplace for crypto collectibles and non-fungible tokens (NFTs).
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/explore" className="btn btn-primary px-8 py-3 text-lg">
              Explore
            </Link>
            <Link to="/create" className="btn btn-outline border-white text-white hover:bg-white hover:bg-opacity-10 px-8 py-3 text-lg">
              Create
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-gray-300">Artworks</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-white">5K+</p>
              <p className="text-gray-300">Artists</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-white">8K+</p>
              <p className="text-gray-300">Collectors</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-white">150K+</p>
              <p className="text-gray-300">Transactions</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured NFTs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Artworks</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Discover the most outstanding NFTs in all topics</p>
            </div>
            <Link to="/explore" className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View all <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {featuredNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Live Auctions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center">
                <FiClock className="text-red-500 mr-2" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Live Auctions</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Bid on exclusive digital artworks before they're gone</p>
            </div>
            <Link to="/auctions" className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View all <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeAuctions.slice(0, 4).map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Trending NFTs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center">
                <FiTrendingUp className="text-green-500 mr-2" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trending</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Explore the NFTs that are gaining traction right now</p>
            </div>
            <Link to="/explore?sort=trending" className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View all <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Top Creators */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center">
                <FiStar className="text-yellow-500 mr-2" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Top Creators</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Follow top creators and discover amazing artworks</p>
            </div>
            <Link to="/explore?tab=creators" className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View all <FiArrowRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCreators.map((creator, index) => (
              <CreatorCard 
                key={creator.id} 
                creator={creator} 
                artworks={10 + index * 5} 
                followers={100 + index * 50} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover how to create, buy, sell, and auction your digital artworks on ArtVerse
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Create & Upload</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your artwork and upload it to the marketplace. Set a price or create an auction.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Buy & Collect</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse the marketplace, find NFTs you love, and add them to your collection.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sell & Earn</h3>
              <p className="text-gray-600 dark:text-gray-400">
                List your NFTs for sale or auction them to the highest bidder and earn cryptocurrency.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 md:flex md:items-center md:justify-between">
              <div className="md:w-0 md:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ready to start your NFT journey?
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-blue-100">
                  Join thousands of artists and collectors in the world's most vibrant digital art marketplace.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:ml-8">
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  <Link
                    to="/explore"
                    className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-base font-medium mb-3 sm:mb-0"
                  >
                    Explore NFTs
                  </Link>
                  <Link
                    to="/create"
                    className="btn border-2 border-white text-white hover:bg-white hover:bg-opacity-10 px-8 py-3 text-base font-medium"
                  >
                    Create NFT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
