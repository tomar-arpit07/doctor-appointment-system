// Doctor model - Represents doctors in the system
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    // Doctor's full name
    name: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },
    
    // Medical specialization
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true
    },
    
    // Contact email
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    
    // Contact phone
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    
    // Years of experience
    experience: {
        type: Number,
        required: [true, 'Experience is required']
    },
    
    
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);