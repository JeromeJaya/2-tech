import api from './api';
// Removed: import { Booking, BookingData } from '../types';

// Create a new booking
const createBooking = async (bookingData) => {
  try {
    // Make sure date is formatted correctly if needed (e.g., ISO string)
    if (bookingData.date instanceof Date) {
        bookingData.event_date = bookingData.date.toISOString().split('T')[0];
        delete bookingData.date; // Remove the original Date object if not needed by backend
    }

    console.log("Sending booking data:", bookingData); // Log data being sent

    const response = await api.post('/bookings', bookingData);
    if (response.data && response.data.success) {
      return response.data.data; // Assuming backend returns the created booking in 'data'
    } else {
      throw new Error(response.data.message || 'Failed to create booking');
    }
  } catch (error) {
    console.error('Create booking service error:', error.response?.data || error.message);
    console.error('Full error response:', error.response);
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
      error.response.data.errors.forEach((err, index) => {
        console.error(`Error ${index + 1}:`, err);
      });
    }
    throw new Error(error.response?.data?.message || error.message || 'An error occurred while creating the booking.');
  }
};

// Fetch all bookings (Admin only, requires auth)
const getAllBookings = async (params = {}) => {
  try {
    const response = await api.get('/bookings', { params });
    if (response.data && response.data.success) {
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } else {
      throw new Error(response.data.message || 'Failed to fetch bookings');
    }
  } catch (error) {
    console.error('Get all bookings service error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings.');
  }
};

// Fetch a single booking by ID (Requires auth)
const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch booking details');
    }
  } catch (error) {
    console.error('Get booking by ID service error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch booking details.');
  }
};

// Update a booking (Admin only, requires auth)
const updateBooking = async (id, updates) => {
  try {
    const response = await api.put(`/bookings/${id}`, updates);
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update booking');
    }
  } catch (error) {
    console.error('Update booking service error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update booking.');
  }
};

// Fetch today's bookings (Admin only, requires auth)
const getTodayBookings = async () => {
    try {
        const response = await api.get('/bookings/today');
        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Failed to fetch today's bookings");
        }
    } catch (error) {
        console.error("Get today's bookings service error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch today's bookings.");
    }
};


// Fetch booking statistics (Admin only, requires auth)
const getBookingStats = async () => {
    try {
        const response = await api.get('/bookings/stats');
        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch booking statistics');
        }
    } catch (error) {
        console.error('Get booking stats service error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch booking statistics.');
    }
};

// Fetch available slots for a specific date
const getAvailableSlots = async (date) => {
    try {
        const response = await api.get(`/slots/available/${date}`);
        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch available slots');
        }
    } catch (error) {
        console.error('Get available slots service error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch available slots.');
    }
};

// Fetch addons (Public)
const getAddons = async () => {
    try {
        const response = await api.get('/addons');
        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch addons');
        }
    } catch (error) {
        console.error('Get addons service error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch addons.');
    }
};

// Fetch plans (Public)
const getPlans = async () => {
    try {
        const response = await api.get('/plans');
        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch plans');
        }
    } catch (error) {
        console.error('Get plans service error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch plans.');
    }
};

export {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  getTodayBookings,
  getBookingStats,
  getAvailableSlots,
  getAddons,
  getPlans,
};
