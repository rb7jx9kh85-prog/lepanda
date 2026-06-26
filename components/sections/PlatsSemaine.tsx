import { Reveal } from '@/components/ui/Reveal';
import { GlowAccent } from '@/components/ui/GlowAccent';
import { PLATS_SEMAINE } from '@/lib/menu-data';

export function PlatsSemaine() {
  return (
    <section id="plats-semaine" className="relative border-y border-or/10 bg-noir px-6 py-24 md:px-12">
      <GlowAccent />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-or/20 bg-or/[0.08] px-4 py-1.5 text-[0.72rem] tracking-wider text-or">
            ⚙ Mis à jour chaque semaine
          </div>
          <span className="section-tag">Sélections du moment</span>
          <h2 className="section-title">
            Plats de la <em>semaine</em>
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted">
            Notre chef renouvelle la sélection chaque semaine selon les produits frais
            du marché.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
          {PLATS_SEMAINE.map((p, i) => (
            <Reveal key={p.nom} delay={(i % 3) * 0.08}>
              <div className="relative h-full border border-or/[0.06] bg-sombre px-7 py-8 transition-all duration-300 hover:-translate-y-1 hover:border-or/25">
                {p.badge && (
                  <span className="absolute right-4 top-4 bg-rouge px-2.5 py-1 text-[0.65rem] uppercase tracking-wider text-white">
                    {p.badge}
                  </span>
                )}
                <div className="mb-2.5 text-[0.65rem] uppercase tracking-[0.2em] text-rouge">{p.tag}</div>
                <h4 className="mb-2 font-cormorant text-xl font-medium text-creme">{p.nom}</h4>
                <p className="text-[0.83rem] leading-relaxed text-muted">{p.description}</p>
                <div className="mt-3.5 font-cormorant text-lg text-or">{p.prix}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-sm italic text-muted/70">
          ⓘ Ces plats sont présentatifs — la carte réelle est disponible au restaurant
          ou sur demande.
        </p>
      </div>
    </section>
  );
}
