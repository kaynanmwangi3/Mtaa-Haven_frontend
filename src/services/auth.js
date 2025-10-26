import axios from 'axios';
import googleAuth from './googleAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mtaa-fundi-backend.onrender.com/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      // If backend is not available, provide demo login
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('Backend not available, using demo mode');
        return this.demoLogin(credentials);
      }
      throw error.response?.data || error;
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      // If backend is not available, provide demo registration
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('Backend not available, using demo mode');
        return this.demoRegister(userData);
      }
      throw error.response?.data || error;
    }
  },

  // Demo login for when backend is unavailable
  demoLogin(credentials) {
    // Simple demo authentication
    if (credentials.email === 'demo@mtaahaven.com' && credentials.password === 'demo123') {
      const demoUser = {
        id: 1,
        first_name: 'Demo',
        last_name: 'User',
        email: credentials.email,
        user_type: 'tenant'
      };
      const demoToken = 'demo-token-' + Date.now();

      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));

      return {
        token: demoToken,
        user: demoUser,
        message: 'Demo login successful!'
      };
    } else {
      throw { error: 'Invalid demo credentials. Use demo@mtaahaven.com / demo123' };
    }
  },

  // Demo registration for when backend is unavailable
  demoRegister(userData) {
    const demoUser = {
      id: Date.now(),
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      user_type: userData.user_type,
      phone: userData.phone
    };

    return {
      message: 'Demo registration successful! You can now login with your credentials.',
      user: demoUser
    };
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optional: Call backend logout endpoint if needed
    return api.post('/logout');
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  },

  // Google OAuth login
  async googleLogin() {
    try {
      await googleAuth.initialize();
      const googleUserData = await googleAuth.signIn();

      // Try to register/login with backend first
      try {
        const response = await api.post('/auth/google', {
          ...googleUserData,
          user_type: 'tenant' // Default user type for Google users
        });

        const { token, user } = response.data;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
      } catch (backendError) {
        // If backend fails, use demo mode
        console.warn('Backend Google auth failed, using demo mode:', backendError);
        return this.demoGoogleLogin(googleUserData);
      }
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  },

  // Demo Google login for when backend is unavailable
  demoGoogleLogin(googleUserData) {
    const demoUser = {
      id: googleUserData.id,
      first_name: googleUserData.first_name,
      last_name: googleUserData.last_name,
      email: googleUserData.email,
      user_type: 'tenant',
      image_url: googleUserData.image_url,
      provider: 'google'
    };

    const demoToken = 'google-demo-token-' + Date.now();

    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));

    return {
      token: demoToken,
      user: demoUser,
      message: 'Google login successful!'
    };
  }
};

export default api;