// server/utils/constants.js
// Role pengguna (sesuai dengan Prisma schema)
const USER_ROLES = {
  ADMIN: 'ADMIN',
  DOSEN: 'DOSEN',
  MAHASISWA: 'MAHASISWA',
  REVIEWER: 'REVIEWER'
};

// Status pengguna
const USER_STATUS = {
  AKTIF: 'AKTIF',
  NONAKTIF: 'NONAKTIF'
};

// Status proposal
const PROPOSAL_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  REVIEW: 'REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION: 'REVISION',
  COMPLETED: 'COMPLETED'
};

// Rekomendasi hasil review
const REKOMENDASI = {
  LAYAK: 'LAYAK',
  TIDAK_LAYAK: 'TIDAK_LAYAK',
  REVISI: 'REVISI'
};

// Kategori proposal
const KATEGORI = {
  PENELITIAN: 'PENELITIAN',
  PENGABDIAN: 'PENGABDIAN',
  HIBAH_INTERNAL: 'HIBAH_INTERNAL',
  HIBAH_EKSTERNAL: 'HIBAH_EKSTERNAL'
};

// Label tampilan untuk role
const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.REVIEWER]: 'Reviewer',
  [USER_ROLES.DOSEN]: 'Dosen',
  [USER_ROLES.MAHASISWA]: 'Mahasiswa'
};

// Status aktif/nonaktif
const STATUS_LABELS = {
  [USER_STATUS.AKTIF]: 'Aktif',
  [USER_STATUS.NONAKTIF]: 'Non-Aktif'
};

// Label tampilan untuk status proposal
const PROPOSAL_STATUS_LABELS = {
  [PROPOSAL_STATUS.DRAFT]: 'Draft',
  [PROPOSAL_STATUS.SUBMITTED]: 'Diajukan',
  [PROPOSAL_STATUS.REVIEW]: 'Sedang Review',
  [PROPOSAL_STATUS.APPROVED]: 'Disetujui',
  [PROPOSAL_STATUS.REJECTED]: 'Ditolak',
  [PROPOSAL_STATUS.REVISION]: 'Perlu Revisi',
  [PROPOSAL_STATUS.COMPLETED]: 'Selesai'
};

// Label rekomendasi
const REKOMENDASI_LABELS = {
  [REKOMENDASI.LAYAK]: 'Layak',
  [REKOMENDASI.TIDAK_LAYAK]: 'Tidak Layak',
  [REKOMENDASI.REVISI]: 'Perlu Revisi'
};

module.exports = {
  USER_ROLES,
  USER_STATUS,
  PROPOSAL_STATUS,
  REKOMENDASI,
  KATEGORI,
  ROLE_LABELS,
  STATUS_LABELS,
  PROPOSAL_STATUS_LABELS,
  REKOMENDASI_LABELS
};