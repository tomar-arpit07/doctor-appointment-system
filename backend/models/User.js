// REPLACE: backend/models/User.js - COMPLETE UPDATED FILE
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Patient's full name
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    
    // Email for login
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    
    // Encrypted password
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    
    // Contact number
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    
    // Age of the patient
    age: {
        type: Number,
        required: [true, 'Age is required']
    },
    
    // Gender
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    
    // ADD THIS: User role for admin functionality
    role: {
        type: String,
        enum: ['patient', 'admin'],
        default: 'patient'
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash if password is modified
    if (!this.isModified('password')) return next();
    
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to check password validity
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);