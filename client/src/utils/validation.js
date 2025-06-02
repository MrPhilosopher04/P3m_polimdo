// src/utils/validation.js
export const validateProposal = (proposalData) => {
  const errors = {};

  if (!proposalData.title || proposalData.title.trim().length < 10) {
    errors.title = 'Judul proposal minimal 10 karakter';
  }

  if (!proposalData.abstract || proposalData.abstract.trim().length < 100) {
    errors.abstract = 'Abstrak minimal 100 karakter';
  }

  if (!proposalData.skema_id) {
    errors.skema_id = 'Skema harus dipilih';
  }

  if (!proposalData.budget || proposalData.budget <= 0) {
    errors.budget = 'Anggaran harus lebih dari 0';
  }

  if (!proposalData.duration || proposalData.duration <= 0) {
    errors.duration = 'Durasi penelitian harus lebih dari 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateUser = (userData) => {
  const errors = {};

  if (!userData.name || userData.name.trim().length < 3) {
    errors.name = 'Nama minimal 3 karakter';
  }

  if (!validateEmail(userData.email)) {
    errors.email = 'Format email tidak valid';
  }

  if (userData.password && !validatePassword(userData.password)) {
    errors.password = 'Password minimal 6 karakter';
  }

  if (!userData.role) {
    errors.role = 'Role harus dipilih';
  }

  if (userData.role === 'dosen' && !userData.nidn) {
    errors.nidn = 'NIDN wajib diisi untuk dosen';
  }

  if (userData.role === 'mahasiswa' && !userData.nim) {
    errors.nim = 'NIM wajib diisi untuk mahasiswa';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};