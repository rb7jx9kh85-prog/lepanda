'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Délai d'entrée (s) */
  delay?: number;
  /** Direction d'apparition */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  /** Décalage initial en px */
  distance?: number;
}

/**
 * Wrapper d'animation d'apparition au scroll — discret et pro.
 * Le texte/section monte légèrement en fondu une seule fois.
 */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  distance = 24,
}: RevealProps) {
  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }[direction];

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}
