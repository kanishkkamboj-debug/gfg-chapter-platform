import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  to, 
  href, 
  onClick, 
  ...props 
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-mono text-sm tracking-wider uppercase transition-all duration-300 overflow-hidden group';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  const variants = {
    primary: 'bg-primary text-on-primary font-bold shadow-neon hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]',
    ghost: 'bg-transparent border border-accent-mint text-accent-mint hover:bg-accent-mint/10',
    secondary: 'bg-secondary text-on-secondary hover:bg-surface-bright',
  };

  const Component = motion(to ? Link : href ? 'a' : 'button');
  const componentProps = {
    to,
    href,
    onClick,
    className: `${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`,
    ...props
  };

  return (
    <Component
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...componentProps}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      
      {/* Shimmer effect for primary button */}
      {variant === 'primary' && (
        <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]"></span>
      )}
    </Component>
  );
};

export default Button;
