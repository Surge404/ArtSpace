import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ImageUpload = ({ type = 'profile' }) => {
  const { setUser } = useAuth();
  const [preview, setPreview]   = useState(null);
  const [uploading, setUploading] = useState(false);

  /* choose file → show preview */
  const handleSelect = e => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    }
  };

  /* actually upload */
  const handleUpload = async e => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    const fd = new FormData();
    if (type === 'profile') fd.append('image', files[0]);
    else Array.from(files).forEach(f => fd.append('images', f));

    try {
      const endpoint = type === 'profile'
        ? '/api/upload/profile-picture'
        : '/api/upload/portfolio';

      const { data } = await axios.post(`http://localhost:5000${endpoint}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      /* sync fresh user to context */
      if (data.user) setUser(data.user);
      alert('Upload successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {preview ? (
            <img src={preview} className="w-32 h-32 rounded-lg object-cover" />
          ) : (
            <>
              <svg className="w-8 h-8 mb-3 text-gray-500" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-500">PNG/JPG up to 5 MB</p>
            </>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          multiple={type !== 'profile'}
          onInput={handleSelect}
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {uploading && (
        <div className="text-center text-sm text-gray-600">Uploading…</div>
      )}
    </div>
  );
};

export default ImageUpload;
