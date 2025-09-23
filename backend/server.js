// Main server file - Entry point of the backend application
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');

// Initialize express app
const app = express();

// Connect to MongoDB database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json()); // Parse JSON requests

// API Routes
app.use('/api/auth', authRoutes);           // Authentication routes
app.use('/api/doctors', doctorRoutes);      // Doctor related routes
app.use('/api/appointments', appointmentRoutes); // Appointment routes

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Doctor Appointment Booking API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});