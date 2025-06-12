// src/pages/Skema/Edit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import skemaService from '../../services/skemaService';
import SkemaForm from '../../components/Skema/SkemaForm';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Common/Loading';

const SkemaEdit = () => {
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

  const handleSubmit = async (skemaData) => {
    try {
      setLoading(true);
      const response = await skemaService.updateSkema(id, skemaData);
      
      if (response.success) {
        showToast('success', 'Skema berhasil diperbarui');
        navigate(`/skema/${id}`);
      } else {
        setError(response.message || 'Gagal memperbarui skema');
        showToast('error', response.message || 'Gagal memperbarui skema');
      }
    } catch (err) {
      console.error('Error updating skema:', err);
      setError('Terjadi kesalahan saat memperbarui skema');
      showToast('error', 'Terjadi kesalahan saat memperbarui skema');
    } finally {
      setLoading(false);
    }
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Skema</h1>
        <p className="text-gray-600">Memperbarui data skema {skema.nama}</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <SkemaForm skema={skema} onSubmit={handleSubmit} />
    </div>
  );
};

export default SkemaEdit;