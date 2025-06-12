//client/src/components/Skema/SkemaDetail.js
import React from 'react';

const SkemaDetail = ({ skema, onBack }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ← Kembali
      </button>

      <h2 className="text-2xl font-bold mb-2">{skema.nama}</h2>
      <p className="text-sm text-gray-600 mb-4">
        Kategori: <span className="font-semibold">{skema.kategori}</span>
      </p>

      <div className="mb-4">
        <h3 className="font-semibold mb-1">Deskripsi:</h3>
        <p>{skema.deskripsi || '-'}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-1">Status:</h3>
        <p className={skema.status === 'AKTIF' ? 'text-green-600' : 'text-red-600'}>
          {skema.status}
        </p>
      </div>

      {/* Tambahkan detail lain sesuai data skema yang tersedia */}
      {skema.tanggalMulai && (
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Tanggal Mulai:</h3>
          <p>{new Date(skema.tanggalMulai).toLocaleDateString()}</p>
        </div>
      )}

      {skema.tanggalSelesai && (
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Tanggal Selesai:</h3>
          <p>{new Date(skema.tanggalSelesai).toLocaleDateString()}</p>
        </div>
      )}

      {/* Kamu bisa tambahkan bagian lain seperti dokumen, link, dll */}
    </div>
  );
};

export default SkemaDetail;
