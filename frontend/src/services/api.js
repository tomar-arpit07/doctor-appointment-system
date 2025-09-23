// API Service - Handles all HTTP requests to backend
import axios from 'axios';

// Base URL for backend API
const API_URL = 'http://localhost:5000/api';

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