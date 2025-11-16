// File Directory: src/pages/HelpCenter.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function HelpCenter() {
  return (
    <div>
      <Navbar />
      <main className="min-h-[70vh] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-4">Help Center</h1>
          <p className="text-gray-300 mb-6">Find answers to common questions about cineView, accounts, and usage.</p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/faq" className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition">
              <h3 className="text-lg font-semibold text-white">Frequently Asked Questions</h3>
              <p className="text-gray-400 mt-2">Quick answers to common questions.</p>
            </Link>

            <Link to="/contact" className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition">
              <h3 className="text-lg font-semibold text-white">Contact Support</h3>
              <p className="text-gray-400 mt-2">Reach out to our support team for help.</p>
            </Link>

            <Link to="/sitemap" className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition">
              <h3 className="text-lg font-semibold text-white">Site Map</h3>
              <p className="text-gray-400 mt-2">Overview of pages and structure.</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HelpCenter;
