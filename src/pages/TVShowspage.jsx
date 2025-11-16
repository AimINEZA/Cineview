// File Directory: src/pages/TVShowspage.jsx

import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Mcard from '../components/Mcard.jsx';
import useOmdbSearch from '../hooks/useOmdbSearch';
import Suggestions from '../components/Suggestions.jsx';

function TVShowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // Use the search hook which returns paginated results; filter to series only
  const { data, loading, error, query, setQuery, page, setPage } = useOmdbSearch(searchTerm, 1, 'series');

  // Localize values
  const shows = data.results || [];
  const total = data.totalResults || 0;
  // UI pagination: show 8 items per page. Use OMDB pages (10 items each) as the data source
  const ITEMS_PER_PAGE = 8;
  const [uiPage, setUiPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const displayed = shows.slice((uiPage - 1) * ITEMS_PER_PAGE, uiPage * ITEMS_PER_PAGE);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchTerm.trim() === '') return;
    setQuery(searchTerm.trim());
    setPage(1);
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 py-8 min-h-[70vh]">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-400">TV Shows</h1>
        <p className="text-gray-400 mb-8">Search and browse TV series only.</p>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search TV shows (e.g. Breaking Bad, The Office)"
              className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none"
            />
            <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500" type="submit">Search</button>
          </form>

          <div className="mt-4 text-gray-300">Showing <span className="font-semibold text-white">{Math.min(total, ITEMS_PER_PAGE)}</span> of <span className="font-semibold text-white">{total}</span> results for <span className="font-semibold text-blue-300">{query}</span></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading && <div className="col-span-full text-gray-400">Loading...</div>}
          {error && <div className="col-span-full text-red-400">Error: {error}</div>}

          {!query && !loading && (
            <div className="col-span-full text-center text-gray-400">Enter a search term above to find TV shows.</div>
          )}

          {displayed.map(show => (
            <Mcard key={show.id} movie={show} onClick={() => console.log(`Open ${show.title}`)} />
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button 
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
            onClick={() => setUiPage(Math.max(1, uiPage - 1))}
            disabled={uiPage <= 1}
          >Prev</button>

          <span className="text-gray-300">Page {uiPage} of {totalPages}</span>

          <button 
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
            onClick={() => {
              const nextUi = Math.min(totalPages, uiPage + 1);
              const neededItems = nextUi * ITEMS_PER_PAGE;
              if (neededItems > shows.length && shows.length < total) {
                // fetch next OMDB API page
                setPage(page + 1);
              }
              setUiPage(nextUi);
            }}
            disabled={uiPage >= totalPages}
          >Next</button>
        </div>

        {/* Suggestions (series-only) */}
        <div className="mt-12">
          <Suggestions type="series" />
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default TVShowsPage;


