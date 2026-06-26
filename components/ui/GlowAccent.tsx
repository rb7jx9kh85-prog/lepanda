'use client';

import { motion } from 'framer-motion';

/**
 * Halos lumineux flottants (façon lanternes) en arrière-plan d'une section.
 * Purement décoratif, pointer-events désactivés, très discret.
 */
export function GlowAccent({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <motion.div
        className="absolute -left-20 top-10 h-72 w-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(192,57,43,0.18), transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-16 bottom-0 h-80 w-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(212,175,90,0.14), transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
    </div>
  );
}
