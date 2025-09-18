import React from 'react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-skylume-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-skylume-secondary">SkyLume</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-skylume-accent hover:text-skylume-secondary transition-colors">
              About
            </a>
            <a href="#" className="text-skylume-accent hover:text-skylume-secondary transition-colors">
              How it Works
            </a>
            <a href="#" className="text-skylume-accent hover:text-skylume-secondary transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header