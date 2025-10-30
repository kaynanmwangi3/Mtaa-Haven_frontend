<<<<<<< Updated upstream
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://mtaa-haven-backend-pr-23.onrender.com";
=======
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
>>>>>>> Stashed changes

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  async login(credentials) {
    try {
<<<<<<< Updated upstream
      const response = await api.post('/login', credentials);
      console.log('Login response:', response.data);
      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Token saved:', token); 
=======
      const response = await api.post("/login", credentials);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
>>>>>>> Stashed changes
      }
      return response.data;
    } catch (error) {
<<<<<<< Updated upstream
=======
      // If backend is not available, provide demo login
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        console.warn("Backend not available, using demo mode");
        return this.demoLogin(credentials);
      }
>>>>>>> Stashed changes
      throw error.response?.data || error;
    }
  },
  // Register user
  async register(userData) {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error) {
<<<<<<< Updated upstream
      throw error.response?.data || error;
    }
  },
=======
      // If backend is not available, provide demo registration
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        console.warn("Backend not available, using demo mode");
        return this.demoRegister(userData);
      }
      throw error.response?.data || error;
    }
  },

>>>>>>> Stashed changes
  // Logout user
  async logout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optional: Call backend logout endpoint if needed
      await api.post("/logout");
    } catch (error) {
      // Even if backend logout fails, clear local storage
      console.warn("Backend logout failed, but local session cleared:", error);
    }
  },
  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get stored token
  getToken() {
    return localStorage.getItem("token");
  },
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
};

export default api;
