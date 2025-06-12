// src/pages/Error403.js
import React from 'react';

const Error403 = () => (
  <div className="flex justify-center items-center min-h-screen text-center px-4">
    <div>
      <h1 className="text-4xl font-bold text-red-600">403</h1>
      <p className="text-xl font-medium text-gray-700 mb-2">Akses Ditolak</p>
      <p className="text-gray-600">Anda tidak memiliki izin untuk melihat halaman ini.</p>
      <a href="/" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Kembali ke Beranda
      </a>
    </div>
  </div>
);

export default Error403;
