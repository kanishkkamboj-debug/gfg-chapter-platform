import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Spring config for smooth following
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);
  
  const dotX = useSpring(-100, { damping: 40, stiffness: 400 });
  const dotY = useSpring(-100, { damping: 40, stiffness: 400 });

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    setIsVisible(true);
    document.body.classList.add('custom-cursor-active');

    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('clickable');

      setIsHovered(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [cursorX, cursorY, dotX, dotY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-accent-mint rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.8 : 0.4,
          backgroundColor: isHovered ? 'rgba(0, 255, 136, 0.1)' : 'transparent'
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-accent-mint rounded-full pointer-events-none z-[9999] shadow-[0_0_10px_#00FF88]"
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          scale: isHovered ? 0 : 1,
        }}
      />
    </>
  );
};

export default CustomCursor;
