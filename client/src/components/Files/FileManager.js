// src/components/Files/FileManager.js

import React, { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import { getFiles, deleteFile } from '../../services/fileService';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFiles();
      setFiles(data);
    } catch (err) {
      setError('Gagal memuat file');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus file ini?')) return;

    try {
      await deleteFile(id);
      setFiles((prev) => prev.filter((file) => file.id !== id));
    } catch {
      alert('Gagal menghapus file');
    }
  };

  const handleUploadSuccess = () => {
    fetchFiles();
  };

  return (
    <div className="p-4 space-y-4">
      <FileUpload onUpload={handleUploadSuccess} />

      {loading && <p>Memuat file...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-2">
          {files.length === 0 && <p>Tidak ada file.</p>}
          {files.map((file) => (
            <li key={file.id} className="flex justify-between items-center border p-2 rounded">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {file.name}
              </a>
              <button
                onClick={() => handleDelete(file.id)}
                className="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileManager;
