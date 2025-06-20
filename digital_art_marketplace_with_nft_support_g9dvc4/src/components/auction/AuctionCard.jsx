import React from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiArrowUp } from 'react-icons/fi'
import Countdown from 'react-countdown'

const AuctionCard = ({ auction }) => {
  const { id, title, image, auction: auctionData, creator } = auction
  
  // Countdown renderer
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span className="text-red-500">Auction ended</span>
    } else {
      return (
        <span>
          {days > 0 && `${days}d `}
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </span>
      )
    }
  }
  
  return (
    <div className="card group overflow-hidden">
      <div className="relative">
        <Link to={`/artwork/${id}`}>
          <img
            src={image}
            alt={title}
            className="h-48 w-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
        
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <FiClock className="mr-1" />
          <Countdown date={new Date(auctionData.endTime)} renderer={countdownRenderer} />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{creator.name}</span>
        </div>
        
        <Link to={`/artwork/${id}`}>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 truncate">{title}</h3>
        </Link>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current bid</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {auctionData.highestBid} ETH
              </p>
            </div>
            
            {auctionData.bids.length > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Bid count</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  <FiArrowUp className="text-green-500 mr-1" />
                  {auctionData.bids.length}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <Link to={`/artwork/${id}`} className="btn btn-primary w-full text-center">
          Place a bid
        </Link>
      </div>
    </div>
  )
}

export default AuctionCard
