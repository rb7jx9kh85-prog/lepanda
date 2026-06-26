import { Reveal } from '@/components/ui/Reveal';
import { GALERIE, AVIS } from '@/lib/menu-data';
import { RESTAURANT } from '@/lib/restaurant';

const STATS = [
  { num: String(RESTAURANT.nbAvis), label: 'Avis Google' },
  { num: RESTAURANT.note, label: 'Note moyenne' },
  { num: '20-50', label: 'CHF / personne' },
  { num: 'Mar-Dim', label: 'Fermé le lundi' },
];

export function About() {
  return (
    <section id="about" className="px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal direction="right">
          <span className="section-tag">Notre histoire</span>
          <h2 className="section-title">
            Une cuisine <em>authentique</em>
            <br />
            au cœur du Valais
          </h2>
          <p className="mb-5 leading-loose text-muted">
            Le Panda vous invite à un voyage culinaire à travers les saveurs d’Asie,
            préparées avec passion et des produits soigneusement sélectionnés.
          </p>
          <p className="mb-8 leading-loose text-muted">
            Notre équipe chaleureuse vous accueille dans un cadre intimiste où
            l’excellence culinaire se marie à un service attentionné. Portions
            généreuses, prix accessibles.
          </p>
          <div className="grid grid-cols-2 gap-px">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="border border-or/10 bg-sombre px-6 py-7 transition-colors hover:border-or/35"
              >
                <div className="font-cormorant text-4xl font-medium leading-none text-or">{s.num}</div>
                <div className="mt-1.5 text-[0.72rem] uppercase tracking-[0.18em] text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <div className="grid grid-cols-2 grid-rows-2 gap-1" style={{ gridTemplateRows: '220px 220px' }}>
            {/* eslint-disable @next/next/no-img-element */}
            <div className="row-span-2 overflow-hidden">
              <img src={GALERIE[0].src} alt={GALERIE[0].alt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="overflow-hidden">
              <img src={GALERIE[1].src} alt={GALERIE[1].alt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="overflow-hidden">
              <img src={GALERIE[2].src} alt={GALERIE[2].alt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
            {/* eslint-enable @next/next/no-img-element */}
          </div>
        </Reveal>
      </div>

      {/* Avis rapides (réutilisés plus bas en section dédiée) */}
      <span className="sr-only">{AVIS.length} avis clients</span>
    </section>
  );
}
