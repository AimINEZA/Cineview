// File Directory: src/pages/ContactUs.jsx

import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function ContactUs() {
  return (
    <div>
      <Navbar />
      <main className="min-h-[70vh] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-4">Contact Us</h1>
          <p className="text-gray-300 mb-6">Send us a message and we'll get back to you as soon as possible.</p>

          <div className="max-w-2xl bg-gray-800 p-6 rounded-lg border border-gray-700">
            <label className="block text-sm text-gray-300">Your email</label>
            <input className="mt-1 w-full p-2 rounded bg-gray-900 border border-gray-700 text-white" placeholder="you@example.com" />

            <label className="block text-sm text-gray-300 mt-4">Message</label>
            <textarea className="mt-1 w-full p-2 rounded bg-gray-900 border border-gray-700 text-white" rows="6" placeholder="How can we help?" />

            <div className="mt-4 text-right">
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">Send Message</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ContactUs;
