const Show = require('../models/Show');
const Theatre = require('../models/Theatre');
const Movie = require('../models/Movie');

// Helper to generate seat grid
const generateDefaultSeats = (pricing = { Silver: 200, Gold: 350, VIP: 500 }) => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = 10;

  rows.forEach((row, rowIndex) => {
    let tier = 'Gold';
    let price = pricing.Gold || 350;

    if (rowIndex <= 1) {
      tier = 'Silver';
      price = pricing.Silver || 200;
    } else if (rowIndex >= 6) {
      tier = 'VIP';
      price = pricing.VIP || 500;
    }

    for (let c = 1; c <= cols; c++) {
      seats.push({
        seatNumber: `${row}${c}`,
        row,
        col: c,
        tier,
        price,
        status: 'available',
        lockedBy: null,
        lockExpiresAt: null,
      });
    }
  });

  return seats;
};

// @desc    Get shows with filtering
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movie, theatre, city, date } = req.query;
    const query = { isActive: true };

    if (movie) query.movie = movie;
    if (theatre) query.theatre = theatre;
    if (date) query.date = date;

    let shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration language certificate formats rating')
      .populate('theatre', 'name city address amenities')
      .sort({ startTime: 1 });

    // Filter by city if specified
    if (city && city !== 'All') {
      shows = shows.filter(
        (show) => show.theatre && show.theatre.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Group shows by theatre for clean cinema listing UI
    const groupedByTheatre = {};
    shows.forEach((show) => {
      if (!show.theatre) return;
      const tId = show.theatre._id.toString();
      if (!groupedByTheatre[tId]) {
        groupedByTheatre[tId] = {
          theatre: show.theatre,
          shows: [],
        };
      }
      groupedByTheatre[tId].shows.push({
        _id: show._id,
        screenNumber: show.screenNumber,
        date: show.date,
        startTime: show.startTime,
        endTime: show.endTime,
        format: show.format,
        language: show.language,
        pricing: show.pricing,
        availableSeatsCount: show.seats.filter((s) => s.status === 'available').length,
        totalSeatsCount: show.seats.length,
      });
    });

    res.status(200).json({
      success: true,
      count: shows.length,
      shows,
      groupedTheatres: Object.values(groupedByTheatre),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show details with real-time seat layout
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Release any expired locks
    const now = new Date();
    let hasExpired = false;
    show.seats.forEach((seat) => {
      if (
        seat.status === 'locked' &&
        seat.lockExpiresAt &&
        new Date(seat.lockExpiresAt) < now
      ) {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockExpiresAt = null;
        hasExpired = true;
      }
    });

    if (hasExpired) {
      await show.save();
    }

    res.status(200).json({ success: true, show });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new show (Admin)
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
  try {
    const {
      movie,
      theatre,
      screenNumber,
      date,
      startTime,
      endTime,
      format,
      language,
      pricing,
    } = req.body;

    const movieDoc = await Movie.findById(movie);
    if (!movieDoc) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const theatreDoc = await Theatre.findById(theatre);
    if (!theatreDoc) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const seats = generateDefaultSeats(pricing);

    const show = await Show.create({
      movie,
      theatre,
      screenNumber: screenNumber || 1,
      date,
      startTime,
      endTime: endTime || '',
      format: format || 'IMAX 3D',
      language: language || movieDoc.language,
      pricing: pricing || { Silver: 200, Gold: 350, VIP: 500 },
      seats,
    });

    res.status(201).json({ success: true, message: 'Show created successfully', show });
  } catch (error) {
    next(error);
  }
};

// @desc    Update show (Admin)
// @route   PUT /api/shows/:id
// @access  Private/Admin
exports.updateShow = async (req, res, next) => {
  try {
    let show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Show updated successfully', show });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show (Admin)
// @route   DELETE /api/shows/:id
// @access  Private/Admin
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    await Show.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Show deleted successfully' });
  } catch (error) {
    next(error);
  }
};
