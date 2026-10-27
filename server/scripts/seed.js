const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('../config/db');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

const moviesData = [
  {
    title: 'Interstellar: Beyond Time',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 169,
    rating: 9.2,
    voteCount: 1420,
    certificate: 'PG-13',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1400&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    formats: ['IMAX 3D', '2D', '4DX'],
  },
  {
    title: 'Cyberpunk Odyssey 2099',
    description: 'In a neon-drenched metropolis controlled by rogue mega-corporations, an augmented synthetic detective unravels a conspiracy that could redefine human consciousness forever.',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    language: 'English',
    duration: 148,
    rating: 8.8,
    voteCount: 980,
    certificate: 'A',
    director: 'Denis Villeneuve',
    cast: ['Ryan Gosling', 'Ana de Armas', 'Harrison Ford', 'Sylvia Hoeks'],
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1400&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=gCcx85zbxz4',
    formats: ['IMAX', '3D', '4DX'],
  },
  {
    title: 'The Dark Knight: Legacy',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 152,
    rating: 9.0,
    voteCount: 2200,
    certificate: 'U/A',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Gary Oldman'],
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1400&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    formats: ['IMAX 2D', '2D'],
  },
  {
    title: 'Avatar: Realm of Tides',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    genre: ['Action', 'Adventure', 'Fantasy'],
    language: 'English',
    duration: 192,
    rating: 8.4,
    voteCount: 1650,
    certificate: 'U/A',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    formats: ['IMAX 3D', '3D', '4DX'],
  },
  {
    title: 'Gladiator: Honor & Blood',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    genre: ['Action', 'Adventure', 'Drama'],
    language: 'English',
    duration: 155,
    rating: 8.9,
    voteCount: 840,
    certificate: 'A',
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    posterUrl: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1400&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    formats: ['2D', 'IMAX'],
  },
  {
    title: 'Inception: Dream Within',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    language: 'English',
    duration: 148,
    rating: 8.8,
    voteCount: 1950,
    certificate: 'U/A',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    formats: ['IMAX', '2D'],
  },
  {
    title: 'Kalki: Dawn of Era',
    description: 'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth in the year 2898 AD to protect the world from evil forces.',
    genre: ['Action', 'Sci-Fi', 'Fantasy'],
    language: 'Hindi',
    duration: 181,
    rating: 8.7,
    voteCount: 1300,
    certificate: 'U/A',
    director: 'Nag Ashwin',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone'],
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1400&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=kQDd1AhGIHk',
    formats: ['IMAX 3D', '3D', '2D'],
  },
  {
    title: 'Midnight Whispers',
    description: 'A secluded psychologist investigating strange paranormal sleep disturbances finds herself entangled in a nightmare that manifests reality and threatens her family.',
    genre: ['Horror', 'Mystery', 'Thriller'],
    language: 'English',
    duration: 112,
    rating: 7.9,
    voteCount: 540,
    certificate: 'A',
    director: 'Jordan Peele',
    cast: ['Lupita Nyong\'o', 'Winston Duke', 'Elisabeth Moss', 'Tim Heidecker'],
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=1Vnghdsjmd0',
    formats: ['2D', 'Dolby Atmos'],
  },
];

const theatresData = [
  {
    name: 'PVR ICON Gold Cinema',
    city: 'Mumbai',
    address: 'Phoenix Palladium, Senapati Bapat Marg, Lower Parel, Mumbai',
    screens: [
      { screenNumber: 1, name: 'IMAX Audi 1', format: 'IMAX 3D', totalSeats: 80 },
      { screenNumber: 2, name: 'Gold Class 2', format: '4DX', totalSeats: 80 },
    ],
    amenities: ['Dolby Atmos', '4K Laser Projection', 'Recliner Seats', 'Gourmet Food Court', 'Valet Parking'],
  },
  {
    name: 'INOX Megaplex',
    city: 'Mumbai',
    address: 'Inorbit Mall, Link Road, Malad West, Mumbai',
    screens: [
      { screenNumber: 1, name: 'Audi 1 Atmos', format: '3D', totalSeats: 80 },
    ],
    amenities: ['Dolby Atmos', 'Recliner Lounge', 'Snack Bar', 'Wheelchair Friendly'],
  },
  {
    name: 'Cinepolis Grand Central',
    city: 'Delhi',
    address: 'DLF Avenue, Saket District Centre, New Delhi',
    screens: [
      { screenNumber: 1, name: 'Audi 1 Dolby 7.1', format: 'IMAX', totalSeats: 80 },
      { screenNumber: 2, name: 'Audi 2 RealD 3D', format: '3D', totalSeats: 80 },
    ],
    amenities: ['IMAX Screen', 'Dolby 7.1', 'Coffee House', 'VIP Lounges'],
  },
  {
    name: 'PVR Director\'s Cut',
    city: 'Bengaluru',
    address: 'Forum Rex Walk, Brigade Road, Bengaluru',
    screens: [
      { screenNumber: 1, name: 'Luxe Audi 1', format: 'IMAX 3D', totalSeats: 80 },
    ],
    amenities: ['Luxe Dining', 'Motorized Recliners', 'Dolby Atmos', 'Bar & Lounge'],
  },
  {
    name: 'AMC Empire 25 IMAX',
    city: 'New York',
    address: '234 W 42nd St, Times Square, New York, NY',
    screens: [
      { screenNumber: 1, name: 'IMAX Laser 1', format: 'IMAX 3D', totalSeats: 80 },
    ],
    amenities: ['Dolby Cinema', 'IMAX Laser', 'Reserved Seating', 'Coca-Cola Freestyle'],
  },
];

const generateSeats = (pricing = { Silver: 220, Gold: 380, VIP: 550 }) => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = 10;

  rows.forEach((row, rowIndex) => {
    let tier = 'Gold';
    let price = pricing.Gold;

    if (rowIndex <= 1) {
      tier = 'Silver';
      price = pricing.Silver;
    } else if (rowIndex >= 6) {
      tier = 'VIP';
      price = pricing.VIP;
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

const getFutureDates = (count = 5) => {
  const dates = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting IMovies database seeding...');
    await connectDB();

    // Clean existing collections
    await User.deleteMany();
    await Movie.deleteMany();
    await Theatre.deleteMany();
    await Show.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();
    await Notification.deleteMany();

    console.log('🧹 Cleaned existing database collections');

    // Create Admin and Regular Users
    const adminUser = await User.create({
      name: 'Admin Anushka',
      email: 'admin@imovies.com',
      password: 'Admin@123456',
      role: 'admin',
      phone: '+91 9876543210',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    });

    const demoUser = await User.create({
      name: 'Rahul Sharma',
      email: 'user@imovies.com',
      password: 'User@123456',
      role: 'user',
      phone: '+91 9123456789',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    });

    console.log(`👤 Users seeded: Admin (${adminUser.email}), User (${demoUser.email})`);

    // Create Movies
    const createdMovies = await Movie.insertMany(moviesData);
    console.log(`🎬 Seeded ${createdMovies.length} blockbuster movies`);

    // Create Theatres
    const createdTheatres = await Theatre.insertMany(theatresData);
    console.log(`🏛️ Seeded ${createdTheatres.length} premier theatres`);

    // Create Shows across dates and theatres
    const dates = getFutureDates(4);
    const showTimes = ['10:00 AM', '01:30 PM', '05:00 PM', '08:45 PM', '11:15 PM'];

    const showsToInsert = [];

    createdTheatres.forEach((theatre) => {
      dates.forEach((date, dateIdx) => {
        // Pick 2-3 movies per theatre per date
        createdMovies.slice(0, 4).forEach((movie, movieIdx) => {
          const time = showTimes[(movieIdx + dateIdx) % showTimes.length];
          const pricing = {
            Silver: theatre.city === 'Mumbai' ? 240 : 200,
            Gold: theatre.city === 'Mumbai' ? 400 : 350,
            VIP: theatre.city === 'Mumbai' ? 600 : 520,
          };

          const seats = generateSeats(pricing);

          // For the first show today, mark a couple of seats booked to showcase realistic state
          if (dateIdx === 0 && movieIdx === 0) {
            seats.find((s) => s.seatNumber === 'C4').status = 'booked';
            seats.find((s) => s.seatNumber === 'C5').status = 'booked';
            seats.find((s) => s.seatNumber === 'D7').status = 'booked';
          }

          showsToInsert.push({
            movie: movie._id,
            theatre: theatre._id,
            screenNumber: 1,
            date,
            startTime: time,
            endTime: 'Approx 2h 45m',
            format: movie.formats[0] || 'IMAX 3D',
            language: movie.language,
            pricing,
            seats,
          });
        });
      });
    });

    const createdShows = await Show.insertMany(showsToInsert);
    console.log(`🎟️ Seeded ${createdShows.length} shows with full seat grids!`);

    // Create a sample confirmed booking for demoUser
    const sampleShow = createdShows[0];
    const sampleMovie = createdMovies[0];
    const sampleTheatre = createdTheatres[0];
    const bookedSeats = [
      { seatNumber: 'C4', row: 'C', col: 4, tier: 'Gold', price: 400 },
      { seatNumber: 'C5', row: 'C', col: 5, tier: 'Gold', price: 400 },
    ];
    const subtotal = 800;
    const fee = 40;
    const tax = 7;
    const total = 847;

    const sampleBooking = await Booking.create({
      bookingId: 'IMV-748921',
      user: demoUser._id,
      show: sampleShow._id,
      movie: {
        id: sampleMovie._id,
        title: sampleMovie.title,
        posterUrl: sampleMovie.posterUrl,
        language: sampleMovie.language,
        certificate: sampleMovie.certificate,
        duration: sampleMovie.duration,
      },
      theatre: {
        id: sampleTheatre._id,
        name: sampleTheatre.name,
        city: sampleTheatre.city,
        address: sampleTheatre.address,
        screenNumber: 1,
      },
      showDate: sampleShow.date,
      showTime: sampleShow.startTime,
      format: sampleShow.format,
      seats: bookedSeats,
      ticketSubtotal: subtotal,
      convenienceFee: fee,
      taxes: tax,
      totalAmount: total,
      bookingStatus: 'confirmed',
      paymentStatus: 'completed',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    });

    const samplePayment = await Payment.create({
      booking: sampleBooking._id,
      user: demoUser._id,
      amount: total,
      paymentMethod: 'UPI / QR',
      transactionId: 'TXN-982312-4412',
      status: 'success',
      paidAt: new Date(),
    });

    sampleBooking.payment = samplePayment._id;
    await sampleBooking.save();

    await Notification.create({
      user: demoUser._id,
      title: 'Welcome to IMovies! 🍿',
      message: 'Explore blockbuster films, reserve premium seats in real-time, and enjoy the cinema!',
      type: 'system',
    });

    console.log('🎉 Seeding successfully completed!');
    return { success: true };
  } catch (err) {
    console.error('❌ Seeding error:', err);
    throw err;
  }
};

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedDatabase;
