// client/src/components/Users/UserCard.js
import React from 'react';
import StatusBadge from '../Common/StatusBadge';

const UserCard = ({ user, onEdit, onDelete, onStatusToggle }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'DOSEN': return 'bg-blue-100 text-blue-800';
      case 'MAHASISWA': return 'bg-green-100 text-green-800';
      case 'REVIEWER': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{user.nama}</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
          {(user.nip || user.nim) && (
            <p className="text-gray-500 text-xs mt-1">
              {user.nip && `NIP: ${user.nip}`}
              {user.nim && `NIM: ${user.nim}`}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
            {user.role}
          </span>
          <StatusBadge
            status={user.status}
            onClick={() => onStatusToggle(user.id, user.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF')}
            clickable
          />
        </div>
      </div>

      {/* Contact Info */}
      {(user.no_telp || user.bidang_keahlian || user.jurusan?.nama || user.prodi?.nama) && (
        <div className="mb-3 text-sm text-gray-600">
          {user.no_telp && (
            <p className="flex items-center">
              <span className="font-medium">Telepon:</span>
              <span className="ml-2">{user.no_telp}</span>
            </p>
          )}
          {user.jurusan?.nama && (
            <p className="flex items-center">
              <span className="font-medium">Jurusan:</span>
              <span className="ml-2">{user.jurusan.nama}</span>
            </p>
          )}
          {user.prodi?.nama && (
            <p className="flex items-center">
              <span className="font-medium">Prodi:</span>
              <span className="ml-2">{user.prodi.nama}</span>
            </p>
          )}
          {user.bidang_keahlian && (
            <p className="flex items-center">
              <span className="font-medium">Bidang:</span>
              <span className="ml-2">{user.bidang_keahlian}</span>
            </p>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="bg-gray-50 rounded p-2">
          <p className="font-medium text-gray-900">{user._count?.proposals || 0}</p>
          <p className="text-gray-600 text-xs">Proposal</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="font-medium text-gray-900">{user._count?.reviewedProposals || 0}</p>
          <p className="text-gray-600 text-xs">Reviewed</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="font-medium text-gray-900">{user._count?.reviews || 0}</p>
          <p className="text-gray-600 text-xs">Reviews</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(user)}
          className="px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded text-sm font-medium transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user)}
          className="px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded text-sm font-medium transition-colors"
        >
          Hapus
        </button>
      </div>

      {/* Created Date */}
      <div className="mt-2 text-xs text-gray-400 text-right">
        Dibuat: {new Date(user.createdAt).toLocaleDateString('id-ID')}
      </div>
    </div>
  );
};

export default UserCard;