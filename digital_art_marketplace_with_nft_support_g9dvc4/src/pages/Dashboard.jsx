import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiGrid, FiClock, FiDollarSign, FiUser, FiSettings, FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import { useNFTStore } from '../store/nftStore'
import NFTCard from '../components/nft/NFTCard'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateProfile } = useAuthStore()
  const { nfts, userNFTs, fetchNFTs } = useNFTStore()
  const [activeTab, setActiveTab] = useState('nfts')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    email: '',
    website: '',
    twitter: '',
    instagram: ''
  })
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])
  
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        email: user.email || '',
        website: user.website || '',
        twitter: user.twitter || '',
        instagram: user.instagram || ''
      })
    }
    
    fetchNFTs()
  }, [user, fetchNFTs])
  
  if (!isAuthenticated || !user) {
    return null
  }
  
  // Filter NFTs based on active tab
  const getFilteredNFTs = () => {
    switch (activeTab) {
      case 'nfts':
        return nfts.filter(nft => nft.creator.id === user.id || nft.owner.id === user.id)
      case 'auctions':
        return nfts.filter(nft => nft.owner.id === user.id && nft.auction.isActive)
      case 'sales':
        // In a real app, we would have sales data
        // For now, return a subset of NFTs as "sold"
        return nfts.filter((nft, index) => nft.creator.id === user.id && index % 2 === 0).slice(0, 2)
      default:
        return []
    }
  }
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleProfileSubmit = (e) => {
    e.preventDefault()
    
    updateProfile(profileData)
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }
  
  // Calculate earnings (mock data)
  const totalEarnings = 12.5 // ETH
  const pendingEarnings = 2.3 // ETH
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Dashboard</h1>
        
        <div className="flex space-x-3">
          <Link to="/create" className="btn btn-primary">
            <FiPlus className="mr-2" />
            Create NFT
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Wallet Address</div>
                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white font-mono text-sm truncate">
                    {user.walletAddress}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.walletAddress)
                      toast.success('Wallet address copied!')
                    }}
                    className="ml-2 text-primary-600 hover:text-primary-700 text-xs"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Total Earnings</span>
                  <span className="font-medium text-gray-900 dark:text-white">{totalEarnings} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Pending</span>
                  <span className="font-medium text-gray-900 dark:text-white">{pendingEarnings} ETH</span>
                </div>
              </div>
            </div>
            
            <nav className="px-3 py-2 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setActiveTab('nfts')}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-lg mb-1 ${
                  activeTab === 'nfts'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FiGrid className="mr-3" />
                My NFTs
              </button>
              
              <button
                onClick={() => setActiveTab('auctions')}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-lg mb-1 ${
                  activeTab === 'auctions'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FiClock className="mr-3" />
                Active Auctions
              </button>
              
              <button
                onClick={() => setActiveTab('sales')}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-lg mb-1 ${
                  activeTab === 'sales'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FiDollarSign className="mr-3" />
                Sales & Earnings
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-lg mb-1 ${
                  activeTab === 'profile'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FiUser className="mr-3" />
                Profile Settings
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                  activeTab === 'settings'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FiSettings className="mr-3" />
                Account Settings
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* NFTs tab */}
          {activeTab === 'nfts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My NFTs</h2>
                <Link to="/create" className="btn btn-outline btn-sm">
                  <FiPlus className="mr-1" /> Create New
                </Link>
              </div>
              
              {getFilteredNFTs().length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredNFTs().map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <FiGrid className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No NFTs found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You haven't created or collected any NFTs yet.
                  </p>
                  <div className="mt-6">
                    <Link to="/create" className="btn btn-primary">
                      Create your first NFT
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Auctions tab */}
          {activeTab === 'auctions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Auctions</h2>
              </div>
              
              {getFilteredNFTs().length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredNFTs().map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <FiClock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No active auctions</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You don't have any active auctions at the moment.
                  </p>
                  <div className="mt-6">
                    <Link to="/create" className="btn btn-primary">
                      Create an auction
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Sales tab */}
          {activeTab === 'sales' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sales & Earnings</h2>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Earnings Overview</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEarnings} ETH</p>
                      <p className="text-sm text-green-600">+2.5 ETH this month</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pending Earnings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingEarnings} ETH</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">From 2 active auctions</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">NFTs Sold</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                      <p className="text-sm text-green-600">+2 this month</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Sales</h3>
                  
                  {getFilteredNFTs().length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Item
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Buyer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          {getFilteredNFTs().map((nft) => (
                            <tr key={nft.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img className="h-10 w-10 rounded-md object-cover" src={nft.image} alt={nft.title} />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{nft.title}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">{nft.price} ETH</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img className="h-6 w-6 rounded-full mr-2" src={nft.owner.avatar} alt={nft.owner.name} />
                                  <div className="text-sm text-gray-900 dark:text-white">{nft.owner.name}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(nft.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No sales data available yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Profile settings tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-sm"
                  >
                    <FiEdit3 className="mr-1" /> Edit Profile
                  </button>
                )}
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6">
                  {isEditing ? (
                    <form onSubmit={handleProfileSubmit}>
                      <div className="mb-6">
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Profile Picture
                        </label>
                        <div className="flex items-center">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-16 w-16 rounded-full object-cover mr-4"
                          />
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            disabled
                          >
                            Change
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Display Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            className="input"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="input"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows="4"
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          className="input"
                          placeholder="Tell the world about yourself"
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={profileData.website}
                            onChange={handleProfileChange}
                            className="input"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Twitter
                          </label>
                          <input
                            type="text"
                            id="twitter"
                            name="twitter"
                            value={profileData.twitter}
                            onChange={handleProfileChange}
                            className="input"
                            placeholder="@username"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="btn btn-outline"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Display Name</h3>
                        <p className="text-lg text-gray-900 dark:text-white">{user.name}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h3>
                        <p className="text-lg text-gray-900 dark:text-white">{user.email}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bio</h3>
                        <p className="text-gray-900 dark:text-white">
                          {user.bio || 'No bio provided yet.'}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Website</h3>
                          <p className="text-gray-900 dark:text-white">
                            {user.website ? (
                              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                                {user.website}
                              </a>
                            ) : (
                              'Not provided'
                            )}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Twitter</h3>
                          <p className="text-gray-900 dark:text-white">
                            {user.twitter ? (
                              <a href={`https://twitter.com/${user.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                                {user.twitter}
                              </a>
                            ) : (
                              'Not provided'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Account settings tab */}
          {activeTab === 'settings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Wallet</h3>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Connected Wallet</p>
                        <p className="font-mono text-gray-900 dark:text-white">{user.walletAddress}</p>
                      </div>
                      <button className="btn btn-outline btn-sm" disabled>
                        Change
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your account activity</p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="email-notifications" defaultChecked className="sr-only" />
                          <div className="block bg-gray-300 dark:bg-gray-700 w-10 h-6 rounded-full"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">Auction Alerts</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when you're outbid or when auctions end</p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="auction-alerts" defaultChecked className="sr-only" />
                          <div className="block bg-gray-300 dark:bg-gray-700 w-10 h-6 rounded-full"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">New Sale Notifications</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when your NFTs are sold</p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="sale-notifications" defaultChecked className="sr-only" />
                          <div className="block bg-gray-300 dark:bg-gray-700 w-10 h-6 rounded-full"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                    
                    <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-800 dark:text-red-300 font-medium">Delete Account</p>
                          <p className="text-sm text-red-700 dark:text-red-400">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                        </div>
                        <button className="btn bg-red-600 hover:bg-red-700 text-white">
                          <FiTrash2 className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
