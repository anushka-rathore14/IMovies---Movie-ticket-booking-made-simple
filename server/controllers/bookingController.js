const QRCode = require('qrcode');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// @desc    Create a new booking & process simulated payment
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seatNumbers, paymentMethod = 'UPI / QR' } = req.body;
    const userId = req.user._id;

    if (!showId || !seatNumbers || !seatNumbers.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and at least one seat to book',
      });
    }

    const show = await Show.findById(showId)
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Verify seats availability and calculate pricing
    const seatsToBook = [];
    let ticketSubtotal = 0;

    for (const seatNum of seatNumbers) {
      const seat = show.seats.find((s) => s.seatNumber === seatNum);
      if (!seat) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNum} does not exist in this auditorium`,
        });
      }

      const now = new Date();
      const isLockedByOther =
        seat.status === 'locked' &&
        seat.lockedBy !== userId.toString() &&
        seat.lockExpiresAt &&
        new Date(seat.lockExpiresAt) > now;

      if (seat.status === 'booked') {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNum} is already booked. Please pick another seat.`,
        });
      }

      if (isLockedByOther) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNum} is locked by another customer during checkout.`,
        });
      }

      seatsToBook.push({
        seatNumber: seat.seatNumber,
        row: seat.row,
        col: seat.col,
        tier: seat.tier,
        price: seat.price,
      });

      ticketSubtotal += seat.price;
    }

    // Calculate fees
    const convenienceFee = Math.round(ticketSubtotal * 0.05); // 5%
    const taxes = Math.round(convenienceFee * 0.18); // 18% GST on fee
    const totalAmount = ticketSubtotal + convenienceFee + taxes;

    // Unique Booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `IMV-${Date.now().toString().slice(-6)}${randomSuffix}`;

    // Generate Scannable QR Code
    const qrData = JSON.stringify({
      bookingId,
      movie: show.movie.title,
      theatre: show.theatre.name,
      screen: show.screenNumber,
      seats: seatNumbers,
      date: show.date,
      time: show.startTime,
      user: req.user.email,
    });
    const qrCode = await QRCode.toDataURL(qrData);

    // Create Booking
    const booking = new Booking({
      bookingId,
      user: userId,
      show: show._id,
      movie: {
        id: show.movie._id,
        title: show.movie.title,
        posterUrl: show.movie.posterUrl,
        language: show.movie.language,
        certificate: show.movie.certificate,
        duration: show.movie.duration,
      },
      theatre: {
        id: show.theatre._id,
        name: show.theatre.name,
        city: show.theatre.city,
        address: show.theatre.address,
        screenNumber: show.screenNumber,
      },
      showDate: show.date,
      showTime: show.startTime,
      format: show.format,
      seats: seatsToBook,
      ticketSubtotal,
      convenienceFee,
      taxes,
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'completed',
      qrCode,
    });

    // Create Payment record
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const payment = await Payment.create({
      booking: booking._id,
      user: userId,
      amount: totalAmount,
      paymentMethod,
      transactionId,
      status: 'success',
      paidAt: new Date(),
    });

    booking.payment = payment._id;
    await booking.save();

    // Mark seats as booked in Show
    show.seats.forEach((seat) => {
      if (seatNumbers.includes(seat.seatNumber)) {
        seat.status = 'booked';
        seat.lockedBy = null;
        seat.lockExpiresAt = null;
        seat.bookingId = booking._id;
      }
    });
    await show.save();

    // Create notification
    await Notification.create({
      user: userId,
      title: 'Booking Confirmed! 🍿',
      message: `Your tickets for ${show.movie.title} at ${show.theatre.name} (${seatNumbers.join(', ')}) are confirmed. Booking ID: ${bookingId}`,
      type: 'booking_confirmation',
      data: { bookingId: booking._id },
    });

    // Broadcast real-time seat update via Socket.io if attached to app
    const io = req.app.get('socketio');
    if (io) {
      io.to(`show_${show._id}`).emit('seats:booked', {
        showId: show._id,
        seatNumbers,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Ticket booked successfully!',
      booking,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's booking history
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('payment')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('payment');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership or admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership or admin
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled',
      });
    }

    // Release seats in Show
    const show = await Show.findById(booking.show);
    const seatNumbers = booking.seats.map((s) => s.seatNumber);

    if (show) {
      show.seats.forEach((seat) => {
        if (seatNumbers.includes(seat.seatNumber)) {
          seat.status = 'available';
          seat.lockedBy = null;
          seat.lockExpiresAt = null;
          seat.bookingId = null;
        }
      });
      await show.save();

      // Emit socket release
      const io = req.app.get('socketio');
      if (io) {
        seatNumbers.forEach((sn) => {
          io.to(`show_${show._id}`).emit('seat:released', {
            showId: show._id,
            seatNumber: sn,
          });
        });
      }
    }

    // Update booking and payment
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancellationReason = req.body.reason || 'User requested cancellation';
    booking.cancelledAt = new Date();
    await booking.save();

    if (booking.payment) {
      await Payment.findByIdAndUpdate(booking.payment, {
        status: 'refunded',
        refundId: `REF-${Date.now()}`,
        refundAmount: booking.totalAmount,
        refundedAt: new Date(),
      });
    }

    // Notification
    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingId} for ${booking.movie.title} has been cancelled and full refund of ₹${booking.totalAmount} initiated.`,
      type: 'cancellation',
      data: { bookingId: booking._id },
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.bookingStatus = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('payment')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
