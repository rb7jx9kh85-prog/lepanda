'use client';

import ScrollExpandMedia from '@/components/ui/ScrollExpandMedia';
import { GlassButton } from '@/components/ui/GlassButton';
import { RESTAURANT } from '@/lib/restaurant';

/**
 * Section d'accueil : effet "scroll to expand".
 * Arrière-plan = façade extérieure du restaurant.
 * Média central qui se déploie = plat signature.
 */
export function Hero() {
  return (
    <section id="accueil" className="relative">
      {/* Images locales — remplace ces 2 fichiers dans public/images/ :
          - exterieur.jpg : facade du restaurant (affichee en premier)
          - homard.jpg    : plateau de homard (se deploie au scroll) */}
      <ScrollExpandMedia
        mediaType="image"
        bgImageSrc="/images/exterieur.jpg"
        mediaSrc="/images/homard.jpg"
        title="Le Panda"
        date="Leytron · Valais"
        scrollToExpand="Faites défiler pour découvrir"
        textBlend
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-tag mx-auto">Restaurant Asiatique</span>
          <h2 className="section-title">
            Une cuisine <em>authentique</em> au cœur du Valais
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted">
            Saveurs d’Asie préparées avec passion, portions généreuses et accueil
            chaleureux. Ouvert du mardi au dimanche, midi et soir.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GlassButton href="#carte" variant="gold">
              Découvrir notre menu
            </GlassButton>
            <GlassButton href="#reservation">Réserver une table</GlassButton>
            <GlassButton href={`tel:${RESTAURANT.telephoneRaw}`}>
              ☏ {RESTAURANT.telephone}
            </GlassButton>
          </div>
        </div>
      </ScrollExpandMedia>
    </section>
  );
}
