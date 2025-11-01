import crypto from 'crypto';
import mongoose from 'mongoose';

/**
 * Generates a random string of specified length.
 * @param length The desired length of the string.
 * @returns A random hex string.
 */
export const generateRandomString = (length = 16) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

/**
 * Generates a unique booking ID.
 * Example format: C3-1678886400000-AB12
 * @returns A unique booking ID string.
 */
export const generateBookingId = () => {
  const timestamp = Date.now();
  const randomPart = generateRandomString(4).toUpperCase();
  return `C3-${timestamp}-${randomPart}`;
};

/**
 * Checks if a string is a valid MongoDB ObjectId.
 * @param id The string to check.
 * @returns True if the string is a valid ObjectId, false otherwise.
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Simple slugify function.
 * Converts a string into a URL-friendly slug.
 * @param text The string to slugify.
 * @returns The slugified string.
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Formats a number as currency (INR).
 * @param amount The number to format.
 * @returns Formatted currency string (e.g., "₹1,234.56").
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
* Parses a boolean value from various string inputs.
* @param value The input string (e.g., 'true', 'false', '1', '0', 'yes', 'no').
* @returns True, false, or undefined if parsing fails.
*/
export const parseBoolean = (value) => {
    if (value === null || value === undefined) return undefined;
    const lowerValue = value.toLowerCase().trim();
    if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') return true;
    if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') return false;
    return undefined;
};
