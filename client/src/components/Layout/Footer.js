import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-10 py-6 text-center shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm text-gray-600">
          © {currentYear}{" "}
          <span className="text-blue-700 font-semibold cursor-pointer hover:underline hover:text-blue-900 transition">
            P3M Politeknik Negeri Manado
          </span>
          . All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Sistem Penelitian, Pengabdian Masyarakat & Publikasi
        </p>
      </div>
    </footer>
  );
};

export default Footer;
