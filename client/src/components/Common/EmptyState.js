import React from 'react';

const EmptyState = ({ message = "Tidak ada data yang tersedia" }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
