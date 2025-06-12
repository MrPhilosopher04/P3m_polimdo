// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentItems from '../components/Dashboard/RecentItems';
import QuickActions from '../components/Dashboard/QuickActions';
import Loading from '../components/Common/Loading';
import AlertMessage from '../components/Common/AlertMessage';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          throw new Error('Request timeout - Server tidak merespons');
        }, 10000); // 10 second timeout

        const response = await dashboardService.getDashboardData();
        
        clearTimeout(timeoutId);
        
        if (response && response.data) {
          setDashboardData(response.data);
        } else {
          // Set default data if no response
          setDashboardData({
            stats: {
              totalProposals: 0,
              pendingReviews: 0,
              totalUsers: 0,
              totalSkema: 0
            },
            recentItems: [],
            announcements: []
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Gagal memuat data dashboard');
        
        // Set fallback data on error
        setDashboardData({
          stats: {
            totalProposals: 0,
            pendingReviews: 0,
            totalUsers: 0,
            totalSkema: 0
          },
          recentItems: [],
          announcements: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Show loading only for first 3 seconds, then show error or fallback
  useEffect(() => {
    const maxLoadingTime = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Data tidak dapat dimuat. Menampilkan data default.');
        setDashboardData({
          stats: {
            totalProposals: 0,
            pendingReviews: 0,
            totalUsers: 0,
            totalSkema: 0
          },
          recentItems: [],
          announcements: []
        });
      }
    }, 3000);

    return () => clearTimeout(maxLoadingTime);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Selamat datang, {user?.name || 'User'}
          </p>
        </div>
      </div>

      {error && (
        <AlertMessage 
          type="warning" 
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Proposal"
          value={dashboardData?.stats?.totalProposals || 0}
          icon="📄"
          color="blue"
        />
        <StatsCard
          title="Review Pending"
          value={dashboardData?.stats?.pendingReviews || 0}
          icon="⏳"
          color="yellow"
        />
        <StatsCard
          title="Total Users"
          value={dashboardData?.stats?.totalUsers || 0}
          icon="👥"
          color="green"
        />
        <StatsCard
          title="Total Skema"
          value={dashboardData?.stats?.totalSkema || 0}
          icon="📋"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentItems 
            items={dashboardData?.recentItems || []}
            loading={false}
          />
        </div>
        <div>
          <QuickActions userRole={user?.role} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;