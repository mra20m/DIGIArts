import React from 'react'
import { Link } from 'react-router-dom'
import { FiTwitter, FiInstagram, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">ArtVerse</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              A digital art marketplace with NFT support, creator profiles, and auction system. Discover, collect, and sell extraordinary NFTs.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <FiGithub className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Marketplace */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Marketplace</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/explore" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  All NFTs
                </Link>
              </li>
              <li>
                <Link to="/explore?category=art" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Art
                </Link>
              </li>
              <li>
                <Link to="/explore?category=photography" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Photography
                </Link>
              </li>
              <li>
                <Link to="/explore?category=music" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Music
                </Link>
              </li>
              <li>
                <Link to="/explore?category=collectibles" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Collectibles
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Account */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Account</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/profile" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Create
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Platform Status
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-base text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} ArtVerse. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
