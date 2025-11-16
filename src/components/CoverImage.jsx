// File Directory: src/components/CoverImage.jsx

import React from 'react';
import { PlayCircle } from 'lucide-react';

/**
 * Large hero section with background image and call-to-action.
 */
function CoverImage() {
  // const coverImageUrl = "https://www.bing.com/images/search?view=detailV2&ccid=223Ht2JT&id=8E9247C765EA5A4FDEB911A44104C454D92CC454&thid=OIP.223Ht2JTZ9lvQRqHG-IJEAHaEo&mediaurl=https%3a%2f%2fcdn.wallpapersafari.com%2f92%2f61%2fqeybO1.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.db6dc7b7625367d96f411a871be20910%3frik%3dVMQs2VTEBEGkEQ%26pid%3dImgRaw%26r%3d0&exph=800&expw=1280&q=heroic+movie+streaming+wallpaper&FORM=IRPRST&ck=1521AE5570FB8EB989E6FB0852C25E73&selectedIndex=8&itb=0"; // Placeholder image

  const handleWatchNow = () => {
    console.log("Watch Now clicked!");
    // In a real app, this would redirect to a streaming page or trigger a modal
  };

  return (
    <div 
      className="relative h-[60vh] md:h-[70vh] w-full bg-cover bg-center flex items-center justify-center overflow-hidden shadow-2xl"
      // style={{ backgroundImage: `url(${coverImageUrl})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 animate-fadeInDown">
          Stream <span className="text-blue-400">Unlimited</span> Movies
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fadeInUp">
          Discover thousands of titles, from blockbusters to hidden gems.
        </p>
        <button
          onClick={handleWatchNow}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center mx-auto"
        >
          <PlayCircle className="w-6 h-6 mr-2 fill-white" />
          Watch Trailer
        </button>
      </div>
    </div>
  );
}

export default CoverImage;
