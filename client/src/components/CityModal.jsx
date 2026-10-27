import React from 'react';
import { useCity } from '../context/CityContext';
import { MapPin, X, Check } from 'lucide-react';

const CityModal = () => {
  const { city, changeCity, availableCities, isCityModalOpen, setIsCityModalOpen } = useCity();

  if (!isCityModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-500">
            <MapPin className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">Select Your Cinema City</h3>
          </div>
          <button
            onClick={() => setIsCityModalOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Choose your city to browse theatres, current shows, and accurate ticket prices.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {availableCities.map((c) => {
            const isSelected = city.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => changeCity(c)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-500/10 text-rose-400 font-semibold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span>{c}</span>
                {isSelected && <Check className="w-4 h-4 text-rose-400" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => changeCity('All')}
          className="w-full mt-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-center"
        >
          View Theatres in All Cities
        </button>
      </div>
    </div>
  );
};

export default CityModal;
