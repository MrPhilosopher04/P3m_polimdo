// client/src/pages/Proposals/Detail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import ProposalDetail from '../../components/Proposals/ProposalDetail';
import Loading from '../../components/Common/Loading';
import proposalService from '../../services/proposalService';

const ProposalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProposal();
    
    // Check if there's a submit action from URL params
    const action = searchParams.get('action');
    if (action === 'submit' && proposal && proposal.status === 'DRAFT') {
      handleAutoSubmit();
    }
  }, [id, searchParams]);

  const loadProposal = async () => {
    const result = await proposalService.getProposalById(id);
    
    if (result.success) {
      setProposal(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleAutoSubmit = async () => {
    if (window.confirm('Apakah Anda ingin mengajukan proposal ini sekarang?')) {
      const result = await proposalService.submitProposal(id);
      if (result.success) {
        setProposal(result.data);
        // Remove action param from URL
        navigate(`/proposals/${id}`, { replace: true });
      }
    } else {
      // Remove action param from URL
      navigate(`/proposals/${id}`, { replace: true });
    }
  };

  const handleStatusUpdate = (updatedProposal) => {
    setProposal(updatedProposal);
  };

  const handleSubmit = (updatedProposal) => {
    setProposal(updatedProposal);
  };

  const handleDelete = () => {
    navigate('/proposals');
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <h2 className="font-semibold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/proposals')}
              className="mt-3 text-red-600 hover:text-red-800 font-medium"
            >
              Kembali ke Daftar Proposal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Proposal tidak ditemukan
          </h2>
          <p className="text-gray-600 mb-4">
            Proposal yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <button
            onClick={() => navigate('/proposals')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Kembali ke Daftar Proposal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <button
              onClick={() => navigate('/proposals')}
              className="hover:text-blue-600"
            >
              Proposals
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate max-w-xs">
            {proposal.judul}
          </li>
        </ol>
      </nav>

      <ProposalDetail
        proposal={proposal}
        onStatusUpdate={handleStatusUpdate}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProposalDetailPage;