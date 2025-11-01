import Photo from '../models/Photo.js';
import logger from '../utils/logger.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload photos
// @route   POST /api/photos
// @access  Private (Admin)
export const uploadPhotos = async (req, res, next) => {
  try {
    const files = req.files;
    const { bookingId } = req.body;
    const uploadedBy = req.user.id;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const photos = await Promise.all(
      files.map(async (file) => {
        return await Photo.create({
          bookingId,
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: `/uploads/${file.filename}`,
          uploadedBy,
        });
      })
    );

    logger.info(`${photos.length} photos uploaded for booking ${bookingId}`);

    res.status(201).json({
      success: true,
      message: 'Photos uploaded successfully',
      data: photos,
    });
  } catch (error) {
    logger.error('Upload photos error:', error);
    next(error);
  }
};

// @desc    Get photos by booking ID
// @route   GET /api/photos/booking/:bookingId
// @access  Public
export const getPhotosByBooking = async (req, res, next) => {
  try {
    const photos = await Photo.find({ bookingId: req.params.bookingId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: photos,
      count: photos.length,
    });
  } catch (error) {
    logger.error('Get photos error:', error);
    next(error);
  }
};

// @desc    Get photo by ID
// @route   GET /api/photos/:id
// @access  Public
export const getPhotoById = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate(
      'uploadedBy',
      'name email'
    );

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
      });
    }

    res.json({
      success: true,
      data: photo,
    });
  } catch (error) {
    logger.error('Get photo error:', error);
    next(error);
  }
};

// @desc    Delete photo
// @route   DELETE /api/photos/:id
// @access  Private (Admin)
export const deletePhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found',
      });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../uploads', photo.filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      logger.warn(`Failed to delete file: ${filePath}`);
    }

    await photo.deleteOne();

    logger.info(`Photo deleted: ${photo.filename}`);

    res.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    logger.error('Delete photo error:', error);
    next(error);
  }
};

// @desc    Get all photos
// @route   GET /api/photos
// @access  Private (Admin)
export const getAllPhotos = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const photos = await Photo.find()
      .populate('bookingId', 'bookingId customerName')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Photo.countDocuments();

    res.json({
      success: true,
      data: photos,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    logger.error('Get all photos error:', error);
    next(error);
  }
};
