import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/public/${username}`);
        if (!res.ok) {
          throw new Error('Profile not found or is private');
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="container-max py-24 min-h-screen relative z-10 flex items-center justify-center">
        <div className="text-[#00FF88] animate-pulse font-mono text-xl">Loading Identity Matrix...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container-max py-24 min-h-screen relative z-10 flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
        <h2 className="text-3xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-[#a3b8cc] text-center mb-8">{error}</p>
        <Link to="/" className="px-6 py-3 bg-[#00FF88] text-[#0a1118] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all">
          Return to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      <Link to="/team" className="inline-flex items-center gap-2 text-[#a3b8cc] hover:text-[#00FF88] transition-colors mb-8">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span className="font-mono text-xs uppercase tracking-wider">Back to Community</span>
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324] text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00FF88]/5 rounded-full blur-3xl group-hover:bg-[#00FF88]/10 transition-colors"></div>
            
            <div className="w-40 h-40 mx-auto rounded-full bg-[#112218] border border-[#00FF88]/30 flex items-center justify-center overflow-hidden mb-6 relative z-10">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-bold text-[#00FF88]">{profile.full_name?.[0] || 'U'}</span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-white mb-1">{profile.full_name}</h1>
            <h2 className="text-[#a3b8cc] font-mono text-sm mb-4">@{profile.username}</h2>
            
            {profile.designation && (
              <div className="inline-block px-4 py-1.5 bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                {profile.designation}
              </div>
            )}

            <div className="flex justify-center gap-4">
              {profile.social_links?.github && (
                <a href={profile.social_links.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#112218] border border-[#1a3324] flex items-center justify-center text-[#a3b8cc] hover:text-white hover:border-[#00FF88] transition-all">
                  <span className="material-symbols-outlined text-lg">code</span>
                </a>
              )}
              {profile.social_links?.linkedin && (
                <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#112218] border border-[#1a3324] flex items-center justify-center text-[#a3b8cc] hover:text-white hover:border-[#00FF88] transition-all">
                  <span className="material-symbols-outlined text-lg">work</span>
                </a>
              )}
              {profile.social_links?.twitter && (
                <a href={profile.social_links.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#112218] border border-[#1a3324] flex items-center justify-center text-[#a3b8cc] hover:text-white hover:border-[#00FF88] transition-all">
                  <span className="material-symbols-outlined text-lg">chat</span>
                </a>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0c1610] p-6 rounded-3xl border border-[#1a3324]"
          >
            <h3 className="text-xs font-mono text-[#a3b8cc] uppercase mb-4 tracking-wider">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-[#112218] border border-[#1a3324] text-[#a3b8cc] hover:text-[#00FF88] hover:border-[#00FF88]/50 transition-colors rounded-lg text-xs font-mono">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-muted">No skills mapped yet.</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324]"
          >
            <h3 className="text-xl font-bold text-white mb-6">About</h3>
            {profile.bio ? (
              <p className="text-[#a3b8cc] leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
            ) : (
              <p className="text-text-muted italic">This user hasn't added a bio yet.</p>
            )}
            
            <div className="mt-8 pt-8 border-t border-[#1a3324]">
               <div className="flex items-center gap-3 text-sm text-[#a3b8cc]">
                 <span className="material-symbols-outlined text-[#00FF88]">military_tech</span>
                 <span>Member since {new Date(profile.joined_at).getFullYear()}</span>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0c1610] p-8 rounded-3xl border border-[#1a3324]"
          >
            <h3 className="text-xl font-bold text-white mb-6">Contributions & Activity</h3>
            <div className="flex items-center justify-center py-12 border-2 border-dashed border-[#1a3324] rounded-2xl">
               <p className="text-[#a3b8cc] text-sm">Activity graph module will be mounted here in future updates.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
