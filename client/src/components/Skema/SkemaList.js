// client/src/components/Skema/SkemaList.js
import React, { useState, useEffect } from 'react';
import SkemaCard from './SkemaCard';
import Loading from '../Common/Loading';
import SearchBar from '../Common/SearchBar';
import Pagination from '../Common/Pagination';
import skemaService from '../../services/skemaService';

const SkemaList = ({ 
  showActions = true, 
  onEdit, 
  onDelete, 
  filters: externalFilters = {},
  showFilters = true 
}) => {
  const [skemas, setSkemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Local filters
  const [filters, setFilters] = useState({
    search: '',
    kategori: 'Semua Kategori',
    status: 'Semua Status',
    tahun_aktif: '',
    ...externalFilters
  });

  const kategoriOptions = [
    'Semua Kategori',
    'Penelitian',
    'Pengabdian',
    'Hibah'
  ];

  const statusOptions = [
    'Semua Status',
    'AKTIF',
    'NONAKTIF'
  ];

  // Generate tahun options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const tahunOptions = [''].concat(
    Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString())
  );

  const fetchSkemas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryFilters = {
        ...filters,
        ...externalFilters,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await skemaService.getAllSkema(queryFilters);
      
      if (response.success) {
        setSkemas(response.data.items || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.pages || 0
        }));
      } else {
        setError(response.message || 'Gagal memuat data skema');
      }
    } catch (error) {
      console.error('Error fetching skemas:', error);
      setError('Terjadi kesalahan saat memuat data skema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkemas();
  }, [pagination.page, filters, externalFilters]);

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleEdit = (skema) => {
    if (onEdit) {
      onEdit(skema);
    }
  };

  const handleDelete = async (skema) => {
    if (onDelete) {
      const success = await onDelete(skema);
      if (success) {
        fetchSkemas(); // Refresh data after delete
      }
    }
  };

  if (loading && skemas.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <SearchBar
                placeholder="Cari nama atau kode skema..."
                onSearch={handleSearch}
                value={filters.search}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={filters.kategori}
                onChange={(e) => handleFilterChange('kategori', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {kategoriOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun Aktif
              </label>
              <select
                value={filters.tahun_aktif}
                onChange={(e) => handleFilterChange('tahun_aktif', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Tahun</option>
                {tahunOptions.slice(1).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Menampilkan {skemas.length} dari {pagination.total} skema
        </div>
        {loading && (
          <div className="text-sm text-blue-600">Memuat...</div>
        )}
      </div>

      {/* Skema Grid */}
      {skemas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skemas.map(skema => (
            <SkemaCard
              key={skema.id}
              skema={skema}
              showActions={showActions}
              onEdit={showActions ? handleEdit : undefined}
              onDelete={showActions ? handleDelete : undefined}
            />
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Tidak ada skema ditemukan</div>
          <div className="text-gray-400 text-sm">
            Coba ubah filter pencarian atau tambah skema baru
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            showPageNumbers={5}
          />
        </div>
      )}
    </div>
  );
};

export default SkemaList;