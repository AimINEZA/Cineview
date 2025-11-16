// File Directory: src/pages/GenrePage.jsx

import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import useOmdbSearch from '../hooks/useOmdbSearch';
import Mcard from '../components/Mcard.jsx';

function GenrePage() {
  // Basic set of genres; clicking a genre will use the existing search hook
  // to query OMDB with the genre name as the search term.
  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Documentary', 'Thriller'];

  const [selectedGenre, setSelectedGenre] = useState('');
  // sortMode: 'rating' | 'year'
  const [sortMode, setSortMode] = useState('rating');

  // useOmdbSearch returns { data: { results, totalResults }, loading, error, query, setQuery, page, setPage }
  const { data: { results = [], totalResults = 0 }, loading, error, query, setQuery, page, setPage } = useOmdbSearch();

  // Client-side pagination: 8 items per page
  const ITEMS_PER_PAGE = 8;
  const [uiPage, setUiPage] = useState(1);

  // derive a sorted results array according to sortMode. We use useMemo to avoid
  // re-sorting on every render unless `results` or `sortMode` changes.
  const sortedResults = useMemo(() => {
    const copy = [...results];
    if (sortMode === 'rating') {
      copy.sort((a, b) => {
        const aHas = typeof a.rating === 'number' && !Number.isNaN(a.rating);
        const bHas = typeof b.rating === 'number' && !Number.isNaN(b.rating);
        if (aHas && bHas) return b.rating - a.rating;
        if (aHas) return -1;
        if (bHas) return 1;
        const aYear = parseInt(String(a.year).slice(0,4), 10) || -Infinity;
        const bYear = parseInt(String(b.year).slice(0,4), 10) || -Infinity;
        return bYear - aYear;
      });
    } else {
      copy.sort((a, b) => {
        const aYear = parseInt(String(a.year).slice(0,4), 10) || -Infinity;
        const bYear = parseInt(String(b.year).slice(0,4), 10) || -Infinity;
        return bYear - aYear;
      });
    }
    return copy;
  }, [results, sortMode]);

  const displayed = sortedResults.slice((uiPage - 1) * ITEMS_PER_PAGE, uiPage * ITEMS_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil((totalResults || results.length) / ITEMS_PER_PAGE));

  function onGenreClick(genre) {
    setSelectedGenre(genre);
    // Use the genre name as the search query. OMDB doesn't provide a direct "genre" search
    // in the public API, so we approximate by searching the genre keyword (consistent with Trending).
    setQuery(genre);
    // reset both the API page and the UI pagination so each genre starts at page 1
    setPage(1);
    setUiPage(1);
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 py-8 min-h-[70vh]">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-400">Browse by Genre</h1>
        <p className="text-gray-400 mb-8">Select a category to find your next watch, or search manually.</p>

        <div className="flex flex-wrap gap-4 p-6 bg-gray-800 rounded-xl border border-gray-700 mb-6">
          {genres.map(genre => (
            <button 
              key={genre} 
              onClick={() => onGenreClick(genre)}
              className={`bg-gray-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-md ${selectedGenre === genre ? 'ring-2 ring-blue-400' : ''}`}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-400 mr-2">Search</label>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedGenre(''); setPage(1); setUiPage(1); }}
            placeholder="Search movies or type a genre..."
            className="ml-2 px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white w-full md:w-1/2"
          />
        </div>

        {query ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Results for "{query}"</h2>
              <div className="flex items-center gap-4">
                <p className="text-gray-400 text-sm">{totalResults} total results</p>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <label className="text-gray-400">Sort:</label>
                  <select
                    value={sortMode}
                    onChange={e => setSortMode(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
                  >
                    <option value="rating">Rating</option>
                    <option value="year">Year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading && <div className="col-span-full text-gray-400">Loading...</div>}
              {error && <div className="col-span-full text-red-400">Error: {error}</div>}

              {displayed.map(movie => (
                <Mcard key={movie.id} movie={movie} onClick={() => console.log(`Viewing: ${movie.title}`)} />
              ))}

              {(!loading && results.length === 0) && (
                <div className="col-span-full text-gray-400">No movies found for "{query}".</div>
              )}
            </div>

            {/* Pagination controls: client-side paging over fetched results. */}
            <div className="flex justify-center items-center gap-4 mt-6">
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
                  // If nextUi requires items beyond current results length, request next OMDB page
                  const neededItems = nextUi * ITEMS_PER_PAGE;
                  if (neededItems > results.length && results.length < (totalResults || Infinity)) {
                    // Advance OMDB page to fetch more results; OMDB returns 10 items per page.
                    setPage(page + 1);
                  }
                  setUiPage(nextUi);
                }}
                disabled={uiPage >= totalPages}
              >Next</button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg">Click a genre above or enter a search term to find movies.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default GenrePage;
