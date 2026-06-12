import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const ProfilePortal = () => {
  const { user } = useApp();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Member Profile</h2>
        <p className="text-[#a3b8cc]">Manage your personal details and how you appear to others.</p>
      </div>

      <div className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324] max-w-2xl">
        {message && (
          <div className="mb-6 p-4 rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88]">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#1a3324]">
            <div className="w-24 h-24 rounded-full bg-[#112218] border border-[#1a3324] flex items-center justify-center overflow-hidden">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">{formData.full_name?.[0] || 'U'}</span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Avatar Image URL</label>
              <input 
                type="url" 
                placeholder="https://..."
                className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white focus:border-[#00FF88] transition-colors"
                value={formData.avatar_url}
                onChange={e => setFormData({...formData, avatar_url: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white focus:border-[#00FF88] transition-colors"
              value={formData.full_name}
              onChange={e => setFormData({...formData, full_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Email</label>
            <input 
              type="email" 
              disabled
              className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-[#a3b8cc] opacity-70 cursor-not-allowed"
              value={user?.email || ''}
            />
            <p className="text-xs text-[#a3b8cc] mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#a3b8cc] mb-1">Bio</label>
            <textarea 
              rows="4"
              className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white focus:border-[#00FF88] transition-colors resize-none"
              placeholder="Tell us about your interests and skills..."
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePortal;
