// File Directory: src/pages/Sitemap.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function Sitemap() {
  return (
    <div>
      <Navbar />
      <main className="min-h-[70vh] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-4">Site Map</h1>
          <p className="text-gray-300 mb-6">A quick overview of pages on cineView.</p>

          <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <li><Link to="/" className="text-gray-200 hover:text-white">Home</Link></li>
            <li><Link to="/genre" className="text-gray-200 hover:text-white">Genre</Link></li>
            <li><Link to="/movies" className="text-gray-200 hover:text-white">Movies</Link></li>
            <li><Link to="/tv-shows" className="text-gray-200 hover:text-white">TV Shows</Link></li>
            <li><Link to="/news" className="text-gray-200 hover:text-white">News</Link></li>
            <li><Link to="/bookmarks" className="text-gray-200 hover:text-white">Bookmarks</Link></li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Sitemap;
