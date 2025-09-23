// Appointment model - Represents booked appointments
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Reference to patient (User)
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Reference to doctor
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    
    // Appointment date
    date: {
        type: Date,
        required: [true, 'Appointment date is required']
    },
    
    // Appointment time slot
    time: {
        type: String,
        required: [true, 'Appointment time is required']
    },
    
    // Reason for visit
    reason: {
        type: String,
        required: [true, 'Please provide reason for appointment'],
        trim: true
    },
    
    // Appointment status
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent double booking
appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);