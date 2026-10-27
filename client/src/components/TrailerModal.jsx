import React from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  if (!isOpen || !trailerUrl) return null;

  // Extract YouTube ID
  let videoId = '';
  if (trailerUrl.includes('v=')) {
    videoId = trailerUrl.split('v=')[1]?.split('&')[0];
  } else if (trailerUrl.includes('youtu.be/')) {
    videoId = trailerUrl.split('youtu.be/')[1]?.split('?')[0];
  }

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : trailerUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90">
          <h4 className="font-semibold text-white truncate max-w-[80%]">
            Trailer: {movieTitle}
          </h4>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          {videoId ? (
            <iframe
              src={embedUrl}
              title={`${movieTitle} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Trailer video preview unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
