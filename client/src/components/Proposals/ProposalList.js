//client/src/components/Proposals/ProposalList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProposalCard from './ProposalCard';
import Loading from '../Common/Loading';
import Pagination from '../Common/Pagination';
import SearchBar from '../Common/SearchBar';
import proposalService from '../../services/proposalService';
import skemaService from '../../services/skemaService';
import { useAuth } from '../../hooks/useAuth';

const ProposalList = () => {
  const { user } = useAuth();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skemas, setSkemas] = useState([]);

  const [filters, setFilters] = useState({
    status: '',
    skema: '',
    search: '',
    page: 1,
    limit: 12,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadProposals();
    loadSkemas();
  }, [filters]);

  const loadProposals = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await proposalService.getProposals(filters);
      if (result.success) {
        setProposals(result.data.proposals || []);
        setPagination(result.data.pagination || {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0,
        });
      } else {
        setError(result.error || 'Gagal memuat proposal');
        setProposals([]);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat proposal');
      setProposals([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSkemas = async () => {
    try {
      const result = await skemaService.getAllSkema();
      const skemaList = result?.data?.items;
      if (Array.isArray(skemaList)) {
        setSkemas(skemaList);
      } else {
        console.error('Format data skemas tidak valid:', result);
        setSkemas([]);
      }
    } catch (err) {
      console.error('Gagal memuat skema:', err);
      setSkemas([]);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange('search', searchTerm);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDelete = async (proposalId) => {
    try {
      const result = await proposalService.deleteProposal(proposalId);
      if (result.success) {
        loadProposals();
      } else {
        alert(result.error || 'Gagal menghapus proposal');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus proposal');
      console.error(err);
    }
  };

    const handleStatusChange = (id, newStatus) => {
    setProposals(prev =>
      prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

 const canEdit = proposal => {
    return (
      user.role === 'ADMIN' ||
      (user.role === 'MAHASISWA' && proposal.ketuaId === user.id) ||
      (user.role === 'DOSEN' && (
        proposal.ketuaId === user.id ||
        proposal.members?.some(m => m.userId === user.id)
      ))
    );
  };

  const canDelete = (proposal) => {
    return (
      user.role === 'ADMIN' ||
      (proposal.ketuaId === user.id && !['APPROVED', 'REJECTED'].includes(proposal.status))
    );
  };

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Diajukan' },
    { value: 'REVIEW', label: 'Sedang Direview' },
    { value: 'APPROVED', label: 'Disetujui' },
    { value: 'REJECTED', label: 'Ditolak' },
    { value: 'REVISION', label: 'Perlu Revisi' },
  ];

  if (loading && proposals.length === 0) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proposal Penelitian</h1>
          <p className="text-gray-600">Kelola dan pantau proposal penelitian Anda</p>
        </div>
        {['DOSEN', 'MAHASISWA', 'ADMIN'].includes(user.role) && (
          <Link
            to="/proposals/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buat Proposal Baru
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
           <SearchBar
  placeholder="Cari proposal..."
  onChange={handleSearch}
  value={filters.search}
/>
          </div>

          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.skema}
            onChange={(e) => handleFilterChange('skema', e.target.value)}
          >
            <option value="">Semua Skema</option>
            {Array.isArray(skemas) &&
              skemas.map((skema) => (
                <option key={skema.id} value={skema.id}>
                  {skema.nama}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Info and Limits */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Menampilkan {proposals.length} dari {pagination.total} proposal
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Tampilkan:</label>
          <select
            className="px-2 py-1 border border-gray-300 rounded text-sm"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Proposal Grid */}
      {proposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onDelete={handleDelete}
               onStatusChange={handleStatusChange} 
              canEdit={canEdit(proposal)}
              canDelete={canDelete(proposal)}
              userRole={user.role}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada proposal ditemukan
          </h3>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.status || filters.skema
              ? 'Coba ubah filter pencarian Anda'
              : 'Belum ada proposal yang dibuat'}
          </p>
          {['DOSEN', 'MAHASISWA', 'ADMIN'].includes(user.role) && (
            <Link
              to="/proposals/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buat Proposal Pertama
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProposalList;
