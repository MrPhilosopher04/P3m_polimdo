// server/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { ensureUploadDirs } = require('./utils/helper');

const app = express();
const prisma = new PrismaClient();

// Ensure upload directories exist
ensureUploadDirs();

// === Middleware Setup ===

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Helmet for Security (conditionally enabled)
if (process.env.HELMET_ENABLED === 'true') {
  app.use(helmet());
}

// Rate Limiting
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti',
  })
);

// Body Parser
const maxFileSize = process.env.MAX_FILE_SIZE || '10mb';
app.use(express.json({ limit: maxFileSize }));
app.use(express.urlencoded({ extended: true, limit: maxFileSize }));

// Static File Serving
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === API Routes ===
const apiBasePath = '/api'; // always use this as the base
app.use(apiBasePath, routes);

// === Health Check ===
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'P3M Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.API_VERSION || 'v1',
  });
});

// === Error Handlers ===
app.use('*', notFoundHandler);
app.use(errorHandler);

// === Start Server ===
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const startServer = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected successfully');

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at http://${HOST}:${PORT}`);
      console.log(`📝 API Base Path: http://${HOST}:${PORT}${apiBasePath}`);
      console.log(`🏥 Health Check: http://${HOST}:${PORT}/health`);
      console.log(`🌿 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('🔐 Auth Endpoints:');
      console.log(`   - POST ${apiBasePath}/auth/login`);
      console.log(`   - POST ${apiBasePath}/auth/register`);
      console.log(`   - GET  ${apiBasePath}/auth/profile`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
};

startServer();
