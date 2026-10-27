import React from 'react';

const SeatLegend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-4 px-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs">
      {/* Available */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md border-2 border-slate-600 bg-slate-800/60"></div>
        <span className="text-slate-300 font-medium">Available</span>
      </div>

      {/* Selected */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
        <span className="text-emerald-400 font-bold">Selected</span>
      </div>

      {/* In Checkout / Locked */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-amber-500 animate-pulse shadow-sm shadow-amber-500/40"></div>
        <span className="text-amber-400 font-medium">In Checkout (Hold)</span>
      </div>

      {/* Booked */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-slate-700/60 opacity-40 cursor-not-allowed"></div>
        <span className="text-slate-500 font-medium">Sold Out</span>
      </div>

      {/* Tier Badges */}
      <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

      <div className="flex items-center gap-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> VIP Recliner
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Gold
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Silver
        </span>
      </div>
    </div>
  );
};

export default SeatLegend;
