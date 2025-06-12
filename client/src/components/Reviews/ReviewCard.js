// client/src/components/Reviews/ReviewCard.js
import React from 'react';

const ReviewCard = ({ review, onViewDetail }) => {
  const getStatusColor = (status) => {
    const colors = {
      REVIEW: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      REVISION: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRekomendasi = (rekomendasi) => {
    const config = {
      LAYAK: { color: 'text-green-600', label: 'Layak' },
      TIDAK_LAYAK: { color: 'text-red-600', label: 'Tidak Layak' },
      REVISI: { color: 'text-orange-600', label: 'Revisi' }
    };
    return config[rekomendasi] || { color: 'text-gray-600', label: rekomendasi };
  };

  const rekom = getRekomendasi(review.rekomendasi);

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm mb-1">
            {review.proposal.judul}
          </h3>
          <p className="text-xs text-gray-500">
            {review.proposal.skema.nama}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(review.proposal.status)}`}>
          {review.proposal.status}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Ketua:</span>
          <span className="text-gray-900">{review.proposal.ketua.nama}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Reviewer:</span>
          <span className="text-gray-900">{review.reviewer.nama}</span>
        </div>

        {review.skor_total && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Skor:</span>
            <span className="text-gray-900 font-medium">{review.skor_total}</span>
          </div>
        )}

        {review.rekomendasi && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Rekomendasi:</span>
            <span className={`font-medium ${rekom.color}`}>{rekom.label}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 border-t">
        <span className="text-xs text-gray-500">
          {new Date(review.tanggal_review).toLocaleDateString('id-ID')}
        </span>
        
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(review)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Detail
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;