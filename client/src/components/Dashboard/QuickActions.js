// src/components/Dashboard/QuickActions.js
import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = ({ userRole = 'USER' }) => {
  const getActionsByRole = (role) => {
    switch (role) {
      case 'ADMIN':
        return [
          { title: 'Kelola User', icon: '👥', link: '/users', color: 'blue' },
          { title: 'Kelola Skema', icon: '📋', link: '/skema', color: 'green' },
          { title: 'Review Proposal', icon: '📝', link: '/reviews', color: 'yellow' },
          { title: 'Buat Pengumuman', icon: '📢', link: '/pengumuman/create', color: 'purple' }
        ];
      case 'DOSEN':
        return [
          { title: 'Buat Proposal', icon: '➕', link: '/proposals/create', color: 'blue' },
          { title: 'Proposal Saya', icon: '📄', link: '/proposals', color: 'green' },
          { title: 'Review Tugas', icon: '📝', link: '/reviews', color: 'yellow' },
          { title: 'Profil Saya', icon: '👤', link: '/profile', color: 'gray' }
        ];
      case 'MAHASISWA':
        return [
          { title: 'Buat Proposal', icon: '➕', link: '/proposals/create', color: 'blue' },
          { title: 'Proposal Saya', icon: '📄', link: '/proposals', color: 'green' },
          { title: 'Lihat Skema', icon: '📋', link: '/skema', color: 'purple' },
          { title: 'Profil Saya', icon: '👤', link: '/profile', color: 'gray' }
        ];
      default:
        return [
          { title: 'Dashboard', icon: '🏠', link: '/dashboard', color: 'blue' },
          { title: 'Profil Saya', icon: '👤', link: '/profile', color: 'gray' }
        ];
    }
  };

  const actions = getActionsByRole(userRole);

  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600 text-white',
    green: 'bg-green-500 hover:bg-green-600 text-white',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white',
    red: 'bg-red-500 hover:bg-red-600 text-white',
    gray: 'bg-gray-500 hover:bg-gray-600 text-white'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Aksi Cepat
      </h2>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`flex items-center p-3 rounded-lg transition-colors ${colorClasses[action.color]} hover:shadow-md`}
          >
            <span className="text-2xl mr-3">{action.icon}</span>
            <span className="font-medium">{action.title}</span>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Aksi berdasarkan role: {userRole}
        </p>
      </div>
    </div>
  );
};

export default QuickActions;