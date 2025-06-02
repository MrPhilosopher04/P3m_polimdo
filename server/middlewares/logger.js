const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Create log entry
const createLogEntry = (level, message, meta = {}) => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    meta,
    pid: process.pid
  };
};

// Write to log file
const writeToFile = (filename, entry) => {
  const logPath = path.join(logsDir, filename);
  const logLine = JSON.stringify(entry) + '\n';
  
  fs.appendFile(logPath, logLine, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

// Logger functions
const logger = {
  error: (message, meta = {}) => {
    const entry = createLogEntry(LOG_LEVELS.ERROR, message, meta);
    console.error(`[ERROR] ${message}`, meta);
    writeToFile('error.log', entry);
  },

  warn: (message, meta = {}) => {
    const entry = createLogEntry(LOG_LEVELS.WARN, message, meta);
    console.warn(`[WARN] ${message}`, meta);
    writeToFile('app.log', entry);
  },

  info: (message, meta = {}) => {
    const entry = createLogEntry(LOG_LEVELS.INFO, message, meta);
    console.log(`[INFO] ${message}`, meta);
    writeToFile('app.log', entry);
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const entry = createLogEntry(LOG_LEVELS.DEBUG, message, meta);
      console.debug(`[DEBUG] ${message}`, meta);
      writeToFile('debug.log', entry);
    }
  }
};

// HTTP request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('HTTP Request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    
    logger.info('HTTP Response', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id
    });

    originalEnd.apply(res, args);
  };

  next();
};

module.exports = {
  logger,
  requestLogger,
  LOG_LEVELS
};