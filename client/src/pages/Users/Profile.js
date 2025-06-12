import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import { User, Edit, Save, X, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_telp: '',
    bidang_keahlian: '',
    password: '',
    jurusanId: '',
    prodiId: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      if (response.success) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          nama: userData.nama || '',
          email: userData.email || '',
          no_telp: userData.no_telp || '',
          bidang_keahlian: userData.bidang_keahlian || '',
          jurusanId: userData.jurusan?.id || '',
          prodiId: userData.prodi?.id || '',
          password: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = { 
        nama: formData.nama,
        no_telp: formData.no_telp,
        bidang_keahlian: formData.bidang_keahlian,
        jurusanId: formData.jurusanId || null,
        prodiId: formData.prodiId || null
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await userService.updateProfile(updateData);
      if (response.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        updateUser(updatedUser);
        setIsEditing(false);
        setFormData({ ...formData, password: '' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...formData,
      nama: user.nama || '',
      no_telp: user.no_telp || '',
      bidang_keahlian: user.bidang_keahlian || '',
      jurusanId: user.jurusan?.id || '',
      prodiId: user.prodi?.id || '',
      password: ''
    });
    setIsEditing(false);
  };

  const getRoleLabel = (role) => {
    const roles = {
      ADMIN: 'Administrator',
      DOSEN: 'Dosen',
      MAHASISWA: 'Mahasiswa',
      REVIEWER: 'Reviewer'
    };
    return roles[role] || 'User';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <User className="w-6 h-6" />
              Profil Saya
            </h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <Edit className="w-4 h-4" />
                Edit Profil
              </button>
            )}
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Nama */}
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                ) : (
                  <p className="text-gray-900">{user?.nama || '-'}</p>
                )}
              </div>

              {/* Email */}
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{user?.email || '-'}</p>
              </div>

              {/* NIP/NIM */}
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {user?.role === 'MAHASISWA' ? 'NIM' : 'NIP'}
                </label>
                <p className="text-gray-900">
                  {user?.role === 'MAHASISWA' ? user?.nim : user?.nip || '-'}
                </p>
              </div>

              {/* Role */}
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <p className="text-gray-900">{getRoleLabel(user?.role)}</p>
              </div>

              {/* No Telepon */}
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Telepon
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="no_telp"
                    value={formData.no_telp}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.no_telp || '-'}</p>
                )}
              </div>

              {/* Bidang Keahlian */}
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bidang Keahlian
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="bidang_keahlian"
                    value={formData.bidang_keahlian}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.bidang_keahlian || '-'}</p>
                )}
              </div>

              {/* Jurusan */}
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jurusan
                </label>
                <p className="text-gray-900">
                  {user?.jurusan?.nama || '-'}
                </p>
              </div>

              {/* Program Studi */}
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Studi
                </label>
                <p className="text-gray-900">
                  {user?.prodi?.nama || '-'}
                </p>
              </div>

              {/* Password - Only when editing */}
              {isEditing && (
                <div className="border-b pb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru (Kosongkan jika tidak ingin mengubah)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                  >
                    <X className="inline mr-2 w-4 h-4" />
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                  >
                    <Save className="inline mr-2 w-4 h-4" />
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;