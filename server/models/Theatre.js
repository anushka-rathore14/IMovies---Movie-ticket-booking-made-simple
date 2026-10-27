const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    default: 'Audi 1',
  },
  format: {
    type: String,
    default: 'IMAX 3D',
  },
  totalSeats: {
    type: Number,
    default: 80,
  },
  seatLayout: {
    rows: { type: Number, default: 8 },
    cols: { type: Number, default: 10 },
  },
});

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide theatre name'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      index: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide theatre address'],
    },
    screens: [screenSchema],
    amenities: {
      type: [String],
      default: ['Dolby Atmos', '4K Projection', 'Recliner Seats', 'Food & Beverages', 'Parking'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

theatreSchema.index({ city: 1, name: 1 });

module.exports = mongoose.model('Theatre', theatreSchema);
