// frontend/src/components/AdminPanel.js - COMPLETE NEW FILE
import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function AdminPanel() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.doctors.getAll();
      setDoctors(response.doctors);
    } catch (err) {
      setError('Failed to load doctors');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctorId, doctorName) => {
    if (!window.confirm(`Are you sure you want to delete Dr. ${doctorName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.doctors.delete(doctorId);
      setDoctors(doctors.filter(d => d._id !== doctorId));
      alert('Doctor deleted successfully');
    } catch (err) {
      alert('Failed to delete doctor. ' + (err.response?.data?.error || 'Please try again.'));
      console.error('Error deleting doctor:', err);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setShowAddForm(false);
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setEditingDoctor(null);
  };

  const handleFormSuccess = () => {
    setEditingDoctor(null);
    setShowAddForm(false);
    fetchDoctors(); // Refresh the list
  };

  const handleFormCancel = () => {
    setEditingDoctor(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="admin-loading"></div>
        Loading doctors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={fetchDoctors} className="btn-secondary" style={{marginTop: '1rem'}}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>👨‍💼 Doctor Management</h2>
        <button 
          className="btn-primary"
          onClick={handleAdd}
        >
          + Add New Doctor
        </button>
      </div>

      {/* Show Add/Edit Form */}
      {(showAddForm || editingDoctor) && (
        <DoctorForm 
          doctor={editingDoctor}
          isEdit={!!editingDoctor}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Doctors List */}
      {doctors.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No doctors found</h3>
          <p>Start by adding your first doctor to the system.</p>
          <button className="btn-primary" onClick={handleAdd}>
            Add First Doctor
          </button>
        </div>
      ) : (
        <div className="doctors-admin-list">
          {doctors.map(doctor => (
            <div key={doctor._id} className="doctor-admin-card">
              <div className="doctor-admin-info">
                <h3>{doctor.name}</h3>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Phone:</strong> {doctor.phone}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Available Slots:</strong> {doctor.availableSlots.join(', ')}</p>
                <p><strong>Added:</strong> {new Date(doctor.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="doctor-admin-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => handleEdit(doctor)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => handleDelete(doctor._id, doctor.name)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Doctor Form Component for Add/Edit
function DoctorForm({ doctor, isEdit, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    specialization: doctor?.specialization || '',
    email: doctor?.email || '',
    phone: doctor?.phone || '',
    experience: doctor?.experience || '',
    availableSlots: doctor?.availableSlots || ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSlotsChange = (e) => {
    const slots = e.target.value.split(',').map(slot => slot.trim()).filter(slot => slot);
    setFormData({
      ...formData,
      availableSlots: slots
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.specialization || !formData.email || 
        !formData.phone || !formData.experience) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.experience < 0 || formData.experience > 50) {
      setError('Experience must be between 0 and 50 years');
      setLoading(false);
      return;
    }

    if (formData.availableSlots.length === 0) {
      setError('At least one time slot is required');
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await apiService.doctors.update(doctor._id, formData);
        alert('Doctor updated successfully');
      } else {
        await apiService.doctors.create(formData);
        alert('Doctor added successfully');
      }
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEdit ? 'update' : 'add'} doctor`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-form-container">
      <div className="doctor-form-card">
        <h3>{isEdit ? 'Edit Doctor' : 'Add New Doctor'}</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Doctor Name: *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter doctor's full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="specialization">Specialization: *</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              placeholder="e.g., Cardiologist, Pediatrician"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email: *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="doctor@hospital.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone: *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="555-0123"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="experience">Experience (years): *</label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              min="0"
              max="50"
              placeholder="Years of experience"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="availableSlots">Available Time Slots: *</label>
            <input
              type="text"
              id="availableSlots"
              value={formData.availableSlots.join(', ')}
              onChange={handleSlotsChange}
              placeholder="9:00 AM, 10:00 AM, 11:00 AM, 2:00 PM"
              required
            />
            <small>Separate multiple slots with commas</small>
          </div>
          
          <div className="button-group">
            <button 
              type="button" 
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="admin-loading"></span>
                  Saving...
                </>
              ) : (
                isEdit ? 'Update Doctor' : 'Add Doctor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;