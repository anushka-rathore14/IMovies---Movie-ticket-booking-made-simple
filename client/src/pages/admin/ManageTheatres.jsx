import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Building, Plus, Trash2, ChevronLeft, X, MapPin } from 'lucide-react';

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [address, setAddress] = useState('');
  const [amenities, setAmenities] = useState('Dolby Atmos, IMAX, Recliner Seats, Food Court');

  const fetchTheatres = async () => {
    setLoading(true);
    try {
      const data = await dbService.getTheatres();
      setTheatres(data || []);
    } catch (err) {
      console.error('Failed to load theatres:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dbService.createTheatre({
        name,
        city,
        address,
        amenities: amenities.split(',').map((a) => a.trim()),
        screens: [
          { screenNumber: 1, name: 'Audi 1 Laser', format: 'IMAX 3D', totalSeats: 80 },
        ],
      });
      setIsModalOpen(false);
      setName('');
      setAddress('');
      fetchTheatres();
    } catch (err) {
      alert(err.message || 'Failed to add theatre');
    }
  };

  const handleDelete = async (theatreId) => {
    if (!window.confirm('Are you sure you want to delete this theatre?')) return;
    try {
      await dbService.deleteTheatre(theatreId);
      fetchTheatres();
    } catch (err) {
      alert(err.message || 'Failed to delete theatre');
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
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Cinema Multiplex Management</h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage cinema properties, cities, screens, and audio amenities</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Theatre</span>
          </button>
        </div>

        {/* Theatres List */}
        {loading ? (
          <LoadingSpinner text="Loading theatre properties..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theatres.map((t) => (
              <div
                key={t._id}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-rose-500 shrink-0" />
                      <h3 className="text-base font-bold text-white">{t.name}</h3>
                    </div>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{t.city} • {t.address}</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {t.amenities?.map((a) => (
                      <span
                        key={a}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Screens: {t.screens?.length || 1} Audi</span>
                  <span className="text-emerald-400 font-semibold">Active Operational</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Theatre Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Cinema Property</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Theatre Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PVR ICON Gold Cinema"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai, Delhi, Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Street Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Phoenix Palladium, Lower Parel"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Amenities (comma separated)</label>
                <input
                  type="text"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
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
                  Create Theatre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTheatres;
