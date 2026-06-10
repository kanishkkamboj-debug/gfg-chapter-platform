import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MagneticButton = ({ children, className = '', onClick, href, strength = 40, ...props }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { width, height, left, top } = buttonRef.current.getBoundingClientRect();
    
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    setPosition({ 
      x: x / width * strength, 
      y: y / height * strength 
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = href ? Link : motion.button;
  const linkProps = href ? { to: href } : { onClick };

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block relative z-10"
    >
      {href ? (
        <Link
          to={href}
          className={`group relative px-8 py-4 text-sm font-semibold overflow-hidden transition-all duration-300 ${className}`}
          {...props}
        >
          {children}
        </Link>
      ) : (
        <motion.button
          onClick={onClick}
          className={`group relative px-8 py-4 text-sm font-semibold overflow-hidden transition-all duration-300 ${className}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          {...props}
        >
          {children}
        </motion.button>
      )}
    </motion.div>
  );
};

export default MagneticButton;
