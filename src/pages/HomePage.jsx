// File Directory: src/pages/HomePage.jsx

import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Trending from '../components/Trending.jsx';
import CoverImage from '../components/CoverImage.jsx';
import Suggestions from '../components/Suggestions.jsx';

/**
 * Main landing page component.
 */
function HomePage() {
  return (
    <div>
      <Navbar />
      <main>
        <CoverImage />
        <Trending />
        
        {/* Simple Section Placeholder */}
        <div className="container mx-auto px-6 md:px-12 py-10">
          <Suggestions />
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
