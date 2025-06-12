// pages/Dashboard/ReviewerDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import reviewService from '../../services/reviewService';
import StatsCard from '../../components/Dashboard/StatsCard';
import RecentItems from '../../components/Dashboard/RecentItems';
import Loading from '../../components/Common/Loading';
import StatusBadge from '../../components/Common/StatusBadge';

const ReviewerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myReviews: 0,
    pendingReviews: 0,
    completedReviews: 0,
    totalAssignments: 0
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage or context
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userInfo);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard stats
      const statsResponse = await dashboardService.getDashboardStats();
      
      if (statsResponse.success) {
        setStats({
          myReviews: statsResponse.data.myReviews || 0,
          pendingReviews: statsResponse.data.pendingReviews || 0,
          completedReviews: statsResponse.data.completedReviews || 0,
          totalAssignments: (statsResponse.data.myReviews || 0) + (statsResponse.data.pendingReviews || 0)
        });
      }

      // Fetch recent reviews
      const reviewsResponse = await dashboardService.getRecentReviews(5);
      if (reviewsResponse.success) {
        setRecentReviews(reviewsResponse.data);
      }

      // Fetch announcements
      const announcementsResponse = await dashboardService.getAnnouncements(3);
      if (announcementsResponse.success) {
        setAnnouncements(announcementsResponse.data);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReview = (reviewId) => {
    navigate(`/reviews/${reviewId}`);
  };

  const handleViewAllReviews = () => {
    navigate('/reviews');
  };

  // Stats configuration for reviewer
  const statsConfig = [
    {
      title: 'Total Penugasan',
      value: stats.totalAssignments,
      color: 'blue',
      icon: '📋'
    },
    {
      title: 'Review Pending',
      value: stats.pendingReviews,
      color: 'yellow',
      icon: '⏳'
    },
    {
      title: 'Review Selesai',
      value: stats.completedReviews,
      color: 'green',
      icon: '✅'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Dashboard Reviewer
                </h1>
                <p className="text-gray-600">
                  Selamat datang, {user?.nama || 'Reviewer'}! 
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <span className="text-blue-800 text-sm font-medium">
                    Status: Reviewer Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={fetchDashboardData}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsConfig.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              color={stat.color}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reviews Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Review Saya
                </h3>
                <button
                  onClick={handleViewAllReviews}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  Lihat Semua
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {recentReviews.length > 0 ? (
                <RecentItems
                  items={recentReviews.map(review => ({
                    id: review.id,
                    title: review.proposal?.judul || 'Judul Tidak Tersedia',
                    subtitle: `Peneliti: ${review.proposal?.ketua?.nama || 'Tidak Diketahui'}`,
                    date: review.tanggal_review,
                    status: review.rekomendasi,
                    onClick: () => handleViewReview(review.id)
                  }))}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada penugasan review
                  </h4>
                  <p className="text-gray-500">
                    Anda akan menerima notifikasi ketika ada penugasan baru
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Announcements Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Pengumuman Terbaru
              </h3>
            </div>
            
            <div className="p-6">
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <div 
                      key={announcement.id || index} 
                      className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg"
                    >
                      <h4 className="font-medium text-gray-900 mb-1">
                        {announcement.judul}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {announcement.konten}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      {announcement.status && (
                        <StatusBadge 
                          status={announcement.status}
                          className="mt-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📢</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada pengumuman
                  </h4>
                  <p className="text-gray-500">
                    Pengumuman terbaru akan muncul di sini
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips & Guidelines Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Panduan Review untuk Reviewer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-70 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📝</span>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Kualitas Review</h4>
                  <p className="text-sm text-gray-600">
                    Berikan penilaian yang objektif dan konstruktif sesuai dengan kriteria yang telah ditetapkan.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-70 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Tepat Waktu</h4>
                  <p className="text-sm text-gray-600">
                    Selesaikan review sesuai dengan tenggat waktu yang telah ditentukan.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-70 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Skor & Rekomendasi</h4>
                  <p className="text-sm text-gray-600">
                    Berikan skor yang sesuai dan rekomendasi yang jelas (Layak, Tidak Layak, atau Revisi).
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-70 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Catatan Konstruktif</h4>
                  <p className="text-sm text-gray-600">
                    Berikan catatan yang membantu peneliti untuk memperbaiki proposal mereka.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;