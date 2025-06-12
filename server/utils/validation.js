//server/utils/validation.js
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
  return phoneRegex.test(phone);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateNIP = (nip) => {
  return nip && nip.length >= 8;
};

const validateNIM = (nim) => {
  return nim && nim.length >= 8;
};

// Schema validation (jika menggunakan joi atau yup)
const registerSchema = {
  nama: { required: true, min: 2 },
  email: { required: true, email: true },
  password: { required: true, min: 6 },
  role: { required: true },
};

const loginSchema = {
  email: { required: true, email: true },
  password: { required: true },
};

module.exports = {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateNIP,
  validateNIM,
  registerSchema,
  loginSchema
};
