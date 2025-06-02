//server/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Prisma errors
  if (err.code && err.code.startsWith('P')) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'Data already exists',
          field: err.meta?.target,
          timestamp: new Date().toISOString()
        });
      
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Record not found',
          timestamp: new Date().toISOString()
        });
      
      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Foreign key constraint failed',
          timestamp: new Date().toISOString()
        });
      
      case 'P2014':
        return res.status(400).json({
          success: false,
          message: 'Invalid ID provided',
          timestamp: new Date().toISOString()
        });
      
      default:
        return res.status(500).json({
          success: false,
          message: 'Database error occurred',
          timestamp: new Date().toISOString()
        });
    }
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large',
      timestamp: new Date().toISOString()
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files uploaded',
      timestamp: new Date().toISOString()
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      timestamp: new Date().toISOString()
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      timestamp: new Date().toISOString()
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
      timestamp: new Date().toISOString()
    });
  }

  // Syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      timestamp: new Date().toISOString()
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};