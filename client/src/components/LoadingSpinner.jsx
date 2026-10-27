import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-3 rounded-full bg-rose-500/10 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400 tracking-wide">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
