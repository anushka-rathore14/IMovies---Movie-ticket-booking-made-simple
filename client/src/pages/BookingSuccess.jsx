import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { dbService } from '../services/dbService';
import TicketCard from '../components/TicketCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle2, Ticket, ArrowRight, Film } from 'lucide-react';

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const fetchBooking = async () => {
      if (!booking) {
        setLoading(true);
        try {
          const b = await dbService.getBookingById(bookingId);
          setBooking(b);
        } catch (err) {
          console.error('Failed to load booking details:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <LoadingSpinner text="Generating your verified cinema pass..." />;

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <Film className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-white">Booking Record Not Found</h2>
        <Link to="/" className="mt-4 text-xs font-semibold text-rose-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xl shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Booking Confirmed!</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Your seats have been successfully reserved. A scannable digital boarding ticket has been generated below.
          </p>
        </div>

        {/* The Cinema Ticket Pass */}
        <TicketCard booking={booking} />

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/my-bookings"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition-all shadow-lg"
          >
            <Ticket className="w-4 h-4 text-rose-500" />
            <span>Go to My Bookings</span>
          </Link>

          <Link
            to="/movies"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30"
          >
            <span>Explore More Movies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
