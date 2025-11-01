import mongoose from 'mongoose';
import User from '../models/User.js'; // Example: Assuming User model for email uniqueness check

/**
 * Custom validator to check if a value is a valid MongoDB ObjectId.
 */
export const isObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ID format');
  }
  return true;
};

/**
 * Custom validator to check if an email is unique in the User collection.
 * Example Usage in validation chain: .custom(isEmailUnique)
 */
export const isEmailUnique = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Error('Email already in use');
  }
  return true;
};

/**
 * Custom validator to check if a date string is in the future.
 */
export const isFutureDate = (value) => {
  const inputDate = new Date(value);
  const now = new Date();
  // Set time to 00:00:00 for comparison to allow booking on the same day
  now.setHours(0, 0, 0, 0);

  if (isNaN(inputDate.getTime())) {
      throw new Error('Invalid date format');
  }
  if (inputDate < now) {
    throw new Error('Date must be in the future');
  }
  return true;
};

/**
 * Custom validator to check if a start time is before an end time.
 * This needs to be used within a validation chain where `req` object is available.
 * Example: body('endTime').custom(isEndTimeAfterStartTime)
 */
export const isEndTimeAfterStartTime = (endTime, { req }) => {
    const startTime = req.body.startTime;

    if (!startTime || !endTime) {
        // Dependent validation, let required/notEmpty handle this
        return true;
    }

    // Basic time comparison (assumes HH:MM format)
    // For more robust validation, consider using a date library like date-fns or moment
    if (typeof startTime === 'string' && typeof endTime === 'string') {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const startDate = new Date(0, 0, 0, startHour, startMinute);
        const endDate = new Date(0, 0, 0, endHour, endMinute);

        if (endDate <= startDate) {
            throw new Error('End time must be after start time');
        }
    } else {
         throw new Error('Invalid time format. Use HH:MM');
    }

    return true;
};


// Add more custom validators as needed...
// e.g., isValidPhoneNumberFormat, isStrongPassword, etc.
