//client/src/components/Dashboard/RecentProposals.js
import React from 'react';
import StatusBadge from '../Common/StatusBadge';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentProposals = ({ proposals }) => {
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    if (id) navigate(`/proposals/${id}`);
  };

  const isEmpty = !Array.isArray(proposals) || proposals.length === 0;

  if (isEmpty) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Proposal Terbaru</h2>
        <div className="text-center py-8 text-gray-500" role="status" aria-live="polite">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" aria-hidden="true" />
          <p>Tidak ada proposal terbaru</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Proposal Terbaru</h2>
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => navigate('/proposals')}
          type="button"
          aria-label="Lihat semua proposal"
        >
          Lihat Semua
        </button>
      </div>

      <div className="space-y-3">
        {proposals.map((proposal) => {
          const {
            id = null,
            title = '-',
            author,
            skema,
            value = '-',
            status = 'UNKNOWN'
          } = proposal || {};

          const authorName =
            typeof author === 'object' && author?.name
              ? author.name
              : typeof author === 'string'
              ? author
              : '-';

          const skemaName = skema?.name || value || '-';

          return (
            <div
              key={id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => handleNavigate(id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleNavigate(id);
              }}
              aria-label={`Lihat detail proposal: ${title}`}
            >
              <div>
                <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
                <p className="text-xs text-gray-500">{authorName}</p>
              </div>
              <div className="text-right min-w-[100px]">
                <p className="text-sm font-medium">{skemaName}</p>
                <StatusBadge status={status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentProposals;
