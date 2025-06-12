//client/src/components/Files/DocumentList.js
import React, { useState } from 'react';
import fileService from '../../services/fileService';
import Button from '../Common/Button';
import { useToast } from '../../context/ToastContext';

const DocumentList = ({ documents, proposalId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('document', file);
      formData.append('proposalId', proposalId);
      formData.append('type', 'PROPOSAL_DOCUMENT');
      
      const result = await fileService.uploadDocument(formData);
      if (result.success) {
        showToast('success', 'Dokumen berhasil diunggah');
        onUploadSuccess(result.data.document);
        setFile(null);
      } else {
        showToast('error', result.error || 'Gagal mengunggah dokumen');
      }
    } catch (error) {
      showToast('error', 'Terjadi kesalahan saat mengunggah dokumen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Unggah Dokumen Baru</h3>
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md p-2 flex-1"
          />
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            loading={uploading}
          >
            Unggah
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-md font-medium mb-2">Dokumen Terlampir</h3>
        {documents.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada dokumen</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {documents.map(doc => (
              <li key={doc.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.nama}</p>
                  <p className="text-xs text-gray-500">{doc.tipe} - {doc.ukuran}</p>
                </div>
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Unduh
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentList;