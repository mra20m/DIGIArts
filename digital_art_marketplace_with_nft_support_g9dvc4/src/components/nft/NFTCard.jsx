import React from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiClock, FiEye } from 'react-icons/fi'
import Countdown from 'react-countdown'

const NFTCard = ({ nft }) => {
  const { id, title, image, price, currency, creator, auction, likes, views } = nft
  
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
    <div className="card group">
      <Link to={`/artwork/${id}`} className="block overflow-hidden relative">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-xl bg-gray-200 relative">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
          />
          
          {auction?.isActive && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <FiClock className="mr-1" />
              <Countdown date={new Date(auction.endTime)} renderer={countdownRenderer} />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{creator.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <FiHeart className="mr-1" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center">
                <FiEye className="mr-1" />
                <span>{views}</span>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 truncate">{title}</h3>
          
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current price</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {auction?.isActive && auction?.highestBid ? auction.highestBid : price} {currency}
              </p>
            </div>
            
            <button className="btn btn-primary text-sm">
              {auction?.isActive ? 'Place bid' : 'Buy now'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default NFTCard
