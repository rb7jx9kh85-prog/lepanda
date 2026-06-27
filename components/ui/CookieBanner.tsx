'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'lepanda_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem(STORAGE_KEY, 'refused');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[1000] border-t border-or/10 bg-noir/95 px-5 py-4 backdrop-blur-xl md:bottom-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:rounded-2xl md:border md:border-or/15 md:px-7 md:py-5 md:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          style={{ maxWidth: '680px', width: '100%' }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.82rem] leading-relaxed text-muted">
              Ce site utilise des cookies fonctionnels pour son bon fonctionnement (Firebase, chatbot).
              Aucune donnée personnelle n&apos;est vendue ou partagée avec des tiers.{' '}
              <Link href="/mentions-legales" className="text-or underline underline-offset-2 hover:text-or/80">
                En savoir plus
              </Link>
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={refuse}
                className="rounded-full border border-or/20 px-5 py-2 text-[0.78rem] text-muted transition-colors hover:border-or/40 hover:text-texte"
              >
                Refuser
              </button>
              <button
                onClick={accept}
                className="rounded-full bg-or px-5 py-2 text-[0.78rem] font-semibold text-noir transition-colors hover:bg-or/90"
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
