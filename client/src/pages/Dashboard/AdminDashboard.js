import React, { useState, useEffect } from 'react';
import dashboardService from '../../services/dashboardService';
import StatsCard from '../../components/Dashboard/StatsCard';
import RecentItems from '../../components/Dashboard/RecentItems';
import Loading from '../../components/Common/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProposals, setRecentProposals] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load all dashboard data
      const [statsRes, proposalsRes, usersRes, announcementsRes] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentProposals(5),
        dashboardService.getRecentUsers(5),
        dashboardService.getAnnouncements(3)
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }

      if (proposalsRes.success) {
        setRecentProposals(proposalsRes.data);
      }

      if (usersRes.success) {
        setRecentUsers(usersRes.data);
      }

      if (announcementsRes.success) {
        setAnnouncements(announcementsRes.data);
      }

    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Selamat datang di sistem manajemen P3M Polimdo</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <span className="text-lg mr-2">⚠️</span>
            <div>
              <strong>Terjadi Kesalahan</strong>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Proposal"
            value={stats.totalProposals || 0}
            icon="📄"
            color="blue"
          />
          <StatsCard
            title="Total Pengguna"
            value={stats.totalUsers || 0}
            icon="👥"
            color="green"
          />
          <StatsCard
            title="Proposal Pending"
            value={stats.pendingProposals || 0}
            icon="⏳"
            color="yellow"
          />
          <StatsCard
            title="Total Review"
            value={stats.totalReviews || 0}
            icon="📝"
            color="purple"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Proposal Terbaru</h2>
          {recentProposals.length > 0 ? (
            <div className="space-y-3">
              {recentProposals.map((proposal) => (
                <div key={proposal.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 truncate">{proposal.judul}</h3>
                  <p className="text-sm text-gray-600">
                    Oleh: {proposal.ketua?.nama || 'Unknown'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(proposal.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Belum ada proposal terbaru</p>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pengguna Terbaru</h2>
          {recentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">{user.nama}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Belum ada pengguna terbaru</p>
          )}
        </div>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pengumuman</h2>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-green-500 pl-4 py-3">
                <h3 className="font-medium text-gray-900">{announcement.judul}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{announcement.konten}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(announcement.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getStatusColor = (status) => {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SUBMITTED: 'bg-blue-100 text-blue-800',
    REVIEW: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    REVISION: 'bg-orange-100 text-orange-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getRoleColor = (role) => {
  const colors = {
    ADMIN: 'bg-purple-100 text-purple-800',
    DOSEN: 'bg-blue-100 text-blue-800',
    MAHASISWA: 'bg-green-100 text-green-800',
    REVIEWER: 'bg-orange-100 text-orange-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

export default AdminDashboard;