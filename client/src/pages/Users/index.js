// client/src/pages/Users/index.js
import React, { useState, useEffect } from 'react';
import UserList from '../../components/Users/UserList';
import UserForm from '../../components/Users/UserForm';
import SearchBar from '../../components/Common/SearchBar';
import Modal from '../../components/Common/Modal';
import userService from '../../services/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);

  const roles = [
    { value: '', label: 'Semua Role' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'DOSEN', label: 'Dosen' },
    { value: 'MAHASISWA', label: 'Mahasiswa' },
    { value: 'REVIEWER', label: 'Reviewer' }
  ];

  const statuses = [
    { value: '', label: 'Semua Status' },
    { value: 'AKTIF', label: 'Aktif' },
    { value: 'NONAKTIF', label: 'Non-Aktif' }
  ];

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, selectedRole, selectedStatus]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.getUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        role: selectedRole,
        status: selectedStatus
      });

      if (result.success) {
        setUsers(result.data.users);
        setTotalPages(result.data.pagination.pages);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setModalMode('delete');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleStatusToggle = async (userId, newStatus) => {
    try {
      const result = await userService.updateUserStatus(userId, newStatus);
      if (result.success) {
        fetchUsers();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Gagal mengubah status user');
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      const result = modalMode === 'create' 
        ? await userService.createUser(formData)
        : await userService.updateUser(selectedUser.id, formData);

      if (result.success) {
        fetchUsers();
        setShowModal(false);
        setSelectedUser(null);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(`Gagal ${modalMode === 'create' ? 'membuat' : 'mengupdate'} user`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setFormLoading(true);
    try {
      const result = await userService.deleteUser(selectedUser.id);
      if (result.success) {
        fetchUsers();
        setShowModal(false);
        setSelectedUser(null);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Gagal menghapus user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
    setError('');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Users</h1>
        <p className="text-gray-600">Kelola pengguna sistem</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <SearchBar 
          value={searchTerm}
          onChange={handleSearch} 
          placeholder="Cari nama, email, NIP, NIM..." 
        />
        
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {roles.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>

        <button
          onClick={handleCreateUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Tambah User
        </button>
      </div>

      {/* User List */}
      <UserList
        users={users}
        loading={loading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onStatusToggle={handleStatusToggle}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleModalClose}
          title={
            modalMode === 'create' ? 'Tambah User Baru' :
            modalMode === 'edit' ? 'Edit User' :
            'Hapus User'
          }
          size={modalMode === 'delete' ? 'small' : 'large'}
        >
          {modalMode === 'delete' ? (
            <div>
              <p className="mb-4">
                Apakah Anda yakin ingin menghapus user <strong>{selectedUser?.nama}</strong>?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleModalClose}
                  disabled={formLoading}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={formLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {formLoading ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          ) : (
            <UserForm
              user={selectedUser}
              onSubmit={handleFormSubmit}
              onCancel={handleModalClose}
              loading={formLoading}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Users;