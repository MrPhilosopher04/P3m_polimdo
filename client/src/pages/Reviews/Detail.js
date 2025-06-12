//client/src/pages/Reviews/Detail.js
// client/src/pages/Reviews/Detail.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReviewById } from '../../services/reviewService';
import Loading from '../../components/Common/Loading';
import StatusBadge from '../../components/Common/StatusBadge';
import { Button } from '@/components/ui/button';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const data = await getReviewById(id);
        setReview(data);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat detail review.');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!review) return <p>Data review tidak ditemukan.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Detail Review</h1>

      <div className="space-y-4">
        <div>
          <h2 className="font-medium">Judul Proposal:</h2>
          <p>{review.proposalTitle}</p>
        </div>

        <div>
          <h2 className="font-medium">Reviewer:</h2>
          <p>{review.reviewer?.name}</p>
        </div>

        <div>
          <h2 className="font-medium">Komentar:</h2>
          <p>{review.comment}</p>
        </div>

        <div>
          <h2 className="font-medium">Nilai:</h2>
          <p>{review.score}</p>
        </div>

        <div>
          <h2 className="font-medium">Status:</h2>
          <StatusBadge status={review.status} />
        </div>

        {review.fileUrl && (
          <div>
            <h2 className="font-medium">File Review:</h2>
            <a
              href={review.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Lihat Dokumen
            </a>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button onClick={() => navigate(-1)}>Kembali</Button>
      </div>
    </div>
  );
};

export default ReviewDetail;
