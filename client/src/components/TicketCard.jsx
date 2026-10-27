import React from 'react';
import {
  Film,
  MapPin,
  Calendar,
  Clock,
  Printer,
  XCircle,
  CheckCircle2,
} from 'lucide-react';

const TicketCard = ({ booking, onCancel }) => {
  if (!booking) return null;

  const isCancelled = booking.bookingStatus === 'cancelled';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden transition-all print:border-none print:shadow-none">
      {/* Top Banner */}
      <div className="px-6 py-4 bg-gradient-to-r from-rose-900/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-rose-500" />
          <span className="font-extrabold text-sm tracking-tight text-white">IMovies e-Ticket</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
              isCancelled
                ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isCancelled ? (
              <>
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancelled & Refunded</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed Pass</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Main Ticket Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Movie poster & basic info */}
        <div className="flex flex-col items-center sm:items-start">
          <img
            src={booking.movie?.posterUrl}
            alt={booking.movie?.title}
            className="w-32 h-44 object-cover rounded-2xl shadow-lg border border-slate-800"
          />
          <h3 className="mt-3 text-base font-bold text-white text-center sm:text-left">
            {booking.movie?.title}
          </h3>
          <p className="text-xs text-rose-400 font-semibold mt-0.5">
            {booking.format} • {booking.movie?.language}
          </p>
        </div>

        {/* Center: Details */}
        <div className="md:col-span-2 space-y-4 text-xs">
          {/* Booking ID & Theatre */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Booking ID
            </span>
            <p className="text-sm font-extrabold text-rose-400 font-mono tracking-wide">
              {booking.bookingId}
            </p>
            <div className="mt-2 flex items-start gap-1.5 text-slate-300">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">{booking.theatre?.name}</p>
                <p className="text-[11px] text-slate-400">{booking.theatre?.address}</p>
              </div>
            </div>
          </div>

          {/* Date, Time, Screen, Seats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date & Time
              </span>
              <p className="text-xs font-bold text-white mt-1">{booking.showDate}</p>
              <p className="text-xs text-slate-300 font-semibold">{booking.showTime}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Screen & Audi
              </span>
              <p className="text-xs font-bold text-white mt-1">Screen {booking.theatre?.screenNumber || 1}</p>
              <p className="text-xs text-slate-300">Audi 1 Laser</p>
            </div>
          </div>

          {/* Reserved Seats */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Reserved Seats</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {booking.seats?.map((seat) => (
                  <span
                    key={seat.seatNumber}
                    className="px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold text-xs"
                  >
                    {seat.seatNumber}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Paid</span>
              <p className="text-base font-extrabold text-white">₹{booking.totalAmount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Perforated Divider */}
      <div className="relative py-2 flex items-center">
        <div className="w-6 h-6 rounded-full bg-slate-950 -ml-3 border-r border-slate-800"></div>
        <div className="flex-1 border-b-2 border-dashed border-slate-800"></div>
        <div className="w-6 h-6 rounded-full bg-slate-950 -mr-3 border-l border-slate-800"></div>
      </div>

      {/* Ticket Footer with QR Code & Actions */}
      <div className="p-6 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Scannable QR code */}
        <div className="flex items-center gap-3">
          {booking.qrCode ? (
            <img
              src={booking.qrCode}
              alt="QR Ticket Code"
              className="w-16 h-16 rounded-xl bg-white p-1 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 text-center">
              QR Pass
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-white">Show at Cinema Entrance</p>
            <p className="text-[11px] text-slate-400">Instant digital check-in scanner</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save</span>
          </button>

          {!isCancelled && onCancel && (
            <button
              onClick={() => onCancel(booking._id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-all"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Ticket</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
