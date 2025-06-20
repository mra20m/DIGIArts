import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useNFTStore } from '../../store/nftStore'
import { toast } from 'react-toastify'

const PlaceBidForm = ({ nft, onBidPlaced }) => {
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  const { placeBid } = useNFTStore()
  
  const minBid = nft.auction.highestBid 
    ? (parseFloat(nft.auction.highestBid) + 0.1).toFixed(1) 
    : parseFloat(nft.price).toFixed(1)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please sign in to place a bid')
      return
    }
    
    if (parseFloat(bidAmount) < parseFloat(minBid)) {
      toast.error(`Bid must be at least ${minBid} ETH`)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await placeBid(nft.id, parseFloat(bidAmount), {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      })
      
      toast.success('Bid placed successfully!')
      setBidAmount('')
      
      if (onBidPlaced) {
        onBidPlaced()
      }
    } catch (error) {
      toast.error(error.message || 'Failed to place bid')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Place a Bid</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bid Amount (ETH)
          </label>
          <div className="relative">
            <input
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={minBid}
              step="0.1"
              placeholder={`${minBid} ETH or more`}
              className="input pr-12"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">ETH</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Minimum bid: {minBid} ETH
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Your balance: <span className="font-medium text-gray-900 dark:text-white">5.0 ETH</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Service fee: <span className="font-medium text-gray-900 dark:text-white">2.5%</span>
          </div>
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting || !isAuthenticated}
        >
          {isSubmitting ? 'Processing...' : 'Place Bid'}
        </button>
        
        {!isAuthenticated && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Please sign in to place a bid
          </p>
        )}
      </form>
    </div>
  )
}

export default PlaceBidForm
