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

        <div className="mb-10 flex flex-wrap justify-center gap-1">
          {CARTE.map((c) => (
            <button
              key={c.cle}
              onClick={() => setActive(c.cle)}
              className={`px-6 py-2.5 text-[0.74rem] uppercase tracking-[0.18em] transition-all ${
                active === c.cle
                  ? 'border border-rouge bg-rouge text-white'
                  : 'border border-or/20 text-muted hover:border-or/40 hover:text-texte'
              }`}
            >
              {c.label}
            </button>
          ))}
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
            {categorie.plats.map((p) => (
              <div
                key={p.nom}
                className="flex items-baseline justify-between gap-4 border border-or/[0.05] bg-sombre px-7 py-6 transition-colors hover:border-or/20"
              >
                <div>
                  <h4 className="mb-1 font-cormorant text-lg font-medium text-creme">
                    {p.nom}
                    {p.signature && <span className="ml-2 text-sm text-or">⭐ Signature</span>}
                  </h4>
                  <p className="text-sm leading-snug text-muted">{p.description}</p>
                </div>
                <div className="whitespace-nowrap font-cormorant text-lg text-or">{p.prix}</div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
