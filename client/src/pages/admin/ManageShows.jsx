import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Calendar, Plus, Trash2, ChevronLeft, X, Film, Building } from 'lucide-react';

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedTheatre, setSelectedTheatre] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('06:30 PM');
  const [format, setFormat] = useState('IMAX 3D');
  const [silverPrice, setSilverPrice] = useState(220);
  const [goldPrice, setGoldPrice] = useState(380);
  const [vipPrice, setVipPrice] = useState(550);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        api.get('/shows'),
        api.get('/movies?limit=50'),
        api.get('/theatres'),
      ]);
      setShows(showsRes.data.shows || []);
      setMovies(moviesRes.data.movies || []);
      setTheatres(theatresRes.data.theatres || []);
      if (moviesRes.data.movies?.length > 0) setSelectedMovie(moviesRes.data.movies[0]._id);
      if (theatresRes.data.theatres?.length > 0) setSelectedTheatre(theatresRes.data.theatres[0]._id);
    } catch (err) {
      console.error('Failed to load shows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shows', {
        movie: selectedMovie,
        theatre: selectedTheatre,
        screenNumber: 1,
        date,
        startTime,
        format,
        pricing: {
          Silver: Number(silverPrice),
          Gold: Number(goldPrice),
          VIP: Number(vipPrice),
        },
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule show');
    }
  };

  const handleDelete = async (showId) => {
    if (!window.confirm('Are you sure you want to delete this show?')) return;
    try {
      await api.delete(`/shows/${showId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete show');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Showtime Scheduling</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Schedule movie showtimes across multiplex screens with automated seat map generation
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Show</span>
          </button>
        </div>

        {/* Shows Table */}
        {loading ? (
          <LoadingSpinner text="Loading show schedules..." />
        ) : (
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3">Movie</th>
                  <th className="py-3">Theatre & City</th>
                  <th className="py-3">Date & Time</th>
                  <th className="py-3">Format</th>
                  <th className="py-3">Seats Available</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {shows.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-850/50">
                    <td className="py-3 font-bold text-white truncate max-w-[180px]">
                      {s.movie?.title || 'Unknown Movie'}
                    </td>
                    <td className="py-3 text-slate-300">
                      {s.theatre?.name} ({s.theatre?.city})
                    </td>
                    <td className="py-3 text-slate-300">
                      <span className="font-semibold text-rose-400">{s.date}</span> at {s.startTime}
                    </td>
                    <td className="py-3 text-slate-400">{s.format}</td>
                    <td className="py-3 text-emerald-400 font-semibold">
                      {s.seats?.filter((seat) => seat.status === 'available').length} / {s.seats?.length}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete Show"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Show Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Schedule Show & Generate Seats</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Movie</label>
                <select
                  value={selectedMovie}
                  onChange={(e) => setSelectedMovie(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Theatre Property</label>
                <select
                  value={selectedTheatre}
                  onChange={(e) => setSelectedTheatre(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} — {t.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Start Showtime</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 07:15 PM"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option>IMAX 3D</option>
                  <option>2D</option>
                  <option>3D</option>
                  <option>4DX</option>
                </select>
              </div>

              {/* Pricing Tiers */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Silver (₹)</label>
                  <input
                    type="number"
                    required
                    value={silverPrice}
                    onChange={(e) => setSilverPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Gold (₹)</label>
                  <input
                    type="number"
                    required
                    value={goldPrice}
                    onChange={(e) => setGoldPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">VIP Recliner (₹)</label>
                  <input
                    type="number"
                    required
                    value={vipPrice}
                    onChange={(e) => setVipPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white shadow-lg shadow-rose-600/30"
                >
                  Schedule Showtime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageShows;
