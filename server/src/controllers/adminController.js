import Booking from '../models/Booking.js';
import Slot from '../models/Slot.js';
import Plan from '../models/Plan.js';
import Addon from '../models/Addon.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total bookings
    const totalBookings = await Booking.countDocuments();

    // Today's bookings
    const todayBookings = await Booking.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });

    // Pending bookings
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Total revenue
    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // This month's revenue
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthRevenue = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: firstDayOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const monthlyRevenue = monthRevenue[0]?.total || 0;

    // Available slots today
    const availableSlots = await Slot.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      isAvailable: true,
    });

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('slotId')
      .populate('planId');

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings,
          todayBookings,
          pendingBookings,
          totalRevenue,
          monthlyRevenue,
          availableSlots,
        },
        recentBookings,
        bookingsByStatus,
      },
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Bookings over time
    const bookingsOverTime = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Popular plans
    const popularPlans = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$planId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'plans',
          localField: '_id',
          foreignField: '_id',
          as: 'plan',
        },
      },
      { $unwind: '$plan' },
    ]);

    // Popular addons
    const popularAddons = await Booking.aggregate([
      { $match: dateFilter },
      { $unwind: '$addons' },
      {
        $group: {
          _id: '$addons.addonId',
          count: { $sum: '$addons.quantity' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'addons',
          localField: '_id',
          foreignField: '_id',
          as: 'addon',
        },
      },
      { $unwind: '$addon' },
    ]);

    res.json({
      success: true,
      data: {
        bookingsOverTime,
        popularPlans,
        popularAddons,
      },
    });
  } catch (error) {
    logger.error('Get analytics error:', error);
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    logger.error('Get users error:', error);
    next(error);
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.info(`User status updated: ${user.email} - ${isActive}`);

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user,
    });
  } catch (error) {
    logger.error('Update user status error:', error);
    next(error);
  }
};
