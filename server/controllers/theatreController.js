const Theatre = require('../models/Theatre');

// @desc    Get all theatres, optionally filtered by city
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = { isActive: true };

    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });
    res.status(200).json({ success: true, count: theatres.length, theatres });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre by ID
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }
    res.status(200).json({ success: true, theatre });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new theatre (Admin)
// @route   POST /api/theatres
// @access  Private/Admin
exports.createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({ success: true, message: 'Theatre created successfully', theatre });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre (Admin)
// @route   PUT /api/theatres/:id
// @access  Private/Admin
exports.updateTheatre = async (req, res, next) => {
  try {
    let theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Theatre updated successfully', theatre });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre (Admin)
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    await Theatre.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Theatre deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of unique cities
// @route   GET /api/theatres/meta/cities
// @access  Public
exports.getCities = async (req, res, next) => {
  try {
    const cities = await Theatre.distinct('city');
    res.status(200).json({ success: true, cities: cities.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};
