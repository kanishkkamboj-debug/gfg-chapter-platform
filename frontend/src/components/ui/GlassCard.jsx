import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ 
  children, 
  className = '', 
  hover = false,
  glow = false,
  animate = false,
  delay = 0,
  ...props 
}) => {
  const baseClasses = `glass-card relative overflow-hidden ${hover ? 'glass-card-hover' : ''} ${className}`;

  const InnerContent = () => (
    <>
      {glow && (
        <>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-mint/0 via-accent-mint/10 to-accent-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl z-0 pointer-events-none"></div>
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className={baseClasses + " group"}
        {...props}
      >
        <InnerContent />
      </motion.div>
    );
  }

  return (
    <div className={baseClasses + (glow ? " group" : "")} {...props}>
      <InnerContent />
    </div>
  );
};

export default GlassCard;
