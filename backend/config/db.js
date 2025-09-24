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
        await seedDoctors();
        await seedAdminUser(); // Add this line

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
                    
                },
                 {
                    name: "Dr. Aman Singh",
                    specialization: "Gyencologist",
                    email: "aman.singh@hospital.com",
                    phone: "86308-28811",
                    experience: 8,
                    
                },
                {
                    name: "Dr. Rajesh Chauhan",
                    specialization: "Cardiologist",
                    email: "rajesh@hospital.com",
                    phone: "9876543210",
                    experience: 15,
                    
                },
                {
                    name: "Dr. Abdul Ansari",
                    specialization: "Dermatologist",
                    email: "abdul.ansari@hospital.com",
                    phone: "84565-01703",
                    experience: 12,
                    
                },
                {
                    name: "Dr. Jassi Kaur",
                    specialization: "Orthopedic Surgeon",
                    email: "jassi.kaur@hospital.com",
                    phone: "75955-71564",
                    experience: 10,
                    
                },
                {
                    name: "Dr. Yug Shisodia",
                    specialization: "Physioterapist",
                    email: "yug.shisodia@hospital.com",
                    phone: "75665-59105",
                    experience: 6,
                    
                }
            ];
            
            await Doctor.insertMany(doctors);
            console.log('Initial doctors data seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding doctors:', error);
    }
};

// Function to seed admin user
const seedAdminUser = async () => {
    const User = require('../models/User');
    
    try {
        // Check if admin user exists
        const adminExists = await User.findOne({ email: 'admin@hospital.com' });
        
        if (!adminExists) {
            const adminUser = new User({
                name: 'Hospital Admin',
                email: 'admin@hospital.com',
                password: 'admin123', // Will be hashed automatically
                phone: '63961-81192',
                age: 30,
                gender: 'Male',
                role: 'admin'    // IMPORTANT: This creates admin user
            });
            
            await adminUser.save();
            console.log('Admin user created successfully');
            console.log('Admin Login: admin@hospital.com / admin123');
        }   else {
            console.log('ℹ️  Admin user already exists');
            
            // Double check the role is set correctly
            if (adminExists.role !== 'admin') {
                adminExists.role = 'admin';
                await adminExists.save();
                console.log('✅ Admin role updated');
            }
        }

    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = connectDB;