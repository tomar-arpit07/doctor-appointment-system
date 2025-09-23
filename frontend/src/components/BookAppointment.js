// BookAppointment Component - Handles appointment booking form
import React, { useState } from 'react';
import apiService from '../services/api';

function BookAppointment({ doctor, onSuccess, onBack }) {
  // Form state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Available time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare appointment data
      const appointmentData = {
        doctorId: doctor._id,
        date: formData.date,
        time: formData.time,
        reason: formData.reason
      };

      // Call book API
      await apiService.appointments.book(appointmentData);
      
      // Show success message and redirect
      alert('Appointment booked successfully!');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If no doctor selected, show error
  if (!doctor) {
    return (
      <div className="booking-container">
        <div className="error-message">No doctor selected</div>
        <button onClick={onBack} className="btn-secondary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2>Book Appointment</h2>
        
        {/* Doctor info card */}
        <div className="doctor-info-card">
          <h3>Doctor Information</h3>
          <p><strong>Name:</strong> {doctor.name}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Experience:</strong> {doctor.experience} years</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Appointment Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Select Time Slot:</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            >
              <option value="">Select a time</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Visit:</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Please describe your symptoms or reason for visit..."
            />
          </div>

          <div className="button-group">
            <button 
              type="button" 
              onClick={onBack}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;