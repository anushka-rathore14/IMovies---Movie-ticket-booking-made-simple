import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import LoadingSpinner from '../components/LoadingSpinner';
import TrailerModal from '../components/TrailerModal';
import { useCity } from '../context/CityContext';
import {
  Star,
  Clock,
  Calendar,
  Film,
  Play,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const { city } = useCity();

  const [movie, setMovie] = useState(null);
  const [groupedTheatres, setGroupedTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Generate 4 consecutive dates starting from today
  const generateDates = () => {
    const list = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      list.push({ iso, dayName, dayNumber, monthName });
    }
    return list;
  };

  const datesList = generateDates();
  const [selectedDate, setSelectedDate] = useState(datesList[0].iso);

  // Fetch Movie Info
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data.movie);
      } catch (err) {
        console.error('Failed to load movie:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // Fetch Shows for this Movie & Date
  useEffect(() => {
    const fetchShows = async () => {
      setShowsLoading(true);
      try {
        const res = await api.get(`/shows?movie=${id}&date=${selectedDate}&city=${city}`);
        setGroupedTheatres(res.data.groupedTheatres || []);
      } catch (err) {
        console.error('Failed to fetch shows:', err);
      } finally {
        setShowsLoading(false);
      }
    };
    if (id && selectedDate) {
      fetchShows();
    }
  }, [id, selectedDate, city]);

  if (loading) return <LoadingSpinner text="Retrieving movie data & schedules..." />;
  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
        <Film className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-white">Movie Not Found</h2>
        <Link to="/movies" className="mt-4 text-xs font-semibold text-rose-500 hover:underline">
          &larr; Back to all movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Hero Backdrop */}
      <div className="relative w-full min-h-[420px] md:min-h-[480px] flex items-end overflow-hidden">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

        {/* Backdrop Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Poster Card */}
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-40 sm:w-52 aspect-[2/3] object-cover rounded-2xl shadow-2xl border-2 border-slate-700/80 -mb-12 shrink-0 z-20"
            />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-rose-600 font-bold text-xs text-white uppercase">
                  {movie.certificate || 'U/A'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-xs font-semibold text-rose-400 border border-slate-700">
                  {movie.formats?.join(' • ')}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
                  {movie.language}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{movie.rating} / 10</span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                </div>
                <span className="text-slate-600">•</span>
                <span>Director: <strong>{movie.director}</strong></span>
              </div>

              {/* Watch Trailer Button */}
              <div className="pt-2">
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold backdrop-blur-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Watch Trailer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
        {/* Synopsis & Cast Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white">About the Movie</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{movie.description}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {movie.genre?.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Cast section */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white">Top Cast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {movie.cast.map((actor, idx) => (
                    <div
                      key={actor}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 text-white font-bold text-sm mx-auto flex items-center justify-center shadow-md">
                        {actor.charAt(0)}
                      </div>
                      <p className="text-xs font-semibold text-white mt-2 truncate">{actor}</p>
                      <p className="text-[10px] text-slate-500">Starring Cast</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Movie Specifications
              </h4>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Certification:</span>
                <span className="font-semibold text-white">{movie.certificate}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Language:</span>
                <span className="font-semibold text-white">{movie.language}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Running Time:</span>
                <span className="font-semibold text-white">{movie.duration} minutes</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Available In:</span>
                <span className="font-semibold text-rose-400">{movie.formats?.join(', ')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Location Filter:</span>
                <span className="font-semibold text-white">{city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Showtime Date Switcher */}
        <div className="space-y-6 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Select Date & Showtime</h2>
              <p className="text-xs text-slate-400 mt-0.5">Showing theatres in {city}</p>
            </div>

            {/* Date Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {datesList.map((d) => {
                const isSelected = selectedDate === d.iso;
                return (
                  <button
                    key={d.iso}
                    onClick={() => setSelectedDate(d.iso)}
                    className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-2xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider">{d.dayName}</span>
                    <span className="text-base font-extrabold">{d.dayNumber}</span>
                    <span className="text-[10px] text-slate-300">{d.monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theatres & Shows Listing */}
          {showsLoading ? (
            <LoadingSpinner text="Checking live auditorium seat availability..." />
          ) : groupedTheatres.length > 0 ? (
            <div className="space-y-4">
              {groupedTheatres.map(({ theatre, shows }) => (
                <div
                  key={theatre._id}
                  className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
                >
                  {/* Theatre Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <h3 className="text-base font-bold text-white">{theatre.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 pl-6">{theatre.address}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pl-6 sm:pl-0">
                      {theatre.amenities?.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-0.5 rounded-md bg-slate-800/70 text-[10px] text-slate-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Showtime Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {shows.map((show) => (
                      <Link
                        key={show._id}
                        to={`/booking/${show._id}`}
                        className="group flex flex-col items-center p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500 hover:scale-105 transition-all text-center min-w-[120px]"
                      >
                        <span className="text-sm font-bold text-white group-hover:text-rose-400">
                          {show.startTime}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                          {show.format || 'IMAX 3D'}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold mt-1">
                          {show.availableSeatsCount} seats left
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900/30 border border-slate-800">
              <Info className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white">No Shows Scheduled For This Date in {city}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Please try another date or switch your cinema city in the top navbar.
              </p>
            </div>
          )}
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

export default MovieDetails;
