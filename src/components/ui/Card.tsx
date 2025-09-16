'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
  as: Component = 'div'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `
    bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 transition-all duration-300
    ${hover ? 'hover:shadow-2xl hover:border-emerald-200/50 dark:hover:border-emerald-700/50 hover:-translate-y-2 cursor-pointer hover:bg-white/90 dark:hover:bg-slate-800/90' : ''}
    ${paddingClasses[padding]}
    ${className}
  `.trim();

  if (onClick) {
    return (
      <motion.div
        whileHover={hover ? { y: -4, scale: 1.02 } : {}}
        whileTap={hover ? { scale: 0.98 } : {}}
        className={baseClasses}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component className={baseClasses}>
      {children}
    </Component>
  );
};

export default Card;