// src/components/Layout/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="app-layout">
      <Header />
      <div className="layout-main">
        <Sidebar />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;