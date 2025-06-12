// src/pages/Skema/Detail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import skemaService from '../../services/skemaService';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Common/Loading';
import StatusBadge from '../../components/Common/StatusBadge';

const SkemaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [skema, setSkema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkema = async () => {
      try {
        setLoading(true);
        const response = await skemaService.getSkemaById(id);
        
        if (response.success) {
          setSkema(response.data);
        } else {
          setError(response.message || 'Gagal memuat data skema');
          showToast('error', response.message || 'Gagal memuat data skema');
        }
      } catch (err) {
        console.error('Error fetching skema:', err);
        setError('Terjadi kesalahan saat memuat data skema');
        showToast('error', 'Terjadi kesalahan saat memuat data skema');
      } finally {
        setLoading(false);
      }
    };

    fetchSkema();
  }, [id, showToast]);

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus skema ini?')) {
      try {
        setLoading(true);
        const response = await skemaService.deleteSkema(id);
        
        if (response.success) {
          showToast('success', 'Skema berhasil dihapus');
          navigate('/skema');
        } else {
          setError(response.message || 'Gagal menghapus skema');
          showToast('error', response.message || 'Gagal menghapus skema');
        }
      } catch (err) {
        console.error('Error deleting skema:', err);
        setError('Terjadi kesalahan saat menghapus skema');
        showToast('error', 'Terjadi kesalahan saat menghapus skema');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getKategoriLabel = (kategori) => {
    const labels = {
      PENELITIAN: 'Penelitian',
      PENGABDIAN: 'Pengabdian',
      HIBAH_INTERNAL: 'Hibah Internal',
      HIBAH_EKSTERNAL: 'Hibah Eksternal'
    };
    return labels[kategori] || kategori;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-red-800 underline hover:no-underline"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  if (!skema) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Skema tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Skema</h1>
          <p className="text-gray-600">Kode: {skema.kode}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/skema/${id}/edit`)}

            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Hapus
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Umum</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nama Skema</dt>
                  <dd className="mt-1 text-sm text-gray-900">{skema.nama}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Kategori</dt>
                  <dd className="mt-1 text-sm text-gray-900">{getKategoriLabel(skema.kategori)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tahun Aktif</dt>
                  <dd className="mt-1 text-sm text-gray-900">{skema.tahun_aktif}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <StatusBadge status={skema.status} />
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detail Pendanaan</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dana Minimum</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatCurrency(skema.dana_min)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dana Maksimum</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatCurrency(skema.dana_max)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Batas Anggota</dt>
                  <dd className="mt-1 text-sm text-gray-900">{skema.batas_anggota} orang</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Periode</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Tanggal Buka</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(skema.tanggal_buka)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tanggal Tutup</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(skema.tanggal_tutup)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Luaran Wajib</h2>
            <p className="text-sm text-gray-900">{skema.luaran_wajib || '-'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/skema')}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Kembali ke Daftar Skema
        </button>
      </div>
    </div>
  );
};

export default SkemaDetail;