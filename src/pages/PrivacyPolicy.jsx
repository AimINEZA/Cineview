// File Directory: src/pages/PrivacyPolicy.jsx

import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function PrivacyPolicy() {
  return (
    <div>
      <Navbar />
      <main className="min-h-[70vh] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-4">Privacy Policy</h1>
          <p className="text-gray-300">This is a minimal placeholder privacy policy. Replace with your legal text before publishing.</p>
          <div className="mt-6 bg-gray-800 p-6 rounded border border-gray-700 text-gray-300">
            <h2 className="font-semibold mb-2">Data Collection</h2>
            <p>We store bookmarks and suggestions locally in your browser. No user data is sent to third parties by default.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
