import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/env';

// Import routes
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';
import slotRoutes from './routes/slotRoutes';
import photoRoutes from './routes/photoRoutes';
import planRoutes from './routes/planRoutes';
import addonRoutes from './routes/addonRoutes';

const app: Application = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Logging Middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/addons', addonRoutes);

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

// Root Endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'TechVaseeGrahHub API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      bookings: '/api/bookings',
      admin: '/api/admin',
      slots: '/api/slots',
      photos: '/api/photos',
      plans: '/api/plans',
      addons: '/api/addons',
    },
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
