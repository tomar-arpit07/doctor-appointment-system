// MyAppointments Component - Shows user's appointments
import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function MyAppointments() {
  // State for appointments list
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Function to fetch user's appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiService.appointments.getMine();
      setAppointments(response.appointments);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle appointment cancellation
  const handleCancel = async (appointmentId) => {
    // Confirm cancellation
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await apiService.appointments.cancel(appointmentId);
      
      // Update local state to reflect cancellation
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt._id === appointmentId 
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      );
      
      alert('Appointment cancelled successfully');
    } catch (err) {
      alert('Failed to cancel appointment. Please try again.');
      console.error('Error cancelling appointment:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="appointments-container">
      <h2>📅 My Appointments</h2>

      {appointments.length === 0 ? (
        <div className="no-appointments">
          <p>You have no appointments yet.</p>
          <p>Book your first appointment with our doctors!</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map(appointment => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                  {appointment.status.toUpperCase()}
                </span>
              </div>

              <div className="appointment-details">
                <div className="detail-row">
                  <strong>Doctor:</strong>
                  <span>{appointment.doctor.name}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Specialization:</strong>
                  <span>{appointment.doctor.specialization}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Date:</strong>
                  <span>{formatDate(appointment.date)}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Time:</strong>
                  <span>{appointment.time}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Reason:</strong>
                  <span>{appointment.reason}</span>
                </div>
                
                <div className="detail-row">
                  <strong>Contact:</strong>
                  <span>{appointment.doctor.phone}</span>
                </div>
              </div>

              {/* Show cancel button only for scheduled appointments */}
              {appointment.status === 'scheduled' && (
                <button 
                  className="btn-danger"
                  onClick={() => handleCancel(appointment._id)}
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;