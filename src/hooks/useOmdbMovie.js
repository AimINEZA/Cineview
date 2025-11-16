import { useEffect, useState } from 'react';

// Simple hook to fetch a single movie by IMDb ID from the public OMDB API.
// This uses the API URL and key provided in the user's request. It returns
// { data, loading, error } and maps fields to the shape used by the app's
// components (title, year, rating, image, id).
export default function useOmdbMovie(imdbId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imdbId) return;

    let cancelled = false;

    async function fetchMovie() {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const res = await fetch(`/api/omdb?i=${encodeURIComponent(imdbId)}`);
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
        const json = await res.json();

        if (json.Response === 'False') {
          throw new Error(json.Error || 'OMDB error');
        }

        // Map OMDB fields to the app's expected props for Mcard and lists.
        const mapped = {
          id: json.imdbID || imdbId,
          title: json.Title || 'Untitled Movie',
          year: json.Year || 'N/A',
          rating: parseFloat(json.imdbRating) || 0,
          image: json.Poster && json.Poster !== 'N/A' ? json.Poster : `https://placehold.co/180x270/2d3748/a0aec0?text=Poster+Missing`,
          raw: json,
        };

        if (!cancelled) setData(mapped);
      } catch (err) {
        if (!cancelled) setError(err.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMovie();

    return () => {
      cancelled = true;
    };
  }, [imdbId]);

  return { data, loading, error };
}
