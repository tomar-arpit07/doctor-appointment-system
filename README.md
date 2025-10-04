# 🏥 Doctor Appointment Booking System

A full-stack web application for managing doctor appointments with secure patient registration, doctor listings, and appointment scheduling.


## 📱 Live Link
Our site live at this link - https://getappoint.netlify.app

## ⚡ Features

- **Patient Registration & Login** - Secure authentication with JWT
- **Doctor Discovery** - Browse available doctors by specialization
- **Smart Scheduling** - Book appointments with time slot management
- **Appointment Management** - View, track, and cancel appointments
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Real-time Validation** - Prevents double booking and conflicts
- **Admin Feature** - Admin can add, delete and edit details of doctors.

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design
- **JavaScript ES6+** - Modern JavaScript features

## 📁 Project Structure

```
doctor-appointment-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── doctors.js
│   │   └── appointments.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── styles/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tomar-arpit07/doctor-appointment-system.git
   cd doctor-appointment-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   
   # Update the following variables:
   MONGODB_URI=mongodb://localhost:27017/doctor_appointment_db
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the Application**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # Register new patient
POST /api/auth/login       # Patient login
```

### Doctor Endpoints
```
GET  /api/doctors          # Get all doctors
GET  /api/doctors/:id      # Get doctor details
```

### Appointment Endpoints
```
POST /api/appointments/book           # Book new appointment
GET  /api/appointments               # Get user appointments
PUT  /api/appointments/:id/cancel    # Cancel appointment
```

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Middleware-based route protection
- **Input Validation** - Server-side data validation
- **CORS Configuration** - Cross-origin request handling

## 🏗️ Database Schema

### User (Patient)
- Name, email, password (hashed)
- Phone, age, gender
- Timestamps

### Doctor
- Name, specialization, experience
- Contact information
- Available time slots
- Timestamps

### Appointment
- Patient and doctor references
- Date, time, reason
- Status (scheduled/completed/cancelled)
- Timestamps

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Future Enhancements

- [ ] Email notifications for appointments
- [ ] Payment integration
- [ ] Doctor reviews and ratings
- [ ] Admin dashboard
- [ ] Medical history tracking
- [ ] SMS reminders
- [ ] Video consultation support

## 🐛 Known Issues

- Time zone handling needs improvement
- Mobile UI could be more responsive
- Need to add appointment reminder system

## 📄 License

This project is licensed under the MIT License.


## 📞 Support

If you have any questions or need help getting started, please open an issue or contact:
- Gmail: tomararpit187@gmail.com
- LinkedIn: [www.linkedin.com/in/arpit-tomar-contactme]

---

⭐ If you found this project helpful, please give it a star!
