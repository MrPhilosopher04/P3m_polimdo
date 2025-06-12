import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import ProposalStatusCard from '../../components/Dashboard/ProposalStatusCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorAlert from '../../components/Common/ErrorAlert';

// Icon Components
const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const DosenDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myProposals: 0,
    pendingProposals: 0,
    approvedProposals: 0,
    rejectedProposals: 0
  });
  const [recentProposals, setRecentProposals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userInfo);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, proposalsRes, announcementsRes] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentProposals(5),
        dashboardService.getAnnouncements(3)
      ]);

      if (statsRes.success) {
        setStats({
          myProposals: statsRes.data.myProposals || 0,
          pendingProposals: statsRes.data.pendingProposals || 0,
          approvedProposals: statsRes.data.approvedProposals || 0,
          rejectedProposals: statsRes.data.rejectedProposals || 0
        });
      }

      if (proposalsRes.success) {
        setRecentProposals(proposalsRes.data || []);
      }

      if (announcementsRes.success) {
        setAnnouncements(announcementsRes.data || []);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create':
        navigate('/dosen/proposals/create');
        break;
      case 'view-proposals':
        navigate('/dosen/proposals');
        break;
      case 'view-skema':
        navigate('/dosen/skema');
        break;
      default:
        break;
    }
  };

  const statsConfig = [
    { 
      title: 'Total Proposal', 
      value: stats.myProposals, 
      icon: <DocumentIcon />, 
      color: 'blue',
      description: 'Semua proposal yang telah dibuat'
    },
    { 
      title: 'Proposal Pending', 
      value: stats.pendingProposals, 
      icon: <ClockIcon />, 
      color: 'yellow',
      description: 'Menunggu review'
    },
    { 
      title: 'Proposal Disetujui', 
      value: stats.approvedProposals, 
      icon: <CheckCircleIcon />, 
      color: 'green',
      description: 'Proposal yang telah disetujui'
    },
    { 
      title: 'Proposal Ditolak', 
      value: stats.rejectedProposals, 
      icon: <XCircleIcon />, 
      color: 'red',
      description: 'Proposal yang tidak disetujui'
    }
  ];

  const quickActions = [
    {
      title: 'Buat Proposal Baru',
      description: 'Mulai membuat proposal penelitian',
      icon: <PlusIcon />,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: 'create'
    },
    {
      title: 'Lihat Proposal Saya',
      description: 'Kelola proposal yang telah dibuat',
      icon: <EyeIcon />,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: 'view-proposals'
    },
    {
      title: 'Lihat Skema',
      description: 'Jelajahi skema penelitian',
      icon: <BookOpenIcon />,
      color: 'bg-teal-600 hover:bg-teal-700',
      action: 'view-skema'
    }
  ];

  if (loading) return <LoadingSpinner message="Memuat dashboard..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Dosen
              </h1>
              <p className="text-gray-600">
                Selamat datang, {user?.nama || 'Dosen'}! Kelola proposal penelitian Anda dengan mudah.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2">
                <p className="text-sm text-indigo-800">
                  <span className="font-semibold">Status:</span> Dosen Peneliti
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className={`${action.color} rounded-lg p-6 text-left text-white transform transition-transform hover:scale-[1.02]`}
            >
              <div className="flex items-center mb-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold">{action.title}</h3>
              </div>
              <p className="text-white text-opacity-90">{action.description}</p>
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Proposals */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Proposal Terbaru Saya
                </h3>
                <button 
                  onClick={() => handleQuickAction('view-proposals')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Lihat Semua
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentProposals.length > 0 ? (
                <div className="space-y-4">
                  {recentProposals.map((proposal, index) => (
                    <ProposalStatusCard key={index} proposal={proposal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentIcon className="mx-auto text-gray-400 w-12 h-12" />
                  <p className="text-gray-500 mt-2">Belum ada proposal yang dibuat</p>
                  <button
                    onClick={() => handleQuickAction('create')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Buat Proposal Baru
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Pengumuman Terbaru
              </h3>
            </div>
            <div className="p-6">
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <div 
                      key={index} 
                      className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-blue-50 rounded-r-lg transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 mb-1">
                        {announcement.judul}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {announcement.konten}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M7 8h10m0 0V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2m10 0v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8m10 0H7" />
                  </svg>
                  <p className="text-gray-500">Belum ada pengumuman terbaru</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips & Guide */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Panduan untuk Dosen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📝 Pengajuan Proposal</h4>
              <p className="text-sm text-gray-600">
                Pastikan proposal mencantumkan anggaran yang jelas dan sesuai dengan skema yang dipilih. Lampirkan dokumen pendukung yang lengkap.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📊 Pelaporan Penelitian</h4>
              <p className="text-sm text-gray-600">
                Lakukan pelaporan kemajuan penelitian sesuai jadwal yang ditentukan. Gunakan template laporan yang telah disediakan.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🔍 Review Proposal</h4>
              <p className="text-sm text-gray-600">
                Sebagai reviewer, berikan ulasan yang konstruktif dan tepat waktu. Fokus pada kualitas metodologi dan kesesuaian dengan skema.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">💼 Manajemen Tim</h4>
              <p className="text-sm text-gray-600">
                Pastikan semua anggota tim memahami tanggung jawab masing-masing. Lakukan koordinasi rutin untuk memantau perkembangan penelitian.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DosenDashboard;