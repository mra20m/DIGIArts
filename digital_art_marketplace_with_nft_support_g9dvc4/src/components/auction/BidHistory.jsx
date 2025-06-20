import { useState } from 'react'
import { FiArrowUp, FiClock } from 'react-icons/fi'

const BidHistory = ({ bids }) => {
  const [expanded, setExpanded] = useState(false)
  
  if (!bids || bids.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No bids yet. Be the first to place a bid!</p>
      </div>
    )
  }
  
  // Sort bids by amount in descending order
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount)
  
  // Display all bids if expanded, otherwise only the top 3
  const displayBids = expanded ? sortedBids : sortedBids.slice(0, 3)
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bid History</h3>
      
      <div className="space-y-3">
        {displayBids.map((bid, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-3 rounded-lg ${
              index === 0 ? 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20' : 'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center">
              {index === 0 && <FiArrowUp className="text-green-500 mr-2" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{bid.bidder}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <FiClock className="mr-1" /> {formatDate(bid.time)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${index === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {bid.amount} ETH
              </p>
              {index === 0 && <p className="text-xs text-green-600 dark:text-green-400">Highest bid</p>}
            </div>
          </div>
        ))}
      </div>
      
      {bids.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          {expanded ? 'Show less' : `Show all ${bids.length} bids`}
        </button>
      )}
    </div>
  )
}

export default BidHistory
