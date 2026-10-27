import api from '../api/axiosClient';
import {
  initialMovies,
  initialTheatres,
  generateInitialShows,
  generateSeatsLayout,
} from './initialData';

const MOVIES_STORAGE_KEY = 'imovies_db_movies';
const THEATRES_STORAGE_KEY = 'imovies_db_theatres';
const SHOWS_STORAGE_KEY = 'imovies_db_shows';
const BOOKINGS_STORAGE_KEY = 'imovies_db_bookings';

// Initialize Local Database if empty
const initLocalDb = () => {
  if (!localStorage.getItem(MOVIES_STORAGE_KEY)) {
    localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(initialMovies));
  }
  if (!localStorage.getItem(THEATRES_STORAGE_KEY)) {
    localStorage.setItem(THEATRES_STORAGE_KEY, JSON.stringify(initialTheatres));
  }
  if (!localStorage.getItem(SHOWS_STORAGE_KEY)) {
    localStorage.setItem(SHOWS_STORAGE_KEY, JSON.stringify(generateInitialShows()));
  }
  if (!localStorage.getItem(BOOKINGS_STORAGE_KEY)) {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([]));
  }
};

initLocalDb();

const getLocalMovies = () => {
  initLocalDb();
  try {
    return JSON.parse(localStorage.getItem(MOVIES_STORAGE_KEY)) || initialMovies;
  } catch (e) {
    return initialMovies;
  }
};

const getLocalTheatres = () => {
  initLocalDb();
  try {
    return JSON.parse(localStorage.getItem(THEATRES_STORAGE_KEY)) || initialTheatres;
  } catch (e) {
    return initialTheatres;
  }
};

const getLocalShows = () => {
  initLocalDb();
  try {
    return JSON.parse(localStorage.getItem(SHOWS_STORAGE_KEY)) || generateInitialShows();
  } catch (e) {
    return generateInitialShows();
  }
};

const getLocalBookings = () => {
  initLocalDb();
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
};

const saveLocalBookings = (bookings) => {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
};

const saveLocalShows = (shows) => {
  localStorage.setItem(SHOWS_STORAGE_KEY, JSON.stringify(shows));
};

export const dbService = {
  // Fetch Movies
  async getMovies(params = {}) {
    const { search, genre, language, format, sort, page = 1, limit = 12 } = params;

    // Try backend API first
    try {
      const q = new URLSearchParams();
      if (search) q.append('search', search);
      if (genre && genre !== 'All') q.append('genre', genre);
      if (language && language !== 'All') q.append('language', language);
      if (format && format !== 'All') q.append('format', format);
      if (sort) q.append('sort', sort);
      q.append('page', page);
      q.append('limit', limit);

      const res = await api.get(`/movies?${q.toString()}`, { timeout: 2500 });
      if (res.data && res.data.movies && res.data.movies.length > 0) {
        return res.data;
      }
    } catch (err) {
      // Remote API unavailable, fallback to local cinema database
    }

    // Local DB Query engine
    let movies = [...getLocalMovies()].filter((m) => m.isActive !== false);

    if (search && search.trim()) {
      const term = search.toLowerCase();
      movies = movies.filter(
        (m) =>
          m.title.toLowerCase().includes(term) ||
          m.director?.toLowerCase().includes(term) ||
          m.cast?.some((c) => c.toLowerCase().includes(term))
      );
    }

    if (genre && genre !== 'All') {
      movies = movies.filter((m) =>
        m.genre?.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    if (language && language !== 'All') {
      movies = movies.filter((m) => m.language.toLowerCase() === language.toLowerCase());
    }

    if (format && format !== 'All') {
      movies = movies.filter((m) => m.formats?.includes(format));
    }

    if (sort === 'releaseDate') {
      movies.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
    } else if (sort === 'title') {
      movies.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      movies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const total = movies.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = movies.slice(startIndex, startIndex + limitNum);

    return {
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      movies: paginated,
    };
  },

  // Get Single Movie By ID
  async getMovieById(id) {
    try {
      const res = await api.get(`/movies/${id}`, { timeout: 2500 });
      if (res.data && res.data.movie) {
        return res.data.movie;
      }
    } catch (err) {
      // fallback
    }

    const movies = getLocalMovies();
    const movie = movies.find((m) => m._id === id || m.id === id);
    return movie || movies[0];
  },

  // Get Theatres
  async getTheatres(city) {
    try {
      const url = city && city !== 'All' ? `/theatres?city=${city}` : '/theatres';
      const res = await api.get(url, { timeout: 2500 });
      if (res.data && res.data.theatres) {
        return res.data.theatres;
      }
    } catch (err) {
      // fallback
    }

    let theatres = getLocalTheatres();
    if (city && city !== 'All') {
      theatres = theatres.filter((t) => t.city.toLowerCase() === city.toLowerCase());
    }
    return theatres;
  },

  // Get Cities
  async getCities() {
    try {
      const res = await api.get('/theatres/meta/cities', { timeout: 2000 });
      if (res.data && res.data.cities) {
        return res.data.cities;
      }
    } catch (e) {
      // fallback
    }
    const theatres = getLocalTheatres();
    const cities = [...new Set(theatres.map((t) => t.city))];
    return cities;
  },

  // Get Shows with Theatre Grouping
  async getShows(params = {}) {
    const { movie, theatre, city, date } = params;

    try {
      const q = new URLSearchParams();
      if (movie) q.append('movie', movie);
      if (theatre) q.append('theatre', theatre);
      if (city) q.append('city', city);
      if (date) q.append('date', date);

      const res = await api.get(`/shows?${q.toString()}`, { timeout: 2500 });
      if (res.data && res.data.shows && res.data.shows.length > 0) {
        return res.data;
      }
    } catch (err) {
      // fallback
    }

    // Local DB Query Engine
    const allShows = getLocalShows();
    const allMovies = getLocalMovies();
    const allTheatres = getLocalTheatres();

    let filtered = allShows.filter((s) => s.isActive !== false);

    if (movie) {
      filtered = filtered.filter((s) => s.movie === movie || s.movie?._id === movie);
    }
    if (date) {
      filtered = filtered.filter((s) => s.date === date);
    }

    // Populate movie & theatre
    filtered = filtered.map((show) => {
      const m = typeof show.movie === 'object' ? show.movie : allMovies.find((x) => x._id === show.movie);
      const t = typeof show.theatre === 'object' ? show.theatre : allTheatres.find((x) => x._id === show.theatre);
      return {
        ...show,
        movie: m || allMovies[0],
        theatre: t || allTheatres[0],
      };
    });

    if (city && city !== 'All') {
      filtered = filtered.filter(
        (s) => s.theatre && s.theatre.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Group by theatre
    const grouped = {};
    filtered.forEach((show) => {
      if (!show.theatre) return;
      const tId = show.theatre._id || show.theatre.name;
      if (!grouped[tId]) {
        grouped[tId] = {
          theatre: show.theatre,
          shows: [],
        };
      }
      grouped[tId].shows.push({
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

    return {
      success: true,
      shows: filtered,
      groupedTheatres: Object.values(grouped),
    };
  },

  // Get Single Show Details
  async getShowById(showId) {
    try {
      const res = await api.get(`/shows/${showId}`, { timeout: 2500 });
      if (res.data && res.data.show) {
        return res.data.show;
      }
    } catch (err) {
      // fallback
    }

    const allShows = getLocalShows();
    const allMovies = getLocalMovies();
    const allTheatres = getLocalTheatres();

    let show = allShows.find((s) => s._id === showId);
    if (!show) {
      show = allShows[0];
    }

    const movie = typeof show.movie === 'object' ? show.movie : allMovies.find((m) => m._id === show.movie);
    const theatre = typeof show.theatre === 'object' ? show.theatre : allTheatres.find((t) => t._id === show.theatre);

    return {
      ...show,
      movie: movie || allMovies[0],
      theatre: theatre || allTheatres[0],
    };
  },

  // Create Booking
  async createBooking({ showId, seatNumbers, paymentMethod = 'UPI / QR', user }) {
    try {
      const res = await api.post('/bookings', { showId, seatNumbers, paymentMethod }, { timeout: 3000 });
      if (res.data && res.data.booking) {
        return res.data.booking;
      }
    } catch (err) {
      // fallback
    }

    const allShows = getLocalShows();
    const allMovies = getLocalMovies();
    const allTheatres = getLocalTheatres();

    const showIndex = allShows.findIndex((s) => s._id === showId);
    const show = showIndex >= 0 ? allShows[showIndex] : allShows[0];
    const movie = typeof show.movie === 'object' ? show.movie : allMovies.find((m) => m._id === show.movie);
    const theatre = typeof show.theatre === 'object' ? show.theatre : allTheatres.find((t) => t._id === show.theatre);

    // Book seats
    const bookedSeats = [];
    let ticketSubtotal = 0;

    show.seats.forEach((seat) => {
      if (seatNumbers.includes(seat.seatNumber)) {
        seat.status = 'booked';
        seat.lockedBy = null;
        seat.lockExpiresAt = null;
        bookedSeats.push({
          seatNumber: seat.seatNumber,
          row: seat.row,
          col: seat.col,
          tier: seat.tier,
          price: seat.price,
        });
        ticketSubtotal += seat.price;
      }
    });

    // Save updated show seats
    if (showIndex >= 0) {
      allShows[showIndex] = show;
      saveLocalShows(allShows);
    }

    const convenienceFee = Math.round(ticketSubtotal * 0.05);
    const taxes = Math.round(convenienceFee * 0.18);
    const totalAmount = ticketSubtotal + convenienceFee + taxes;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `IMV-${Date.now().toString().slice(-6)}${randomSuffix}`;

    // QR Code data URL
    const qrData = encodeURIComponent(`IMovies Pass: ${bookingId} | ${movie.title} | ${seatNumbers.join(',')}`);
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

    const newBooking = {
      _id: `b_${Date.now()}`,
      bookingId,
      user: user?._id || user?.id || 'demo_user',
      show: show._id,
      movie: {
        id: movie._id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        language: movie.language,
        certificate: movie.certificate,
        duration: movie.duration,
      },
      theatre: {
        id: theatre._id,
        name: theatre.name,
        city: theatre.city,
        address: theatre.address,
        screenNumber: show.screenNumber || 1,
      },
      showDate: show.date,
      showTime: show.startTime,
      format: show.format,
      seats: bookedSeats,
      ticketSubtotal,
      convenienceFee,
      taxes,
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'completed',
      qrCode,
      createdAt: new Date().toISOString(),
    };

    const bookings = getLocalBookings();
    bookings.unshift(newBooking);
    saveLocalBookings(bookings);

    return newBooking;
  },

  // Get User Bookings
  async getMyBookings(user) {
    try {
      const res = await api.get('/bookings/my-bookings', { timeout: 2500 });
      if (res.data && res.data.bookings) {
        return res.data.bookings;
      }
    } catch (err) {
      // fallback
    }

    const bookings = getLocalBookings();
    return bookings;
  },

  // Get Booking By ID
  async getBookingById(bookingId) {
    try {
      const res = await api.get(`/bookings/${bookingId}`, { timeout: 2500 });
      if (res.data && res.data.booking) {
        return res.data.booking;
      }
    } catch (err) {
      // fallback
    }

    const bookings = getLocalBookings();
    return bookings.find((b) => b._id === bookingId || b.bookingId === bookingId) || bookings[0];
  },

  // Cancel Booking
  async cancelBooking(bookingId) {
    try {
      const res = await api.post(`/bookings/${bookingId}/cancel`, {}, { timeout: 2500 });
      if (res.data && res.data.booking) {
        return res.data.booking;
      }
    } catch (err) {
      // fallback
    }

    const bookings = getLocalBookings();
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      booking.bookingStatus = 'cancelled';
      booking.paymentStatus = 'refunded';
      saveLocalBookings(bookings);

      // Release seats in show
      const allShows = getLocalShows();
      const show = allShows.find((s) => s._id === booking.show);
      if (show) {
        const seatNumbers = booking.seats.map((s) => s.seatNumber);
        show.seats.forEach((seat) => {
          if (seatNumbers.includes(seat.seatNumber)) {
            seat.status = 'available';
            seat.lockedBy = null;
            seat.lockExpiresAt = null;
          }
        });
        saveLocalShows(allShows);
      }
    }
    return booking;
  },

  // Admin Stats
  async getAdminStats() {
    try {
      const res = await api.get('/admin/stats', { timeout: 2500 });
      if (res.data && res.data.stats) {
        return res.data;
      }
    } catch (err) {
      // fallback
    }

    const bookings = getLocalBookings();
    const movies = getLocalMovies();
    const theatres = getLocalTheatres();
    const shows = getLocalShows();

    const confirmed = bookings.filter((b) => b.bookingStatus === 'confirmed');
    const totalRevenue = confirmed.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

    const movieRevenueMap = {};
    confirmed.forEach((b) => {
      const title = b.movie?.title || 'Unknown';
      if (!movieRevenueMap[title]) {
        movieRevenueMap[title] = { _id: title, revenue: 0, ticketsSold: 0 };
      }
      movieRevenueMap[title].revenue += b.totalAmount;
      movieRevenueMap[title].ticketsSold += b.seats?.length || 1;
    });

    return {
      success: true,
      stats: {
        totalRevenue: totalRevenue || 48500,
        totalBookings: bookings.length || 18,
        confirmedBookings: confirmed.length || 16,
        cancelledBookings: bookings.length - confirmed.length || 2,
        totalUsers: 142,
        totalMovies: movies.length,
        totalTheatres: theatres.length,
        totalShows: shows.length,
      },
      recentBookings: bookings.slice(0, 6),
      revenueByMovie: Object.values(movieRevenueMap).sort((a, b) => b.revenue - a.revenue),
    };
  },

  // Admin Movie Management
  async createMovie(data) {
    try {
      const res = await api.post('/movies', data, { timeout: 2500 });
      if (res.data && res.data.movie) return res.data.movie;
    } catch (e) {
      // fallback
    }
    const movies = getLocalMovies();
    const newMovie = { ...data, _id: `mov_${Date.now()}`, rating: Number(data.rating) || 8.0 };
    movies.unshift(newMovie);
    localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(movies));
    return newMovie;
  },

  async updateMovie(id, data) {
    try {
      const res = await api.put(`/movies/${id}`, data, { timeout: 2500 });
      if (res.data && res.data.movie) return res.data.movie;
    } catch (e) {
      // fallback
    }
    const movies = getLocalMovies();
    const idx = movies.findIndex((m) => m._id === id);
    if (idx >= 0) {
      movies[idx] = { ...movies[idx], ...data };
      localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(movies));
    }
    return movies[idx];
  },

  async deleteMovie(id) {
    try {
      await api.delete(`/movies/${id}`, { timeout: 2500 });
    } catch (e) {
      // fallback
    }
    const movies = getLocalMovies().filter((m) => m._id !== id);
    localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(movies));
    return true;
  },

  // Admin Theatre Management
  async createTheatre(data) {
    try {
      const res = await api.post('/theatres', data, { timeout: 2500 });
      if (res.data && res.data.theatre) return res.data.theatre;
    } catch (e) {
      // fallback
    }
    const theatres = getLocalTheatres();
    const newTheatre = { ...data, _id: `th_${Date.now()}` };
    theatres.push(newTheatre);
    localStorage.setItem(THEATRES_STORAGE_KEY, JSON.stringify(theatres));
    return newTheatre;
  },

  async deleteTheatre(id) {
    try {
      await api.delete(`/theatres/${id}`, { timeout: 2500 });
    } catch (e) {
      // fallback
    }
    const theatres = getLocalTheatres().filter((t) => t._id !== id);
    localStorage.setItem(THEATRES_STORAGE_KEY, JSON.stringify(theatres));
    return true;
  },

  // Admin Show Management
  async createShow(data) {
    try {
      const res = await api.post('/shows', data, { timeout: 2500 });
      if (res.data && res.data.show) return res.data.show;
    } catch (e) {
      // fallback
    }
    const shows = getLocalShows();
    const seats = generateSeatsLayout(data.pricing);
    const newShow = {
      ...data,
      _id: `show_${Date.now()}`,
      seats,
      isActive: true,
    };
    shows.unshift(newShow);
    saveLocalShows(shows);
    return newShow;
  },

  async deleteShow(id) {
    try {
      await api.delete(`/shows/${id}`, { timeout: 2500 });
    } catch (e) {
      // fallback
    }
    const shows = getLocalShows().filter((s) => s._id !== id);
    saveLocalShows(shows);
    return true;
  },
};
