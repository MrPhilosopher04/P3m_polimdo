//client/src/components/Dashboard/ProposalStatusCard.js
import React from 'react';

const ProposalStatusCard = ({ proposal }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      'DRAFT': {
        color: 'bg-gray-100 text-gray-800',
        text: 'Draft'
      },
      'SUBMITTED': {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Submitted'
      },
      'REVIEW': {
        color: 'bg-blue-100 text-blue-800',
        text: 'In Review'
      },
      'APPROVED': {
        color: 'bg-green-100 text-green-800',
        text: 'Approved'
      },
      'REJECTED': {
        color: 'bg-red-100 text-red-800',
        text: 'Rejected'
      },
      'REVISION': {
        color: 'bg-orange-100 text-orange-800',
        text: 'Revision'
      }
    };

    const config = statusConfig[status] || statusConfig['DRAFT'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
            {proposal.judul || 'Untitled Proposal'}
          </h4>
          <p className="text-xs text-gray-500">
            {proposal.skema?.nama || 'No Schema'}
          </p>
        </div>
        <div className="ml-3">
          {getStatusBadge(proposal.status)}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Dibuat: {formatDate(proposal.createdAt)}
        </span>
        {proposal.updatedAt && proposal.updatedAt !== proposal.createdAt && (
          <span>
            Update: {formatDate(proposal.updatedAt)}
          </span>
        )}
      </div>
      
      {proposal.catatan && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <strong>Catatan:</strong> {proposal.catatan}
        </div>
      )}
    </div>
  );
};

export default ProposalStatusCard;