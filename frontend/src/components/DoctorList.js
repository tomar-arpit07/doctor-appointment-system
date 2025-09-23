// DoctorList Component - Displays all available doctors
import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function DoctorList({ onSelectDoctor }) {
  // State to store doctors list
  const [doctors, setDoctors] = useState([]);
  
  // Loading state
  const [loading, setLoading] = useState(true);
  
  // Error state
  const [error, setError] = useState('');
  
  // Search/filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch doctors when component mounts
  useEffect(() => {
    fetchDoctors();
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await apiService.doctors.getAll();
      setDoctors(response.doctors);
    } catch (err) {
      setError('Failed to load doctors. Please try again.');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  // Error state
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="doctor-list-container">
      <h2>👨‍⚕️ Our Doctors</h2>
      
      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Doctors grid */}
      <div className="doctors-grid">
        {filteredDoctors.map(doctor => (
          <div key={doctor._id} className="doctor-card">
            <div className="doctor-avatar">
              {/* Show initials as avatar */}
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <h3>{doctor.name}</h3>
            <p className="specialization">{doctor.specialization}</p>
            
            <div className="doctor-info">
              <p>📞 {doctor.phone}</p>
              <p>📧 {doctor.email}</p>
              <p>🏥 {doctor.experience} years experience</p>
            </div>
            
            <button 
              className="btn-primary"
              onClick={() => onSelectDoctor(doctor)}
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Show message if no doctors found */}
      {filteredDoctors.length === 0 && (
        <div className="no-results">
          No doctors found matching your search.
        </div>
      )}
    </div>
  );
}

export default DoctorList;