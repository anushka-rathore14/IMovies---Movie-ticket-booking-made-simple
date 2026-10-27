import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CityModal from './components/CityModal';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import BookingPage from './pages/BookingPage';
import BookingSuccess from './pages/BookingSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Protected User pages
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

// Protected Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMovies from './pages/admin/ManageMovies';
import ManageTheatres from './pages/admin/ManageTheatres';
import ManageShows from './pages/admin/ManageShows';
import ManageBookings from './pages/admin/ManageBookings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CityProvider>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
            <Navbar />
            <CityModal />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/booking/:showId" element={<BookingPage />} />
                <Route path="/booking/success/:bookingId" element={<BookingSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User Protected Routes */}
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/movies"
                  element={
                    <AdminRoute>
                      <ManageMovies />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/theatres"
                  element={
                    <AdminRoute>
                      <ManageTheatres />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/shows"
                  element={
                    <AdminRoute>
                      <ManageShows />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <AdminRoute>
                      <ManageBookings />
                    </AdminRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
