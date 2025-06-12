const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Log levels
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

const fs = require('fs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}


// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');

// Winston formatters
const { combine, timestamp, printf, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const baseLog = {
    timestamp,
    level: level.toUpperCase(),
    message,
    pid: process.pid,
    ...(meta.userId && { userId: meta.userId })
  };

  if (stack) {
    baseLog.stack = stack;
  }

  if (Object.keys(meta).length > 0) {
    baseLog.meta = meta;
  }

  return JSON.stringify(baseLog);
});

// Logger instance
const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  },
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console transport (development only)
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),

    // Daily rotate for application logs
    new DailyRotateFile({
      level: 'info',
      filename: path.join(logsDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    }),

    // Daily rotate for error logs
    new DailyRotateFile({
      level: 'error',
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '90d'
    })
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

// Production environment settings
if (process.env.NODE_ENV === 'production') {
  logger.transports[0].level = 'info'; // Set console to info in prod
}

// HTTP request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Capture user ID if available
  const userId = req.user?.id || null;

  // Log request
  logger.info('HTTP Request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Response', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId
    });
  });

  next();
};

// Export logger instance directly
module.exports = {
  logger,
  requestLogger,
  LOG_LEVELS
};