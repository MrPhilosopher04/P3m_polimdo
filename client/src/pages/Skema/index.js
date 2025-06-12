// src/pages/Skema/index.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import skemaService from '../../services/skemaService';
import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/Common/Pagination';
import StatusBadge from '../../components/Common/StatusBadge';
import SearchBar from '../../components/Common/SearchBar';

const SkemaIndex = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [skemas, setSkemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    kategori: 'Semua Kategori',
    status: 'Semua Status',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    hasPrev: false,
    hasNext: false
  });

  // Fetch skemas data
  const fetchSkemas = async () => {
    try {
      setLoading(true);
      const response = await skemaService.getAllSkema(filters);
      
      if (response.success) {
        setSkemas(response.data.items || []);
        setPagination(response.data.pagination || {});
        setError('');
      } else {
        setError(response.message || 'Gagal memuat data skema');
        showToast('error', response.message || 'Gagal memuat data skema');
      }
    } catch (err) {
      console.error('Error fetching skemas:', err);
      setError('Terjadi kesalahan saat memuat data skema');
      showToast('error', 'Terjadi kesalahan saat memuat data skema');
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchSkemas();
  }, [filters]);

  // Handle search input change
  const handleSearchChange = (value) => {
    setFilters({
      ...filters,
      search: value,
      page: 1
    });
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1
    });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus skema ini?')) return;
    
    try {
      const response = await skemaService.deleteSkema(id);
      if (response.success) {
        showToast('success', 'Skema berhasil dihapus');
        fetchSkemas();
      } else {
        setError(response.message || 'Gagal menghapus skema');
        showToast('error', response.message || 'Gagal menghapus skema');
      }
    } catch (error) {
      console.error('Error deleting skema:', error);
      setError('Terjadi kesalahan saat menghapus skema');
      showToast('error', 'Terjadi kesalahan saat menghapus skema');
    }
  };

  // Format currency to Rupiah
  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // Get kategori label
  const getKategoriLabel = (kategori) => {
    const labels = {
      PENELITIAN: 'Penelitian',
      PENGABDIAN: 'Pengabdian',
      HIBAH_INTERNAL: 'Hibah Internal',
      HIBAH_EKSTERNAL: 'Hibah Eksternal'
    };
    return labels[kategori] || kategori;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Skema</h1>
            <p className="text-gray-600">Kelola skema penelitian dan pengabdian</p>
          </div>
          <button
            onClick={() => navigate('/skema/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            + Tambah Skema
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={fetchSkemas}
            className="ml-2 text-red-800 underline hover:no-underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <SearchBar 
              placeholder="Cari nama atau kode skema..."
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.kategori}
              onChange={(e) => handleFilterChange('kategori', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="PENELITIAN">Penelitian</option>
              <option value="PENGABDIAN">Pengabdian</option>
              <option value="HIBAH_INTERNAL">Hibah Internal</option>
              <option value="HIBAH_EKSTERNAL">Hibah Eksternal</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Non-Aktif</option>
            </select>
          </div>

          {/* Items per page */}
          <div>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 per halaman</option>
              <option value={10}>10 per halaman</option>
              <option value={25}>25 per halaman</option>
              <option value={50}>50 per halaman</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {pagination.total !== undefined && (
        <div className="mb-4 text-sm text-gray-600">
          Menampilkan {Math.min((filters.page - 1) * filters.limit + 1, pagination.total)} - {Math.min(filters.page * filters.limit, pagination.total)} dari {pagination.total} data skema
        </div>
      )}

      {/* Skema Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {skemas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Tidak ada data skema</p>
            <p className="text-sm">Belum ada skema yang tersedia atau sesuai dengan filter Anda</p>
            <Link
              to="/skema/create"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Tambah Skema Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skema
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dana
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proposal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {skemas.map((skema) => (
                  <tr key={skema.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{skema.nama}</div>
                        <div className="text-sm text-gray-500">Kode: {skema.kode}</div>
                        <div className="text-sm text-gray-500">Tahun: {skema.tahun_aktif}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getKategoriLabel(skema.kategori)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {skema.dana_min && skema.dana_max ? (
                          <>
                            <div>{formatCurrency(skema.dana_min)}</div>
                            <div className="text-gray-500">s/d {formatCurrency(skema.dana_max)}</div>
                          </>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>Buka: {formatDate(skema.tanggal_buka)}</div>
                        <div>Tutup: {formatDate(skema.tanggal_tutup)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={skema.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">Total: {skema.totalProposal || 0}</div>
                        <div className="text-green-600">Disetujui: {skema.approvedProposal || 0}</div>
                        <div className="text-orange-600">Aktif: {skema.activeProposal || 0}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/skema/${skema.id}`}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Detail
                        </Link>
                        <Link
                          to={`/skema/${skema.id}/edit`}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(skema.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination 
          currentPage={filters.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
          hasPrev={pagination.hasPrev}
          hasNext={pagination.hasNext}
        />
      )}
    </div>
  );
};

export default SkemaIndex;