// Database connection configuration
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect to MongoDB using the connection string from .env
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');
        
        // Seed initial doctor data if database is empty
        seedDoctors();
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1); // Exit process with failure
    }
};

// Function to seed initial doctor data
const seedDoctors = async () => {
    const Doctor = require('../models/Doctor');
    
    try {
        // Check if doctors already exist
        const count = await Doctor.countDocuments();
        
        if (count === 0) {
            // Sample doctor data
            const doctors = [
                 {
                    name: "Dr. Arpit Tomar",
                    specialization: "Gyencologist",
                    email: "arpit.tomar@hospital.com",
                    phone: "75155-59965",
                    experience: 15
                },
                 {
                    name: "Dr. Aman Singh",
                    specialization: "Gyencologist",
                    email: "aman.singh@hospital.com",
                    phone: "86308-28811",
                    experience: 8
                },
                {
                    name: "Dr. Anil Chauhan",
                    specialization: "Cardiologist",
                    email: "anil.chauhan@hospital.com",
                    phone: "92549-01051",
                    experience: 10
                },
                {
                    name: "Dr. Khusboo Chaudhary",
                    specialization: "Pediatrician",
                    email: "khus.ch@hospital.com",
                    phone: "75984-01502",
                    experience: 9
                },
                {
                    name: "Dr. Abdul Ansari",
                    specialization: "Dermatologist",
                    email: "abdul.ansari@hospital.com",
                    phone: "84565-01703",
                    experience: 12
                },
                {
                    name: "Dr. Jassi Kaur",
                    specialization: "Orthopedic Surgeon",
                    email: "jassi.kaur@hospital.com",
                    phone: "75955-71564",
                    experience: 10
                },
                {
                    name: "Dr. Shekhar Tomar",
                    specialization: "General Physician",
                    email: "sheku.tomar@hospital.com",
                    phone: "75665-59105",
                    experience: 6
                },
                {
                    name: "Dr. Yug Shisodia",
                    specialization: "Physioterapist",
                    email: "yug.shisodia@hospital.com",
                    phone: "75665-59105",
                    experience: 6
                }
            ];
            
            await Doctor.insertMany(doctors);
            console.log('Initial doctors data seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding doctors:', error);
    }
};

module.exports = connectDB;