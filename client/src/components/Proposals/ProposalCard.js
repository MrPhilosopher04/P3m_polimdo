// client/src/components/Proposals/ProposalCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProposalStatus from './ProposalStatus';
import proposalService from '../../services/proposalService';

const ProposalCard = ({ proposal, onDelete, onStatusChange, canEdit, canDelete }) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proposal ini?')) {
      onDelete(proposal.id);
    }
  };

  const handleSubmit = async () => {
    if (proposal.status !== 'DRAFT' || loadingSubmit) return;
    if (!window.confirm('Ajukan proposal ini?')) return;

    try {
      setLoadingSubmit(true);
      const result = await proposalService.submitProposal(proposal.id);
      if (result.success) {
        onStatusChange(proposal.id, 'SUBMITTED');
      } else {
        alert(result.error || 'Gagal mengajukan proposal');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat mengajukan proposal');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link 
            to={`/proposals/${proposal.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
          >
            {proposal.judul}
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            {proposal.skema?.nama || 'Skema tidak tersedia'}
          </p>
        </div>
        <ProposalStatus status={proposal.status} />
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm line-clamp-3">
          {proposal.abstrak || 'Tidak ada abstrak'}
        </p>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Ketua:</span>
          <p className="font-medium">{proposal.ketua?.nama || 'Tidak tersedia'}</p>
        </div>
        <div>
          <span className="text-gray-500">Tahun:</span>
          <p className="font-medium">{proposal.tahun}</p>
        </div>
        <div>
          <span className="text-gray-500">Dana Diusulkan:</span>
          <p className="font-medium">{formatCurrency(proposal.dana_diusulkan)}</p>
        </div>
        <div>
          <span className="text-gray-500">Anggota:</span>
          <p className="font-medium">{proposal._count?.members || 0} orang</p>
        </div>
      </div>

      {/* Keywords */}
      {proposal.kata_kunci && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {proposal.kata_kunci.split(',').slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {keyword.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Dibuat: {formatDate(proposal.createdAt)}
        </span>
        
        <div className="flex gap-2">
          <Link
            to={`/proposals/${proposal.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Detail
          </Link>
          
          {canEdit && (
            <Link
              to={`/proposals/${proposal.id}/edit`}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Edit
            </Link>
          )}
          
          {canDelete && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Hapus
            </button>
          )}

          {proposal.status === 'DRAFT' && canEdit && (
            <button
              onClick={handleSubmit}
              disabled={loadingSubmit}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium disabled:opacity-50"
            >
              {loadingSubmit ? 'Mengajukan...' : 'Ajukan'}
            </button>
          )}
        </div>
      </div>

      {proposal.reviewer && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Reviewer: <span className="font-medium">{proposal.reviewer.nama}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProposalCard;
