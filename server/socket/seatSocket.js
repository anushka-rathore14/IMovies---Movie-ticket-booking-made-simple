const Show = require('../models/Show');

const setupSeatSocket = (io) => {
  // Map of active socketId -> Set of { showId, seatNumber, userId }
  const socketLocks = new Map();

  io.on('connection', (socket) => {
    // console.log(`🔌 Client connected: ${socket.id}`);

    // Join show room
    socket.on('join_show_room', async (showId) => {
      socket.join(`show_${showId}`);
      // Send fresh show seat statuses
      try {
        const show = await Show.findById(showId).select('seats');
        if (show) {
          // Release any expired locks first
          let hasExpired = false;
          const now = new Date();
          show.seats.forEach((seat) => {
            if (seat.status === 'locked' && seat.lockExpiresAt && new Date(seat.lockExpiresAt) < now) {
              seat.status = 'available';
              seat.lockedBy = null;
              seat.lockExpiresAt = null;
              hasExpired = true;
            }
          });
          if (hasExpired) {
            await show.save();
          }
          socket.emit('seat_layout_sync', { showId, seats: show.seats });
        }
      } catch (err) {
        console.error('Error syncing show room:', err.message);
      }
    });

    // Leave show room
    socket.on('leave_show_room', (showId) => {
      socket.leave(`show_${showId}`);
    });

    // Lock seat temporarily (e.g., 5-minute checkout hold)
    socket.on('seat:lock', async ({ showId, seatNumber, userId }) => {
      try {
        const show = await Show.findById(showId);
        if (!show) {
          return socket.emit('seat:error', { seatNumber, message: 'Show not found' });
        }

        const seat = show.seats.find((s) => s.seatNumber === seatNumber);
        if (!seat) {
          return socket.emit('seat:error', { seatNumber, message: 'Seat not found' });
        }

        const now = new Date();
        const isLockedByOther =
          seat.status === 'locked' &&
          seat.lockedBy !== userId &&
          seat.lockExpiresAt &&
          new Date(seat.lockExpiresAt) > now;

        if (seat.status === 'booked') {
          return socket.emit('seat:error', { seatNumber, message: `Seat ${seatNumber} is already booked` });
        }

        if (isLockedByOther) {
          return socket.emit('seat:error', { seatNumber, message: `Seat ${seatNumber} is currently selected by another customer` });
        }

        // Lock the seat
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        seat.status = 'locked';
        seat.lockedBy = userId || socket.id;
        seat.lockExpiresAt = expiresAt;

        await show.save();

        // Track socket lock
        if (!socketLocks.has(socket.id)) {
          socketLocks.set(socket.id, new Set());
        }
        socketLocks.get(socket.id).add({ showId, seatNumber, userId });

        // Broadcast to all clients in the show room
        io.to(`show_${showId}`).emit('seat:locked', {
          showId,
          seatNumber,
          lockedBy: userId || socket.id,
          lockExpiresAt: expiresAt,
        });
      } catch (err) {
        console.error('Error locking seat:', err.message);
        socket.emit('seat:error', { seatNumber, message: 'Failed to lock seat' });
      }
    });

    // Release seat
    socket.on('seat:release', async ({ showId, seatNumber, userId }) => {
      try {
        const show = await Show.findById(showId);
        if (!show) return;

        const seat = show.seats.find((s) => s.seatNumber === seatNumber);
        if (!seat || seat.status === 'booked') return;

        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockExpiresAt = null;

        await show.save();

        if (socketLocks.has(socket.id)) {
          const userLocks = socketLocks.get(socket.id);
          for (const item of userLocks) {
            if (item.showId === showId && item.seatNumber === seatNumber) {
              userLocks.delete(item);
            }
          }
        }

        io.to(`show_${showId}`).emit('seat:released', {
          showId,
          seatNumber,
        });
      } catch (err) {
        console.error('Error releasing seat:', err.message);
      }
    });

    // On disconnect, release locks held by this socket if not booked
    socket.on('disconnect', async () => {
      if (socketLocks.has(socket.id)) {
        const locks = socketLocks.get(socket.id);
        for (const item of locks) {
          try {
            const show = await Show.findById(item.showId);
            if (show) {
              const seat = show.seats.find((s) => s.seatNumber === item.seatNumber);
              if (seat && seat.status === 'locked' && seat.lockedBy === (item.userId || socket.id)) {
                seat.status = 'available';
                seat.lockedBy = null;
                seat.lockExpiresAt = null;
                await show.save();
                io.to(`show_${item.showId}`).emit('seat:released', {
                  showId: item.showId,
                  seatNumber: item.seatNumber,
                });
              }
            }
          } catch (e) {
            // ignore cleanup errors
          }
        }
        socketLocks.delete(socket.id);
      }
    });
  });

  // Background sweep to release expired locks every 30 seconds
  setInterval(async () => {
    try {
      const now = new Date();
      const showsWithExpiredSeats = await Show.find({
        'seats.status': 'locked',
        'seats.lockExpiresAt': { $lt: now },
      });

      for (const show of showsWithExpiredSeats) {
        let changed = false;
        show.seats.forEach((seat) => {
          if (seat.status === 'locked' && seat.lockExpiresAt && new Date(seat.lockExpiresAt) < now) {
            seat.status = 'available';
            seat.lockedBy = null;
            seat.lockExpiresAt = null;
            changed = true;
            io.to(`show_${show._id}`).emit('seat:released', {
              showId: show._id,
              seatNumber: seat.seatNumber,
            });
          }
        });
        if (changed) {
          await show.save();
        }
      }
    } catch (err) {
      // background sweep error
    }
  }, 30000);
};

module.exports = setupSeatSocket;
