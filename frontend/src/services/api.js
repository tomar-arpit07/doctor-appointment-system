// frontend/src/services/api.js - COMPLETE UPDATED FILE
import axios from 'axios';

// Base URL for backend API and react app url' set on netlify
const API_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL + '/api' 
  : 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid, logout user
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // You might want to redirect to login page here
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API methods for different operations
const apiService = {
  // Authentication APIs
  auth: {
    // Register new user
    register: async (userData) => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    },
    
    // Login user
    login: async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    }
  },
  
  // Doctor APIs
  doctors: {
    // Get all doctors
    getAll: async () => {
      const response = await api.get('/doctors');
      return response.data;
    },
    
    // Get single doctor by ID
    getById: async (doctorId) => {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data;
    },
    
    // Create new doctor (Admin only)
    create: async (doctorData) => {
      const response = await api.post('/doctors', doctorData);
      return response.data;
    },
    
    // Update doctor (Admin only)
    update: async (doctorId, doctorData) => {
      const response = await api.put(`/doctors/${doctorId}`, doctorData);
      return response.data;
    },
    
    // Delete doctor (Admin only)
    delete: async (doctorId) => {
      const response = await api.delete(`/doctors/${doctorId}`);
      return response.data;
    }
  },
  
  // Appointment APIs
  appointments: {
    // Book new appointment
    book: async (appointmentData) => {
      const response = await api.post('/appointments/book', appointmentData);
      return response.data;
    },
    
    // Get user's appointments
    getMine: async () => {
      const response = await api.get('/appointments');
      return response.data;
    },
    
    // Cancel appointment
    cancel: async (appointmentId) => {
      const response = await api.put(`/appointments/${appointmentId}/cancel`);
      return response.data;
    }
  }
};

export default apiService;