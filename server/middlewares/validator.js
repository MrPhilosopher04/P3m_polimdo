// =====================
// middlewares/validator.js (FIXED)
// =====================
const Joi = require('joi');
const { errorResponse } = require('../utils/response'); // Fixed import name

// === SCHEMA ===
const registerSchema = Joi.object({
  nama: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nama minimal 2 karakter',
    'string.max': 'Nama maksimal 100 karakter',
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
  role: Joi.string().valid('ADMIN', 'DOSEN', 'MAHASISWA', 'REVIEWER').required(),
  nip: Joi.string().min(8).max(20).optional(),
  nim: Joi.string().min(8).max(20).optional(),
  no_telp: Joi.string().pattern(/^(\+62|62|0)8[1-9][0-9]{6,9}$/).optional(),
  jurusanId: Joi.number().integer().min(1).optional(),
  prodiId: Joi.number().integer().min(1).optional()
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

const jurusanSchema = Joi.object({
  nama: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nama jurusan minimal 2 karakter',
    'string.max': 'Nama jurusan maksimal 100 karakter',
    'any.required': 'Nama jurusan wajib diisi'
  })
});

const prodiSchema = Joi.object({
  nama: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nama prodi minimal 2 karakter',
    'string.max': 'Nama prodi maksimal 100 karakter',
    'any.required': 'Nama prodi wajib diisi'
  }),
  jurusanId: Joi.number().integer().min(1).required().messages({
    'number.base': 'JurusanId harus berupa angka',
    'number.integer': 'JurusanId harus berupa bilangan bulat',
    'number.min': 'JurusanId tidak valid',
    'any.required': 'Jurusan wajib dipilih'
  })
});

const skemaSchema = Joi.object({
  kode: Joi.string().min(2).max(20).required(),
  nama: Joi.string().min(2).max(200).required(),
  kategori: Joi.string().valid('PENELITIAN', 'PENGABDIAN', 'HIBAH_INTERNAL', 'HIBAH_EKSTERNAL').required(),
  dana_min: Joi.number().min(0).optional(),
  dana_max: Joi.number().min(0).optional(),
  batas_anggota: Joi.number().integer().min(1).max(20).optional(),
  tahun_aktif: Joi.string().length(4).pattern(/^\d{4}$/).required()
});

const proposalSchema = Joi.object({
  judul: Joi.string().min(10).max(500).required(),
  abstrak: Joi.string().min(50).required(),
  skemaId: Joi.number().integer().min(1).required(),
  tahun: Joi.number().integer().min(2020).max(2030).required(),
  dana_diusulkan: Joi.number().min(0).optional(),
  kata_kunci: Joi.string().max(200).optional()
});

const reviewSchema = Joi.object({
  skor_total: Joi.number().min(0).max(100).required(),
  rekomendasi: Joi.string().valid('LAYAK', 'TIDAK_LAYAK', 'REVISI').required(),
  catatan: Joi.string().max(1000).optional()
});

// === VALIDATOR MIDDLEWARE ===
const createValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map(detail => detail.message).join(', ');
      return errorResponse(res, `Validasi gagal: ${details}`, 400);
    }
    next();
  };
};

// Ekspor validator khusus
const validateProdi = createValidator(prodiSchema);
const validateJurusan = createValidator(jurusanSchema);
const validateRegister = createValidator(registerSchema);
const validateLogin = createValidator(loginSchema);
const validateSkema = createValidator(skemaSchema);
const validateProposal = createValidator(proposalSchema);
const validateReview = createValidator(reviewSchema);

// Ekspor semua schema & middleware
module.exports = {
  registerSchema,
  loginSchema,
  jurusanSchema,
  prodiSchema,
  skemaSchema,
  proposalSchema,
  reviewSchema,
  validateProdi,
  validateJurusan,
  validateRegister,
  validateLogin,
  validateSkema,
  validateProposal,
  validateReview
};