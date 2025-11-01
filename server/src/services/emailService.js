const nodemailer = require('nodemailer');
const { config } = require('../config/env');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

// Verify transporter configuration
if (config.nodeEnv !== 'test' && config.smtpUser && config.smtpPass) {
  transporter.verify((error, success) => {
    if (error) {
      logger.error('Email transporter verification failed:', error);
    } else {
      logger.info('📧 Email transporter is ready to send messages');
    }
  });
} else if (config.nodeEnv !== 'test') {
    logger.warn('📧 Email transporter not configured (SMTP_USER or SMTP_PASS missing)');
}


exports.sendEmail = async (options) => {
  if (!config.smtpUser || !config.smtpPass) {
    logger.warn('Email sending skipped: SMTP not configured.');
    return; // Don't attempt to send if not configured
  }

  const mailDefaults = {
    from: `"${config.appName || 'TechVaseeGrahHub'}" <${config.smtpUser}>`,
  };

  const mailToSend = { ...mailDefaults, ...options };

  try {
    const info = await transporter.sendMail(mailToSend);
    logger.info(`Email sent: ${info.messageId} to ${options.to}`);
  } catch (error) {
    logger.error(`Error sending email to ${options.to}:`, error);
    // Optionally re-throw or handle the error appropriately
    // throw new Error('Failed to send email');
  }
};

// Example usage function (can be called from controllers)
exports.sendBookingConfirmationEmail = async (bookingDetails) => {
  const mailOptions = {
    to: bookingDetails.email,
    subject: `Booking Confirmed - ${bookingDetails.bookingId}`,
    html: `<h1>Booking Confirmation</h1>
           <p>Dear ${bookingDetails.customerName},</p>
           <p>Your booking with ID <strong>${bookingDetails.bookingId}</strong> is confirmed.</p>
           <p>Date: ${new Date(bookingDetails.date).toLocaleDateString()}</p>
           <p>Thank you!</p>`,
    // You can also provide a plain text version:
    // text: `Booking Confirmation...\nYour booking ID is ${bookingDetails.bookingId}...`
  };
  await exports.sendEmail(mailOptions);
};
