// File Directory: src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
// FIX: Removing the explicit .jsx extension from imports to resolve file path errors in this specific environment.
import HomePage from './pages/HomePage';
import ServiceBanner from './components/ServiceBanner';
import GenrePage from './pages/GenrePage';
import NewsPage from './pages/NewsPage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowspage';
import BookmarksPage from './pages/BookmarksPage';

import HelpCenter from './pages/HelpCenter';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import Sitemap from './pages/Sitemap';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

/**
 * Main application component responsible for defining all routes.
 */
function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter">
      <ServiceBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        {/* Explore page removed */}
        <Route path="/genre" element={<GenrePage />} />
        <Route path="/news" element={<NewsPage />} />
  <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/tv-shows" element={<TVShowsPage />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
        {/* You could add a 404/NotFound page here */}
      </Routes>
    </div>
  );
}

export default App;
