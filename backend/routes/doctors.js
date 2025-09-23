// Doctor routes - Handle doctor-related operations
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Fetch all doctors from database
        const doctors = await Doctor.find().select('-__v');
        
        res.json({
            message: 'Doctors fetched successfully',
            doctors
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Server error while fetching doctors' });
    }
});

// @route   GET /api/doctors/:id
// @desc    Get single doctor details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // Find doctor by ID
        const doctor = await Doctor.findById(req.params.id).select('-__v');
        
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        res.json({
            message: 'Doctor details fetched successfully',
            doctor
        });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ error: 'Server error while fetching doctor details' });
    }
});

module.exports = router;