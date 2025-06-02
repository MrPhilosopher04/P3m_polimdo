// src/utils/helpers.js
export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const getStatusColor = (status) => {
  const colors = {
    draft: '#6c757d',
    submitted: '#007bff',
    under_review: '#ffc107',
    approved: '#28a745',
    rejected: '#dc3545',
    revision: '#fd7e14'
  };
  return colors[status] || '#6c757d';
};

export const getStatusText = (status) => {
  const texts = {
    draft: 'Draft',
    submitted: 'Disubmit',
    under_review: 'Sedang Direview',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    revision: 'Perlu Revisi'
  };
  return texts[status] || status;
};

export const getRoleName = (role) => {
  const names = {
    admin: 'Administrator',
    dosen: 'Dosen',
    mahasiswa: 'Mahasiswa',
    reviewer: 'Reviewer'
  };
  return names[role] || role;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};
