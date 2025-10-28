import { Request, Response, NextFunction } from 'express';
import Booking from '../models/Booking';
import Slot from '../models/Slot';
import Plan from '../models/Plan';
import Addon from '../models/Addon';
import logger from '../utils/logger';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingData = req.body;

    // Check if slot exists and is available
    const slot = await Slot.findById(bookingData.slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found',
      });
    }

    if (!slot.checkAvailability()) {
      return res.status(400).json({
        success: false,
        message: 'Slot is not available',
      });
    }

    // Verify plan exists
    const plan = await Plan.findById(bookingData.planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found or inactive',
      });
    }

    // Create booking
    const booking = await Booking.create(bookingData);

    // Update slot
    slot.currentBookings += 1;
    if (slot.currentBookings >= slot.maxCapacity) {
      slot.isAvailable = false;
    }
    slot.bookingId = booking._id;
    await slot.save();

    // Populate booking details
    await booking.populate(['slotId', 'planId', 'addons.addonId']);

    logger.info(`New booking created: ${booking.bookingId}`);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    logger.error('Create booking error:', error);
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
export const getBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      status,
      date,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const bookings = await Booking.find(query)
      .populate('slotId')
      .populate('planId')
      .populate('addons.addonId')
      .sort({ [sortBy as string]: sortOrder })
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
export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('slotId')
      .populate('planId')
      .populate('addons.addonId');

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
export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate(['slotId', 'planId', 'addons.addonId']);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    logger.info(`Booking updated: ${booking.bookingId}`);

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
export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const getTodayBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const getBookingStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
