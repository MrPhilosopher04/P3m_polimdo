// client/src/components/Users/UserList.js
import React from 'react';
import UserCard from './UserCard';
import Table from '../Common/Table';
import Pagination from '../Common/Pagination';
import Loading from '../Common/Loading';

const UserList = ({
  users,
  loading,
  onEdit,
  onDelete,
  onStatusToggle,
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (loading) {
    return <Loading />;
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tidak ada data user</p>
      </div>
    );
  }

  const columns = [
    {
      key: 'info',
      label: 'Informasi User',
      render: (user) => (
        <div>
          <p className="font-semibold text-gray-900">{user.nama}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-500">
            {user.nip && `NIP: ${user.nip}`}
            {user.nim && `NIM: ${user.nim}`}
          </p>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
          user.role === 'DOSEN' ? 'bg-blue-100 text-blue-800' :
          user.role === 'MAHASISWA' ? 'bg-green-100 text-green-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {user.role}
        </span>
      )
    },
    {
      key: 'contact',
      label: 'Kontak & Institusi',
      render: (user) => (
        <div>
          {user.no_telp && <p className="text-sm">{user.no_telp}</p>}
          {user.jurusan?.nama && <p className="text-xs text-gray-500">Jurusan: {user.jurusan.nama}</p>}
          {user.prodi?.nama && <p className="text-xs text-gray-500">Prodi: {user.prodi.nama}</p>}
          {user.bidang_keahlian && <p className="text-xs text-gray-500">Bidang: {user.bidang_keahlian}</p>}
        </div>
      )
    },
    {
      key: 'stats',
      label: 'Statistik',
      render: (user) => (
        <div className="text-xs text-gray-600">
          <p>Proposal: {user._count?.proposals || 0}</p>
          <p>Reviewed: {user._count?.reviewedProposals || 0}</p>
          <p>Reviews: {user._count?.reviews || 0}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => (
        <button
          onClick={() => onStatusToggle(user.id, user.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            user.status === 'AKTIF' 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          {user.status}
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (user) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(user)}
            className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Hapus
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table columns={columns} data={users} />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="grid gap-4 p-4">
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusToggle={onStatusToggle}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-4 py-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default UserList;