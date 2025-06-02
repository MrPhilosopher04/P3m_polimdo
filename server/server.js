require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { ensureUploadDirs } = require('./utils/helper');

const app = express();

// Buat direktori upload jika belum ada
ensureUploadDirs();

// Konfigurasi CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Helmet hanya aktif jika diaktifkan di env
if (process.env.HELMET_ENABLED === 'true') {
  app.use(helmet());
}

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS
    ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
    : 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10)
    : 100,
  message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti',
});
app.use(limiter);

// Body parser
const maxFileSize = process.env.MAX_FILE_SIZE || '10mb';
app.use(express.json({ limit: maxFileSize }));
app.use(express.urlencoded({ extended: true, limit: maxFileSize }));

// Static files untuk uploads
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// PERBAIKAN: Routes dengan prefix yang benar
const apiVersion = process.env.API_VERSION || 'v1';
const apiBasePath = `/api`;  // PERBAIKAN: selalu gunakan /api sebagai base
app.use(apiBasePath, routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'P3M Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.API_VERSION || 'v1',
  });
});

// 404 handler
app.use('*', notFoundHandler);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const startServer = async () => {
  try {
    // Cek koneksi database Prisma
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected successfully');

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`📝 API Documentation: http://${HOST}:${PORT}${apiBasePath}`);
      console.log(`🏥 Health Check: http://${HOST}:${PORT}/health`);
      console.log(`🌿 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 Auth endpoints:`);
      console.log(`   - POST http://${HOST}:${PORT}${apiBasePath}/auth/login`);
      console.log(`   - POST http://${HOST}:${PORT}${apiBasePath}/auth/register`);
      console.log(`   - GET  http://${HOST}:${PORT}${apiBasePath}/auth/profile`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
};

startServer();