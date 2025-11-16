// File Directory: src/pages/TermsOfService.jsx

import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function TermsOfService() {
  return (
    <div>
      <Navbar />
      <main className="min-h-[70vh] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-4">Terms of Service</h1>
          <p className="text-gray-300">This is a placeholder Terms of Service page. Update with legally reviewed terms for production.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TermsOfService;
