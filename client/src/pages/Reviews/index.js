import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import ReviewList from '../../components/Reviews/ReviewList';

const ReviewsPage = () => {
  const { user } = useAuth();

  // Check if user has permission to access reviews
 const hasPermission = user && ['ADMIN', 'REVIEWER', 'DOSEN', 'MAHASISWA'].includes(user.role);

  if (!hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Akses Ditolak</h3>
          <p className="mt-1 text-sm text-gray-500">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReviewList />
      </div>
    </div>
  );
};

export default ReviewsPage;