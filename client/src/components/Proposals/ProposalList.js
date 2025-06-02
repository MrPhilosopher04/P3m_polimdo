import React, { useState, useEffect, useCallback } from 'react';
import { proposalService } from '../../services/proposalService';
import ProposalCard from './ProposalCard';

const ProposalList = ({ userRole }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true); // pindahkan ke atas supaya loading ulang saat filter berubah
      const data = await proposalService.getAll({ status: filter !== 'all' ? filter : undefined });
      setProposals(data.proposals || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]); // 🟡 sekarang dependensinya jelas dan aman

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]); // ✅ sudah tidak warning

  if (loading) return <div className="loading">Loading proposals...</div>;

  return (
    <div className="proposal-list">
      <div className="list-header">
        <h2>Daftar Proposal</h2>
        <div className="filter-section">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Semua</option>
            <option value="draft">Draft</option>
            <option value="submitted">Diajukan</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </div>

      <div className="proposals-grid">
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              userRole={userRole}
              onUpdate={fetchProposals}
            />
          ))
        ) : (
          <div className="no-data">Tidak ada proposal ditemukan</div>
        )}
      </div>
    </div>
  );
};

export default ProposalList;
