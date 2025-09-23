// Login Component - Handles user authentication
import React, { useState } from 'react';
import apiService from '../services/api';

function Login({ onLogin, onNavigate }) {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Loading state for button
  const [loading, setLoading] = useState(false);
  
  // Error message state
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear any previous errors
    setLoading(true); // Show loading state
    
    try {
      // Call login API
      const response = await apiService.auth.login(formData);
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Call parent component's login handler
      onLogin(response.user);
    } catch (err) {
      // Show error message
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Patient Login</h2>
        
        {/* Show error if exists */}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>Don't have an account? 
            <button 
              onClick={() => onNavigate('register')}
              className="link-btn"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;