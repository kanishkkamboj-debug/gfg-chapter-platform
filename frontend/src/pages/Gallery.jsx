import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

export const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'seminars', label: 'Seminars' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'hackathons', label: 'Hackathons' },
    { id: 'community', label: 'Community Events' }
  ];

  const images = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    src: `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&sig=${i}`,
    type: categories[(i % 5) + 1].id,
    title: `${categories[(i % 5) + 1].label} Highlight ${i + 1}`
  }));

  const filteredImages = activeCategory === 'all' ? images : images.filter(img => img.type === activeCategory);

  return (
    <div className="container-max py-24 min-h-screen relative z-10">
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            <motion.img 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              src={selectedImage.src} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] object-contain"
            />
            <div className="absolute bottom-8 text-center">
               <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
               <span className="text-[#00FF88] font-mono text-sm uppercase">{selectedImage.type}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollReveal>
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Visual <span className="gradient-text-primary">Archive</span>
          </h1>
          <p className="text-xl text-[#a3b8cc] font-light max-w-2xl mx-auto mb-10">
            A curated masonry gallery capturing our workshops, seminars, and hackathons.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-bold transition-all text-sm ${
                  activeCategory === cat.id ? 'bg-[#00FF88] text-[#0a1118] shadow-neon' : 'bg-[#0c1610] text-[#a3b8cc] hover:text-white border border-[#1a3324]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {filteredImages.map(img => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              key={img.id}
              className="break-inside-avoid relative rounded-3xl overflow-hidden cursor-pointer group border border-[#1a3324] hover:border-[#00FF88]/50 transition-colors bg-[#0c1610]"
              onClick={() => setSelectedImage(img)}
            >
              <img src={img.src} alt={img.title} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1118] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                 <span className="material-symbols-outlined text-white text-3xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">zoom_in</span>
                 <h3 className="text-white font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{img.title}</h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GalleryPage;
