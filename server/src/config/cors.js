import cors from 'cors';
import { config } from './env.js';
import logger from '../utils/logger.js';

const allowedOrigins = config.corsOrigin ? config.corsOrigin.split(',') : [];

if (config.nodeEnv === 'development') {
  logger.info(`Allowed CORS Origins: ${allowedOrigins.join(', ')}`);
}

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};
