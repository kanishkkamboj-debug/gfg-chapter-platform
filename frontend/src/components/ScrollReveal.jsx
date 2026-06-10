import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.8, 
  stagger = 0,
  className = '' 
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    
    let x = 0;
    let y = 0;
    
    switch (direction) {
      case 'up': y = 50; break;
      case 'down': y = -50; break;
      case 'left': x = 50; break;
      case 'right': x = -50; break;
      default: y = 50;
    }

    gsap.fromTo(
      el,
      { opacity: 0, x, y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [direction, delay, duration, stagger]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
