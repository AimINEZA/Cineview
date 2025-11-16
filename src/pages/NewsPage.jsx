import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function NewsPage() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 py-8 min-h-[70vh]">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-400">News</h1>
        <p className="text-gray-400 mb-8">Top headlines — curated for Movie & TV Series fans.</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {['business','entertainment','general','health','science','sports','technology'].map(cat => (
              <button
                key={cat}
                // onClick={() => { setCategory(cat); setPage(1); setShowBookmarks(false); }}
                className={`px-3 py-1 rounded`}>
                {cat}
              </button>
            ))}
            <button
              // onClick={() => { setCategory(''); setPage(1); setShowBookmarks(false); }}
              className={`px-3 py-1 rounded`}
            >All</button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              // onClick={() => { setShowBookmarks(!showBookmarks); setBookmarks(getBookmarks()); }}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
            >{/*showBookmarks ? 'Hide Bookmarks' : 'Show Bookmarks'*/}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/*articles.map((a, idx) => (
            <article key={a.url || idx} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-white">{a.title}</h2>
                <button
                  onClick={() => {
                    if (isBookmarked(a.url)) { removeBookmark(a.url); setBookmarks(getBookmarks()); }
                    else { saveBookmark(a); setBookmarks(getBookmarks()); }
                  }}
                  className="text-sm px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                >{isBookmarked(a.url) ? 'Remove' : 'Bookmark'}</button>
              </div>
              <p className="text-sm text-gray-400 mt-2">{a.description || a.content || 'Read more on source.'}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>{a.source?.name || 'Unknown source'}</span>
                <a href={a.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Read</a>
              </div>
            </article>
          ))*/}
        </div>

        {/*showBookmarks && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Bookmarks</h3>
            <div className="space-y-3">
              {bookmarks.length === 0 && <div className="text-gray-400">You have no bookmarks.</div>}
              {bookmarks.map(b => (
                <div key={b.url} className="bg-gray-800 p-3 rounded border border-gray-700 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{b.title}</div>
                    <div className="text-xs text-gray-400">{b.source?.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a className="text-blue-400" href={b.url} target="_blank" rel="noreferrer">Open</a>
                    <button onClick={() => { removeBookmark(b.url); setBookmarks(getBookmarks()); }} className="text-sm px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )*/}

        {/*<div className="flex justify-center items-center gap-4 mt-8">
          <button
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
          >Prev</button>

          <span className="text-gray-300">Page {page} of {totalPages}</span>

          <button
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >Next</button>
        </div>*/}

      </div>
      <Footer />
    </div>
  );
}

export default NewsPage;
