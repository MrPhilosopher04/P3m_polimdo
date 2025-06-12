// src/components/Users/UserProfile.js
import React from 'react';
import { FaPhone, FaGraduationCap, FaBook, FaCalendarAlt, FaSyncAlt, FaChartBar, FaUser, FaEnvelope, FaIdCard, FaCrown, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const UserProfile = ({ user }) => {
  if (!user) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <div className="text-center py-12">
          <div className="mx-auto bg-gray-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-6">
            <FaUser className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Pengguna Tidak Ditemukan</h3>
          <p className="text-gray-600">Data pengguna yang Anda cari tidak tersedia</p>
        </div>
      </div>
    );
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DOSEN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MAHASISWA': return 'bg-green-100 text-green-800 border-green-200';
      case 'REVIEWER': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    return status === 'AKTIF' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'ADMIN': 'Administrator',
      'DOSEN': 'Dosen',
      'MAHASISWA': 'Mahasiswa',
      'REVIEWER': 'Reviewer'
    };
    return labels[role] || role;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const renderStatCard = (value, label, icon, color) => (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-5 text-white shadow-md`}>
      <div className="flex items-center">
        <div className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
          {icon}
        </div>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm opacity-90">{label}</p>
        </div>
      </div>
    </div>
  );

  const renderInfoItem = (icon, label, value) => (
    <div className="flex items-start py-3 border-b border-gray-100">
      <div className="text-blue-600 mt-1 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative">
            <div className="bg-white bg-opacity-20 rounded-full p-1 w-28 h-28 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {getInitials(user.nama)}
                </span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(user.status)}`}>
                {user.status === 'AKTIF' ? (
                  <span className="flex items-center">
                    <FaCheckCircle className="mr-1" /> AKTIF
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaTimesCircle className="mr-1" /> NONAKTIF
                  </span>
                )}
              </span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">{user.nama}</h1>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <span className={`px-4 py-2 rounded-full font-medium flex items-center ${getRoleColor(user.role)}`}>
                <FaCrown className="mr-2" /> {getRoleLabel(user.role)}
              </span>
              {(user.nip || user.nim) && (
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full font-medium">
                  {user.nip ? `NIP: ${user.nip}` : `NIM: ${user.nim}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informasi Utama */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
              <FaUser className="text-blue-500 mr-2" /> Informasi Profil
            </h2>
            
            <div className="space-y-2">
              {renderInfoItem(<FaEnvelope className="h-5 w-5" />, "Email", user.email)}
              
              {user.no_telp && renderInfoItem(
                <FaPhone className="h-5 w-5" />, 
                "Nomor Telepon", 
                user.no_telp
              )}
              
              {user.bidang_keahlian && renderInfoItem(
                <FaBook className="h-5 w-5" />, 
                "Bidang Keahlian", 
                user.bidang_keahlian
              )}
              
              {(user.jurusan || user.prodi) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-b border-gray-100">
                  <div className="flex items-start">
                    <div className="text-blue-600 mt-1 mr-4">
                      <FaGraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Jurusan</p>
                      <p className="text-gray-800 font-medium">
                        {typeof user.jurusan === 'object' ? user.jurusan.nama : user.jurusan || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-blue-600 mt-1 mr-4">
                      <FaGraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Program Studi</p>
                      <p className="text-gray-800 font-medium">
                        {typeof user.prodi === 'object' ? user.prodi.nama : user.prodi || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                <div className="flex items-start">
                  <div className="text-blue-600 mt-1 mr-4">
                    <FaCalendarAlt className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Bergabung Sejak</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                {user.updatedAt && (
                  <div className="flex items-start">
                    <div className="text-blue-600 mt-1 mr-4">
                      <FaSyncAlt className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Terakhir Diperbarui</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(user.updatedAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistik */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
              <FaChartBar className="text-blue-500 mr-2" /> Statistik Aktivitas
            </h2>
            
            <div className="space-y-5">
              {renderStatCard(
                user._count?.proposals || 0,
                "Proposal Diajukan",
                <FaBook className="h-6 w-6 text-blue-500" />,
                "from-blue-400 to-blue-600"
              )}
              
              {renderStatCard(
                user._count?.reviewedProposals || 0,
                "Proposal Direview",
                <FaCheckCircle className="h-6 w-6 text-green-500" />,
                "from-green-400 to-green-600"
              )}
              
              {renderStatCard(
                user._count?.reviews || 0,
                "Review Diberikan",
                <FaIdCard className="h-6 w-6 text-purple-500" />,
                "from-purple-400 to-purple-600"
              )}
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-700 mb-2">Status Akun</h3>
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${user.status === 'AKTIF' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">
                  Akun ini {user.status === 'AKTIF' ? 'aktif' : 'nonaktif'} dalam sistem
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Pengguna {user.status === 'AKTIF' ? 'dapat' : 'tidak dapat'} mengakses fitur sistem sesuai perannya
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;