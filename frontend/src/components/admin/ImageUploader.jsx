import React, { useState, useRef } from 'react';

const ImageUploader = ({ value, onChange, label = 'Image' }) => {
  const [mode, setMode] = useState('url'); // 'url' or 'upload'
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Upload failed');
      }

      const data = await res.json();
      // data.url will be like '/uploads/12345.jpg'
      // We need to prepend backend URL or just use relative if proxy handles it.
      // Since Vite proxies /api, but static files are in /uploads on port 5000:
      const fullUrl = `http://localhost:5000${data.url}`;
      onChange(fullUrl);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono text-[#a3b8cc]">{label}</label>
        <div className="flex bg-[#112218] rounded-lg p-1 border border-[#1a3324]">
          <button 
            type="button"
            onClick={() => setMode('url')}
            className={`px-3 py-1 text-xs rounded-md font-mono transition-colors ${mode === 'url' ? 'bg-[#0c1610] text-[#00FF88] shadow-sm' : 'text-[#a3b8cc] hover:text-white'}`}
          >
            URL
          </button>
          <button 
            type="button"
            onClick={() => setMode('upload')}
            className={`px-3 py-1 text-xs rounded-md font-mono transition-colors ${mode === 'upload' ? 'bg-[#0c1610] text-[#00FF88] shadow-sm' : 'text-[#a3b8cc] hover:text-white'}`}
          >
            Upload
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 font-mono">{error}</p>}

      {mode === 'url' ? (
        <input 
          type="url" 
          className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white focus:border-[#00FF88] outline-none" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          placeholder="https://example.com/image.jpg" 
        />
      ) : (
        <div className="relative">
          <input 
            type="file" 
            accept="image/*"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-[#112218] border border-dashed border-[#1a3324] hover:border-[#00FF88]/50 rounded-xl p-4 text-center transition-colors flex flex-col items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[#a3b8cc]">
              {isUploading ? 'hourglass_empty' : 'cloud_upload'}
            </span>
            <span className="text-sm text-[#a3b8cc] font-mono">
              {isUploading ? 'Uploading...' : (value ? 'Upload another file' : 'Click to select from device')}
            </span>
          </button>
        </div>
      )}

      {value && (
        <div className="mt-2 relative rounded-lg overflow-hidden border border-[#1a3324] inline-block h-20 w-32 bg-[#0c1610]">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
