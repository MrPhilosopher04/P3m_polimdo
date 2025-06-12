// components/Dashboard/RecentItems.js
import React from 'react';
import StatusBadge from '../Common/StatusBadge';

const RecentItems = ({ items = [], onViewAll, title = "Item Terbaru" }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'LAYAK': 'green',
      'TIDAK_LAYAK': 'red',
      'REVISI': 'yellow',
      'PENDING': 'yellow',
      'SUBMITTED': 'blue',
      'APPROVED': 'green',
      'REJECTED': 'red',
      'REVIEW': 'blue'
    };
    return statusMap[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'LAYAK': 'Layak',
      'TIDAK_LAYAK': 'Tidak Layak',
      'REVISI': 'Perlu Revisi',
      'PENDING': 'Pending',
      'SUBMITTED': 'Diajukan',
      'APPROVED': 'Disetujui',
      'REJECTED': 'Ditolak',
      'REVIEW': 'Sedang Review'
    };
    return statusMap[status] || status;
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-3">📋</div>
        <p className="text-gray-500 text-sm">Tidak ada data tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
          key={item.id || index}
          className={`border border-gray-200 rounded-lg p-4 ${item.onClick ? 'hover:bg-gray-50 cursor-pointer' : ''} transition-colors`}
          onClick={item.onClick}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                {item.title || 'Tidak ada judul'}
              </h4>
              
              {item.subtitle && (
                <p className="text-xs text-gray-600 mb-2">
                  {item.subtitle}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {item.date && (
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0 118 0z" />
                    </svg>
                    {formatDate(item.date)}
                  </span>
                )}
                
                {item.meta && (
                  <span>{item.meta}</span>
                )}
              </div>
            </div>
            
            {item.status && (
              <div className="flex-shrink-0 ml-3">
                <StatusBadge 
                  status={item.status}
                  label={getStatusLabel(item.status)}
                  color={getStatusColor(item.status)}
                />
              </div>
            )}
          </div>
          
          {item.description && (
            <p className="text-xs text-gray-600 mt-2 line-clamp-2">
              {item.description}
            </p>
          )}
          
          {item.progress !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, item.progress || 0))}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {onViewAll && (
        <div className="text-center pt-4">
          <button
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Lihat Semua →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentItems;