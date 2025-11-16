import React, { useEffect, useState } from 'react';


function MovieDetailsModal({ imdbID, title, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerVideoId, setTrailerVideoId] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [trailerError, setTrailerError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setDetails(null);

    if (!imdbID) {
      setError('No movie id');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const url = `/api/omdb?i=${encodeURIComponent(imdbID)}&plot=full`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Network ${res.status}`);
        const json = await res.json();
        if (json.Response === 'False') throw new Error(json.Error || 'No details');
        if (!cancelled) setDetails(json);
      } catch (err) {
        if (!cancelled) setError(err.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [imdbID]);

  function openTrailer() {
    const YT_KEY = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_YOUTUBE_API_KEY : undefined;
    if (YT_KEY) {
      // use YouTube Data API to get top video id
      if (trailerVideoId) {
        setShowTrailer(true);
        return;
      }
      setTrailerLoading(true);
      setTrailerError(null);
      const q = `${title || details?.Title || ''} trailer`;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${encodeURIComponent(q)}&key=${YT_KEY}`;
      fetch(url).then(r => r.json()).then(json => {
        if (json && json.items && json.items.length > 0 && json.items[0].id && json.items[0].id.videoId) {
          setTrailerVideoId(json.items[0].id.videoId);
          setShowTrailer(true);
        } else {
          setTrailerError('No trailer found');
          setShowTrailer(true); // show fallback UI
        }
      }).catch(e => {
        setTrailerError(String(e));
        setShowTrailer(true);
      }).finally(() => setTrailerLoading(false));
      return;
    }

    // No API key: show embedded YouTube search results as a playlist (no API key required)
    setShowTrailer(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative max-w-3xl w-full bg-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-auto" style={{maxHeight: '90vh'}}>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-2xl font-bold">{title || (details && details.Title)}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">Close</button>
          </div>

          {loading && <div className="text-gray-400 mt-4">Loading details...</div>}
          {error && <div className="text-red-400 mt-4">Error: {error}</div>}

          {details && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <img src={details.Poster && details.Poster !== 'N/A' ? details.Poster : `https://placehold.co/300x450/2d3748/a0aec0?text=Poster+Missing`} alt={details.Title} className="w-full rounded" />
                <div className="mt-3 text-sm text-gray-400">Year: {details.Year}</div>
                <div className="text-sm text-gray-400">Runtime: {details.Runtime}</div>
                <div className="text-sm text-gray-400">Genre: {details.Genre}</div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="text-yellow-300 font-bold text-lg">{details.imdbRating && details.imdbRating !== 'N/A' ? details.imdbRating : 'N/A'}</div>
                  <div className="text-sm text-gray-400">IMDB Rating</div>
                </div>

                <h4 className="mt-4 font-semibold">Plot</h4>
                <p className="text-gray-300 text-sm mt-1">{details.Plot}</p>

                <h4 className="mt-4 font-semibold">Actors</h4>
                <p className="text-gray-300 text-sm mt-1">{details.Actors}</p>

                <h4 className="mt-4 font-semibold">Director</h4>
                <p className="text-gray-300 text-sm mt-1">{details.Director}</p>

                <div className="mt-6 flex items-center gap-3">
                  {!showTrailer ? (
                    <button onClick={openTrailer} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">View Trailer</button>
                  ) : (
                    <button onClick={() => setShowTrailer(false)} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Close Trailer</button>
                  )}
                  <a href={`https://www.imdb.com/title/${details.imdbID}`} target="_blank" rel="noreferrer" className="text-sm text-gray-300 underline">View on IMDB</a>
                </div>

                {showTrailer && (
                  <div className="mt-4">
                    <div className="bg-black rounded overflow-hidden">
                      {trailerLoading ? (
                        <div className="p-6 text-gray-400">Loading trailer...</div>
                      ) : trailerVideoId ? (
                        <div className="aspect-[16/9]">
                          <iframe
                            title="Trailer"
                            src={`https://www.youtube.com/embed/${trailerVideoId}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        </div>
                      ) : (
                        // fallback to search playlist embed when no videoId available
                        <div className="aspect-[16/9]">
                          <iframe
                            title="Trailer"
                            src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent((title || details.Title) + ' trailer')}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-sm text-gray-400">
                      {trailerError && <div className="text-red-400">Trailer error: {trailerError}</div>}
                      If the trailer does not appear (some embeds are blocked by YouTube), you can open it on YouTube directly.
                      <button
                        onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent((title || details.Title) + ' trailer')}`, '_blank', 'noopener')}
                        className="ml-3 px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                      >Open on YouTube</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsModal;
