// File Directory: src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import {Clapperboard, Menu } from 'lucide-react';

/**
 * Responsive Navigation Bar component with primary links.
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { to: "/home", label: "Home" },
    // Explore removed
    { to: "/genre", label: "Genre" },
    { to: "/news", label: "News" },
    { to: "/bookmarks", label: "Bookmarks" },
    { to: "/movies", label: "Movies" },
    { to: "/tv-shows", label: "TV Shows" },
  ];

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-400 hover:text-blue-300 transition duration-300">
          <Clapperboard className="w-6 h-6" />
          <span>cineView</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="text-gray-300 hover:text-white transition duration-200 font-medium tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search & Mobile Menu */}
        <div className="flex items-center space-x-4">
          
          <button 
            className="lg:hidden text-gray-300 hover:text-white transition duration-200 p-2 rounded-full hover:bg-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-700 pb-4 shadow-xl">
          <nav className="flex flex-col space-y-2 px-6">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="block py-2 text-gray-200 hover:bg-gray-600 rounded-lg transition duration-200"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
