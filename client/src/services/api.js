import axios from 'axios';

// Get the backend URL from environment variables, default to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log(`API Base URL: ${API_BASE_URL}`); // Log the base URL for debugging

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // You might want to include credentials if your backend requires cookies/sessions
  // withCredentials: true,
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    // Attempt to get the token from localStorage
    // Ensure you are storing the token correctly after login
    // The key 'adminUser' might contain the whole user object including the token
    // Adjust based on how you store the token
    const adminUserData = localStorage.getItem('adminUser');
    let token = null; // Removed string | null type

    if (adminUserData) {
        try {
            const parsedData = JSON.parse(adminUserData);
            token = parsedData?.token || null; // Assuming the token is stored under the 'token' key
        } catch (e) {
            console.error("Failed to parse adminUser from localStorage", e);
        }
    }

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request:', config.headers.Authorization); // Debug log
    } else {
        console.log('No token found for request.'); // Debug log
    }

    return config;
  },
  (error) => {
    // Handle request error
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor (optional: for handling global errors like 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    console.error('API response error:', error.response?.data || error.message);

    // Example: Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - removing token and redirecting to login.');
      // Remove invalid token or user data
      localStorage.removeItem('adminUser');
      // Redirect to login page - ensure you have access to navigation logic here
      // This might be better handled in a context or component
      // window.location.href = '/admin/login';
    }

    // Pass the error along
    return Promise.reject(error);
  }
);

export default api;
