// File Directory: src/components/Mcard.jsx

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import MovieDetailsModal from './MovieDetailsModal.jsx';

/**
 * Reusable card component for displaying individual movie/show details.
 * @param {object} props - The component props.
 * @param {object} props.movie - The movie object containing title, year, rating, etc.
 * @param {function} props.onClick - Handler function for when the card is clicked.
 */
function Mcard({ movie, onClick }) {
  // Defensive coding to prevent "Cannot read properties of undefined" error
  const [isOpen, setIsOpen] = useState(false);
  if (!movie) {
    return null;
  }

  // Use fallback values in case data is incomplete
  const { title = "Untitled Movie", year = "N/A", rating = null, image = "placeholder.png" } = movie;

  const handleImageError = (e) => {
    // Fallback image URL using a placeholder service
    e.target.onerror = null; // prevents infinite loop
    e.target.src = `https://placehold.co/180x270/2d3748/a0aec0?text=Poster+Missing`;
  };

  function handleClick(e) {
    // open modal first
    setIsOpen(true);
    if (typeof onClick === 'function') onClick(e);
  }

  return (
    <>
      <div
        className="bg-gray-800 rounded-xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-[1.03] transition duration-300 ease-in-out border border-gray-700 hover:border-blue-400 group"
        onClick={handleClick}
      >
      {/* Movie Image/Poster */}
      <div className="relative w-full h-auto aspect-[2/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          onError={handleImageError}
        />
        <div
          className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-lg"
          role="status"
          aria-label={typeof rating === 'number' && !Number.isNaN(rating) ? `IMDB rating ${rating.toFixed(1)}` : 'No rating available'}
          title={typeof rating === 'number' && !Number.isNaN(rating) ? `IMDB: ${rating.toFixed(1)}` : 'Rating: N/A'}
        >
          <Star className="w-3 h-3 mr-1 fill-current text-yellow-300" />
          {(typeof rating === 'number' && !Number.isNaN(rating)) ? rating.toFixed(1) : 'N/A'}
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-3">
        <h3 className="text-base font-semibold truncate text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">Year: {year}</p>
      </div>
    </div>

      {isOpen && (
        <MovieDetailsModal imdbID={movie.id} title={title} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

export default Mcard;
