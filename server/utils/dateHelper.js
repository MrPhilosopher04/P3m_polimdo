const moment = require('moment');

/**
 * Format tanggal ke format Indonesia (DD MMMM YYYY)
 */
const formatDate = (date) => {
  return moment(date).locale('id').format('DD MMMM YYYY');
};

/**
 * Mendapatkan tanggal sekarang (YYYY-MM-DD)
 */
const getToday = () => {
  return moment().format('YYYY-MM-DD');
};

/**
 * Mendapatkan selisih hari antara dua tanggal
 */
const daysBetween = (start, end) => {
  return moment(end).diff(moment(start), 'days');
};

module.exports = {
  formatDate,
  getToday,
  daysBetween,
};
