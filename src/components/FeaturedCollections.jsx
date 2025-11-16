// File Directory: src/components/FeaturedCollections.jsx

import React from 'react';

/**
 * Displays a section of hand-picked movie or TV show collections.
 */
function FeaturedCollections() {
  const collectionsData = [
    { 
      id: 1, 
      title: "Oscar Winners", 
      description: "Critically acclaimed films that took home the gold. Must-watch cinema.",
      themeColor: "bg-yellow-600/20 text-yellow-300 border-yellow-500",
      icon: "🌟"
    },
    { 
      id: 2, 
      title: "'80s Classics", 
      description: "The greatest hits from the decade of big hair and synthesizer music.",
      themeColor: "bg-purple-600/20 text-purple-300 border-purple-500",
      icon: "📼"
    },
    { 
      id: 3, 
      title: "Sci-Fi Essentials", 
      description: "From space operas to cyberpunk futures, the best of the genre.",
      themeColor: "bg-blue-600/20 text-blue-300 border-blue-500",
      icon: "🚀"
    },
  ];

  return (
    <section className="bg-gray-800 py-12 border-t border-b border-gray-700">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-extrabold mb-8 text-white">
          Featured Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collectionsData.map((collection) => (
            <div 
              key={collection.id} 
              className={`p-6 rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-[1.02] ${collection.themeColor}`}
            >
              <div className="text-4xl mb-3">{collection.icon}</div>
              <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
              <p className="text-sm opacity-80">
                {collection.description}
              </p>
              <button
                className="mt-4 text-xs font-semibold py-1 px-3 rounded-full border border-current hover:bg-white hover:text-gray-900 transition-colors"
                onClick={() => console.log(`Viewing collection: ${collection.title}`)}
              >
                Explore {collection.title}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-400 p-4 border-t border-gray-700">
          Looking for something else? Browse our full <a href="/genre" className="text-blue-400 hover:underline">Genre List</a>.
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollections;
