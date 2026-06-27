'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { CARTE } from '@/lib/menu-data';

export function Carte() {
  const [active, setActive] = useState(CARTE[0].cle);
  const categorie = CARTE.find((c) => c.cle === active)!;

  return (
    <section id="carte" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <span className="section-tag">Menu complet</span>
          <h2 className="section-title">
            La <em>carte</em> du Panda
          </h2>
        </Reveal>

        {/* Onglets avec indicateur animé */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CARTE.map((c) => {
            const isActive = active === c.cle;
            return (
              <button
                key={c.cle}
                onClick={() => setActive(c.cle)}
                className={`relative rounded-full px-6 py-2.5 text-[0.74rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-muted hover:text-texte'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="carte-tab-pill"
                    className="absolute inset-0 -z-0 rounded-full bg-rouge"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{c.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-px md:grid-cols-2"
          >
            {categorie.plats.map((p, i) => (
              <motion.div
                key={p.nom}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group/item relative flex items-baseline justify-between gap-4 overflow-hidden rounded-xl border border-or/[0.05] bg-sombre px-7 py-6 transition-colors hover:border-or/25"
              >
                {/* Liseré doré qui apparaît à gauche au survol */}
                <span className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-gradient-to-b from-or to-rouge transition-transform duration-300 group-hover/item:scale-y-100" />
                <div className="transition-transform duration-300 group-hover/item:translate-x-1.5">
                  <h4 className="mb-1 font-cormorant text-lg font-medium text-creme">
                    {p.nom}
                    {p.signature && <span className="ml-2 text-sm text-or">⭐ Signature</span>}
                  </h4>
                  <p className="text-sm leading-snug text-muted">{p.description}</p>
                </div>
                <div className="whitespace-nowrap font-cormorant text-lg text-or transition-transform duration-300 group-hover/item:scale-110">
                  {p.prix}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
