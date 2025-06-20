import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUpload, FiX, FiInfo, FiCalendar } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import { useNFTStore } from '../store/nftStore'
import { toast } from 'react-toastify'

const CreateNFT = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { createNFT, isLoading } = useNFTStore()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    category: 'art',
    tags: '',
    isAuction: false,
    auctionEndDate: '',
    auctionEndTime: ''
  })
  
  const [previewImage, setPreviewImage] = useState('')
  const [errors, setErrors] = useState({})
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login')
    return null
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        image: 'Please upload a valid image file (JPEG, PNG, GIF, or WEBP)' 
      }))
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ 
        ...prev, 
        image: 'Image size should be less than 5MB' 
      }))
      return
    }
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result)
      setFormData(prev => ({ ...prev, image: reader.result }))
      setErrors(prev => ({ ...prev, image: '' }))
    }
    reader.readAsDataURL(file)
  }
  
  const removeImage = () => {
    setPreviewImage('')
    setFormData(prev => ({ ...prev, image: '' }))
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.image) {
      newErrors.image = 'Image is required'
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price'
    }
    
    if (formData.isAuction) {
      if (!formData.auctionEndDate) {
        newErrors.auctionEndDate = 'End date is required for auctions'
      }
      
      if (!formData.auctionEndTime) {
        newErrors.auctionEndTime = 'End time is required for auctions'
      }
      
      // Check if auction end date/time is in the future
      if (formData.auctionEndDate && formData.auctionEndTime) {
        const endDateTime = new Date(`${formData.auctionEndDate}T${formData.auctionEndTime}`)
        if (endDateTime <= new Date()) {
          newErrors.auctionEndDate = 'Auction end time must be in the future'
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    try {
      // Prepare auction data if it's an auction
      let auctionData = null
      if (formData.isAuction) {
        const endDateTime = new Date(`${formData.auctionEndDate}T${formData.auctionEndTime}`)
        auctionData = {
          isActive: true,
          endTime: endDateTime.toISOString()
        }
      }
      
      // Create NFT
      const nftData = {
        title: formData.title,
        description: formData.description,
        image: formData.image || 'https://images.pexels.com/photos/3109807/pexels-photo-3109807.jpeg?auto=compress&cs=tinysrgb&w=1600',
        price: parseFloat(formData.price),
        currency: 'ETH',
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        creator: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        },
        owner: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        },
        auction: auctionData
      }
      
      const newNFT = await createNFT(nftData)
      
      toast.success('NFT created successfully!')
      navigate(`/artwork/${newNFT.id}`)
    } catch (error) {
      toast.error(error.message || 'Failed to create NFT')
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create New NFT</h1>
      
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Image upload */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload File
                  </label>
                  
                  {!previewImage ? (
                    <div 
                      className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        errors.image 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900 dark:bg-opacity-10' 
                          : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'
                      }`}
                    >
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <label 
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <FiUpload className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          PNG, JPG, GIF, or WEBP (max 5MB)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Drag and drop or click to browse
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-auto object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  
                  {errors.image && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
                  )}
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiInfo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Information</h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>File types supported: JPG, PNG, GIF, WEBP</li>
                          <li>Max size: 5MB</li>
                          <li>Recommended aspect ratio: 1:1</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right column - Form fields */}
              <div>
                <div className="mb-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. 'Cosmic Perspective'"
                    className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Provide a detailed description of your NFT"
                    className={`input ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="art">Art</option>
                      <option value="photography">Photography</option>
                      <option value="music">Music</option>
                      <option value="collectibles">Collectibles</option>
                      <option value="sports">Sports</option>
                      <option value="utility">Utility</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (ETH)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 0.5"
                      step="0.01"
                      min="0"
                      className={`input ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g. abstract, digital, modern"
                    className="input"
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAuction"
                      name="isAuction"
                      checked={formData.isAuction}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isAuction" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                      Create as auction
                    </label>
                  </div>
                </div>
                
                {formData.isAuction && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                    <div className="flex items-center mb-4">
                      <FiCalendar className="text-gray-500 mr-2" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Auction Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="auctionEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="auctionEndDate"
                          name="auctionEndDate"
                          value={formData.auctionEndDate}
                          onChange={handleChange}
                          className={`input ${errors.auctionEndDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.auctionEndDate && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.auctionEndDate}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="auctionEndTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          id="auctionEndTime"
                          name="auctionEndTime"
                          value={formData.auctionEndTime}
                          onChange={handleChange}
                          className={`input ${errors.auctionEndTime ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.auctionEndTime && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.auctionEndTime}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create NFT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateNFT
