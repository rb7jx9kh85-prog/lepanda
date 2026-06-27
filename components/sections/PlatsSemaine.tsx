'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { GlowAccent } from '@/components/ui/GlowAccent';
import { db, MENU_DOC_PATH, type LiveMenu, type PlatLive } from '@/lib/firebase';

const TYPE_LABELS: Record<string, string> = {
  entree: 'Entrée',
  entrée: 'Entrée',
  plat: 'Plat',
  plat_jour: 'Plat du jour',
  plat_principal: 'Plat principal',
  dessert: 'Dessert',
  boisson: 'Boisson',
};

function labelType(type: string): string {
  return TYPE_LABELS[type?.toLowerCase()] ?? (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Plat');
}

function prixPlat(p: PlatLive): string {
  if (typeof p.prix === 'number' && p.prix > 0) return `${p.prix.toFixed(2)} CHF`;
  if (typeof p.menu_prix === 'number' && p.menu_prix > 0) return 'Au menu';
  return '';
}

export function PlatsSemaine() {
  const [menu, setMenu] = useState<LiveMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ref = doc(db, ...MENU_DOC_PATH);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setMenu(snap.exists() ? (snap.data() as LiveMenu) : null);
        setLoading(false);
        setError(false);
      },
      () => {
        setError(true);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const plats = menu?.plats ?? [];

  return (
    <section id="plats-semaine" className="relative border-y border-or/10 bg-noir px-6 py-24 md:px-12">
      <GlowAccent />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-or/20 bg-or/[0.08] px-4 py-1.5 text-[0.72rem] tracking-wider text-or">
            <span className={`inline-block h-1.5 w-1.5 rounded-full bg-or ${loading ? 'animate-pulse' : ''}`} />
            {menu?.semaine ? `Semaine du ${menu.semaine}` : 'Menu de la semaine'}
          </div>
          <span className="section-tag">Sélections du moment</span>
          <h2 className="section-title">
            Plats de la <em>semaine</em>
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted">
            {menu?.description_menu
              ? menu.description_menu
              : 'Notre chef renouvelle la sélection chaque semaine selon les produits frais du marché.'}
            {typeof menu?.prix_menu === 'number' && (
              <span className="mt-3 block font-cormorant text-xl text-or">
                Menu à {menu.prix_menu.toFixed(2)} CHF
              </span>
            )}
          </p>
        </Reveal>

        {/* État : chargement */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-xl border border-or/[0.06] bg-sombre"
              />
            ))}
          </div>
        )}

        {/* État : aucun menu publié (ou erreur de lecture) */}
        {!loading && plats.length === 0 && (
          <Reveal className="mx-auto max-w-lg rounded-2xl border border-or/[0.1] bg-sombre px-8 py-14 text-center">
            <div className="mb-4 text-4xl">🐼</div>
            <h3 className="mb-2 font-cormorant text-2xl text-creme">
              {error ? 'Menu momentanément indisponible' : 'Le menu arrive bientôt'}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {error
                ? 'Impossible de charger le menu pour le moment. Réessayez dans un instant.'
                : 'Le menu de la semaine sera disponible prochainement. Revenez vite !'}
            </p>
          </Reveal>
        )}

        {/* État : menu affiché */}
        {!loading && plats.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plats.map((p, i) => (
              <Reveal key={p.id || i} delay={(i % 3) * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="group/plat relative h-full overflow-hidden rounded-xl border border-or/[0.06] bg-sombre px-7 py-8 transition-colors hover:border-or/30"
                >
                  {/* Barre d'accent dégradée révélée au survol */}
                  <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-rouge via-or to-or-clair transition-transform duration-500 group-hover/plat:scale-x-100" />
                  {/* Reflet qui balaye */}
                  <span
                    className="pointer-events-none absolute left-[-150%] top-0 h-full w-[140%] -skew-x-12 opacity-0 transition-all duration-[900ms] group-hover/plat:left-[150%] group-hover/plat:opacity-100"
                    style={{ background: 'linear-gradient(110deg, transparent, rgba(255,255,255,0.06), transparent)' }}
                  />
                  {p.jour && (
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-or/15 px-2.5 py-1 text-[0.62rem] uppercase tracking-wider text-or">
                      {p.jour}
                    </span>
                  )}
                  <div className="relative">
                    <div className="mb-2.5 text-[0.65rem] uppercase tracking-[0.2em] text-rouge">
                      {p.emoji} {labelType(p.type)}
                    </div>
                    <h4 className="mb-2 font-cormorant text-xl font-medium text-creme">{p.nom}</h4>
                    <p className="text-[0.83rem] leading-relaxed text-muted">{p.description}</p>
                    {prixPlat(p) && (
                      <div className="mt-3.5 font-cormorant text-lg text-or transition-transform duration-300 group-hover/plat:origin-left group-hover/plat:scale-105">
                        {prixPlat(p)}
                      </div>
                    )}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
