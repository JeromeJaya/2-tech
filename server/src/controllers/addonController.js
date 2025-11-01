import Addon from '../models/Addon.js';
import logger from '../utils/logger.js';

// @desc    Create new addon
// @route   POST /api/addons
// @access  Private (Admin)
export const createAddon = async (req, res, next) => {
  try {
    const addon = await Addon.create(req.body);

    logger.info(`New addon created: ${addon.name}`);

    res.status(201).json({
      success: true,
      message: 'Addon created successfully',
      data: addon,
    });
  } catch (error) {
    logger.error('Create addon error:', error);
    next(error);
  }
};

// @desc    Get all addons
// @route   GET /api/addons
// @access  Public
export const getAddons = async (req, res, next) => {
  try {
    const { category, isAvailable } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const addons = await Addon.find(query).sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: addons,
      count: addons.length,
    });
  } catch (error) {
    logger.error('Get addons error:', error);
    next(error);
  }
};

// @desc    Get addon by ID
// @route   GET /api/addons/:id
// @access  Public
export const getAddonById = async (req, res, next) => {
  try {
    const addon = await Addon.findById(req.params.id);

    if (!addon) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found',
      });
    }

    res.json({
      success: true,
      data: addon,
    });
  } catch (error) {
    logger.error('Get addon error:', error);
    next(error);
  }
};

// @desc    Update addon
// @route   PUT /api/addons/:id
// @access  Private (Admin)
export const updateAddon = async (req, res, next) => {
  try {
    const addon = await Addon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!addon) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found',
      });
    }

    logger.info(`Addon updated: ${addon.name}`);

    res.json({
      success: true,
      message: 'Addon updated successfully',
      data: addon,
    });
  } catch (error) {
    logger.error('Update addon error:', error);
    next(error);
  }
};

// @desc    Delete addon
// @route   DELETE /api/addons/:id
// @access  Private (Admin)
export const deleteAddon = async (req, res, next) => {
  try {
    const addon = await Addon.findByIdAndDelete(req.params.id);

    if (!addon) {
      return res.status(404).json({
        success: false,
        message: 'Addon not found',
      });
    }

    logger.info(`Addon deleted: ${addon.name}`);

    res.json({
      success: true,
      message: 'Addon deleted successfully',
    });
  } catch (error) {
    logger.error('Delete addon error:', error);
    next(error);
  }
};

// @desc    Get addons by category
// @route   GET /api/addons/category/:category
// @access  Public
export const getAddonsByCategory = async (req, res, next) => {
  try {
    const addons = await Addon.find({
      category: req.params.category,
      isAvailable: true,
    }).sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: addons,
      count: addons.length,
    });
  } catch (error) {
    logger.error('Get addons by category error:', error);
    next(error);
  }
};

