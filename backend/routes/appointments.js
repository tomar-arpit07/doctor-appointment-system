// Appointment routes - Handle appointment booking and management
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/appointments/book
// @desc    Book a new appointment
// @access  Private (requires authentication)
router.post('/book', authMiddleware, async (req, res) => {
    try {
        const { doctorId, date, time, reason } = req.body;
        const patientId = req.userId; // From auth middleware
        
        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        // Check if time slot is available
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date: new Date(date),
            time,
            status: { $ne: 'cancelled' }
        });
        
        if (existingAppointment) {
            return res.status(400).json({ error: 'This time slot is already booked' });
        }
        
        // Create new appointment
        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date: new Date(date),
            time,
            reason
        });
        
        // Save appointment
        await appointment.save();
        
        // Populate doctor details for response
        await appointment.populate('doctor', 'name specialization');
        
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: 'Server error while booking appointment' });
    }
});

// @route   GET /api/appointments
// @desc    Get all appointments for logged-in patient
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const patientId = req.userId;
        
        // Fetch appointments for this patient
        const appointments = await Appointment.find({ 
            patient: patientId 
        })
        .populate('doctor', 'name specialization email phone')
        .sort({ date: -1 }); // Sort by date (newest first)
        
        res.json({
            message: 'Appointments fetched successfully',
            appointments
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Server error while fetching appointments' });
    }
});

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel an appointment
// @access  Private
router.put('/:id/cancel', authMiddleware, async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const patientId = req.userId;
        
        // Find appointment and verify ownership
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            patient: patientId
        });
        
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        // Check if already cancelled
        if (appointment.status === 'cancelled') {
            return res.status(400).json({ error: 'Appointment is already cancelled' });
        }
        
        // Update status to cancelled
        appointment.status = 'cancelled';
        await appointment.save();
        
        res.json({
            message: 'Appointment cancelled successfully',
            appointment
        });
    } catch (error) {
        console.error('Cancel error:', error);
        res.status(500).json({ error: 'Server error while cancelling appointment' });
    }
});

module.exports = router;