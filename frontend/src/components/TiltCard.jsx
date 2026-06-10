import React, { useRef, useState } from 'react';

const TiltCard = ({ children, className = '', maxTilt = 8, scale = 1.02 }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const tiltX = (maxTilt / 2 - x * maxTilt).toFixed(2);
    const tiltY = (y * maxTilt - maxTilt / 2).toFixed(2);

    setStyle({
      transform: `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'none',
      '--mouseX': `${x * 100}%`,
      '--mouseY': `${y * 100}%`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      '--mouseX': '50%',
      '--mouseY': '50%',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative preserve-3d glass-card overflow-hidden group ${className}`}
      style={style}
    >
      {/* Light Reflection */}
      <div 
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--mouseX, 50%) var(--mouseY, 50%), rgba(255,255,255,0.08) 0%, transparent 60%)`
        }}
      />
      <div className="relative z-20 h-full w-full transform translate-z-[20px]">
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
