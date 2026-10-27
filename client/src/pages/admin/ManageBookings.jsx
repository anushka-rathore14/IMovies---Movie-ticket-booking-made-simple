import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Ticket, ChevronLeft, XCircle, Search, RefreshCw } from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url = filterStatus
        ? `/bookings?status=${filterStatus}&limit=100`
        : '/bookings?limit=100';
      const res = await api.get(url);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const handleAdminCancel = async (bookingId) => {
    if (!window.confirm('Cancel this customer booking and release seats back to inventory?')) return;
    try {
      await api.post(`/bookings/${bookingId}/cancel`, {
        reason: 'Cancelled by Administrator',
      });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      b.bookingId.toLowerCase().includes(term) ||
      b.movie?.title?.toLowerCase().includes(term) ||
      b.user?.email?.toLowerCase().includes(term) ||
      b.user?.name?.toLowerCase().includes(term)
    );
  });

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
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Customer Bookings & Audits</h1>
              <p className="text-xs text-slate-400 mt-0.5">Comprehensive audit log of tickets sold, payments, and cancellations</p>
            </div>
          </div>

          <button
            onClick={fetchBookings}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Booking ID, customer email, or movie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed Only</option>
            <option value="cancelled">Cancelled Only</option>
          </select>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <LoadingSpinner text="Retrieving customer booking registry..." />
        ) : (
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3">Booking ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Movie & Theatre</th>
                  <th className="py-3">Date & Time</th>
                  <th className="py-3">Seats</th>
                  <th className="py-3 text-right">Amount</th>
                  <th className="py-3 text-right">Status</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-850/50">
                    <td className="py-3 font-mono font-bold text-rose-400">{b.bookingId}</td>
                    <td className="py-3">
                      <p className="font-semibold text-white">{b.user?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{b.user?.email}</p>
                    </td>
                    <td className="py-3">
                      <p className="font-bold text-white truncate max-w-[150px]">{b.movie?.title}</p>
                      <p className="text-[11px] text-slate-400">{b.theatre?.name}</p>
                    </td>
                    <td className="py-3 text-slate-300">
                      <p>{b.showDate}</p>
                      <p className="text-[11px] text-slate-400">{b.showTime}</p>
                    </td>
                    <td className="py-3 font-mono text-slate-300">
                      {b.seats?.map((s) => s.seatNumber).join(', ')}
                    </td>
                    <td className="py-3 text-right font-extrabold text-white">₹{b.totalAmount}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {b.bookingStatus === 'confirmed' ? (
                        <button
                          onClick={() => handleAdminCancel(b._id)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[11px] font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">Refunded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
