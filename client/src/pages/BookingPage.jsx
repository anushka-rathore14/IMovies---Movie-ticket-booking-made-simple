import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';
import SeatLegend from '../components/SeatLegend';
import CheckoutModal from '../components/CheckoutModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Film,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchShowDetails = async () => {
      setLoading(true);
      try {
        const data = await dbService.getShowById(showId);
        setShow(data);
      } catch (err) {
        console.error('Failed to load show details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (showId) {
      fetchShowDetails();
    }
  }, [showId]);

  const handleSeatToggle = (seat, isSelecting) => {
    if (isSelecting) {
      setSelectedSeats((prev) => [...prev, seat]);
    } else {
      setSelectedSeats((prev) => prev.filter((s) => s.seatNumber !== seat.seatNumber));
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login preserving destination
      navigate('/login', { state: { from: `/booking/${showId}` } });
      return;
    }

    if (!selectedSeats.length) {
      setBookingError('Please choose at least 1 seat before checking out.');
      setTimeout(() => setBookingError(''), 3000);
      return;
    }

    setIsCheckoutOpen(true);
  };

  const handleConfirmBooking = async (paymentMethod) => {
    setIsProcessing(true);
    setBookingError('');
    try {
      const booking = await dbService.createBooking({
        showId,
        seatNumbers: selectedSeats.map((s) => s.seatNumber),
        paymentMethod,
        user,
      });

      setIsCheckoutOpen(false);
      navigate(`/booking/success/${booking._id}`, { state: { booking } });
    } catch (err) {
      setBookingError(err.message || 'Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner text="Connecting to live seat reservation engine..." />;
  if (!show) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
        <Film className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-white">Showtime Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-xs font-semibold text-rose-500 hover:underline"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  const movie = show.movie;
  const theatre = show.theatre;
  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="min-h-screen bg-slate-950 pb-32">
      {/* Top Header Bar */}
      <div className="w-full bg-slate-900/60 border-b border-slate-800/80 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
                  {movie.title}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600/30 text-rose-400 border border-rose-500/40">
                  {show.format || 'IMAX 3D'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{theatre.name}</span>
                <span>•</span>
                <span>Screen {show.screenNumber || 1}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>{show.date}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span>{show.startTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Seat Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Seat Legend */}
        <SeatLegend />

        {/* Error notification */}
        {bookingError && (
          <div className="max-w-lg mx-auto flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{bookingError}</span>
          </div>
        )}

        {/* Interactive Seat Grid */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/30 border border-slate-800/80 shadow-2xl">
          <SeatGrid
            showId={showId}
            initialSeats={show.seats || []}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            pricing={show.pricing}
          />
        </div>
      </div>

      {/* Floating Bottom Booking Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 border-t border-slate-800/90 backdrop-blur-xl p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Selected seats pills */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Selected Seats ({selectedSeats.length})</p>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.seatNumber}
                      className="px-2 py-0.5 rounded-md bg-rose-600/20 text-rose-300 font-mono font-bold text-xs border border-rose-500/40"
                    >
                      {s.seatNumber}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-semibold text-slate-500">Pick seats from the grid above</p>
              )}
            </div>
          </div>

          {/* Pricing & Proceed CTA */}
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 text-right">Subtotal</p>
              <p className="text-xl font-extrabold text-white text-right">₹{subtotal}</p>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={selectedSeats.length === 0}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 hover:scale-105 disabled:opacity-40 disabled:scale-100 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Checkout & Pay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        movie={movie}
        theatre={theatre}
        show={show}
        selectedSeats={selectedSeats}
        onConfirmBooking={handleConfirmBooking}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default BookingPage;
