// frontend/src/App.js - COMPLETE UPDATED FILE
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import DoctorList from './components/DoctorList';
import BookAppointment from './components/BookAppointment';
import MyAppointments from './components/MyAppointments';
import AdminPanel from './components/AdminPanel';
import './styles/App.css';

function App() {
  // State to track current page/view
  const [currentPage, setCurrentPage] = useState('login');
  
  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State to store user information
  const [user, setUser] = useState(null);
  
  // State to store selected doctor for booking
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Check if user is already logged in when app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setIsLoggedIn(true);
      setUser(parsedUser);
      
      // If admin, go to admin panel; if patient, go to doctors
      if (parsedUser.role === 'admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('doctors');
      }
    }
  }, []);

  // Handle successful login
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    
    // Redirect based on role
    if (userData.role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('doctors');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setSelectedDoctor(null);
    setCurrentPage('login');
  };

  // Handle doctor selection for booking
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentPage('book');
  };

  // Handle successful appointment booking
  const handleBookingSuccess = () => {
    setCurrentPage('appointments');
    setSelectedDoctor(null);
  };

  // Check if current user is admin
  const isAdmin = user?.role === 'admin';

  // Render different components based on current page
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
      
      case 'register':
        return <Register onRegister={handleLogin} onNavigate={setCurrentPage} />;
      
      case 'doctors':
        return <DoctorList onSelectDoctor={handleSelectDoctor} />;
      
      case 'book':
        return (
          <BookAppointment 
            doctor={selectedDoctor} 
            onSuccess={handleBookingSuccess}
            onBack={() => setCurrentPage('doctors')}
          />
        );
      
      case 'appointments':
        return <MyAppointments />;
      
      case 'admin':
        return isAdmin ? (
          <AdminPanel />
        ) : (
          <div className="error-message">
            Access Denied. Admin privileges required.
          </div>
        );
      
      default:
        return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      {/* Header with navigation */}
      <header className="app-header">
        <h1>🏥 Get Appoint</h1>
        
        {/* Show navigation menu only when logged in */}
        {isLoggedIn && (
          <nav className="nav-menu">
            {/* Show different navigation based on user role */}
            {isAdmin ? (
              // Admin Navigation
              <>
                <button 
                  onClick={() => setCurrentPage('admin')}
                  className={currentPage === 'admin' ? 'active' : ''}
                >
                  👨‍💼 Manage Doctors
                </button>
                <button 
                  onClick={() => setCurrentPage('doctors')}
                  className={currentPage === 'doctors' ? 'active' : ''}
                >
                  View Doctors
                </button>
              </>
            ) : (
              // Patient Navigation
              <>
                <button 
                  onClick={() => setCurrentPage('doctors')}
                  className={currentPage === 'doctors' ? 'active' : ''}
                >
                  Find Doctors
                </button>
                <button 
                  onClick={() => setCurrentPage('appointments')}
                  className={currentPage === 'appointments' ? 'active' : ''}
                >
                  My Appointments
                </button>
              </>
            )}
            
            <button onClick={handleLogout} className="logout-btn">
              Logout ({user?.name}) {isAdmin && <span className="admin-badge">ADMIN</span>}
            </button>
          </nav>
        )}
      </header>

      {/* Main content area */}
      <main className="app-main">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2024 Doctor Appointment System - Team Mietians</p>
      </footer>
    </div>
  );
}

export default App;