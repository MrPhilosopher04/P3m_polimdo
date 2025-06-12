import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import jurusanService from '../../services/jurusanService';
import Loading from '../Common/Loading';
import Modal from '../Common/Modal';
import { useAuth } from '../../hooks/useAuth';

const JurusanList = () => {
  const [jurusan, setJurusan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, nama: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchJurusan();
    
    // Handle success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Auto clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchJurusan = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching jurusan data...');
      const response = await jurusanService.getAllJurusan();
      console.log('Service response:', response);
      
      // Handle response structure from backend
      if (response && response.success && response.data) {
        if (Array.isArray(response.data)) {
          setJurusan(response.data);
          console.log(`Loaded ${response.data.length} jurusan records`);
        } else {
          throw new Error('Data format tidak sesuai - data harus berupa array');
        }
      } else {
        throw new Error(response?.message || 'Response tidak valid dari server');
      }
    } catch (error) {
      console.error('Error fetching jurusan:', error);
      
      let errorMessage = 'Gagal memuat data jurusan';
      
      // More specific error handling
      if (error.message === 'Tidak dapat terhubung ke server') {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Endpoint tidak ditemukan. Periksa konfigurasi API.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Anda tidak memiliki akses. Silakan login kembali.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setJurusan([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      console.log(`Attempting to delete jurusan with ID: ${id}`);
      
      await jurusanService.deleteJurusan(id);
      
      // Remove deleted item from state
      setJurusan(prevJurusan => prevJurusan.filter(item => item.id !== id));
      setDeleteModal({ show: false, id: null, nama: '' });
      setSuccessMessage('Jurusan berhasil dihapus');
      
      console.log('Jurusan deleted successfully');
    } catch (error) {
      console.error('Error deleting jurusan:', error);
      
      let errorMessage = 'Gagal menghapus jurusan';
      
      if (error.message.includes('masih memiliki')) {
        errorMessage = 'Tidak dapat menghapus jurusan yang masih memiliki data terkait (pengguna atau program studi)';
      } else if (error.message === 'Jurusan tidak ditemukan') {
        errorMessage = 'Jurusan tidak ditemukan atau sudah dihapus';
        // Refresh data to sync with server
        fetchJurusan();
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      // Don't close modal on error so user can try again
    }
  };

  const openDeleteModal = (id, nama) => {
    setDeleteModal({ show: true, id, nama });
    setError(''); // Clear any previous errors
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, id: null, nama: '' });
    setError(''); // Clear errors when closing modal
  };

  const handleRetry = () => {
    setError('');
    setSuccessMessage('');
    fetchJurusan();
  };

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Jurusan</h1>
          <p className="text-gray-600">Kelola data jurusan di institusi</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Link
            to="/jurusan/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Jurusan
          </Link>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-green-700">{successMessage}</div>
            <button
              onClick={clearSuccessMessage}
              className="text-green-600 hover:text-green-800 text-sm ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-red-700">{error}</div>
            <button
              onClick={handleRetry}
              className="text-red-600 hover:text-red-800 text-sm underline ml-4"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Jurusan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Prodi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jurusan.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      {error ? (
                        <div>
                          <p className="mb-2">Tidak dapat memuat data jurusan</p>
                          <button
                            onClick={handleRetry}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Coba lagi
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="mb-2">Belum ada data jurusan</p>
                          {user?.role === 'ADMIN' && (
                            <Link
                              to="/jurusan/create"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Tambah jurusan pertama
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                jurusan.map((item) => {
                  const canDelete = !item._count?.prodis && !item._count?.users;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.nama}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item._count?.prodis || 0} Prodi
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item._count?.users || 0} User
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/jurusan/${item.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="Lihat Detail"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          {user?.role === 'ADMIN' && (
                            <>
                              <Link
                                to={`/jurusan/${item.id}/edit`}
                                className="text-yellow-600 hover:text-yellow-900 p-1 rounded transition-colors"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => canDelete ? openDeleteModal(item.id, item.nama) : null}
                                className={`p-1 rounded transition-colors ${
                                  canDelete
                                    ? 'text-red-600 hover:text-red-900 cursor-pointer'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                                title={
                                  canDelete
                                    ? 'Hapus'
                                    : 'Tidak dapat dihapus karena masih memiliki data terkait'
                                }
                                disabled={!canDelete}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={closeDeleteModal}
        title="Konfirmasi Hapus"
      >
        <div className="mb-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus jurusan{' '}
            <span className="font-semibold text-gray-900">{deleteModal.nama}</span>?
          </p>
          <p className="text-red-600 text-sm mt-2">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Show error in modal if delete fails */}
        {error && deleteModal.show && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => handleDelete(deleteModal.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default JurusanList;