import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-6 shadow-2xl">
        <Film className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-white tracking-tight">404 - Curtain Call</h1>
      <p className="mt-2 text-sm text-slate-400 max-w-sm">
        The cinema reel you're looking for doesn't exist or has moved to another theatre.
      </p>
      <Link
        to="/"
        className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
