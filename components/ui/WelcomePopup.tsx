'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { X } from 'lucide-react';
import { db, MENU_DOC_PATH, type LiveMenu, type PlatLive } from '@/lib/firebase';

function prixPlat(p: PlatLive): string {
  if (typeof p.prix === 'number' && p.prix > 0) return `${p.prix.toFixed(2)} CHF`;
  if (typeof p.menu_prix === 'number' && p.menu_prix > 0) return 'Au menu';
  return '';
}

export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<LiveMenu | null>(null);

  useEffect(() => {
    const ref = doc(db, ...MENU_DOC_PATH);
    const unsub = onSnapshot(ref, (snap) => {
      setMenu(snap.exists() ? (snap.data() as LiveMenu) : null);
    });
    setOpen(true);
    return () => unsub();
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[1000] bg-noir/70 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed inset-x-4 top-1/2 z-[1001] mx-auto max-w-lg -translate-y-1/2 overflow-hidden rounded-2xl border border-or/25 bg-sombre shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-noir/50 text-muted transition-colors hover:bg-or/20 hover:text-or"
            >
              <X size={16} />
            </button>

            {/* En-tête */}
            <div className="border-b border-or/15 bg-noir/60 px-6 pb-5 pt-6 text-center">
              <div className="mb-3 text-4xl">🐼</div>
              <h2 className="font-cormorant text-[1.6rem] font-semibold leading-tight text-creme">
                Bienvenue au Panda !
              </h2>
              <p className="mt-1.5 text-[0.75rem] tracking-wide text-muted">
                {menu?.semaine ? `Menu · semaine du ${menu.semaine}` : 'Restaurant asiatique · Leytron'}
              </p>
            </div>

            {/* Contenu menu */}
            <div className="max-h-[46vh] overflow-y-auto px-6 py-5">
              {menu && menu.plats.length > 0 ? (
                <>
                  {(menu.description_menu || menu.prix_menu) && (
                    <div className="mb-4 rounded-xl border border-or/15 bg-or/[0.06] px-4 py-3 text-center">
                      {menu.description_menu && (
                        <p className="text-[0.8rem] text-texte">{menu.description_menu}</p>
                      )}
                      {typeof menu.prix_menu === 'number' && (
                        <p className="mt-1 font-cormorant text-lg text-or">
                          Menu à {menu.prix_menu.toFixed(2)} CHF
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-2.5">
                    {menu.plats.map((p, i) => (
                      <div
                        key={p.id || i}
                        className="flex items-start gap-3 rounded-xl border border-or/[0.08] bg-noir/40 px-4 py-3"
                      >
                        <span className="mt-0.5 text-xl leading-none">{p.emoji || '🍽️'}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-cormorant text-[1rem] font-medium text-creme">{p.nom}</span>
                            {prixPlat(p) && (
                              <span className="shrink-0 text-[0.72rem] text-or">{prixPlat(p)}</span>
                            )}
                          </div>
                          {p.jour && (
                            <span className="text-[0.62rem] uppercase tracking-wider text-rouge">{p.jour}</span>
                          )}
                          {p.description && (
                            <p className="mt-0.5 text-[0.76rem] leading-relaxed text-muted">{p.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="py-6 text-center text-sm text-muted">
                  Le menu de la semaine sera disponible prochainement. À bientôt 🐼
                </p>
              )}
            </div>

            {/* Pied de page */}
            <div className="flex gap-3 border-t border-or/15 bg-noir/60 px-6 py-4">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-or/20 py-2.5 text-[0.8rem] text-muted transition-colors hover:border-or/40 hover:text-or"
              >
                Fermer
              </button>
              <a
                href="#reservation"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl bg-rouge py-2.5 text-center text-[0.8rem] font-semibold text-white transition-colors hover:bg-rouge/80"
              >
                Réserver une table
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
