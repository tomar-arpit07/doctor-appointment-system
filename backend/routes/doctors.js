const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
    try {
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

// @route   POST /api/doctors
// @desc    Add new doctor (Admin only)
// @access  Private (Admin)
router.post('/', adminAuthMiddleware, async (req, res) => {
    try {
        const { name, specialization, email, phone, experience, availableSlots } = req.body;
        
        // Check if doctor with email already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ error: 'Doctor with this email already exists' });
        }
        
        // Create new doctor
        const doctor = new Doctor({
            name,
            specialization,
            email,
            phone,
            experience,
            availableSlots: availableSlots || ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
        });
        
        await doctor.save();
        
        res.status(201).json({
            message: 'Doctor added successfully',
            doctor
        });
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Server error while adding doctor' });
    }
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor details (Admin only)
// @access  Private (Admin)
router.put('/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const { name, specialization, email, phone, experience, availableSlots } = req.body;
        
        // Find doctor
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        // Check if email is being changed and if new email already exists
        if (email && email !== doctor.email) {
            const existingDoctor = await Doctor.findOne({ email });
            if (existingDoctor) {
                return res.status(400).json({ error: 'Doctor with this email already exists' });
            }
        }
        
        // Update doctor fields
        if (name) doctor.name = name;
        if (specialization) doctor.specialization = specialization;
        if (email) doctor.email = email;
        if (phone) doctor.phone = phone;
        if (experience) doctor.experience = experience;
        if (availableSlots) doctor.availableSlots = availableSlots;
        
        await doctor.save();
        
        res.json({
            message: 'Doctor updated successfully',
            doctor
        });
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ error: 'Server error while updating doctor' });
    }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor (Admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        await Doctor.findByIdAndDelete(req.params.id);
        
        res.json({
            message: 'Doctor deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ error: 'Server error while deleting doctor' });
    }
});

module.exports = router;