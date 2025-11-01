import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// Booking validation rules
export const validateBooking = [
  body('booking_id')
    .trim()
    .notEmpty()
    .withMessage('Booking ID is required'),
  body('applicant_name')
    .trim()
    .notEmpty()
    .withMessage('Applicant name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('event_type')
    .trim()
    .notEmpty()
    .withMessage('Event type is required'),
  body('event_date')
    .notEmpty()
    .withMessage('Event date is required'),
  body('time_slot')
    .notEmpty()
    .withMessage('Time slot is required'),
  body('guests')
    .notEmpty()
    .withMessage('Number of guests is required')
    .isInt({ min: 1 })
    .withMessage('Guests must be at least 1'),
  body('decoration_id')
    .notEmpty()
    .withMessage('Decoration is required'),
  body('plan_type')
    .notEmpty()
    .withMessage('Plan type is required')
    .isIn(['basic', 'premium', 'elite'])
    .withMessage('Invalid plan type'),
  body('total_amount')
    .notEmpty()
    .withMessage('Total amount is required')
    .isNumeric()
    .withMessage('Total amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be positive'),
  validate,
];

// Login validation rules
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

// Registration validation rules
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  validate,
];

// Plan validation rules
export const validatePlan = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Plan name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be positive'),
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 hour'),
  validate,
];

// Addon validation rules
export const validateAddon = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Addon name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be positive'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  validate,
];

// Slot validation rules
export const validateSlot = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Slot name is required'),
  body('startTime')
    .notEmpty()
    .withMessage('Start time is required'),
  body('endTime')
    .notEmpty()
    .withMessage('End time is required'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  validate,
];
