// client/src/components/Proposals/ProposalStatus.js
import React from 'react';

const ProposalStatus = ({ status, size = 'sm' }) => {
  const getStatusConfig = (status) => {
    const configs = {
      DRAFT: {
        label: 'Draft',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
      },
      SUBMITTED: {
        label: 'Diajukan',
        className: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      REVIEW: {
        label: 'Sedang Direview',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      APPROVED: {
        label: 'Disetujui',
        className: 'bg-green-100 text-green-800 border-green-200'
      },
      REJECTED: {
        label: 'Ditolak',
        className: 'bg-red-100 text-red-800 border-red-200'
      },
      REVISION: {
        label: 'Perlu Revisi',
        className: 'bg-orange-100 text-orange-800 border-orange-200'
      }
    };
    return configs[status] || configs.DRAFT;
  };

  const config = getStatusConfig(status);
  const sizeClass = size === 'lg' ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs';

  return (
    <span className={`inline-flex items-center ${sizeClass} font-medium rounded-full border ${config.className}`}>
      {config.label}
    </span>
  );
};

export default ProposalStatus;