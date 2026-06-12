import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CertificatesPortal = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates', { credentials: 'include' });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setCertificates(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCertificates(); }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">My Certificates</h2>
        <p className="text-[#a3b8cc]">View and download your official chapter achievements.</p>
      </div>

      {loading ? (
        <div className="text-[#00FF88] font-mono animate-pulse">Scanning records...</div>
      ) : certificates.length === 0 ? (
        <div className="bg-[#0c1610] p-12 rounded-3xl border border-[#1a3324] text-center">
          <span className="material-symbols-outlined text-4xl text-[#1a3324] mb-4">folder_off</span>
          <h3 className="text-xl font-bold text-white mb-2">No Certificates Found</h3>
          <p className="text-[#a3b8cc] text-sm">Participate in events and hackathons to earn verified certificates.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0c1610] rounded-2xl border border-[#1a3324] overflow-hidden group">
              <div className="p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-accent-mint mb-4">
                  <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{cert.event_title || 'Chapter Certificate'}</h3>
                <p className="text-sm text-[#a3b8cc] uppercase font-mono">{cert.certificate_type}</p>
                <div className="mt-6 pt-4 border-t border-[#1a3324] flex justify-between items-center">
                  <span className="text-xs text-[#a3b8cc]">{new Date(cert.issued_at).toLocaleDateString()}</span>
                  <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer" className="text-[#00D4FF] hover:text-white text-sm font-bold flex items-center gap-1 transition-colors">
                    View PDF <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPortal;
