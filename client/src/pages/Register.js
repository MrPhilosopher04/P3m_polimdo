import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RegisterForm from '../components/Auth/RegisterForm';
import { authService } from '../services/authService';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      const response = await authService.register(formData);
      
      if (response.success) {
        setSuccess(true);
        toast.success('Pendaftaran berhasil! Silakan login dengan akun Anda.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(response.message || 'Terjadi kesalahan saat mendaftar');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error messages
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Data yang dimasukkan tidak valid');
      } else if (error.response?.status === 409) {
        toast.error('Email atau NIP/NIM sudah terdaftar');
      } else {
        toast.error('Terjadi kesalahan server. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pendaftaran Berhasil!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Akun Anda telah berhasil dibuat. Anda akan diarahkan ke halaman login dalam beberapa detik.
            </p>
            
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
              >
                Login Sekarang
              </Link>
              
              <Link
                to="/"
                className="w-full text-gray-600 hover:text-gray-800 transition-colors inline-block"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke Beranda
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sudah punya akun?</span>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Daftar Akun Baru
              </h1>
              <p className="text-blue-100">
                Bergabunglah dengan sistem manajemen proposal penelitian dan pengabdian
              </p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              {/* Info Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Informasi Penting:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Pastikan email yang digunakan masih aktif</li>
                      <li>Untuk mahasiswa, pilih jurusan dan program studi dengan benar</li>
                      <li>Untuk dosen dan reviewer, pastikan NIP sudah benar</li>
                      <li>Akun akan diverifikasi oleh admin sebelum dapat digunakan</li>
                    </ul>
                  </div>
                </div>
              </div>

              <RegisterForm onSubmit={handleRegister} loading={loading} />
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600">
              Dengan mendaftar, Anda menyetujui{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                Syarat dan Ketentuan
              </Link>{' '}
              serta{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                Kebijakan Privasi
              </Link>{' '}
              kami.
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Peran Pengguna dalam Sistem
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">M</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Mahasiswa</h4>
                  <p className="text-gray-600">
                    Dapat mengajukan proposal penelitian atau pengabdian sesuai dengan program studi
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">D</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Dosen</h4>
                  <p className="text-gray-600">
                    Dapat mengajukan proposal dan membimbing mahasiswa dalam penelitian
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">R</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Reviewer</h4>
                  <p className="text-gray-600">
                    Bertugas mengevaluasi dan memberikan penilaian terhadap proposal yang diajukan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;