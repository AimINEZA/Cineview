import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { getBookmarks, removeBookmark } from '../lib/bookmarks.js';

function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  function handleRemove(url) {
    removeBookmark(url);
    setBookmarks(getBookmarks());
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 py-8 min-h-[70vh]">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-400">Bookmarks</h1>
        <p className="text-gray-400 mb-8">Your saved news articles.</p>

        {bookmarks.length === 0 ? (
          <div className="text-gray-400">You have no bookmarks yet. Browse news and save articles to appear here.</div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map(b => (
              <div key={b.url} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{b.title}</div>
                  <div className="text-xs text-gray-400">{b.source?.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a className="text-blue-400" href={b.url} target="_blank" rel="noreferrer">Open</a>
                  <button onClick={() => handleRemove(b.url)} className="text-sm px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default BookmarksPage;
