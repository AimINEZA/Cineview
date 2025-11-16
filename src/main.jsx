import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { setSuggestions } from './lib/suggestionsCache.js';

// Prefetch suggestions for faster UI later
;(async function prefetchSuggestions() {
  try {
    const pool = ['inception', 'friends', 'breaking bad', 'matrix', 'avengers', 'stranger things', 'the office', 'godfather', 'pulp fiction', 'the crown', 'seinfeld', 'got', 'lost', 'dark', 'westworld'];
    const pick = () => {
      const picked = [];
      const count = Math.floor(Math.random() * 4) + 3;
      while (picked.length < count && picked.length < pool.length) {
        const candidate = pool[Math.floor(Math.random() * pool.length)];
        if (!picked.includes(candidate)) picked.push(candidate);
      }
      return picked;
    };

    async function fetchFor(type) {
      const picked = pick();
      const typeParam = type ? `&type=${encodeURIComponent(type)}` : '';
      const responses = await Promise.all(picked.map(q => fetch(`http://www.omdbapi.com/?apikey=22dba36c&s=${encodeURIComponent(q)}&page=1${typeParam}`).then(r => r.json()).catch(() => null)));
      const flattened = responses.flatMap(r => (r && r.Search) ? r.Search : []);
      const mapped = flattened.map(item => ({
        id: item.imdbID,
        title: item.Title,
        year: item.Year,
        image: item.Poster && item.Poster !== 'N/A' ? item.Poster : `https://placehold.co/180x270/2d3748/a0aec0?text=Poster+Missing`,
        rating: null,
        type: item.Type,
      }));
      // dedupe and shuffle
      const seen = new Set();
      const dedup = [];
      for (const m of mapped) {
        if (!seen.has(m.id)) { seen.add(m.id); dedup.push(m); }
      }
      for (let i = dedup.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dedup[i], dedup[j]] = [dedup[j], dedup[i]];
      }
      return dedup.slice(0, 8);
    }

    // populate both movie and series caches in background
    fetchFor('movie').then(items => setSuggestions('movie', items)).catch(() => {});
    fetchFor('series').then(items => setSuggestions('series', items)).catch(() => {});
    // also populate mixed cache
    fetchFor(undefined).then(items => setSuggestions(undefined, items)).catch(() => {});
  } catch {
    // ignore prefetch failures
  }
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
