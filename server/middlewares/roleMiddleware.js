// middleware/roleMiddleware.js
const { sendError } = require('../utils/response');

// Hirarki role
const ROLE_HIERARCHY = {
  ADMIN: 4,
  REVIEWER: 3,
  DOSEN: 2,
  MAHASISWA: 1
};

// Middleware utama: Periksa apakah user memiliki role yang diizinkan
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return sendError(res, 'User tidak ditemukan', 401);
      }

      let roles = [];
      if (Array.isArray(allowedRoles)) {
        roles = allowedRoles.flat();
      } else if (typeof allowedRoles === 'string') {
        roles = [allowedRoles];
      } else {
        roles = [allowedRoles];
      }

      console.log('🔍 RoleMiddleware - User Role:', user.role);
      console.log('🔍 RoleMiddleware - Allowed Roles:', roles);

      if (!roles.includes(user.role)) {
        console.log('❌ RoleMiddleware - Access denied');
        return sendError(res, `Akses tidak diizinkan untuk role ${user.role}`, 403);
      }

      console.log('✅ RoleMiddleware - Access granted');
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return sendError(res, 'Terjadi kesalahan sistem', 500);
    }
  };
};

// Minimum role level (hirarki)
const requireMinRole = (minRole) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return sendError(res, 'User tidak ditemukan', 401);

      const userLevel = ROLE_HIERARCHY[user.role];
      const requiredLevel = ROLE_HIERARCHY[minRole];

      if (!userLevel || userLevel < requiredLevel) {
        return sendError(res, 'Akses ditolak. Level akses tidak mencukupi', 403);
      }

      next();
    } catch (error) {
      console.error('MinRole middleware error:', error);
      return sendError(res, 'Terjadi kesalahan sistem', 500);
    }
  };
};

// Verifikasi pemilik resource atau ADMIN
const requireOwnershipOrAdmin = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return sendError(res, 'User tidak ditemukan', 401);

      if (user.role === 'ADMIN') return next();

      const resourceUserId = req.params[resourceUserIdField]
        || req.body[resourceUserIdField]
        || req.query[resourceUserIdField];

      if (parseInt(resourceUserId) === user.id) {
        return next();
      }

      return sendError(res, 'Akses ditolak. Anda hanya dapat mengakses resource milik sendiri', 403);
    } catch (error) {
      console.error('Ownership middleware error:', error);
      return sendError(res, 'Terjadi kesalahan sistem', 500);
    }
  };
};

// Role khusus: Reviewer
const requireReviewerRole = (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 'User tidak ditemukan', 401);

    if (!['REVIEWER', 'ADMIN'].includes(user.role)) {
      return sendError(res, 'Akses ditolak. Hanya reviewer yang dapat melakukan review', 403);
    }

    next();
  } catch (error) {
    console.error('Reviewer middleware error:', error);
    return sendError(res, 'Terjadi kesalahan sistem', 500);
  }
};

// Role khusus: Dosen & Mahasiswa & Admin
const requireProposalCreatorRole = (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 'User tidak ditemukan', 401);

    if (!['DOSEN', 'MAHASISWA', 'ADMIN'].includes(user.role)) {
      return sendError(res, 'Akses ditolak. Hanya dosen/mahasiswa yang dapat membuat proposal', 403);
    }

    next();
  } catch (error) {
    console.error('Proposal creator role middleware error:', error);
    return sendError(res, 'Terjadi kesalahan sistem', 500);
  }
};

// Middleware dinamis berdasarkan method & path
const dynamicRoleCheck = (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 'User tidak ditemukan', 401);

    const method = req.method;
    const path = req.route?.path;

    const routeRoles = {
      'POST /api/users': ['ADMIN'],
      'DELETE /api/users/:id': ['ADMIN'],
      'POST /api/skema': ['ADMIN'],
      'PUT /api/skema/:id': ['ADMIN'],
      'DELETE /api/skema/:id': ['ADMIN'],
      'POST /api/jurusan': ['ADMIN'],
      'PUT /api/jurusan/:id': ['ADMIN'],
      'DELETE /api/jurusan/:id': ['ADMIN'],
      'POST /api/prodi': ['ADMIN'],
      'PUT /api/prodi/:id': ['ADMIN'],
      'DELETE /api/prodi/:id': ['ADMIN'],

      'POST /api/reviews': ['REVIEWER', 'ADMIN'],
      'PUT /api/reviews/:id': ['REVIEWER', 'ADMIN'],

      'POST /api/proposals': ['DOSEN', 'MAHASISWA', 'ADMIN'],
      'PUT /api/proposals/:id': ['DOSEN', 'MAHASISWA', 'ADMIN'],
    };

    const routeKey = `${method} ${path}`;
    const allowedRoles = routeRoles[routeKey];

    console.log('🔍 DynamicRole - User:', user.role, '| Method:', method, '| Path:', path);

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return sendError(res, `Akses ditolak untuk route ${routeKey}`, 403);
    }

    next();
  } catch (error) {
    console.error('Dynamic role check error:', error);
    return sendError(res, 'Terjadi kesalahan sistem', 500);
  }
};

module.exports = {
  roleMiddleware,
  requireMinRole,
  requireOwnershipOrAdmin,
  requireReviewerRole,
  requireProposalCreatorRole,
  dynamicRoleCheck,
  ROLE_HIERARCHY
};
