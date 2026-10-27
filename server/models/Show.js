const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  row: {
    type: String,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  },
  tier: {
    type: String,
    enum: ['Silver', 'Gold', 'VIP'],
    default: 'Gold',
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'locked', 'booked'],
    default: 'available',
  },
  lockedBy: {
    type: String, // User ID or socket ID
    default: null,
  },
  lockExpiresAt: {
    type: Date,
    default: null,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null,
  },
});

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
      index: true,
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
      index: true,
    },
    screenNumber: {
      type: Number,
      default: 1,
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: 'IMAX 3D',
    },
    language: {
      type: String,
      default: 'English',
    },
    pricing: {
      Silver: { type: Number, default: 200 },
      Gold: { type: Number, default: 350 },
      VIP: { type: Number, default: 500 },
    },
    seats: [seatSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying shows by movie, theatre, and date
showSchema.index({ movie: 1, theatre: 1, date: 1 });
showSchema.index({ date: 1, isActive: 1 });

module.exports = mongoose.model('Show', showSchema);
