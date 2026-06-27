'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassButton } from '@/components/ui/GlassButton';
import { AVIS } from '@/lib/menu-data';
import { RESTAURANT } from '@/lib/restaurant';

function TestimonialCard({ texte, auteur }: { texte: string; auteur: string }) {
  return (
    <div className="rounded-2xl border border-or/[0.12] bg-sombre px-7 py-6 transition-colors hover:border-or/30 hover:bg-sombre/80">
      <div className="mb-3 text-sm tracking-wide text-or">★★★★★</div>
      <p className="mb-5 font-cormorant text-[1.07rem] italic leading-relaxed text-texte">
        &ldquo;{texte}&rdquo;
      </p>
      <div className="text-[0.7rem] uppercase tracking-[0.15em] text-muted">{auteur}</div>
    </div>
  );
}

function TestimonialsColumn({
  testimonials,
  duration = 20,
  className = '',
}: {
  testimonials: typeof AVIS;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="flex flex-col gap-4"
      >
        {[...Array(2)].map((_, idx) => (
          <React.Fragment key={idx}>
            {testimonials.map((a, i) => (
              <TestimonialCard key={i} texte={a.texte} auteur={a.auteur} />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function Reviews() {
  const col1 = AVIS.filter((_, i) => i % 3 === 0);
  const col2 = AVIS.filter((_, i) => i % 3 === 1);
  const col3 = AVIS.filter((_, i) => i % 3 === 2);

  return (
    <section id="avis" className="overflow-hidden px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        {/* En-tête */}
        <div className="mb-14 text-center">
          <span className="section-tag">Ce que disent nos clients</span>
          <h2 className="section-title">
            Ils ont <em>adoré</em>
          </h2>
          <p className="mx-auto max-w-sm text-sm text-muted">
            {RESTAURANT.nbAvis} avis Google &middot; Note {RESTAURANT.note}/5
          </p>
        </div>

        {/* Colonnes défilantes */}
        <div
          className="grid h-[520px] grid-cols-1 gap-4 overflow-hidden md:grid-cols-3 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
        >
          <TestimonialsColumn testimonials={col1} duration={24} />
          <TestimonialsColumn testimonials={col2} duration={19} className="hidden md:block" />
          <TestimonialsColumn testimonials={col3} duration={27} className="hidden md:block" />
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="mb-5 text-sm text-muted">Vous avez dîné chez nous ? Partagez votre expérience.</p>
          <GlassButton href={RESTAURANT.googleMaps} external variant="gold">
            ★ Laisser un avis Google
          </GlassButton>
        </div>
      </div>
    </section>
  );
}
