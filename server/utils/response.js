const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) response.data = data;

  return res.status(statusCode).json(response);
};

const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  // Show full error details only in development mode
  if (errors && process.env.NODE_ENV === 'development') {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const sendPaginated = (res, message = 'Success', data = [], pagination = {}) => {
  const totalPages = Math.ceil(pagination.total / pagination.limit || 1);

  const response = {
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      pages: totalPages,
      hasNext: (pagination.page || 1) < totalPages,
      hasPrev: (pagination.page || 1) > 1
    },
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(response);
};

// PERBAIKAN: Tambahkan alias untuk backward compatibility
const sendResponse = sendSuccess;

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  sendResponse // Alias untuk compatibility
};