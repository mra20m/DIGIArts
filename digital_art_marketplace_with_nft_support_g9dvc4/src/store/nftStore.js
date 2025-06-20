import { create } from 'zustand'

export const useNFTStore = create((set, get) => ({
  nfts: [],
  featuredNFTs: [],
  trendingNFTs: [],
  userNFTs: [],
  currentNFT: null,
  isLoading: false,
  error: null,
  
  // Mock data initialization
  initializeStore: () => {
    const mockNFTs = [
      {
        id: '1',
        title: 'Cosmic Perspective',
        description: 'A journey through the cosmos, exploring the vastness of space and our place within it.',
        image: 'https://images.pexels.com/photos/1341279/pexels-photo-1341279.jpeg?auto=compress&cs=tinysrgb&w=1600',
        price: 2.5,
        currency: 'ETH',
        creator: {
          id: '1',
          name: 'John Doe',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        owner: {
          id: '2',
          name: 'Jane Smith',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        createdAt: '2023-06-15T10:30:00Z',
        likes: 156,
        views: 1024,
        tokenId: '0x123456789',
        blockchain: 'Ethereum',
        auction: {
          isActive: true,
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          highestBid: 2.7,
          highestBidder: {
            id: '3',
            name: 'Mike Johnson',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          },
          bids: [
            { amount: 2.7, bidder: 'Mike Johnson', time: '2023-06-16T14:30:00Z' },
            { amount: 2.6, bidder: 'Alice Williams', time: '2023-06-16T12:15:00Z' },
            { amount: 2.5, bidder: 'Bob Brown', time: '2023-06-16T10:45:00Z' },
          ]
        }
      },
      {
        id: '2',
        title: 'Digital Dreamscape',
        description: 'An exploration of the subconscious mind through digital art, blending reality and imagination.',
        image: 'https://images.pexels.com/photos/3109807/pexels-photo-3109807.jpeg?auto=compress&cs=tinysrgb&w=1600',
        price: 1.8,
        currency: 'ETH',
        creator: {
          id: '3',
          name: 'Mike Johnson',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        owner: {
          id: '3',
          name: 'Mike Johnson',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        createdAt: '2023-06-10T15:45:00Z',
        likes: 89,
        views: 567,
        tokenId: '0x987654321',
        blockchain: 'Ethereum',
        auction: {
          isActive: false,
          endTime: null,
          highestBid: null,
          highestBidder: null,
          bids: []
        }
      },
      {
        id: '3',
        title: 'Neon Metropolis',
        description: 'A vibrant cityscape inspired by cyberpunk aesthetics and futuristic urban environments.',
        image: 'https://images.pexels.com/photos/1910236/pexels-photo-1910236.jpeg?auto=compress&cs=tinysrgb&w=1600',
        price: 3.2,
        currency: 'ETH',
        creator: {
          id: '2',
          name: 'Jane Smith',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        owner: {
          id: '1',
          name: 'John Doe',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        createdAt: '2023-06-05T09:20:00Z',
        likes: 215,
        views: 1432,
        tokenId: '0xabcdef123',
        blockchain: 'Ethereum',
        auction: {
          isActive: true,
          endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
          highestBid: 3.5,
          highestBidder: {
            id: '4',
            name: 'Alice Williams',
            avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          },
          bids: [
            { amount: 3.5, bidder: 'Alice Williams', time: '2023-06-16T16:30:00Z' },
            { amount: 3.4, bidder: 'John Doe', time: '2023-06-16T14:20:00Z' },
            { amount: 3.3, bidder: 'Bob Brown', time: '2023-06-16T11:10:00Z' },
          ]
        }
      },
      {
        id: '4',
        title: 'Abstract Emotions',
        description: 'A series of abstract shapes and colors representing different human emotions and states of mind.',
        image: 'https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg?auto=compress&cs=tinysrgb&w=1600',
        price: 1.5,
        currency: 'ETH',
        creator: {
          id: '4',
          name: 'Alice Williams',
          avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        owner: {
          id: '4',
          name: 'Alice Williams',
          avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        createdAt: '2023-06-12T13:15:00Z',
        likes: 76,
        views: 489,
        tokenId: '0x456789abc',
        blockchain: 'Ethereum',
        auction: {
          isActive: false,
          endTime: null,
          highestBid: null,
          highestBidder: null,
          bids: []
        }
      },
      {
        id: '5',
        title: 'Digital Flora',
        description: 'A digital garden of impossible plants and flowers, exploring the intersection of nature and technology.',
        image: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=1600',
        price: 2.1,
        currency: 'ETH',
        creator: {
          id: '5',
          name: 'Bob Brown',
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        owner: {
          id: '2',
          name: 'Jane Smith',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        createdAt: '2023-06-08T11:50:00Z',
        likes: 124,
        views: 876,
        tokenId: '0xdef123456',
        blockchain: 'Ethereum',
        auction: {
          isActive: true,
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          highestBid: 2.3,
          highestBidder: {
            id: '1',
            name: 'John Doe',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          },
          bids: [
            { amount: 2.3, bidder: 'John Doe', time: '2023-06-16T15:40:00Z' },
            { amount: 2.2, bidder: 'Mike Johnson', time: '2023-06-16T13:25:00Z' },
            { amount: 2.1, bidder: 'Alice Williams', time: '2023-06-16T10:15:00Z' },
          ]
        }
      },
      {
        id: '6',
        title: 'Quantum Fragments',
        description: 'Inspired by quantum physics, this piece explores the fragmented nature of reality at the smallest scales.',
        image: 'https://images.pexels.com/photos/3222686/pexels-photo-3222686.jpeg?auto=compress&cs=tinysrgb&w=1600',
        price: 4.0,
        currency: 'ETH',
        creator: {
          id: '1',
          name: 'John Doe',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        owner: {
          id: '5',
          name: 'Bob Brown',
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        createdAt: '2023-06-01T16:40:00Z',
        likes: 267,
        views: 1876,
        tokenId: '0x789abcdef',
        blockchain: 'Ethereum',
        auction: {
          isActive: false,
          endTime: null,
          highestBid: null,
          highestBidder: null,
          bids: []
        }
      }
    ]
    
    set({ 
      nfts: mockNFTs,
      featuredNFTs: [mockNFTs[0], mockNFTs[2], mockNFTs[4]],
      trendingNFTs: [mockNFTs[5], mockNFTs[2], mockNFTs[0], mockNFTs[3]],
      userNFTs: [mockNFTs[0], mockNFTs[5]]
    })
  },
  
  fetchNFTs: async () => {
    set({ isLoading: true, error: null })
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // If store is empty, initialize it
      if (get().nfts.length === 0) {
        get().initializeStore()
      }
      
      set({ isLoading: false })
      return get().nfts
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch NFTs',
        isLoading: false
      })
      throw error
    }
  },
  
  fetchNFTById: async (id) => {
    set({ isLoading: true, error: null, currentNFT: null })
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // If store is empty, initialize it
      if (get().nfts.length === 0) {
        get().initializeStore()
      }
      
      const nft = get().nfts.find(nft => nft.id === id)
      
      if (!nft) {
        throw new Error('NFT not found')
      }
      
      set({ currentNFT: nft, isLoading: false })
      return nft
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch NFT',
        isLoading: false
      })
      throw error
    }
  },
  
  createNFT: async (nftData) => {
    set({ isLoading: true, error: null })
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newNFT = {
        id: Date.now().toString(),
        ...nftData,
        createdAt: new Date().toISOString(),
        likes: 0,
        views: 0,
        tokenId: `0x${Math.random().toString(16).substr(2, 8)}`,
        blockchain: 'Ethereum',
        auction: {
          isActive: nftData.auction?.isActive || false,
          endTime: nftData.auction?.endTime || null,
          highestBid: null,
          highestBidder: null,
          bids: []
        }
      }
      
      set(state => ({ 
        nfts: [newNFT, ...state.nfts],
        userNFTs: [newNFT, ...state.userNFTs],
        isLoading: false
      }))
      
      return newNFT
    } catch (error) {
      set({ 
        error: error.message || 'Failed to create NFT',
        isLoading: false
      })
      throw error
    }
  },
  
  placeBid: async (nftId, bidAmount, bidder) => {
    set({ isLoading: true, error: null })
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(state => {
        const updatedNFTs = state.nfts.map(nft => {
          if (nft.id === nftId && nft.auction.isActive) {
            // Ensure bid is higher than current highest
            if (!nft.auction.highestBid || bidAmount > nft.auction.highestBid) {
              const newBid = {
                amount: bidAmount,
                bidder: bidder.name,
                time: new Date().toISOString()
              }
              
              return {
                ...nft,
                auction: {
                  ...nft.auction,
                  highestBid: bidAmount,
                  highestBidder: bidder,
                  bids: [newBid, ...nft.auction.bids]
                }
              }
            }
          }
          return nft
        })
        
        // Also update currentNFT if it matches
        let updatedCurrentNFT = state.currentNFT
        if (state.currentNFT && state.currentNFT.id === nftId) {
          updatedCurrentNFT = updatedNFTs.find(nft => nft.id === nftId)
        }
        
        return { 
          nfts: updatedNFTs,
          currentNFT: updatedCurrentNFT,
          isLoading: false
        }
      })
      
      return get().nfts.find(nft => nft.id === nftId)
    } catch (error) {
      set({ 
        error: error.message || 'Failed to place bid',
        isLoading: false
      })
      throw error
    }
  }
}))
