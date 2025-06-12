// src/context/AppContext.js

import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Contoh state global: tema aplikasi (light/dark)
  const [theme, setTheme] = useState('light');

  // Contoh state global: notifikasi sederhana
  const [notification, setNotification] = useState(null);

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook untuk akses context lebih mudah
export const useAppContext = () => useContext(AppContext);

export default AppContext;
