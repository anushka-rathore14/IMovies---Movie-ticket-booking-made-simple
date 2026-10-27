import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movie/${movie._id}`}
      className="group relative flex flex-col bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden glow-card transition-all"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-800">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{movie.rating}</span>
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5">
          <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            {movie.language}
          </span>
        </div>

        {/* Formats Tag */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="text-[11px] font-bold text-rose-400 bg-rose-950/80 backdrop-blur-sm border border-rose-800/40 px-2 py-0.5 rounded-md">
            {movie.formats?.[0] || 'IMAX 3D'}
          </span>
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{movie.duration}m</span>
          </span>
        </div>

        {/* Hover Quick Action */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 backdrop-blur-xs transition-opacity duration-300">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/40 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Ticket className="w-3.5 h-3.5" />
            Book Tickets
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {movie.genre?.join(', ')}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-xs">
          <span className="text-slate-400 font-medium">{movie.certificate || 'U/A'}</span>
          <span className="text-rose-400 font-semibold group-hover:underline">
            Explore Shows &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
