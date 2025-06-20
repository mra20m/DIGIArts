import NFTCard from './NFTCard'

const NFTGrid = ({ nfts, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="aspect-w-1 aspect-h-1 w-full rounded-t-xl bg-gray-300 dark:bg-gray-700"></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 mr-2"></div>
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (!nfts || nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No NFTs found</h3>
        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  )
}

export default NFTGrid
