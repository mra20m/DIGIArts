import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Mock login function (in a real app, this would call an API)
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock user data
          const userData = {
            id: '1',
            name: 'John Doe',
            email,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            walletAddress: '0x1234...5678',
            bio: 'Digital artist specializing in abstract and surreal art',
            createdAt: new Date().toISOString(),
          }
          
          set({ 
            user: userData,
            isAuthenticated: true,
            isLoading: false
          })
          
          return userData
        } catch (error) {
          set({ 
            error: error.message || 'Failed to login',
            isLoading: false
          })
          throw error
        }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock user data
          const userData = {
            id: '1',
            name,
            email,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            walletAddress: '0x1234...5678',
            bio: '',
            createdAt: new Date().toISOString(),
          }
          
          set({ 
            user: userData,
            isAuthenticated: true,
            isLoading: false
          })
          
          return userData
        } catch (error) {
          set({ 
            error: error.message || 'Failed to register',
            isLoading: false
          })
          throw error
        }
      },
      
      logout: () => {
        set({ 
          user: null,
          isAuthenticated: false
        })
      },
      
      checkAuth: () => {
        // In a real app, this would verify the token with the backend
        // For now, we rely on the persisted state
      },
      
      updateProfile: (profileData) => {
        set(state => ({
          user: { ...state.user, ...profileData }
        }))
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)
