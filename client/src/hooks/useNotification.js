// src/hooks/useNotification.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Fungsi untuk menampilkan notifikasi
  const showNotification = useCallback(({ type, message }) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto remove notifikasi setelah 3 detik
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, notifications }}>
      {children}
      {/* Render notifikasi jika ingin, contoh sederhana di pojok kanan bawah */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map(({ id, type, message }) => (
          <div
            key={id}
            className={`max-w-xs px-4 py-2 rounded shadow text-white ${
              type === 'error'
                ? 'bg-red-600'
                : type === 'info'
                ? 'bg-blue-600'
                : type === 'success'
                ? 'bg-green-600'
                : 'bg-gray-600'
            }`}
          >
            {message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
