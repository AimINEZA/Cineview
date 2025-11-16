// File Directory: src/pages/CookiePolicy.jsx

import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function CookiePolicy() {
  return (
    <div>
      <Navbar />
      <main className="min-h-[70vh] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-4">Cookie Policy</h1>
            <p className="text-gray-300">We use browser storage for bookmarks and session storage for suggestions. No tracking cookies are set by default in this demo.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CookiePolicy;
