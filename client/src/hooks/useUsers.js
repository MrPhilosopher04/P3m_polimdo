// client/src/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  // Fetch users
  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...params
      };

      const result = await userService.getUsers(queryParams);

      if (result.success) {
        setUsers(result.data.users);
        setPagination(prev => ({
          ...prev,
          ...result.data.pagination
        }));
      } else {
        setError(result.error);
        setUsers([]);
      }
    } catch (err) {
      setError('Terjadi kesalahan tidak terduga');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Create user
  const createUser = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await userService.createUser(userData);
      
      if (result.success) {
        await fetchUsers(); // Refresh data
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorResult = { success: false, error: 'Terjadi kesalahan tidak terduga' };
      setError(errorResult.error);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await userService.updateUser(id, userData);
      
      if (result.success) {
        await fetchUsers(); // Refresh data
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorResult = { success: false, error: 'Terjadi kesalahan tidak terduga' };
      setError(errorResult.error);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  // Update user status
  const updateUserStatus = async (id, status) => {
    setLoading(true);
    setError(null);

    try {
      const result = await userService.updateUserStatus(id, status);
      
      if (result.success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, status } : user
        ));
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorResult = { success: false, error: 'Terjadi kesalahan tidak terduga' };
      setError(errorResult.error);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const result = await userService.deleteUser(id);
      
      if (result.success) {
        await fetchUsers(); // Refresh data
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorResult = { success: false, error: 'Terjadi kesalahan tidak terduga' };
      setError(errorResult.error);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Update pagination
  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      role: '',
      status: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // Data
    users,
    loading,
    error,
    pagination,
    filters,
    
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    
    // Filter actions
    updateFilters,
    updatePagination,
    resetFilters,
    
    // Utilities
    refresh: () => fetchUsers(),
    clearError: () => setError(null)
  };
};

export default useUsers;