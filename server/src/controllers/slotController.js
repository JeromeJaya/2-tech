import Slot from '../models/Slot.js';
import logger from '../utils/logger.js';

// @desc    Create new slot
// @route   POST /api/slots
// @access  Private (Admin)
export const createSlot = async (req, res, next) => {
  try {
    const slot = await Slot.create(req.body);

    logger.info(`New slot created: ${slot.name}`);

    res.status(201).json({
      success: true,
      message: 'Slot created successfully',
      data: slot,
    });
  } catch (error) {
    logger.error('Create slot error:', error);
    next(error);
  }
};

// @desc    Get all slots
// @route   GET /api/slots
// @access  Public
export const getSlots = async (req, res, next) => {
  try {
    const { date, isAvailable } = req.query;
    const query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const slots = await Slot.find(query)
      .populate('bookingId')
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      data: slots,
      count: slots.length,
    });
  } catch (error) {
    logger.error('Get slots error:', error);
    next(error);
  }
};

// @desc    Get slot by ID
// @route   GET /api/slots/:id
// @access  Public
export const getSlotById = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id).populate('bookingId');

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found',
      });
    }

    res.json({
      success: true,
      data: slot,
    });
  } catch (error) {
    logger.error('Get slot error:', error);
    next(error);
  }
};

// @desc    Update slot
// @route   PUT /api/slots/:id
// @access  Private (Admin)
export const updateSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found',
      });
    }

    logger.info(`Slot updated: ${slot.name}`);

    res.json({
      success: true,
      message: 'Slot updated successfully',
      data: slot,
    });
  } catch (error) {
    logger.error('Update slot error:', error);
    next(error);
  }
};

// @desc    Delete slot
// @route   DELETE /api/slots/:id
// @access  Private (Admin)
export const deleteSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found',
      });
    }

    // Check if slot has bookings
    if (slot.bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete slot with existing booking',
      });
    }

    await slot.deleteOne();

    logger.info(`Slot deleted: ${slot.name}`);

    res.json({
      success: true,
      message: 'Slot deleted successfully',
    });
  } catch (error) {
    logger.error('Delete slot error:', error);
    next(error);
  }
};

// @desc    Get available slots for a date
// @route   GET /api/slots/available/:date
// @access  Public
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { default: Booking } = await import('../models/Booking.js');
    const dateStr = req.params.date;
    
    // Define all possible time slots (matching frontend format)
    const allTimeSlots = [
      "11:00 AM - 12:00 PM",
      "12:15 PM - 1:15 PM",
      "1:30 PM - 2:30 PM",
      "2:45 PM - 3:45 PM",
      "4:00 PM - 5:00 PM",
      "5:15 PM - 6:15 PM",
      "6:30 PM - 7:30 PM",
      "7:45 PM - 8:45 PM",
      "9:00 PM - 10:00 PM",
      "10:15 PM - 11:15 PM"
    ];

    // Find all bookings for this date
    const bookings = await Booking.find({
      event_date: dateStr,
      status: { $nin: ['cancelled'] } // Exclude cancelled bookings
    });

    // Get booked time slots
    const bookedSlots = bookings.map(booking => booking.time_slot);

    // Filter out booked slots to get available slots
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

    logger.info(`Available slots for ${dateStr}: ${availableSlots.length}/${allTimeSlots.length}`);
    logger.info(`Booked slots:`, bookedSlots);

    res.json({
      success: true,
      data: availableSlots,
      count: availableSlots.length,
    });
  } catch (error) {
    logger.error('Get available slots error:', error);
    next(error);
  }
};
