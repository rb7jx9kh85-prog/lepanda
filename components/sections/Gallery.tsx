'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioGallery } from '@/components/ui/PortfolioGallery';
import { GALERIE } from '@/lib/menu-data';
import { RESTAURANT } from '@/lib/restaurant';

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + GALERIE.length) % GALERIE.length)),
    []
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % GALERIE.length)),
    []
  );

  // Navigation clavier + blocage du scroll quand le lightbox est ouvert
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close, prev, next]);

  return (
    <section id="galerie" className="bg-sombre">
      <PortfolioGallery
        title="Notre galerie"
        archiveButton={{ text: 'Voir sur Facebook', href: RESTAURANT.facebook }}
        images={GALERIE}
        className="!min-h-0"
        onImageClick={(i) => setOpenIndex(i)}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-noir/90 p-4 backdrop-blur-md sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            {/* Fermer */}
            <button
              aria-label="Fermer"
              onClick={close}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <X size={22} />
            </button>

            {/* Précédent */}
            <button
              aria-label="Image précédente"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft size={26} />
            </button>

            {/* Suivant */}
            <button
              aria-label="Image suivante"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight size={26} />
            </button>

            {/* Image agrandie */}
            <motion.figure
              key={openIndex}
              className="relative max-h-[85vh] max-w-[92vw] overflow-hidden rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.7)] sm:max-w-[80vw]"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={GALERIE[openIndex!].src}
                alt={GALERIE[openIndex!].alt}
                className="max-h-[85vh] w-auto object-contain"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/80 to-transparent px-5 py-4 text-sm tracking-wide text-creme">
                {GALERIE[openIndex!].alt}
                <span className="ml-2 text-muted">· {openIndex! + 1} / {GALERIE.length}</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
