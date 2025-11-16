import React, { useEffect, useState } from 'react';
import Mcard from './Mcard.jsx';

/**
 * Trending component aggregates several popular search terms and shows
 * a deduplicated list of movies when the user opens the Trending panel.
 */
const popularTerms = ['avengers', 'inception', 'matrix', 'star', 'harry', 'godfather'];

function Trending() {
  // Show movies immediately when the component mounts
  const [showMovies, setShowMovies] = useState(true);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // sortMode: 'rating' | 'year'
  const [sortMode, setSortMode] = useState('rating');

  useEffect(() => {
    if (!showMovies) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchAggregated() {
      try {
        const responses = await Promise.all(
          popularTerms.map(term => fetch(`http://www.omdbapi.com/?apikey=22dba36c&s=${encodeURIComponent(term)}&page=1`).then(r => r.json()).catch(() => null))
        );

        const flattened = responses.flatMap(r => (r && r.Search) ? r.Search : []);

        const mapped = flattened.map(item => ({
          id: item.imdbID,
          title: item.Title,
          year: item.Year,
          image: item.Poster && item.Poster !== 'N/A' ? item.Poster : `https://placehold.co/180x270/2d3748/a0aec0?text=Poster+Missing`,
          rating: null,
          raw: item,
        }));

        const dedup = [];
        const seen = new Set();
        for (const m of mapped) {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            dedup.push(m);
          }
        }

        // Sort movies by year (newest first) initially and limit to 20 items.
        // Some OMDB Year fields can be ranges like "2010-2012" or "N/A",
        // so parseInt is used and NaN values are treated as very old.
        const withYear = dedup.map(d => ({
          ...d,
          numericYear: parseInt(String(d.year).slice(0,4), 10) || -Infinity,
        }));

        withYear.sort((a, b) => b.numericYear - a.numericYear);

        // remove numericYear property before storing into state without creating an unused variable
        const limited = withYear.slice(0, 20).map(item => {
          const copy = { ...item };
          delete copy.numericYear;
          return copy;
        });

  if (!cancelled) setMovies(limited);

        // Enrich trending movies with ratings (non-blocking)
        (async () => {
          try {
            for (const m of limited) {
              try {
                const r = await fetch(`http://www.omdbapi.com/?apikey=22dba36c&i=${encodeURIComponent(m.id)}`);
                if (!r.ok) continue;
                const det = await r.json();
                if (!det || det.Response === 'False') continue;
                const rating = parseFloat(det.imdbRating);
                m.rating = Number.isNaN(rating) ? null : rating;
                // trigger state update (create new array reference) and re-sort according to current sortMode
                if (!cancelled) setMovies(prev => {
                  const updated = prev.map(x => x.id === m.id ? { ...x, rating: m.rating } : x);
                  // perform sorting based on current user selection
                  if (sortMode === 'rating') {
                    updated.sort((a, b) => {
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
                    // sortMode === 'year'
                    updated.sort((a, b) => {
                      const aYear = parseInt(String(a.year).slice(0,4), 10) || -Infinity;
                      const bYear = parseInt(String(b.year).slice(0,4), 10) || -Infinity;
                      return bYear - aYear;
                    });
                  }
                  return [...updated];
                });
              } catch {
                // ignore per-item errors
              }
              await new Promise(res => setTimeout(res, 120));
            }
          } catch {
            // ignore
          }
        })();
      } catch (err) {
        if (!cancelled) setError(err.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAggregated();

    return () => { cancelled = true; };
  }, [showMovies, popularTerms]);

  // Pagination for trending (client-side): show 8 items per page
  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(movies.length / ITEMS_PER_PAGE));
  const visibleMovies = movies.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-6 md:px-12 py-8 mt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-blue-400">
          <button
            onClick={() => setShowMovies(true)}
            className="hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          >
            Trending
          </button>
        </h1>

        {showMovies && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <label className="text-gray-400">Sort:</label>
              <select
                value={sortMode}
                onChange={e => {
                  const v = e.target.value;
                  setSortMode(v);
                  // re-sort current movies immediately
                  setMovies(prev => {
                    const updated = [...prev];
                    if (v === 'rating') {
                      updated.sort((a, b) => {
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
                      updated.sort((a, b) => {
                        const aYear = parseInt(String(a.year).slice(0,4), 10) || -Infinity;
                        const bYear = parseInt(String(b.year).slice(0,4), 10) || -Infinity;
                        return bYear - aYear;
                      });
                    }
                    return updated;
                  });
                }}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
              >
                <option value="rating">Rating</option>
                <option value="year">Year</option>
              </select>
            </div>

            <div>
              <button onClick={() => setShowMovies(false)}>Hide</button>
              <p className="text-gray-400 text-sm">Showing {movies.length} results</p>
            </div>
          </div>
        )}
      </div>

      <hr className="bg-gray-700 h-0.5 border-none my-4" />

      {showMovies ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading && <div className="col-span-full text-gray-400">Loading movie data...</div>}
            {error && <div className="col-span-full text-red-400">Error loading movies: {error}</div>}
            {visibleMovies.map(movie => (
              <Mcard key={movie.id} movie={movie} onClick={() => console.log(`Viewing details for: ${movie.title}`)} />
            ))}
          </div>

          {/* Pagination controls for Trending */}
          {movies.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mt-6">
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
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-lg">Click the Trending button above to view the latest movie listings.</p>
        </div>
      )}
    </div>
  );
}

export default Trending;
// File Directory: src/components/Trending.jsx
