import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PencilIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import prodiService from '../../services/prodiService';
import Loading from '../../components/Common/Loading';
import Modal from '../../components/Common/Modal';
import { useAuth } from '../../hooks/useAuth';

const ProdiDetail = () => {
  const [prodi, setProdi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, nama: '' });
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchProdi();
  }, [id]);

  const fetchProdi = async () => {
    try {
      setLoading(true);
      const response = await prodiService.getProdiById(id);
      setProdi(response.data);
    } catch (error) {
      setError('Gagal memuat data program studi');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await prodiService.deleteProdi(id);
      navigate('/prodi', {
        replace: true,
        state: { message: 'Program studi berhasil dihapus' }
      });
    } catch (error) {
      setError(error.message || 'Gagal menghapus program studi');
      setDeleteModal({ show: false, id: null, nama: '' });
    }
  };

  const openDeleteModal = () => {
    setDeleteModal({ show: true, id: prodi.id, nama: prodi.nama });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, id: null, nama: '' });
  };

  if (loading) return <Loading />;

  if (error && !prodi) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="text-red-700">{error}</div>
        </div>
        <Link
          to="/prodi"
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali ke Daftar Program Studi
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/prodi"
            className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Program Studi</h1>
            <p className="text-gray-600">Informasi lengkap program studi</p>
          </div>
        </div>
        
        {user?.role === 'ADMIN' && (
          <div className="flex items-center gap-2">
            <Link
              to={`/prodi/${id}/edit`}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={openDeleteModal}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              disabled={prodi?.users?.length > 0}
            >
              <TrashIcon className="h-4 w-4" />
              Hapus
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {prodi && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Program Studi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Nama Program Studi
                </label>
                <p className="mt-1 text-lg text-gray-900">{prodi.nama}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  ID Program Studi
                </label>
                <p className="mt-1 text-lg text-gray-900">{prodi.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Jurusan
                </label>
                <Link
                  to={`/jurusan/${prodi.jurusan?.id}`}
                  className="mt-1 text-lg text-blue-600 hover:text-blue-800 block"
                >
                  {prodi.jurusan?.nama}
                </Link>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Jumlah Pengguna
                </label>
                <p className="mt-1 text-lg text-gray-900">
                  {prodi.users?.length || 0} pengguna
                </p>
              </div>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pengguna ({prodi.users?.length || 0})
            </h2>
            
            {prodi.users && prodi.users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prodi.users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/users/${user.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            {user.nama}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                            user.role === 'DOSEN' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'MAHASISWA' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Belum ada pengguna di program studi ini
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={closeDeleteModal}
        title="Konfirmasi Hapus"
      >
        <div className="mb-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus program studi{' '}
            <span className="font-semibold">{deleteModal.nama}</span>?
          </p>
          <p className="text-red-600 text-sm mt-2">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProdiDetail;