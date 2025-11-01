import api from './api';
// Removed: import { UserProfile } from '../types';

// TypeScript interfaces (DashboardStats, RecentBooking, etc.) are removed in JavaScript.

// Fetch dashboard statistics
const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch dashboard stats');
    }
  } catch (error) {
    console.error('Get dashboard stats service error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats.');
  }
};

// Fetch analytics data
const getAnalytics = async (params = {}) => {
  try {
    const response = await api.get('/admin/analytics', { params });
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch analytics data');
    }
  } catch (error) {
    console.error('Get analytics service error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch analytics data.');
  }
};

// Fetch all users
const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch users');
    }
  } catch (error) {
    console.error('Get all users service error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch users.');
  }
};

// Update user status
const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update user status');
    }
  } catch (error) {
    console.error('Update user status service error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update user status.');
  }
};

export {
  getDashboardStats,
  getAnalytics,
  getAllUsers,
  updateUserStatus,
};
