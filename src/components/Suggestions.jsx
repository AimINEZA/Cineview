import React, { useEffect, useState } from 'react';
import Mcard from './Mcard.jsx';
import { getSuggestions, setSuggestions } from '../lib/suggestionsCache.js';

/**
 * Suggestions: lightweight recommendations component that aggregates a few
 * popular searches and shows a small curated set of movies and TV series.
 */
function Suggestions({ type } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Larger pool and random selection so suggestions change on each mount/refresh
    const pool = ['inception', 'friends', 'breaking bad', 'matrix', 'avengers', 'stranger things', 'the office', 'godfather', 'pulp fiction', 'the crown', 'seinfeld', 'got', 'lost', 'dark', 'westworld'];
    let cancelled = false;
    setLoading(true);
    setError(null);

    // try cached suggestions first
    const cached = getSuggestions(type);
    if (cached && cached.length > 0) {
      setItems(cached);
      setLoading(false);
      return () => { cancelled = true; };
    }

    (async () => {
      try {
        // pick between 3 and 6 random search terms from the pool
        const pickCount = Math.floor(Math.random() * 4) + 3; // 3..6
        const picked = [];
        while (picked.length < pickCount && picked.length < pool.length) {
          const candidate = pool[Math.floor(Math.random() * pool.length)];
          if (!picked.includes(candidate)) picked.push(candidate);
        }

        const typeParam = type ? `&type=${encodeURIComponent(type)}` : '';
        const responses = await Promise.all(picked.map(q => fetch(`/api/omdb?s=${encodeURIComponent(q)}&page=1${typeParam}`).then(r => r.json()).catch(() => null)));
        const flattened = responses.flatMap(r => (r && r.Search) ? r.Search : []);

        const mapped = flattened.map(item => ({
          id: item.imdbID,
          title: item.Title,
          year: item.Year,
          image: item.Poster && item.Poster !== 'N/A' ? item.Poster : `https://placehold.co/180x270/2d3748/a0aec0?text=Poster+Missing`,
          rating: null,
          type: item.Type,
        }));

        // dedupe and then shuffle so selection varies on each load
        const seen = new Set();
        const dedup = [];
        for (const m of mapped) {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            dedup.push(m);
          }
        }

        // fisher-yates shuffle
        for (let i = dedup.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [dedup[i], dedup[j]] = [dedup[j], dedup[i]];
        }

        const limited = dedup.slice(0, 8);
        if (!cancelled) {
          setItems(limited);
          // persist the selection for faster subsequent loads
          try {
            setSuggestions(type, limited);
          } catch {
            // ignore storage failures (privacy or quota)
          }
        }

        // enrich ratings in background
        (async () => {
          for (const it of limited) {
              try {
                const r = await fetch(`/api/omdb?i=${encodeURIComponent(it.id)}`);
                if (!r.ok) continue;
                const det = await r.json();
              if (!det || det.Response === 'False') continue;
              const rating = parseFloat(det.imdbRating);
              it.rating = Number.isNaN(rating) ? null : rating;
              if (!cancelled) setItems(prev => prev.map(x => x.id === it.id ? { ...x, rating: it.rating } : x));
            } catch {
              // ignore
            }
            await new Promise(res => setTimeout(res, 120));
          }
        })();
      } catch (err) {
        if (!cancelled) setError(err.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [type]);

  return (
    <section className="bg-gray-800 py-12 border-t border-b border-gray-700">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Suggestions for you</h2>
            <p className="text-gray-400 mt-1">A small mix of movies and series you might enjoy.</p>
          </div>
          <div>
            <button className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Explore</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {loading && <div className="col-span-full text-gray-400">Loading suggestions...</div>}
          {error && <div className="col-span-full text-red-400">Error loading suggestions: {error}</div>}
          {items.map(i => (
            <Mcard key={i.id} movie={i} onClick={() => console.log(`Open suggestion: ${i.title}`)} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Suggestions;
