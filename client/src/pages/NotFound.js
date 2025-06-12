import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 text-center">
      <div className="max-w-md">
        <div className="text-7xl font-bold text-rose-600 mb-4">404</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-6">
          Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau mungkin dihapus.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Kembali ke Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Kembali ke Halaman Sebelumnya
          </button>
        </div>

        <div className="mt-8 text-6xl">🧐</div>
      </div>
    </div>
  );
};

export default NotFound;
