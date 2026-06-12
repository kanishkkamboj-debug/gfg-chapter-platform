import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const ProfilePortal = () => {
  const { user } = useApp();
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
    designation: '',
    skills: [],
    social_links: { github: '', linkedin: '', twitter: '' },
    profile_privacy: 'public'
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            full_name: data.full_name || '',
            bio: data.bio || '',
            avatar_url: data.avatar_url || '',
            designation: data.designation || '',
            skills: data.skills || [],
            social_links: data.social_links || { github: '', linkedin: '', twitter: '' },
            profile_privacy: data.profile_privacy || 'public'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/users/me', {
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

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  if (fetching) return <div className="text-[#00FF88] p-8">Loading Profile...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Member Profile</h2>
          <p className="text-[#a3b8cc]">Manage your personal brand and developer identity.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#a3b8cc] uppercase">Privacy:</span>
          <select 
            value={formData.profile_privacy}
            onChange={e => setFormData({...formData, profile_privacy: e.target.value})}
            className="bg-[#112218] border border-[#1a3324] rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324] text-center">
            <div className="w-32 h-32 mx-auto rounded-full bg-[#112218] border-2 border-[#00FF88]/50 flex items-center justify-center overflow-hidden mb-4 relative group">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-[#00FF88]">{formData.full_name?.[0] || 'U'}</span>
              )}
            </div>
            <input 
              type="url" 
              placeholder="Avatar Image URL..."
              className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-2 text-center text-xs text-white focus:border-[#00FF88] transition-colors mb-4"
              value={formData.avatar_url}
              onChange={e => setFormData({...formData, avatar_url: e.target.value})}
            />
            <h3 className="text-xl font-bold text-white mb-1">{formData.full_name || 'Anonymous User'}</h3>
            <div className="text-xs font-mono text-[#00FF88] mb-4">@{user?.username}</div>
            
            <input 
              type="text" 
              placeholder="Designation (e.g. Full Stack Developer)"
              className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-2 text-center text-sm text-white focus:border-[#00FF88] transition-colors"
              value={formData.designation}
              onChange={e => setFormData({...formData, designation: e.target.value})}
            />
          </div>

          <div className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324]">
             <h4 className="text-xs font-mono text-[#a3b8cc] uppercase mb-4">Social Links</h4>
             <div className="space-y-3">
               <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-[#a3b8cc]">code</span>
                 <input type="text" placeholder="GitHub Username" className="flex-1 bg-[#112218] border border-[#1a3324] rounded-lg p-2 text-xs text-white" value={formData.social_links?.github || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, github: e.target.value}})} />
               </div>
               <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-[#a3b8cc]">work</span>
                 <input type="url" placeholder="LinkedIn URL" className="flex-1 bg-[#112218] border border-[#1a3324] rounded-lg p-2 text-xs text-white" value={formData.social_links?.linkedin || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, linkedin: e.target.value}})} />
               </div>
               <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-[#a3b8cc]">chat</span>
                 <input type="text" placeholder="Twitter Handle" className="flex-1 bg-[#112218] border border-[#1a3324] rounded-lg p-2 text-xs text-white" value={formData.social_links?.twitter || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, twitter: e.target.value}})} />
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Bio & Skills */}
        <div className="col-span-2 space-y-6">
          <div className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324]">
            {message && (
              <div className="mb-6 p-4 rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88]">
                {message}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-[#a3b8cc] uppercase mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white focus:border-[#00FF88] transition-colors"
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#a3b8cc] uppercase mb-2">About (Bio)</label>
                <textarea 
                  rows="4"
                  className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-white focus:border-[#00FF88] transition-colors resize-none"
                  placeholder="Tell the community about your interests and expertise..."
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#a3b8cc] uppercase mb-2">Skills / Tech Stack</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] rounded-full text-xs font-mono flex items-center gap-2">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white">&times;</button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  placeholder="Type a skill and press Enter..."
                  className="w-full bg-[#112218] border border-[#1a3324] rounded-xl p-3 text-sm text-white focus:border-[#00FF88] transition-colors"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
              </div>

              <div className="pt-4 border-t border-[#1a3324] flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-3 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePortal;
