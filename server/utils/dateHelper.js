const moment = require('moment');

/**
 * Format tanggal ke format Indonesia (DD MMMM YYYY)
 * @param {Date|string|number} date - Tanggal yang akan diformat
 * @returns {string} Tanggal dalam format DD MMMM YYYY (contoh: 06 Juni 2025)
 */
const formatDate = (date) => {
  if (!date || !moment(date).isValid()) return '';
  return moment(date).locale('id').format('DD MMMM YYYY');
};

/**
 * Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
 * @returns {string}
 */
const getToday = () => {
  return moment().format('YYYY-MM-DD');
};

/**
 * Menghitung selisih hari antara dua tanggal
 * @param {Date|string|number} start - Tanggal awal
 * @param {Date|string|number} end - Tanggal akhir
 * @returns {number} Jumlah hari (integer)
 */
const daysBetween = (start, end) => {
  if (!moment(start).isValid() || !moment(end).isValid()) return 0;
  return moment(end).diff(moment(start), 'days');
};

module.exports = {
  formatDate,
  getToday,
  daysBetween,
};
