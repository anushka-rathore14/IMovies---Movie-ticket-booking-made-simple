import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, ShieldCheck, Clock, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Real-Time Seat Booking</h4>
              <p className="text-xs text-slate-400 mt-0.5">Live WebSocket sync prevents double booking & lock contention</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant Ticket & QR Pass</h4>
              <p className="text-xs text-slate-400 mt-0.5">Scannable QR boarding pass sent right to your dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Cancellation Refund</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free 1-click booking cancellation with instant seat release</p>
            </div>
          </div>
        </div>

        {/* Links section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">IMovies</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 mb-4">
              Movie ticket booking made simple. Next-generation cinema platform for discovering blockbusters, reserving VIP recliners, and enjoying movies.
            </p>
            <p className="text-xs text-slate-500">Built with MERN Stack & Socket.io</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/movies" className="hover:text-rose-400 transition-colors">Now Showing</Link></li>
              <li><Link to="/movies?sort=releaseDate" className="hover:text-rose-400 transition-colors">Upcoming Releases</Link></li>
              <li><Link to="/movies?format=IMAX" className="hover:text-rose-400 transition-colors">IMAX Theatres</Link></li>
              <li><Link to="/my-bookings" className="hover:text-rose-400 transition-colors">Booking History</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Cinema Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer">Mumbai (PVR ICON, INOX)</span></li>
              <li><span className="hover:text-white cursor-pointer">Delhi (Cinepolis Saket)</span></li>
              <li><span className="hover:text-white cursor-pointer">Bengaluru (PVR Director's Cut)</span></li>
              <li><span className="hover:text-white cursor-pointer">New York (AMC Empire 25)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Security & Auth</h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-3">
              JWT token authorization, bcrypt password hashing, and real-time seat lock protection.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Gateway Active
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} IMovies. Movie ticket booking made simple. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by Anushka Rathore</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
