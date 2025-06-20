import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi'
import NFTGrid from '../components/nft/NFTGrid'
import { useNFTStore } from '../store/nftStore'

const Explore = () => {
  const [searchParams] = useSearchParams()
  const { nfts, isLoading, fetchNFTs } = useNFTStore()
  const [filteredNFTs, setFilteredNFTs] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  
  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    priceRange: [0, 10],
    sortBy: searchParams.get('sort') || 'newest',
    onlyAuctions: false,
  })
  
  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])
  
  useEffect(() => {
    if (nfts.length > 0) {
      let filtered = [...nfts]
      
      // Apply search query
      const searchQuery = searchParams.get('search')
      if (searchQuery) {
        filtered = filtered.filter(nft => 
          nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // Apply category filter
      if (filters.category !== 'all') {
        filtered = filtered.filter(nft => nft.category === filters.category)
      }
      
      // Apply price range filter
      filtered = filtered.filter(nft => {
        const price = nft.auction.isActive && nft.auction.highestBid 
          ? nft.auction.highestBid 
          : nft.price
        return price >= filters.priceRange[0] && price <= filters.priceRange[1]
      })
      
      // Apply auction filter
      if (filters.onlyAuctions) {
        filtered = filtered.filter(nft => nft.auction.isActive)
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'oldest':
          filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          break
        case 'price-high':
          filtered.sort((a, b) => {
            const priceA = a.auction.isActive && a.auction.highestBid ? a.auction.highestBid : a.price
            const priceB = b.auction.isActive && b.auction.highestBid ? b.auction.highestBid : b.price
            return priceB - priceA
          })
          break
        case 'price-low':
          filtered.sort((a, b) => {
            const priceA = a.auction.isActive && a.auction.highestBid ? a.auction.highestBid : a.price
            const priceB = b.auction.isActive && b.auction.highestBid ? b.auction.highestBid : b.price
            return priceA - priceB
          })
          break
        case 'trending':
          filtered.sort((a, b) => b.views - a.views)
          break
        default:
          break
      }
      
      setFilteredNFTs(filtered)
    }
  }, [nfts, searchParams, filters])
  
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 10],
      sortBy: 'newest',
      onlyAuctions: false,
    })
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore NFTs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover, collect, and sell extraordinary NFTs
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-4">
          <div className="flex items-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              aria-label="Grid view"
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              aria-label="List view"
            >
              <FiList />
            </button>
          </div>
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center btn btn-outline"
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>
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
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sort By</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="trending">Trending</option>
              </select>
            </div>
            
            {/* Auction filter */}
            <div>
              <div className="flex items-center">
                <input
                  id="only-auctions"
                  name="only-auctions"
                  type="checkbox"
                  checked={filters.onlyAuctions}
                  onChange={(e) => handleFilterChange('onlyAuctions', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="only-auctions" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  Only show auctions
                </label>
              </div>
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
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="trending">Trending</option>
                        </select>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-center">
                          <input
                            id="mobile-only-auctions"
                            name="only-auctions"
                            type="checkbox"
                            checked={filters.onlyAuctions}
                            onChange={(e) => handleFilterChange('onlyAuctions', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor="mobile-only-auctions" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                            Only show auctions
                          </label>
                        </div>
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
              Showing <span className="font-medium">{filteredNFTs.length}</span> results
            </p>
            
            {/* Mobile sort */}
            <div className="lg:hidden">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input py-1 px-2 text-sm"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="price-high">Sort: Price High to Low</option>
                <option value="price-low">Sort: Price Low to High</option>
                <option value="trending">Sort: Trending</option>
              </select>
            </div>
          </div>
          
          {/* NFT Grid */}
          <NFTGrid nfts={filteredNFTs} loading={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default Explore
