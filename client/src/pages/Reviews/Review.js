import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import reviewService from '../../services/reviewService';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/Common/Loading';

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    skor_total: '',
    catatan: '',
    rekomendasi: 'LAYAK'
  });

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getReviewById(id);
      setReview(response.data);
      
      // Populate form if review exists
      if (response.data) {
        setFormData({
          skor_total: response.data.skor_total || '',
          catatan: response.data.catatan || '',
          rekomendasi: response.data.rekomendasi || 'LAYAK'
        });
      }
    } catch (err) {
      setError(err.message || 'Error fetching review');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await reviewService.updateReview(id, formData);
      alert('Review berhasil disimpan');
      navigate('/reviews');
    } catch (err) {
      alert(err.message || 'Error saving review');
    } finally {
      setSaving(false);
    }
  };

  const canEdit = () => {
    return user.role === 'ADMIN' || 
           (user.role === 'REVIEWER' && review?.reviewerId === user.id);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/reviews')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Kembali ke Reviews
          </button>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">Review not found</div>
          <button
            onClick={() => navigate('/reviews')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Kembali ke Reviews
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Proposal</h1>
          <p className="text-gray-600">Detail dan form review proposal</p>
        </div>
        <button
          onClick={() => navigate('/reviews')}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Kembali
        </button>
      </div>

      {/* Proposal Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Informasi Proposal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Judul</label>
            <p className="mt-1 text-sm text-gray-900">{review.proposal.judul}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ketua</label>
            <p className="mt-1 text-sm text-gray-900">{review.proposal.ketua.nama}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Skema</label>
            <p className="mt-1 text-sm text-gray-900">{review.proposal.skema.nama}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reviewer</label>
            <p className="mt-1 text-sm text-gray-900">{review.reviewer?.nama || 'Belum ditugaskan'}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Abstrak</label>
          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
            {review.proposal.abstrak}
          </p>
        </div>
      </div>

      {/* Review Form */}
      {canEdit() && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Form Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skor Total (1-5)
              </label>
              <input
                type="number"
                name="skor_total"
                min="1"
                max="5"
                step="0.1"
                value={formData.skor_total}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rekomendasi
              </label>
              <select
                name="rekomendasi"
                value={formData.rekomendasi}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="LAYAK">Layak</option>
                <option value="TIDAK_LAYAK">Tidak Layak</option>
                <option value="REVISI">Perlu Revisi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Review
              </label>
              <textarea
                name="catatan"
                rows="6"
                value={formData.catatan}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Berikan catatan dan saran untuk proposal ini..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/reviews')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review Result (Read Only) */}
      {!canEdit() && review.skor_total && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Hasil Review</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Skor Total</label>
              <p className="mt-1 text-sm text-gray-900">{review.skor_total}/5</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rekomendasi</label>
              <p className="mt-1 text-sm text-gray-900">{review.rekomendasi}</p>
            </div>
          </div>
          
          {review.catatan && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Catatan</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                {review.catatan}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewPage;