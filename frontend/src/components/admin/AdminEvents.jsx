import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from './ImageUploader';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', event_type: 'workshop', 
    start_date: '', end_date: '', location: '', capacity: '', image_url: '',
    send_email: false
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.capacity) payload.capacity = parseInt(payload.capacity);
      else delete payload.capacity;
      
      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || `Failed to ${editingId ? 'update' : 'create'} event`);
      }
      
      setIsCreating(false);
      setEditingId(null);
      setFormData({
        title: '', description: '', event_type: 'workshop', 
        start_date: '', end_date: '', location: '', capacity: '', image_url: '',
        send_email: false
      });
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      event_type: event.event_type || 'workshop',
      start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0,16) : '',
      end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0,16) : '',
      location: event.location || '',
      capacity: event.capacity || '',
      image_url: event.image_url || ''
    });
    setIsCreating(true);
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete');
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-12 text-[#00FF88]">Loading Events Grid...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Event Architecture</h3>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', description: '', event_type: 'workshop', start_date: '', end_date: '', location: '', capacity: '', image_url: '', send_email: false });
            setIsCreating(true);
          }}
          className="px-6 py-3 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl flex items-center gap-2 hover:shadow-neon transition-shadow"
        >
          <span className="material-symbols-outlined">add</span> Create Node
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/30 text-error rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-xl">error</span>
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-[#112218] text-[#00FF88] border border-[#00FF88]/30 rounded-lg text-xs font-mono uppercase">
                  {event.event_type}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(event)} className="text-[#a3b8cc] hover:text-[#00FF88] transition-colors">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="text-[#a3b8cc] hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
              <p className="text-sm text-[#a3b8cc] mb-4 line-clamp-2">{event.description}</p>
            </div>
            
            <div className="space-y-2 mt-4 pt-4 border-t border-[#1a3324]">
              <div className="flex items-center gap-2 text-xs text-[#a3b8cc]">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                {new Date(event.start_date).toLocaleDateString()}
              </div>
              <div className="flex justify-between text-xs font-mono text-[#00FF88]">
                <span>Registered: {event.registered_count}</span>
                <span>Capacity: {event.capacity || 'Infinite'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1118]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0c1610] border border-[#1a3324] p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white">{editingId ? 'Edit Event Node' : 'Initialize Event Node'}</h3>
                <button onClick={() => setIsCreating(false)} className="text-[#a3b8cc] hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Title</label>
                    <input required type="text" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Event Type</label>
                    <select className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})}>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="contest">Contest</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Description</label>
                  <textarea required rows="3" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Start Date (ISO)</label>
                    <input required type="datetime-local" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#a3b8cc] mb-1">End Date (ISO)</label>
                    <input required type="datetime-local" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                  </div>
                </div>

                <ImageUploader 
                  label="Event Cover Image" 
                  value={formData.image_url} 
                  onChange={(val) => setFormData({...formData, image_url: val})} 
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Location</label>
                    <input type="text" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Capacity (Optional)</label>
                    <input type="number" className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                  </div>
                </div>

                {!editingId && (
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="send_email" checked={formData.send_email} onChange={e => setFormData({...formData, send_email: e.target.checked})} className="w-4 h-4 rounded border-[#1a3324] bg-[#112218]" />
                    <label htmlFor="send_email" className="text-sm text-[#00FF88] font-bold">Send Email Blast to all members</label>
                  </div>
                )}

                <div className="flex justify-end gap-4 mt-8">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 border border-[#1a3324] text-white hover:bg-[#112218] rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-[#00FF88] text-[#0a1118] hover:bg-[#00D4FF] rounded-xl font-bold">{editingId ? 'Update Node' : 'Initialize Node'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEvents;
