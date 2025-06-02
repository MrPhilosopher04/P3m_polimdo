// server/middlewares/validator.js
const Joi = require('joi');
const { sendError } = require('../utils/response');

// Skema validasi
const registerSchema = Joi.object({
  nama: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Nama tidak boleh kosong',
    'any.required': 'Nama wajib diisi'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password wajib diisi'
  }),
  role: Joi.string().valid('DOSEN', 'MAHASISWA', 'REVIEWER').required().messages({
    'any.only': 'Role harus DOSEN, MAHASISWA, atau REVIEWER',
    'any.required': 'Role wajib diisi'
  }),
  no_telp: Joi.string().pattern(/^(\+62|62|0)8[1-9][0-9]{6,9}$/).required().messages({
    'string.pattern.base': 'Format nomor telepon tidak valid',
    'any.required': 'Nomor telepon wajib diisi'
  }),
  institusi: Joi.string().optional(),
  jurusan: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password wajib diisi'
  })
});

// Middleware untuk validasi
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { 
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return sendError(res, 'Validasi gagal', 400, { errors });
    }
    
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema
};