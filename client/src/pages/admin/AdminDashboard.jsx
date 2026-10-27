import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  DollarSign,
  Ticket,
  Film,
  Users,
  Building,
  Calendar,
  Shield,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
        setRecentBookings(res.data.recentBookings || []);
        setRevenueByMovie(res.data.revenueByMovie || []);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner text="Compiling cinema analytics & live revenue reports..." />;

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Cinema Command</h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage movies, theatres, showtimes, and view revenue analytics</p>
            </div>
          </div>

          {/* Quick Management Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/movies"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all"
            >
              Manage Movies
            </Link>
            <Link
              to="/admin/theatres"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all"
            >
              Theatres
            </Link>
            <Link
              to="/admin/shows"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-all"
            >
              Shows
            </Link>
            <Link
              to="/admin/bookings"
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all"
            >
              All Bookings
            </Link>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-4">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-time confirmed gross</span>
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-4">{stats?.totalBookings || 0}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {stats?.confirmedBookings || 0} Confirmed • {stats?.cancelledBookings || 0} Cancelled
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Movies</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-4">{stats?.totalMovies || 0}</p>
            <p className="text-[11px] text-slate-400 mt-1">Running across multiplexes</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customers</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-4">{stats?.totalUsers || 0}</p>
            <p className="text-[11px] text-slate-400 mt-1">Registered moviegoers</p>
          </div>
        </div>

        {/* Analytics Section: Revenue by Movie & Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue by Movie */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Top Box Office Performers</h3>
            <div className="space-y-3">
              {revenueByMovie.length > 0 ? (
                revenueByMovie.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{item._id}</h4>
                      <p className="text-[10px] text-slate-400">{item.ticketsSold} tickets booked</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">
                      ₹{item.revenue.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No revenue data recorded yet.</p>
              )}
            </div>
          </div>

          {/* Recent Customer Bookings Table */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Recent Customer Transactions</h3>
              <Link to="/admin/bookings" className="text-xs font-semibold text-rose-400 hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5">Booking ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Movie</th>
                    <th className="py-2.5">Seats</th>
                    <th className="py-2.5 text-right">Amount</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-850/50">
                      <td className="py-3 font-mono font-bold text-rose-400">{b.bookingId}</td>
                      <td className="py-3 text-slate-300">{b.user?.name || 'Guest'}</td>
                      <td className="py-3 text-white font-medium truncate max-w-[140px]">{b.movie?.title}</td>
                      <td className="py-3 text-slate-400">{b.seats?.map((s) => s.seatNumber).join(', ')}</td>
                      <td className="py-3 text-right font-bold text-white">₹{b.totalAmount}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.bookingStatus === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
