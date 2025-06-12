import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../hooks/useAuth';

const Layout = () => {
  const { user } = useAuth();
  const role = user?.role ? user.role.toUpperCase() : '';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={role} className="w-64 hidden md:block h-screen sticky top-0" />

        <main className="flex-1 p-6 overflow-y-auto max-h-screen">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
