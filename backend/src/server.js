const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables with absolute path resolution
const backendEnvPath = path.resolve(__dirname, '../.env');
const rootEnvPath = path.resolve(__dirname, '../../.env');
if (require('fs').existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
} else if (require('fs').existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { getDatabaseMetadata } = require('./config/db');
const autoSeedIfEmpty = require('./seeds/autoSeed');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Configurable CORS allowing production FRONTEND_URL and local development
const rawFrontendUrls = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((u) => u.trim().replace(/\/$/, ''))
  : [];

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...rawFrontendUrls,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleanOrigin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error(`CORS error: Origin ${origin} not allowed by CORS policy`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate Limiter for API endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint with safe database metadata inspection
app.get('/api/health', async (req, res) => {
  const dbMeta = await getDatabaseMetadata();
  res.status(dbMeta.connected ? 200 : 503).json({
    status: dbMeta.connected ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    service: 'Farmer-to-Consumer Agri Marketplace API',
    uptime: process.uptime(),
    database: dbMeta,
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Port and Host binding for Render / Cloud deployments
const PORT = process.env.PORT || 5050;
const HOST = '0.0.0.0';

/**
 * Start HTTP Server only AFTER MongoDB Atlas initialization succeeds
 */
const startServer = async () => {
  try {
    // Step 1: Connect to MongoDB Atlas (Production database)
    console.log('[Startup] Initializing database connection...');
    await connectDB();

    // Step 2: Auto-seed initial dataset if clean/empty database
    await autoSeedIfEmpty();

    // Step 3: Bind and start Express HTTP server on 0.0.0.0
    const server = app.listen(PORT, HOST, () => {
      console.log(`=======================================================`);
      console.log(` AgriDirect Backend Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(` Host: ${HOST}`);
      console.log(` Port: ${PORT}`);
      console.log(` Health Check: http://${HOST}:${PORT}/api/health`);
      console.log(`=======================================================`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Rejection] ${err.message}`);
    });

    // Graceful shutdown on termination signal (e.g. Render deploys)
    process.on('SIGTERM', () => {
      console.log('[Process] SIGTERM received. Gracefully closing HTTP server...');
      server.close(() => {
        console.log('[Process] Server closed cleanly.');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error(`[Fatal Startup Error] MongoDB Atlas connection failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
