const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true,
    },
    movie: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
      title: { type: String, required: true },
      posterUrl: { type: String, required: true },
      language: { type: String, default: 'English' },
      certificate: { type: String, default: 'U/A' },
      duration: { type: Number, default: 120 },
    },
    theatre: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
      name: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      screenNumber: { type: Number, default: 1 },
    },
    showDate: {
      type: String,
      required: true,
    },
    showTime: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      default: 'IMAX 3D',
    },
    seats: [
      {
        seatNumber: String,
        row: String,
        col: Number,
        tier: String,
        price: Number,
      },
    ],
    ticketSubtotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      default: 30,
    },
    taxes: {
      type: Number,
      default: 18,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'failed'],
      default: 'completed',
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
    qrCode: {
      type: String, // Data URL
      default: '',
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
