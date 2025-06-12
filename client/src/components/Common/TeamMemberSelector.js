// client/src/components/Common/TeamMemberSelector.js
import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';

const TeamMemberSelector = ({ selectedMembers = [], onChange, maxMembers = 10 }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Load users when component mounts
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter(user =>
        user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nip?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.getUsers({
        role: ['DOSEN', 'MAHASISWA'], // Include both dosen and mahasiswa
        status: 'ACTIVE',
        limit: 100
      });

      if (result.success) {
        setUsers(result.data.users || []);
        setFilteredUsers(result.data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = (userId) => {
    if (!selectedMembers.includes(userId) && selectedMembers.length < maxMembers) {
      const newSelectedMembers = [...selectedMembers, userId];
      onChange(newSelectedMembers);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveMember = (userId) => {
    const newSelectedMembers = selectedMembers.filter(id => id !== userId);
    onChange(newSelectedMembers);
  };

  const getSelectedUserData = () => {
    return users.filter(user => selectedMembers.includes(user.id));
  };

  const getAvailableUsers = () => {
    return filteredUsers.filter(user => !selectedMembers.includes(user.id));
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cari nama, email, NIM, atau NIP..."
          disabled={selectedMembers.length >= maxMembers}
        />

        {/* Dropdown */}
        {showDropdown && searchTerm.trim() && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-3 py-2 text-center text-gray-500">
                Memuat data...
              </div>
            ) : getAvailableUsers().length > 0 ? (
              getAvailableUsers().map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleAddMember(user.id)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{user.nama}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      {(user.nim || user.nip) && (
                        <div className="text-xs text-gray-500">
                          {user.nim || user.nip}
                        </div>
                      )}
                    </div>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${user.role === 'DOSEN' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                      }
                    `}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-center text-gray-500">
                Tidak ada pengguna ditemukan
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Selected Members */}
      {getSelectedUserData().length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Anggota Terpilih ({selectedMembers.length}/{maxMembers})
          </label>
          <div className="space-y-2">
            {getSelectedUserData().map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user.nama}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    {(user.nim || user.nip) && (
                      <div className="text-xs text-gray-500">
                        {user.nim || user.nip}
                      </div>
                    )}
                  </div>
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${user.role === 'DOSEN' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                    }
                  `}>
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(user.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Hapus anggota"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Text */}
      <div className="text-sm text-gray-500">
        {selectedMembers.length >= maxMembers 
          ? `Maksimal ${maxMembers} anggota tim telah tercapai`
          : `Anda dapat menambahkan maksimal ${maxMembers} anggota tim (termasuk dosen dan mahasiswa)`
        }
      </div>
    </div>
  );
};

export default TeamMemberSelector;