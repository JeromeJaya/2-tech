import Booking from '../models/Booking.js';
import logger from '../utils/logger.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body;

    // Validate required fields
    if (!bookingData.booking_id || !bookingData.applicant_name || !bookingData.contact || 
        !bookingData.event_type || !bookingData.event_date || !bookingData.time_slot || 
        !bookingData.guests || !bookingData.decoration_id || !bookingData.plan_type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        errors: ['Please fill in all required booking information']
      });
    }

    // Create booking
    const booking = await Booking.create(bookingData);

    logger.info(`New booking created: ${booking.booking_id}`);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    logger.error('Create booking error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }
    
    // Handle duplicate booking_id
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID already exists',
        errors: ['This booking ID is already in use']
      });
    }
    
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
export const getBookings = async (req, res, next) => {
  try {
    const {
      status,
      date,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (date) {
      query.event_date = date;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const bookings = await Booking.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get bookings error:', error);
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error('Get booking error:', error);
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private (Admin)
export const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    logger.info(`Booking updated: ${booking.booking_id}`);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    logger.error('Update booking error:', error);
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Free up the slot
    const slot = await Slot.findById(booking.slotId);
    if (slot) {
      slot.currentBookings = Math.max(0, slot.currentBookings - 1);
      slot.isAvailable = true;
      if (slot.bookingId?.toString() === booking._id.toString()) {
        slot.bookingId = undefined;
      }
      await slot.save();
    }

    await booking.deleteOne();

    logger.info(`Booking deleted: ${booking.bookingId}`);

    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    logger.error('Delete booking error:', error);
    next(error);
  }
};

// @desc    Get today's bookings
// @route   GET /api/bookings/today
// @access  Private (Admin)
export const getTodayBookings = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookings = await Booking.find({
      date: { $gte: today, $lt: tomorrow },
    })
      .populate('slotId')
      .populate('planId')
      .sort({ 'slotId.startTime': 1 });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    logger.error('Get today bookings error:', error);
    next(error);
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (Admin)
export const getBookingStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    logger.error('Get booking stats error:', error);
    next(error);
  }
};
