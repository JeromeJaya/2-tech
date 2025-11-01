import api from './api';
// Removed: import { UserCredentials, UserProfile, RegistrationData } from '../types';

// Login function
const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data && response.data.success) {
      // Store token and user data (e.g., in localStorage or context)
      // The structure depends on your API response
      const { token, user } = response.data;
      // Example: Storing the whole response object for simplicity here
      localStorage.setItem('adminUser', JSON.stringify({ token, user }));
      return { token, user };
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login service error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'An error occurred during login.');
  }
};

// Logout function (client-side implementation)
const logoutUser = () => { // Removed :void
  // Remove token and user data from storage
  localStorage.removeItem('adminUser');
  // Optionally call a backend logout endpoint if it performs server-side actions
  // api.post('/auth/logout').catch(err => console.error("Logout API call failed:", err));
};

// Get current user profile function
const getCurrentUserProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    if (response.data && response.data.success) {
      return response.data.user;
    } else {
      throw new Error(response.data.message || 'Failed to fetch user profile');
    }
  } catch (error) {
    console.error('Get profile service error:', error.response?.data || error.message);
    // If unauthorized, logout the user might be a good strategy
    if (error.response?.status === 401) {
      logoutUser();
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile.');
  }
};

// Register function (if needed)
const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        if (response.data && response.data.success) {
            const { token, user } = response.data;
            localStorage.setItem('adminUser', JSON.stringify({ token, user }));
            return { token, user };
        } else {
            throw new Error(response.data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration service error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message || 'An error occurred during registration.');
    }
};

// Update Password function
const updatePassword = async (passwords) => {
    try {
        const response = await api.put('/auth/password', passwords);
        if (!response.data || !response.data.success) {
            throw new Error(response.data.message || 'Failed to update password');
        }
        // Password updated successfully
    } catch (error) {
        console.error('Update password service error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update password.');
    }
};

export {
  loginUser,
  logoutUser,
  getCurrentUserProfile,
  registerUser,
  updatePassword,
};
