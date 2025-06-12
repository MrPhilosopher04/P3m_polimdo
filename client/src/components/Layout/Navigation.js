import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Layers, Users, User } from 'lucide-react';

const Navigation = ({ role }) => {
  const { pathname } = useLocation();
  const roleUpper = role?.toUpperCase() || '';

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = pathname === to;
    return (
      <Link
        to={to}
        aria-current={isActive ? 'page' : undefined}
        className={`flex flex-col items-center justify-center px-4 py-2 text-sm font-medium transition
          ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
      >
        <Icon className="w-6 h-6 mb-1" />
        {label}
      </Link>
    );
  };

  return (
    <nav className="w-full bg-white border-b shadow-sm fixed top-0 left-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start space-x-6">
          <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

          {(roleUpper === 'ADMIN' || roleUpper === 'DOSEN' || roleUpper === 'MAHASISWA') && (
            <NavLink to="/proposals" icon={FileText} label="Proposals" />
          )}

          {(roleUpper === 'ADMIN' || roleUpper === 'REVIEWER' || roleUpper === 'DOSEN') && (
            <NavLink to="/reviews" icon={Layers} label="Reviews" />
          )}

          {roleUpper === 'ADMIN' && (
            <>
              <NavLink to="/skema" icon={Layers} label="Skema" />
              <NavLink to="/users" icon={Users} label="Users" />
            </>
          )}

          <NavLink to="/profile" icon={User} label="Profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
