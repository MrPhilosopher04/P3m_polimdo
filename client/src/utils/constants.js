// src/utils/constants.js

// User Roles (sesuai dengan Prisma schema)
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DOSEN: 'DOSEN',
  MAHASISWA: 'MAHASISWA',
  REVIEWER: 'REVIEWER'
};

// Status
export const STATUS = {
  AKTIF: 'AKTIF',
  NONAKTIF: 'NONAKTIF'
};

// Kategori Skema
export const KATEGORI = {
  PENELITIAN: 'PENELITIAN',
  PENGABDIAN: 'PENGABDIAN',
  HIBAH_INTERNAL: 'HIBAH_INTERNAL',
  HIBAH_EKSTERNAL: 'HIBAH_EKSTERNAL'
};

// Status Proposal
export const PROPOSAL_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  REVIEW: 'REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION: 'REVISION',
  COMPLETED: 'COMPLETED'
};

// Rekomendasi Review
export const REKOMENDASI = {
  LAYAK: 'LAYAK',
  TIDAK_LAYAK: 'TIDAK_LAYAK',
  REVISI: 'REVISI'
};

// Role Labels untuk Display
export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.DOSEN]: 'Dosen',
  [USER_ROLES.MAHASISWA]: 'Mahasiswa',
  [USER_ROLES.REVIEWER]: 'Reviewer'
};

// Status Labels untuk Display
export const STATUS_LABELS = {
  [STATUS.AKTIF]: 'Aktif',
  [STATUS.NONAKTIF]: 'Non-Aktif'
};

// Kategori Labels untuk Display
export const KATEGORI_LABELS = {
  [KATEGORI.PENELITIAN]: 'Penelitian',
  [KATEGORI.PENGABDIAN]: 'Pengabdian Masyarakat',
  [KATEGORI.HIBAH_INTERNAL]: 'Hibah Internal',
  [KATEGORI.HIBAH_EKSTERNAL]: 'Hibah Eksternal'
};

// Proposal Status Labels untuk Display
export const PROPOSAL_STATUS_LABELS = {
  [PROPOSAL_STATUS.DRAFT]: 'Draft',
  [PROPOSAL_STATUS.SUBMITTED]: 'Diajukan',
  [PROPOSAL_STATUS.REVIEW]: 'Sedang Review',
  [PROPOSAL_STATUS.APPROVED]: 'Disetujui',
  [PROPOSAL_STATUS.REJECTED]: 'Ditolak',
  [PROPOSAL_STATUS.REVISION]: 'Perlu Revisi',
  [PROPOSAL_STATUS.COMPLETED]: 'Selesai'
};

// Rekomendasi Labels untuk Display
export const REKOMENDASI_LABELS = {
  [REKOMENDASI.LAYAK]: 'Layak',
  [REKOMENDASI.TIDAK_LAYAK]: 'Tidak Layak',
  [REKOMENDASI.REVISI]: 'Perlu Revisi'
};

// Daftar Jurusan di Polimdo
export const JURUSAN_LIST = [
  'Teknik Sipil',
  'Teknik Mesin',
  'Teknik Elektro',
  'Teknik Informatika',
  'Akuntansi',
  'Administrasi Bisnis',
  'Budidaya Perairan',
  'Teknologi Hasil Perikanan',
  'Agribisnis',
  'Teknologi Pangan'
];

// Storage Keys untuk localStorage
export const STORAGE_KEYS = {
  TOKEN: 'authToken' // Key untuk menyimpan token
};

// Role Permissions
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    canViewUsers: true,
    canManageUsers: true,
    canViewProposals: true,
    canManageProposals: true,
    canViewReviews: true,
    canManageReviews: true,
    canViewSkema: true,
    canManageSkema: true,
    canViewReports: true
  },
  [USER_ROLES.DOSEN]: {
    canViewUsers: false,
    canManageUsers: false,
    canViewProposals: true,
    canManageProposals: true,
    canViewReviews: true,
    canManageReviews: false,
    canViewSkema: true,
    canManageSkema: false,
    canViewReports: false
  },
  [USER_ROLES.MAHASISWA]: {
    canViewUsers: false,
    canManageUsers: false,
    canViewProposals: true,
    canManageProposals: true,
    canViewReviews: false,
    canManageReviews: false,
    canViewSkema: true,
    canManageSkema: false,
    canViewReports: false
  },
  [USER_ROLES.REVIEWER]: {
    canViewUsers: false,
    canManageUsers: false,
    canViewProposals: true,
    canManageProposals: false,
    canViewReviews: true,
    canManageReviews: true,
    canViewSkema: true,
    canManageSkema: false,
    canViewReports: false
  }
};

