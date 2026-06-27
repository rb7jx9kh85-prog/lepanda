'use client';

import { motion } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { GlassButton } from '@/components/ui/GlassButton';
import { AVIS } from '@/lib/menu-data';
import { RESTAURANT } from '@/lib/restaurant';

export function Reviews() {
  return (
    <section id="avis" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-10 text-center">
          <span className="section-tag">Ce que disent nos clients</span>
          <h2 className="section-title">
            Ils ont <em>adoré</em>
          </h2>
          {/* Badge note Google */}
          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-or/20 bg-or/[0.06] px-5 py-2">
            <span className="font-cormorant text-2xl font-semibold text-or">{RESTAURANT.note}</span>
            <span className="text-sm text-or">★★★★★</span>
            <span className="text-xs tracking-wide text-muted">{RESTAURANT.nbAvis} avis Google</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group/review relative h-full overflow-hidden rounded-xl border border-or/[0.08] bg-sombre px-8 py-9 transition-colors hover:border-or/30"
              >
                {/* Halo dégradé au survol */}
                <span
                  className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover/review:opacity-100"
                  style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(212,175,90,0.10), transparent 60%)' }}
                />
                <div className="relative">
                  <div className="mb-4 font-cormorant text-5xl leading-[0.3] text-rouge/30 transition-colors group-hover/review:text-rouge/50">
                    &ldquo;
                  </div>
                  <p className="mb-6 font-cormorant text-[1.05rem] italic leading-relaxed text-texte">{a.texte}</p>
                  <div className="mb-3 text-sm text-or">★★★★★</div>
                  <div className="text-[0.72rem] uppercase tracking-[0.15em] text-muted">{a.auteur}</div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <p className="mb-5 text-sm text-muted">Vous avez dîné chez nous ? Partagez votre expérience !</p>
          <GlassButton href={RESTAURANT.googleMaps} external variant="gold">
            ★ Laisser un avis Google
          </GlassButton>
        </Reveal>
      </div>
    </section>
  );
}
