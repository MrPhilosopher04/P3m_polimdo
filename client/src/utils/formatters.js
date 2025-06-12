// src/utils/formatters.js

// Format tanggal ke format lokal, contoh: 2 Juni 2025
export const formatDate = (dateString, locale = 'id-ID', options = {}) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date)) return '-';

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
};

// Format waktu, contoh: 14:35
export const formatTime = (dateString, locale = 'id-ID', options = {}) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date)) return '-';

  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
};

// Format tanggal & waktu lengkap
export const formatDateTime = (dateString, locale = 'id-ID') => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date)) return '-';

  return `${formatDate(dateString, locale)} ${formatTime(dateString, locale)}`;
};

// Format angka dengan pemisah ribuan, contoh: 1,234,567
export const formatNumber = (number) => {
  if (number == null || isNaN(number)) return '-';
  return new Intl.NumberFormat('id-ID').format(number);
};

// Format mata uang Rupiah, contoh: Rp 1.500.000
export const formatCurrency = (number, locale = 'id-ID', currency = 'IDR') => {
  if (number == null || isNaN(number)) return '-';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(number);
};

// Capitalize pertama kata
export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Capitalize setiap kata
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => capitalizeFirst(word))
    .join(' ');
};
