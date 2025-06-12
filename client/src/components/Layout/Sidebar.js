import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Users,
  LayoutDashboard,
  User,
  Layers,
  BookOpen,
  GraduationCap // Tambahkan icon baru
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const { pathname } = useLocation();
  const roleUpper = role?.toUpperCase() || '';

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = pathname.startsWith(to);
    return (
      <Link
        to={to}
        aria-current={isActive ? 'page' : undefined}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition 
          ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <Icon className="w-5 h-5" />
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm">
      <div className="p-6 text-center font-bold text-xl text-blue-600 border-b">
        P3M Polimdo
      </div>

      <nav className="p-4 space-y-1">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

        {(roleUpper === 'ADMIN' || roleUpper === 'DOSEN' || roleUpper === 'MAHASISWA') && (
          <NavItem to="/proposals" icon={FileText} label="Proposals" />
        )}

        {(roleUpper === 'ADMIN' || roleUpper === 'REVIEWER' || roleUpper === 'DOSEN' || roleUpper === 'MAHASISWA') && (
          <NavItem to="/reviews" icon={Layers} label="Reviews" />
        )}

        {roleUpper === 'ADMIN' && (
          <>
            <NavItem to="/admin/skema" icon={Layers} label="Skema" />
            <NavItem to="/admin/users" icon={Users} label="Users" />
            {/* Tambahkan menu untuk Jurusan dan Prodi */}
            <NavItem to="/admin/jurusan" icon={BookOpen} label="Jurusan" />
            <NavItem to="/admin/prodi" icon={GraduationCap} label="Prodi" />
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;