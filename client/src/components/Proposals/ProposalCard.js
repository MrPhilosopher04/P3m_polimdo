import React from 'react';
import { Link } from 'react-router-dom';

const ProposalCard = ({ proposal, userRole, onUpdate }) => {
  const getStatusBadge = (status) => {
    const badges = {
      draft: { text: 'Draft', class: 'badge-draft' },
      submitted: { text: 'Diajukan', class: 'badge-submitted' },
      approved: { text: 'Disetujui', class: 'badge-approved' },
      rejected: { text: 'Ditolak', class: 'badge-rejected' }
    };
    return badges[status] || badges.draft;
  };

  const badge = getStatusBadge(proposal.status);

  return (
    <div className="proposal-card">
      <div className="card-header">
        <h3>{proposal.title}</h3>
        <span className={`status-badge ${badge.class}`}>
          {badge.text}
        </span>
      </div>
      
      <div className="card-body">
        <p className="proposal-description">
          {proposal.description?.substring(0, 100)}...
        </p>
        
       <div className="proposal-meta">
  <span>
    <span role="img" aria-label="tanggal">📅</span> {new Date(proposal.createdAt).toLocaleDateString('id-ID')}
  </span>
  <span>
    <span role="img" aria-label="pengguna">👤</span> {proposal.user?.name}
  </span>
  <span>
    <span role="img" aria-label="skema">📋</span> {proposal.skema?.name}
  </span>
</div>

      </div>
      
      <div className="card-actions">
        <Link 
          to={`/proposals/${proposal.id}`} 
          className="btn btn-primary"
        >
          Lihat Detail
        </Link>
        
        {(userRole === 'admin' || proposal.userId === proposal.currentUserId) && (
          <Link 
            to={`/proposals/${proposal.id}/edit`} 
            className="btn btn-secondary"
          >
            Edit
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;