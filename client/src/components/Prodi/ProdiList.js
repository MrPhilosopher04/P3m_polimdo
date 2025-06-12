import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import prodiService from '../../services/prodiService';
import Loading from '../Common/Loading';
import Modal from '../Common/Modal';
import SearchBar from '../Common/SearchBar';

const ProdiList = () => {
  const [prodi, setProdi] = useState([]);
  const [filteredProdi, setFilteredProdi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, nama: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProdi();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = prodi.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jurusan.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProdi(filtered);
    } else {
      setFilteredProdi(prodi);
    }
  }, [searchTerm, prodi]);

  const fetchProdi = async () => {
    try {
      setLoading(true);
      const response = await prodiService.getAllProdi();
      setProdi(response.data);
      setFilteredProdi(response.data);
    } catch (error) {
      console.error('Error fetching prodi:', error);
      alert('Gagal mengambil data prodi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, nama) => {
    setDeleteModal({ show: true, id, nama });
  };

  const handleDeleteConfirm = async () => {
    try {
      await prodiService.deleteProdi(deleteModal.id);
      setDeleteModal({ show: false, id: null, nama: '' });
      fetchProdi();
      alert('Prodi berhasil dihapus');
    } catch (error) {
      console.error('Error deleting prodi:', error);
      alert(error.message || 'Gagal menghapus prodi');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, id: null, nama: '' });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Studi</h1>
          <p className="text-gray-600">Kelola data program studi</p>
        </div>
        <Link
          to="/prodi/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Tambah Prodi
        </Link>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Cari prodi atau jurusan..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* Prodi Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Prodi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jurusan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah Pengguna
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProdi.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? 'Tidak ada prodi yang ditemukan' : 'Belum ada data prodi'}
                </td>
              </tr>
            ) : (
              filteredProdi.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.nama}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.jurusan.nama}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item._count.users} pengguna
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/prodi/edit/${item.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(item.id, item.nama)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Hapus"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={handleDeleteCancel}
        title="Konfirmasi Hapus"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus prodi "{deleteModal.nama}"?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProdiList;