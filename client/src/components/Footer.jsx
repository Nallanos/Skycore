import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-skylume-secondary text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-skylume-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-lg font-semibold">SkyLume</span>
          </div>
          <p className="text-skylume-light mb-4">
            Discover your social influence with SkyScore™
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-skylume-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-skylume-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-skylume-primary transition-colors">Contact</a>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-skylume-light text-sm">
              © 2024 SkyLume. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer