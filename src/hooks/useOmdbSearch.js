import { useEffect, useState, useRef } from 'react';

// Hook to search OMDB by text (s=) with simple pagination support.
// Returns { data: { results, totalResults }, loading, error, query, setQuery, page, setPage }
export default function useOmdbSearch(initialQuery = '', initialPage = 1, typeFilter = undefined) {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  // Minimal in-memory cache to avoid repeated identical requests during the session
  // Structure: cache.current[query] = { pages: { [page]: [items] }, combined: [...items], totalResults }
  const cache = useRef({});

  useEffect(() => {
    if (!query) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    const cacheKey = `${query}`;

    async function fetchSearch() {
      setLoading(true);
      setError(null);

      // If we have cached combined results for this query, use them immediately
      if (cache.current[cacheKey] && cache.current[cacheKey].combined) {
        setResults(cache.current[cacheKey].combined);
        setTotalResults(Number(cache.current[cacheKey].totalResults) || 0);
        // If the specific page is already cached, we can avoid fetching, otherwise we will fetch below
        if (cache.current[cacheKey].pages && cache.current[cacheKey].pages[page]) {
          setLoading(false);
          return;
        }
      }

      try {
        const typeParam = typeFilter ? `&type=${encodeURIComponent(typeFilter)}` : '';
        const res = await fetch(`http://www.omdbapi.com/?apikey=22dba36c&s=${encodeURIComponent(query)}&page=${page}${typeParam}`);
        if (!res.ok) throw new Error(`Network response not ok: ${res.status}`);
        const json = await res.json();

        if (json.Response === 'False') {
          // OMDB returns Response: 'False' with Error message when no results
          setResults([]);
          setTotalResults(0);
          cache.current[cacheKey] = { pages: { [page]: [] }, combined: [], totalResults: 0 };
          setLoading(false);
          return;
        }

        // Normalize results: map to fields expected by Mcard (id, title, year, image, rating)
        // rating is initially null (unknown) and will be enriched asynchronously
        const mapped = (json.Search || []).map(item => ({
          id: item.imdbID,
          title: item.Title,
          year: item.Year,
          image: item.Poster && item.Poster !== 'N/A' ? item.Poster : `https://placehold.co/180x270/2d3748/a0aec0?text=Poster+Missing`,
          rating: null,
          raw: item,
        }));

        // Initialize cache for this query if needed
        if (!cache.current[cacheKey]) cache.current[cacheKey] = { pages: {}, combined: [], totalResults: 0 };

        cache.current[cacheKey].pages[page] = mapped;
        cache.current[cacheKey].totalResults = Number(json.totalResults) || cache.current[cacheKey].totalResults;

        // Rebuild combined results in page order
        const pagesKeys = Object.keys(cache.current[cacheKey].pages).map(k => Number(k)).sort((a, b) => a - b);
        cache.current[cacheKey].combined = pagesKeys.flatMap(p => cache.current[cacheKey].pages[p] || []);

        setResults(cache.current[cacheKey].combined);
        setTotalResults(Number(cache.current[cacheKey].totalResults) || 0);

        // Prefetch the next API page in background to smooth pagination UX
        const nextApiPage = page + 1;
        const totalAvailable = Number(cache.current[cacheKey].totalResults) || 0;
        // Only prefetch if there are more results and we haven't already cached or are fetching that page
        if (nextApiPage && cache.current[cacheKey].combined.length < totalAvailable) {
          cache.current[cacheKey].fetchingPages = cache.current[cacheKey].fetchingPages || new Set();
            if (!cache.current[cacheKey].pages[nextApiPage] && !cache.current[cacheKey].fetchingPages.has(nextApiPage)) {
            cache.current[cacheKey].fetchingPages.add(nextApiPage);
            (async () => {
              try {
                const typeParam2 = typeFilter ? `&type=${encodeURIComponent(typeFilter)}` : '';
                const res2 = await fetch(`http://www.omdbapi.com/?apikey=22dba36c&s=${encodeURIComponent(query)}&page=${nextApiPage}${typeParam2}`);
                if (!res2.ok) return;
                const json2 = await res2.json();
                if (json2.Response === 'False') return;

                const mapped2 = (json2.Search || []).map(item => ({
                  id: item.imdbID,
                  title: item.Title,
                  year: item.Year,
                  image: item.Poster && item.Poster !== 'N/A' ? item.Poster : `https://placehold.co/180x270/2d3748/a0aec0?text=Poster+Missing`,
                  rating: null,
                  raw: item,
                }));

                cache.current[cacheKey].pages[nextApiPage] = mapped2;
                // Rebuild combined results
                const keys2 = Object.keys(cache.current[cacheKey].pages).map(k => Number(k)).sort((a, b) => a - b);
                cache.current[cacheKey].combined = keys2.flatMap(p => cache.current[cacheKey].pages[p] || []);
                cache.current[cacheKey].totalResults = Number(json2.totalResults) || cache.current[cacheKey].totalResults;

                // Update results if the query still matches
                setResults(cache.current[cacheKey].combined);
                setTotalResults(Number(cache.current[cacheKey].totalResults) || 0);
              } catch {
                // ignore background prefetch errors
              } finally {
                cache.current[cacheKey].fetchingPages.delete(nextApiPage);
              }
            })();
          }
        }

        // Asynchronously enrich the mapped search items with detailed ratings
        // by calling the movie endpoint for each imdbID. This is done
        // sequentially with a small delay to avoid hitting API rate limits.
        (async () => {
          try {
            const ids = mapped.map(m => m.id).filter(Boolean);
            for (const id of ids) {
              // Skip if rating already available in cache
              const already = cache.current[cacheKey].combined.find(x => x.id === id && x.rating != null);
              if (already) continue;
              try {
                const r = await fetch(`http://www.omdbapi.com/?apikey=22dba36c&i=${encodeURIComponent(id)}`);
                if (!r.ok) continue;
                const det = await r.json();
                if (!det || det.Response === 'False') continue;
                const rating = parseFloat(det.imdbRating);
                const value = Number.isNaN(rating) ? null : rating;

                // Update cached pages that contain this id
                Object.keys(cache.current[cacheKey].pages).forEach(p => {
                  cache.current[cacheKey].pages[p] = cache.current[cacheKey].pages[p].map(item => item.id === id ? { ...item, rating: value } : item);
                });

                // Rebuild combined list and set results
                cache.current[cacheKey].combined = Object.keys(cache.current[cacheKey].pages).map(k => Number(k)).sort((a,b)=>a-b).flatMap(p => cache.current[cacheKey].pages[p] || []);
                setResults(cache.current[cacheKey].combined);
              } catch {
                // ignore per-item errors
              }
              // polite delay
              await new Promise(res => setTimeout(res, 150));
            }
          } catch {
            // ignore enrichment errors
          }
        })();
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchSearch();
  }, [query, page]);

  return { data: { results, totalResults }, loading, error, query, setQuery, page, setPage };
}
