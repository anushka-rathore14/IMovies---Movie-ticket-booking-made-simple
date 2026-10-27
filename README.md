# 🎬 IMovies - Movie Ticket Booking Made Simple

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-success?style=for-the-badge&logo=vercel)](https://anushka-rathore14.github.io/IMovies---Movie-ticket-booking-made-simple/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/anushka-rathore14/IMovies---Movie-ticket-booking-made-simple)

> **Live Demo URL**: [https://anushka-rathore14.github.io/IMovies---Movie-ticket-booking-made-simple/](https://anushka-rathore14.github.io/IMovies---Movie-ticket-booking-made-simple/)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-rose.svg)](https://github.com/anushka-rathore14/IMovies---Movie-ticket-booking-made-simple)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-orange.svg)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-cyan.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A modern, production-ready MERN stack movie ticket booking platform with real-time seat concurrency locking via Socket.io, role-based access control, scannable digital QR boarding passes, and a comprehensive cinema administration panel.

---

## 🌟 Key Features

### 🍿 Customer Cinema Experience
- **Dynamic Blockbuster Catalog**: Browse currently running films with high-definition backdrops, ratings, languages, and formats (`2D`, `3D`, `IMAX 3D`, `4DX`).
- **Trailer Video Player Modal**: Watch high-res YouTube trailers seamlessly before reserving.
- **Location & City Switcher**: Filter shows and theatres across cinema hubs (Mumbai, Delhi, Bengaluru, New York, etc.).
- **Interactive Multi-Tier Seat Map**:
  - Live visual auditorium map with curved cinema screen ("ALL EYES THIS WAY").
  - Tier classification: **VIP Recliner**, **Gold Class**, and **Silver Standard**.
  - Real-time seat concurrency protection via **Socket.io** (temporary hold lock with countdown timer to prevent double-booking).
  - Instant live updates across all connected clients when seats are locked or confirmed.
- **Express Checkout & Payment**:
  - Multiple payment methods: UPI / QR Code scan simulation, Credit/Debit Card test autofill, Net Banking.
  - Transparent itemized pricing with convenience fee and taxes calculation.
- **Scannable QR Boarding Pass**:
  - Automatically generates scannable digital tickets embedded with JSON ticket data.
  - Perforated cinema pass design with one-click Print / PDF save.
- **1-Click Ticket Cancellation & Refund**:
  - Instant self-service ticket cancellation releasing seats immediately back to the auditorium inventory.

### 🛡️ Administration & Analytics Command
- **Executive Revenue Dashboard**: Real-time metrics for Gross Revenue, Confirmed Bookings, Active Movies, and Registered Users.
- **Top Box Office Performers**: Automatic revenue breakdown grouped by movie title.
- **Movie Catalog Manager**: Add upcoming releases, update synopsis, duration, posters, and YouTube trailer links.
- **Theatre & Screen Manager**: Configure cinema properties, auditoriums, and luxury amenities.
- **Showtime Scheduler**: Automated show generation with custom date, time, format, and tiered pricing.
- **Customer Bookings Registry**: Comprehensive transaction log with admin-level cancellation & refund triggers.

---

## 🧱 Architecture & Tech Stack

```
IMovies (MERN)
│
├── client/ (Vite + React 18 SPA)
│   ├── Tailwind CSS + Lucide Icons + Canvas-Confetti
│   ├── Axios API Client (JWT Interceptors)
│   ├── Socket.io Client (Real-time seat room sync)
│   └── Context Providers (AuthContext, CityContext)
│
└── server/ (Node.js + Express REST API)
    ├── MongoDB + Mongoose Schemas (Users, Movies, Theatres, Shows, Bookings, Payments, Notifications)
    ├── Socket.io Server (Real-time seat locks & broadcast)
    ├── JWT Authentication & Role-Based Middleware
    └── In-Memory / Atlas Database Connection Fallback
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@imovies.com` | `Admin@123456` | Full Admin Dashboard, Movie/Show Management, Analytics |
| **Standard User** | `user@imovies.com` | `User@123456` | Seat Selection, Checkout, My Bookings, Cancellation |

*(Quick one-click demo login buttons are provided directly on the Login screen).*

---

## 📡 API Reference

### Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate & receive JWT
- `GET /api/auth/me` - Get current session user *(Private)*
- `PUT /api/auth/profile` - Update user profile *(Private)*

### Movies
- `GET /api/movies` - List movies with search, filter (genre, language, format), & pagination
- `GET /api/movies/:id` - Get movie details & metadata
- `POST /api/movies` - Create new movie *(Admin)*
- `PUT /api/movies/:id` - Update movie *(Admin)*
- `DELETE /api/movies/:id` - Remove movie *(Admin)*

### Theatres & Shows
- `GET /api/theatres` - List theatres (filtered by city)
- `GET /api/shows` - Get showtimes grouped by theatre with availability
- `GET /api/shows/:id` - Get show seat layout and live statuses
- `POST /api/shows` - Schedule new show & generate seat grid *(Admin)*

### Bookings & Payments
- `POST /api/bookings` - Reserve seats, generate QR code pass, & process payment *(Private)*
- `GET /api/bookings/my-bookings` - Retrieve user ticket history *(Private)*
- `GET /api/bookings/:id` - Get booking pass *(Private)*
- `POST /api/bookings/:id/cancel` - Cancel booking & release seats *(Private)*
- `GET /api/bookings` - Audit all customer bookings *(Admin)*

### Real-Time Sockets (Socket.io)
- `join_show_room` / `leave_show_room` - Join show room by ID
- `seat:lock` - Temporarily lock seat for 5-minute checkout hold
- `seat:release` - Unlock seat
- `seats:booked` - Broadcast confirmed booking to all clients

---

## 🚀 Quickstart & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/anushka-rathore14/IMovies---Movie-ticket-booking-made-simple.git
cd IMovies---Movie-ticket-booking-made-simple
```

### 2. Install dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 3. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=super_secret_imovies_jwt_token_2026_xyz_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```
*(Note: If no `MONGODB_URI` is supplied, the server automatically starts an in-memory MongoDB instance for zero-config local testing).*

### 4. Seed the Database
```bash
npm run seed
```

### 5. Run Development Servers
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🌐 Deployment Guide

### Option 1: Full-Stack Web Service (Render / Railway / Heroku)
1. Fork or push this repository to GitHub.
2. In **Render**, create a new **Web Service** pointing to this repository.
3. Settings:
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm run start`
   - **Environment Variables**: Add `MONGODB_URI` and `JWT_SECRET`.
4. Deploy! The server serves both the REST API and the React SPA build.

### Option 2: Frontend on Vercel + Backend on Render
1. Deploy `client/` to **Vercel** with root directory set to `client`.
2. Add environment variable `VITE_API_URL=https://your-render-backend.onrender.com/api`.
3. Deploy `server/` to **Render** or **Railway**.

---

## 👩‍💻 Author
**Anushka Rathore**  
GitHub: [@anushka-rathore14](https://github.com/anushka-rathore14)
