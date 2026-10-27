import React, { useEffect, useState } from 'react';
import { getSocket } from '../socket/socketClient';
import { useAuth } from '../context/AuthContext';
import { Monitor, AlertCircle, Clock } from 'lucide-react';

const SeatGrid = ({
  showId,
  initialSeats = [],
  selectedSeats = [],
  onSeatToggle,
  pricing = {},
}) => {
  const { user } = useAuth();
  const [seatsState, setSeatsState] = useState(initialSeats);
  const [errorMessage, setErrorMessage] = useState('');

  // Socket.io integration
  useEffect(() => {
    setSeatsState(initialSeats);
  }, [initialSeats]);

  useEffect(() => {
    if (!showId) return;

    const socket = getSocket();

    // Join show room
    socket.emit('join_show_room', showId);

    // Initial sync
    socket.on('seat_layout_sync', ({ seats }) => {
      setSeatsState(seats);
    });

    // Another user locked a seat
    socket.on('seat:locked', ({ seatNumber, lockedBy, lockExpiresAt }) => {
      setSeatsState((prev) =>
        prev.map((s) =>
          s.seatNumber === seatNumber
            ? { ...s, status: 'locked', lockedBy, lockExpiresAt }
            : s
        )
      );
    });

    // Seat was released
    socket.on('seat:released', ({ seatNumber }) => {
      setSeatsState((prev) =>
        prev.map((s) =>
          s.seatNumber === seatNumber
            ? { ...s, status: 'available', lockedBy: null, lockExpiresAt: null }
            : s
        )
      );
    });

    // Confirmed booking broadcast
    socket.on('seats:booked', ({ seatNumbers }) => {
      setSeatsState((prev) =>
        prev.map((s) =>
          seatNumbers.includes(s.seatNumber)
            ? { ...s, status: 'booked', lockedBy: null, lockExpiresAt: null }
            : s
        )
      );
    });

    // Error from server
    socket.on('seat:error', ({ message }) => {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 4000);
    });

    return () => {
      socket.emit('leave_show_room', showId);
      socket.off('seat_layout_sync');
      socket.off('seat:locked');
      socket.off('seat:released');
      socket.off('seats:booked');
      socket.off('seat:error');
    };
  }, [showId]);

  const handleSeatClick = (seat) => {
    const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
    const socket = getSocket();
    const currentUserId = user?._id || user?.id || 'guest';

    if (seat.status === 'booked') {
      setErrorMessage(`Seat ${seat.seatNumber} is already booked.`);
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (
      seat.status === 'locked' &&
      seat.lockedBy !== currentUserId &&
      !isSelected
    ) {
      setErrorMessage(`Seat ${seat.seatNumber} is temporarily on hold by another customer.`);
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (isSelected) {
      // Release
      socket.emit('seat:release', {
        showId,
        seatNumber: seat.seatNumber,
        userId: currentUserId,
      });
      onSeatToggle(seat, false);
    } else {
      // Lock
      socket.emit('seat:lock', {
        showId,
        seatNumber: seat.seatNumber,
        userId: currentUserId,
      });
      onSeatToggle(seat, true);
    }
  };

  // Group seats by tier and row
  const tiers = ['VIP', 'Gold', 'Silver'];
  const groupedSeats = {};

  tiers.forEach((t) => {
    groupedSeats[t] = {};
  });

  seatsState.forEach((seat) => {
    const tier = seat.tier || 'Gold';
    if (!groupedSeats[tier]) groupedSeats[tier] = {};
    if (!groupedSeats[tier][seat.row]) groupedSeats[tier][seat.row] = [];
    groupedSeats[tier][seat.row].push(seat);
  });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none py-6">
      {/* Toast Alert for Concurrency Notice */}
      {errorMessage && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs font-semibold animate-bounce">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Screen Representation */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <div className="w-full h-8 cinema-screen-curve bg-gradient-to-b from-rose-500/20 to-transparent flex items-center justify-center">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold tracking-widest uppercase">
            <Monitor className="w-4 h-4" />
            <span>ALL EYES THIS WAY • AUDITORIUM SCREEN</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 font-medium">Curved 4K Dolby Atmos Laser Screen</p>
      </div>

      {/* Seat Grid Layout */}
      <div className="w-full space-y-8 overflow-x-auto pb-4">
        {tiers.map((tierName) => {
          const rowKeys = Object.keys(groupedSeats[tierName] || {}).sort().reverse();
          if (!rowKeys.length) return null;

          return (
            <div key={tierName} className="flex flex-col items-center">
              {/* Tier Heading */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${
                    tierName === 'VIP'
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
                      : tierName === 'Gold'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                      : 'border-slate-700 bg-slate-800/60 text-slate-400'
                  }`}
                >
                  {tierName} Class — ₹{pricing[tierName] || (tierName === 'VIP' ? 500 : tierName === 'Gold' ? 350 : 200)}
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-2.5">
                {rowKeys.map((rowKey) => {
                  const rowSeats = groupedSeats[tierName][rowKey].sort((a, b) => a.col - b.col);
                  return (
                    <div key={rowKey} className="flex items-center gap-2 sm:gap-3">
                      {/* Row Label Left */}
                      <span className="w-5 text-center text-xs font-bold text-slate-500">{rowKey}</span>

                      {/* Seats Row */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {rowSeats.map((seat) => {
                          const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
                          const isBooked = seat.status === 'booked';
                          const isLockedByOther =
                            seat.status === 'locked' &&
                            !isSelected &&
                            seat.lockedBy !== (user?._id || user?.id || 'guest');

                          let seatClasses =
                            'w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all transform';

                          if (isBooked) {
                            seatClasses += ' bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed';
                          } else if (isSelected) {
                            seatClasses +=
                              ' bg-emerald-500 text-white shadow-md shadow-emerald-500/50 scale-105 border-2 border-emerald-400 cursor-pointer';
                          } else if (isLockedByOther) {
                            seatClasses +=
                              ' bg-amber-500/80 text-white animate-pulse border border-amber-400 cursor-not-allowed';
                          } else {
                            seatClasses +=
                              ' bg-slate-900 border border-slate-700 text-slate-300 hover:border-rose-500 hover:text-white hover:scale-110 cursor-pointer';
                          }

                          return (
                            <button
                              key={seat.seatNumber}
                              disabled={isBooked || isLockedByOther}
                              onClick={() => handleSeatClick(seat)}
                              title={`Seat ${seat.seatNumber} - ₹${seat.price} (${isBooked ? 'Booked' : isLockedByOther ? 'In Checkout' : 'Available'})`}
                              className={seatClasses}
                            >
                              {seat.col}
                            </button>
                          );
                        })}
                      </div>

                      {/* Row Label Right */}
                      <span className="w-5 text-center text-xs font-bold text-slate-500">{rowKey}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeatGrid;
