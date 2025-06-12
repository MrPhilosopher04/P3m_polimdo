//server/config/constants.js
// server/config/constants.js
require('dotenv').config();
const path = require('path');

const APP_ENV = process.env.NODE_ENV || 'development';

const constants = {
  ENV: APP_ENV,
  IS_DEV: APP_ENV === 'development',
  IS_PROD: APP_ENV === 'production',

  SERVER: {
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 5000,
    URL: process.env.APP_URL || `http://localhost:5000`,
    API_VERSION: process.env.API_VERSION || 'v1'
  },

  CLIENT: {
    URL: process.env.CLIENT_URL || 'http://localhost:3000',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || []
  },

  DATABASE: {
    URL: process.env.DATABASE_URL,
    POOL_MIN: parseInt(process.env.DB_POOL_MIN || '2'),
    POOL_MAX: parseInt(process.env.DB_POOL_MAX || '10')
  },

  JWT: {
    SECRET: process.env.JWT_SECRET,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  SECURITY: {
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
    SESSION_SECRET: process.env.SESSION_SECRET,
    HELMET_ENABLED: process.env.HELMET_ENABLED === 'true'
  },

  UPLOAD: {
    DIR: path.resolve(process.env.UPLOAD_DIR || './uploads'),
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [],
    PATHS: {
      PROPOSAL: path.resolve(process.env.PROPOSAL_UPLOAD_PATH || './uploads/proposals'),
      DOCUMENT: path.resolve(process.env.DOCUMENT_UPLOAD_PATH || './uploads/documents'),
      IMAGE: path.resolve(process.env.IMAGE_UPLOAD_PATH || './uploads/images'),
      TEMP: path.resolve(process.env.TEMP_UPLOAD_PATH || './uploads/temp')
    }
  },

  EMAIL: {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    SMTP_SECURE: process.env.SMTP_SECURE === 'true',
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    FROM: process.env.EMAIL_FROM || process.env.SMTP_USER,
    FROM_NAME: process.env.EMAIL_FROM_NAME || 'P3M POLIMDO'
  },

  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  },

  LOGGING: {
    LEVEL: process.env.LOG_LEVEL || 'info',
    FILE_PATH: path.resolve(process.env.LOG_FILE_PATH || './logs'),
    MAX_SIZE: process.env.LOG_MAX_SIZE || '10m',
    MAX_FILES: process.env.LOG_MAX_FILES || '5'
  },

  BACKUP: {
    ENABLED: process.env.AUTO_BACKUP_ENABLED === 'true',
    DIR: path.resolve(process.env.BACKUP_DIR || './backups'),
    SCHEDULE: process.env.BACKUP_SCHEDULE || '0 2 * * *'
  },

  DEBUG: process.env.DEBUG_MODE === 'true',

  // Optional external integrations
  EXTERNAL: {
    SINTA_API_KEY: process.env.SINTA_API_KEY || '',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
  },

  REDIS: {
    HOST: process.env.REDIS_HOST || '',
    PORT: process.env.REDIS_PORT || '',
    PASSWORD: process.env.REDIS_PASSWORD || '',
    CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600')
  }
};

module.exports = constants;
