// File Directory: src/pages/FAQ.jsx

import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const faqs = [
  { q: 'How do I search for a movie?', a: 'Use the search box on the top of the site or browse by genre.' },
  { q: 'How do I bookmark news articles?', a: 'Click the bookmark icon on any news card; bookmarks are saved in your browser.' },
  { q: 'Why is a trailer not showing?', a: 'Some YouTube embeds may be blocked. Use the "Open on YouTube" fallback.' },
];

function FAQ() {
  return (
    <div>
      <Navbar />
      <main className="min-h-[70vh] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-6">FAQ</h1>
          </div>
          <div className="mt-4 max-w-2xl mx-auto space-y-4">
            {faqs.map((f, idx) => (
              <details key={idx} className="bg-gray-800 p-4 rounded border border-gray-700">
                <summary className="font-medium text-white cursor-pointer">{f.q}</summary>
                <p className="mt-2 text-gray-300">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FAQ;
