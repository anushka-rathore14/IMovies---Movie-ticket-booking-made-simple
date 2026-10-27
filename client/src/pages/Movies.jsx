import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosClient';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, SlidersHorizontal, Film } from 'lucide-react';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState(initialSearch);
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');
  const [format, setFormat] = useState('All');
  const [sort, setSort] = useState('rating');

  // Filter options
  const [availableGenres, setAvailableGenres] = useState([
    'All',
    'Action',
    'Sci-Fi',
    'Drama',
    'Adventure',
    'Thriller',
    'Crime',
    'Horror',
    'Fantasy',
  ]);
  const [availableLanguages, setAvailableLanguages] = useState(['All', 'English', 'Hindi']);

  useEffect(() => {
    if (initialSearch !== search) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (genre !== 'All') params.append('genre', genre);
        if (language !== 'All') params.append('language', language);
        if (format !== 'All') params.append('format', format);
        if (sort) params.append('sort', sort);
        params.append('page', page);
        params.append('limit', 12);

        const res = await api.get(`/movies?${params.toString()}`);
        setMovies(res.data.movies || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [search, genre, language, format, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Movie Catalog</h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse all currently running movies, filter by genre, format, and reserve seats
            </p>
          </div>

          <div className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-3.5 py-1.5 rounded-full border border-rose-500/30 self-start md:self-auto">
            {total} Movies Available
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative sm:col-span-2 lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, cast, or director..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </form>

          {/* Genre select */}
          <select
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Genres</option>
            {availableGenres.filter((g) => g !== 'All').map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Language select */}
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Languages</option>
            {availableLanguages.filter((l) => l !== 'All').map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {/* Sort select */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="rating">Highest Rated</option>
            <option value="releaseDate">Newest Releases</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <LoadingSpinner text="Filtering movie listings..." />
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center rounded-2xl bg-slate-900/30 border border-slate-800">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Movies Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try clearing your filters or search keywords.</p>
            <button
              onClick={() => {
                setSearch('');
                setGenre('All');
                setLanguage('All');
                setFormat('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-slate-400 px-4">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
