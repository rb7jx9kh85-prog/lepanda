'use client';

import { PortfolioGallery } from '@/components/ui/PortfolioGallery';
import { GALERIE } from '@/lib/menu-data';
import { RESTAURANT } from '@/lib/restaurant';

export function Gallery() {
  return (
    <section id="galerie" className="bg-sombre">
      <PortfolioGallery
        title="Notre galerie"
        archiveButton={{ text: 'Voir sur Facebook', href: RESTAURANT.facebook }}
        images={GALERIE}
        className="!min-h-0"
      />
    </section>
  );
}
