import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';

export const AnnouncementDetailPage = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/announcements/${id}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to load announcement');
        const data = await response.json();
        setAnnouncement(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-accent-mint border-t-transparent rounded-full"></div></div>;
  if (error || !announcement) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <span className="material-symbols-outlined text-6xl text-error">error</span>
      <h2 className="text-2xl text-white">Transmission Not Found</h2>
      <Link to="/announcements" className="text-accent-mint hover:underline">Return to Log</Link>
    </div>
  );

  return (
    <div className="container-max py-24 min-h-screen relative z-10 max-w-4xl mx-auto">
      <ScrollReveal>
        <Link to="/announcements" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 font-mono text-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Announcements
        </Link>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <TiltCard className="p-8 md:p-12 rounded-[2rem] border-t-accent-mint/30">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="px-3 py-1 bg-surface-container-high text-accent-mint rounded-full text-xs font-mono uppercase border border-border-low-opacity">
              {announcement.category || 'Notice'}
            </span>
            <span className="text-text-muted font-mono text-sm">
              {new Date(announcement.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 leading-tight">
            {announcement.title}
          </h1>

          {announcement.image_url && (
            <div className="rounded-xl overflow-hidden mb-8 border border-border-low-opacity">
              <img loading="lazy" src={announcement.image_url} alt="" className="w-full h-auto object-cover max-h-96" />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-text-muted leading-relaxed font-light whitespace-pre-wrap">
              {announcement.description}
            </p>
          </div>

          {announcement.link && (
            <div className="mt-12 pt-8 border-t border-border-low-opacity">
              <a href={announcement.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full font-bold hover:shadow-neon transition-all hover:scale-105">
                Execute Link
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          )}
        </TiltCard>
      </ScrollReveal>
    </div>
  );
};

export default AnnouncementDetailPage;
