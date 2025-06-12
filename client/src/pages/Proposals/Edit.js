// client/src/pages/Proposals/Edit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProposalForm from '../../components/Proposals/ProposalForm';
import Loading from '../../components/Common/Loading';
import proposalService from '../../services/proposalService';

const EditProposalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProposal();
  }, [id]);

  const loadProposal = async () => {
    const result = await proposalService.getProposalById(id);
    
    if (result.success) {
      // Check if proposal can be edited
      if (!['DRAFT', 'REVISION'].includes(result.data.status)) {
        setError('Proposal ini tidak dapat diedit karena sudah diajukan atau direview');
      } else {
        setProposal(result.data);
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
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

  return (
    <div className="container mx-auto px-4 py-6">
      <ProposalForm proposalId={id} initialData={proposal} />
    </div>
  );
};

export default EditProposalPage;