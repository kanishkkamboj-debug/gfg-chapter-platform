import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', content: '', category: 'General', priority: 'low', is_pinned: false
  });

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch announcements');
      const data = await res.json();
      setAnnouncements(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/announcements/${editingId}` : '/api/announcements';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || `Failed to ${editingId ? 'update' : 'create'} announcement`);
      }
      
      setIsCreating(false);
      setEditingId(null);
      setFormData({
        title: '', description: '', content: '', category: 'General', priority: 'low', is_pinned: false
      });
      fetchAnnouncements();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEdit = (ann) => {
    setEditingId(ann.id);
    setFormData({
      title: ann.title || '',
      description: ann.description || '',
      content: ann.content || '',
      category: ann.category || 'General',
      priority: ann.priority || 'low',
      is_pinned: ann.is_pinned || false
    });
    setIsCreating(true);
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete');
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-12 text-[#00FF88]">Loading Announcements...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Platform Announcements</h3>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', description: '', content: '', category: 'General', priority: 'low', is_pinned: false });
            setIsCreating(true);
          }}
          className="px-6 py-3 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all"
        >
          <span className="material-symbols-outlined">add_alert</span> Broadcast
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-xl">error</span>
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 bg-[#112218] border rounded-lg text-xs font-mono uppercase ${ann.priority === 'high' || ann.priority === 'critical' ? 'text-red-500 border-red-500/30' : 'text-[#00FF88] border-[#00FF88]/30'}`}>
                  {ann.priority} Priority
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(ann)} className="text-[#a3b8cc] hover:text-[#00FF88] transition-colors">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button onClick={() => handleDelete(ann.id)} className="text-[#a3b8cc] hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                {ann.is_pinned && <span className="material-symbols-outlined text-[16px] text-yellow-500">push_pin</span>}
                {ann.title}
              </h4>
              <p className="text-sm text-[#a3b8cc] mb-4 line-clamp-3">{ann.description}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#1a3324]">
               <div className="text-xs font-mono text-[#a3b8cc]">Posted by {ann.full_name}</div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && <div className="col-span-2 text-center p-12 text-[#a3b8cc]">No announcements broadcasted yet.</div>}
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1118]/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0c1610] border border-[#1a3324] p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white">{editingId ? 'Edit Broadcast' : 'New Broadcast'}</h3>
                <button onClick={() => setIsCreating(false)} className="text-[#a3b8cc] hover:text-white"><span className="material-symbols-outlined">close</span></button>
              </div>

              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Title</label>
                  <input required type="text" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Description (Short Summary)</label>
                  <textarea required rows="2" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Priority</label>
                    <select className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Category</label>
                    <input type="text" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="General, Technical, etc." />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="is_pinned" checked={formData.is_pinned} onChange={e => setFormData({...formData, is_pinned: e.target.checked})} className="w-4 h-4 rounded border-[#1a3324] bg-[#112218]" />
                  <label htmlFor="is_pinned" className="text-sm text-[#a3b8cc]">Pin to top of notifications</label>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 border border-[#1a3324] text-white hover:bg-[#112218] rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-[#00FF88] text-[#0a1118] hover:bg-[#00D4FF] rounded-xl font-bold">{editingId ? 'Update Broadcast' : 'Send Broadcast'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAnnouncements;
