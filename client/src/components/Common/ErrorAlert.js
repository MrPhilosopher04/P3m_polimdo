import React from 'react';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm max-w-xl mx-auto">
      <strong className="font-bold">Terjadi kesalahan!</strong>
      <span className="block sm:inline ml-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 inline-block text-blue-700 hover:underline font-medium"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
