import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', image_url: '', category: 'Community Events'
  });

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch gallery');
      const data = await res.json();
      setImages(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to upload');
      setShowAddModal(false);
      fetchImages();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete image?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchImages();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gallery Assets</h2>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-[#00D4FF] text-[#0a1118] font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span> Upload Media
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {images.map(img => (
          <div key={img.id} className="bg-[#0c1610] rounded-2xl border border-[#1a3324] overflow-hidden group relative">
            <div className="h-40 overflow-hidden relative">
              <img loading="lazy" src={img.image_url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button onClick={() => handleDelete(img.id)} className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
            <div className="p-4">
              <h4 className="text-white font-bold text-sm truncate">{img.title}</h4>
              <div className="text-xs text-[#a3b8cc] mt-1">{img.category}</div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1118]/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0c1610] border border-[#1a3324] p-8 rounded-3xl w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Upload Media</h3>
                <button onClick={() => setShowAddModal(false)} className="text-[#a3b8cc] hover:text-white"><span className="material-symbols-outlined">close</span></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Image Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Image URL</label>
                  <input type="url" required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1" />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#a3b8cc] uppercase">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#112218] border border-[#1a3324] rounded-xl px-4 py-3 text-white mt-1">
                    <option>Workshops</option><option>Hackathons</option><option>Community Events</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-[#00D4FF] text-[#0a1118] font-bold rounded-xl mt-4">Upload to Gallery</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(AdminGallery);
