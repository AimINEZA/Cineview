// File Directory: src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Clapperboard, X } from 'lucide-react';

/**
 * Styled footer component for consistent site navigation and information.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 border-t border-gray-700 mt-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 divide-y divide-gray-700 sm:divide-y-0">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-400 mb-3">
              <Clapperboard className="w-6 h-6" />
              <span>cineView</span>
            </Link>
            <p className="text-sm max-w-xs">
              Your ultimate destination for discovering and enjoying the best movies and TV shows.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="list-none space-y-2 text-sm">
              <li><Link to="/genre" className="hover:text-blue-400 transition-colors">Genre</Link></li>
              <li><Link to="/movies" className="hover:text-blue-400 transition-colors">Movies</Link></li>
              <li><Link to="/tv-shows" className="hover:text-blue-400 transition-colors">TV Shows</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="list-none space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
              <li><Link to="/sitemap" className="hover:text-blue-400 transition-colors">Site Map</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="list-none space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
            <div className="flex space-x-4 justify-center lg:justify-end">
              <a href="https://web.facebook.com/aime.ineza.399" className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-900 hover:bg-gray-700 shadow-sm">
                <Facebook size={20} />
              </a>
              <a href="https://x.com/AimINEZA2" className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-900 hover:bg-gray-700 shadow-sm">
                <X size={20} />
              </a>
              <a href="https://www.instagram.com/fab_ineza/" className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-900 hover:bg-gray-700 shadow-sm">
                <Instagram size={20} />
              </a>
              <a href="https://www.youtube.com/@Netflix" className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full bg-gray-900 hover:bg-gray-700 shadow-sm">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-sm flex flex-col md:flex-row md:justify-between items-center gap-2">
          <p className="text-center md:text-left">&copy; {currentYear} cineView. All rights reserved.</p>
          <div className="flex items-center gap-3 text-gray-400">
            <small className="block md:inline">Built by INEZA.</small>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
//