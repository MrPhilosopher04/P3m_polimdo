// server/utils/response.js

// Kirim respon sukses
const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) response.data = data;

  return res.status(statusCode).json(response);
};

// Kirim respon error
const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  // Tampilkan detail error hanya jika mode development
  if (errors && process.env.NODE_ENV === 'development') {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Kirim respon paginasi
const sendPaginated = (
  res,
  message = 'Success',
  data = [],
  pagination = {}
) => {
  const page = pagination.page || 1;
  const limit = pagination.limit || 10;
  const total = pagination.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const response = {
    success: true,
    message,
    data: { items: data }, // Konsistensi struktur data
    pagination: {
      page,
      limit,
      total,
      pages: totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(response);
};

// Alias untuk backward compatibility
const sendResponse = sendSuccess;

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  sendResponse,
  successResponse: sendSuccess,   // Tambahkan ini
  errorResponse: sendError,   

};
