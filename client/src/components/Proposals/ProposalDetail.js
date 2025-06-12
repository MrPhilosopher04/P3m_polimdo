// client/src/components/Proposals/ProposalDetail.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProposalStatus from './ProposalStatus';
import proposalService from '../../services/proposalService';
import { useAuth } from '../../hooks/useAuth';

const ProposalDetail = ({ proposal, onStatusUpdate, onSubmit, onDelete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: proposal.status,
    komentar: ''
  });

  const formatCurrency = (amount) => {
    if (!amount) return 'Tidak disebutkan';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = () => {
    return user.role === 'ADMIN' || 
           proposal.ketuaId === user.id || 
           proposal.members?.some(m => m.userId === user.id);
  };

  const canDelete = () => {
    return user.role === 'ADMIN' || 
           (proposal.ketuaId === user.id && !['APPROVED', 'REJECTED'].includes(proposal.status));
  };

  const canUpdateStatus = () => {
    return user.role === 'ADMIN' || 
           (user.role === 'REVIEWER' && proposal.reviewerId === user.id);
  };

  const canSubmit = () => {
    return proposal.status === 'DRAFT' && canEdit();
  };

  const handleSubmit = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mengajukan proposal ini?')) {
      return;
    }

    setLoading(true);
    const result = await proposalService.submitProposal(proposal.id);
    
    if (result.success) {
      onSubmit && onSubmit(result.data);
    } else {
      alert(result.error);
    }
    
    setLoading(false);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await proposalService.updateProposalStatus(proposal.id, statusForm);
    
    if (result.success) {
      onStatusUpdate && onStatusUpdate(result.data);
      setShowStatusForm(false);
    } else {
      alert(result.error);
    }
    
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus proposal ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    setLoading(true);
    const result = await proposalService.deleteProposal(proposal.id);
    
    if (result.success) {
      onDelete && onDelete();
    } else {
      alert(result.error);
    }
    
    setLoading(false);
  };

  const statusOptions = [
    { value: 'SUBMITTED', label: 'Diajukan' },
    { value: 'REVIEW', label: 'Sedang Direview' },
    { value: 'APPROVED', label: 'Disetujui' },
    { value: 'REJECTED', label: 'Ditolak' },
    { value: 'REVISION', label: 'Perlu Revisi' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {proposal.judul}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Skema: <strong>{proposal.skema?.nama}</strong></span>
              <span>Tahun: <strong>{proposal.tahun}</strong></span>
              <ProposalStatus status={proposal.status} size="lg" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {canEdit() && proposal.status === 'DRAFT' && (
            <Link
              to={`/proposals/${proposal.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Proposal
            </Link>
          )}
          
          {canSubmit() && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Mengajukan...' : 'Ajukan Proposal'}
            </button>
          )}

          {canUpdateStatus() && (
            <button
              onClick={() => setShowStatusForm(!showStatusForm)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Update Status
            </button>
          )}

          {canDelete() && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Menghapus...' : 'Hapus'}
            </button>
          )}
        </div>
      </div>

      {/* Status Update Form */}
      {showStatusForm && canUpdateStatus() && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Update Status Proposal</h3>
          <form onSubmit={handleStatusUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Baru
              </label>
              <select
                value={statusForm.status}
                onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Komentar (Opsional)
              </label>
              <textarea
                rows={4}
                value={statusForm.komentar}
                onChange={(e) => setStatusForm(prev => ({ ...prev, komentar: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Berikan komentar atau catatan..."
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Update Status'}
              </button>
              <button
                type="button"
                onClick={() => setShowStatusForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Abstrak */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Abstrak</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {proposal.abstrak || 'Tidak ada abstrak'}
            </p>
          </div>

          {/* Kata Kunci */}
          {proposal.kata_kunci && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kata Kunci</h2>
              <div className="flex flex-wrap gap-2">
                {proposal.kata_kunci.split(',').map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Komentar Reviewer */}
          {proposal.komentar_reviewer && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-4">Komentar Reviewer</h2>
              <p className="text-yellow-700 leading-relaxed">
                {proposal.komentar_reviewer}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Ketua:</span>
                <p className="font-medium">{proposal.ketua?.nama}</p>
                <p className="text-gray-600">{proposal.ketua?.email}</p>
              </div>
              
              <div>
                <span className="text-gray-500">Dana Diusulkan:</span>
                <p className="font-medium">{formatCurrency(proposal.dana_diusulkan)}</p>
              </div>
              
              {proposal.reviewer && (
                <div>
                  <span className="text-gray-500">Reviewer:</span>
                  <p className="font-medium">{proposal.reviewer.nama}</p>
                </div>
              )}
            </div>
          </div>

          {/* Anggota Tim */}
          {proposal.members && proposal.members.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Anggota Tim ({proposal.members.length})
              </h2>
              <div className="space-y-2">
                {proposal.members.map(member => (
                  <div key={member.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{member.user.nama}</p>
                      <p className="text-xs text-gray-600">{member.user.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      member.peran === 'KETUA' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.peran}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Dibuat:</span>
                <p className="font-medium">{formatDate(proposal.createdAt)}</p>
              </div>
              
              {proposal.tanggal_submit && (
                <div>
                  <span className="text-gray-500">Diajukan:</span>
                  <p className="font-medium">{formatDate(proposal.tanggal_submit)}</p>
                </div>
              )}
              
              {proposal.tanggal_review && (
                <div>
                  <span className="text-gray-500">Direview:</span>
                  <p className="font-medium">{formatDate(proposal.tanggal_review)}</p>
                </div>
              )}
              
              <div>
                <span className="text-gray-500">Diperbarui:</span>
                <p className="font-medium">{formatDate(proposal.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {proposal.documents && proposal.documents.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Dokumen ({proposal.documents.length})
              </h2>
              <div className="space-y-2">
                {proposal.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{doc.nama}</p>
                      <p className="text-xs text-gray-600">{doc.tipe}</p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;