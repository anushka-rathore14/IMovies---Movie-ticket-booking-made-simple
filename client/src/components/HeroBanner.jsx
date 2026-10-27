import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Ticket, Clock, Calendar } from 'lucide-react';
import TrailerModal from './TrailerModal';

const HeroBanner = ({ movie }) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  if (!movie) return null;

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[560px] flex items-center overflow-hidden">
      {/* Background Backdrop Image with Multi-layer Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 transition-transform duration-700 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-2xl">
          {/* Certificate & Format Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-md bg-rose-600/90 text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-rose-600/30">
              Trending Blockbuster
            </span>
            <span className="px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900/80 text-slate-300 font-semibold text-xs">
              {movie.certificate || 'U/A'}
            </span>
            <span className="px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900/80 text-rose-400 font-semibold text-xs">
              {movie.formats?.join(' • ') || 'IMAX 3D'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {movie.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 my-4 font-medium">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-bold text-white text-base">{movie.rating}</span>
              <span className="text-slate-400 text-xs">/10 ({movie.voteCount} votes)</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{movie.language}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 my-3">
            {movie.genre?.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-semibold text-slate-300"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-slate-300/90 line-clamp-3 leading-relaxed mb-8 max-w-xl">
            {movie.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={`/movie/${movie._id}`}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 hover:scale-105 transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </Link>

            <button
              onClick={() => setIsTrailerOpen(true)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 text-white font-semibold text-sm hover:border-slate-500 backdrop-blur-sm transition-all"
            >
              <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Watch Trailer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </div>
  );
};

export default HeroBanner;
