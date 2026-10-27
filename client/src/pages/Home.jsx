import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCity } from '../context/CityContext';
import { Film, Sparkles, MapPin, ChevronRight, Flame } from 'lucide-react';

const Home = () => {
  const { city, setIsCityModalOpen } = useCity();
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await dbService.getMovies({ limit: 12 });
        if (data.movies && data.movies.length > 0) {
          setMovies(data.movies);
          setFeaturedMovie(data.movies[0]);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Thriller', 'Horror'];

  const filteredMovies =
    selectedGenre === 'All'
      ? movies
      : movies.filter((m) => m.genre?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Featured Hero Banner */}
      {featuredMovie && <HeroBanner movie={featuredMovie} />}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* City Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-semibold">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Currently showing in: <strong className="text-white">{city}</strong></span>
          </div>
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold transition-all"
          >
            Change Location
          </button>
        </div>

        {/* Now Showing Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Flame className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Now Showing</h2>
                <p className="text-xs text-slate-400 mt-0.5">Explore movies with live seat booking</p>
              </div>
            </div>

            {/* Genre filter tags */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedGenre === genre
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading current blockbusters..." />
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
              <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No movies found matching genre "{selectedGenre}".</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white text-xs font-bold transition-all shadow-lg"
            >
              <span>View All Movies & Theatres</span>
              <ChevronRight className="w-4 h-4 text-rose-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
