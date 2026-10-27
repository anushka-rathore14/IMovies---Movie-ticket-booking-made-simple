const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a movie title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a synopsis/description'],
    },
    genre: {
      type: [String],
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      index: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0,
    },
    voteCount: {
      type: Number,
      default: 250,
    },
    certificate: {
      type: String,
      default: 'U/A',
    },
    director: {
      type: String,
      default: 'N/A',
    },
    cast: {
      type: [String],
      default: [],
    },
    posterUrl: {
      type: String,
      required: true,
    },
    backdropUrl: {
      type: String,
      required: true,
    },
    trailerUrl: {
      type: String,
      default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    formats: {
      type: [String],
      default: ['2D', '3D', 'IMAX'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
movieSchema.index({ title: 'text', description: 'text', director: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
