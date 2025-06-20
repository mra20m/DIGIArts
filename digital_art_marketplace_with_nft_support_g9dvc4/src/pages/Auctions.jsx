import { useEffect, useState } from 'react'
import { FiClock, FiFilter, FiX } from 'react-icons/fi'
import AuctionCard from '../components/auction/AuctionCard'
import { useNFTStore } from '../store/nftStore'

const Auctions = () => {
  const { nfts, isLoading, fetchNFTs } = useNFTStore()
  const [activeAuctions, setActiveAuctions] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 10],
    sortBy: 'ending-soon',
    category: 'all'
  })
  
  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])
  
  useEffect(() => {
    if (nfts.length > 0) {
      // Filter active auctions
      let auctions = nfts.filter(nft => nft.auction.isActive)
      
      // Apply category filter
      if (filters.category !== 'all') {
        auctions = auctions.filter(nft => nft.category === filters.category)
      }
      
      // Apply price range filter
      auctions = auctions.filter(nft => {
        const price = nft.auction.highestBid || nft.price
        return price >= filters.priceRange[0] && price <= filters.priceRange[1]
      })
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'ending-soon':
          auctions.sort((a, b) => new Date(a.auction.endTime) - new Date(b.auction.endTime))
          break
        case 'price-high':
          auctions.sort((a, b) => {
            const priceA = a.auction.highestBid || a.price
            const priceB = b.auction.highestBid || b.price
            return priceB - priceA
          })
          break
        case 'price-low':
          auctions.sort((a, b) => {
            const priceA = a.auction.highestBid || a.price
            const priceB = b.auction.highestBid || b.price
            return priceA - priceB
          })
          break
        case 'most-bids':
          auctions.sort((a, b) => (b.auction.bids?.length || 0) - (a.auction.bids?.length || 0))
          break
        default:
          break
      }
      
      setActiveAuctions(auctions)
    }
  }, [nfts, filters])
  
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const resetFilters = () => {
    setFilters({
      priceRange: [0, 10],
      sortBy: 'ending-soon',
      category: 'all'
    })
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiClock className="mr-3 text-red-500" />
            Live Auctions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Bid on exclusive digital artworks before they're gone
          </p>
        </div>
        
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="mt-4 md:mt-0 flex items-center btn btn-outline"
        >
          <FiFilter className="mr-2" />
          Filters
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar - desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Reset
              </button>
            </div>
            
            {/* Category filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Category</h4>
              <div className="space-y-2">
                {['all', 'art', 'photography', 'music', 'collectibles'].map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      name="category"
                      type="radio"
                      checked={filters.category === category}
                      onChange={() => handleFilterChange('category', category)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {category === 'all' ? 'All categories' : category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price range filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{filters.priceRange[0]} ETH</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{filters.priceRange[1]} ETH</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseFloat(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
            
            {/* Sort by filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sort By</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input"
              >
                <option value="ending-soon">Ending Soon</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="most-bids">Most Bids</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Mobile filters */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsFilterOpen(false)}></div>
              <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div className="relative w-screen max-w-md">
                  <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => setIsFilterOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <FiX className="h-6 w-6" />
                        </button>
                      </div>
                      
                      {/* Mobile filters content - same as desktop */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Category</h4>
                        <div className="space-y-2">
                          {['all', 'art', 'photography', 'music', 'collectibles'].map((category) => (
                            <div key={category} className="flex items-center">
                              <input
                                id={`mobile-category-${category}`}
                                name="category"
                                type="radio"
                                checked={filters.category === category}
                                onChange={() => handleFilterChange('category', category)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`mobile-category-${category}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {category === 'all' ? 'All categories' : category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{filters.priceRange[0]} ETH</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{filters.priceRange[1]} ETH</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={filters.priceRange[1]}
                            onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseFloat(e.target.value)])}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sort By</h4>
                        <select
                          value={filters.sortBy}
                          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                          className="input"
                        >
                          <option value="ending-soon">Ending Soon</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="most-bids">Most Bids</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-4">
                        <button
                          onClick={resetFilters}
                          className="btn btn-outline flex-1"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="btn btn-primary flex-1"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1">
          {/* Results info */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">
              Showing <span className="font-medium">{activeAuctions.length}</span> active auctions
            </p>
            
            {/* Mobile sort */}
            <div className="lg:hidden">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input py-1 px-2 text-sm"
              >
                <option value="ending-soon">Sort: Ending Soon</option>
                <option value="price-high">Sort: Price High to Low</option>
                <option value="price-low">Sort: Price Low to High</option>
                <option value="most-bids">Sort: Most Bids</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-xl"></div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 mr-2"></div>
                      <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeAuctions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <FiClock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No active auctions found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your filters or check back later for new auctions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Auctions
