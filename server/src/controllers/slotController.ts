import { Request, Response, NextFunction } from 'express';
import Slot from '../models/Slot';
import logger from '../utils/logger';

// @desc    Create new slot
// @route   POST /api/slots
// @access  Private (Admin)
export const createSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const getSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, isAvailable } = req.query;
    const query: any = {};

    if (date) {
      const startDate = new Date(date as string);
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
export const getSlotById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const updateSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const deleteSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const getAvailableSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const slots = await Slot.find({
      date: { $gte: date, $lt: nextDay },
      isAvailable: true,
    }).sort({ startTime: 1 });

    res.json({
      success: true,
      data: slots,
      count: slots.length,
    });
  } catch (error) {
    logger.error('Get available slots error:', error);
    next(error);
  }
};
