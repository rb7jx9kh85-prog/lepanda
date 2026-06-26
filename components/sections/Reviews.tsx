import { Reveal } from '@/components/ui/Reveal';
import { GlassButton } from '@/components/ui/GlassButton';
import { AVIS } from '@/lib/menu-data';
import { RESTAURANT } from '@/lib/restaurant';

export function Reviews() {
  return (
    <section id="avis" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-14 text-center">
          <span className="section-tag">Ce que disent nos clients</span>
          <h2 className="section-title">
            Ils ont <em>adoré</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-px md:grid-cols-3">
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div className="h-full border border-or/[0.08] bg-sombre px-8 py-9 transition-colors hover:border-or/25">
                <div className="mb-4 font-cormorant text-5xl leading-[0.3] text-rouge/30">&ldquo;</div>
                <p className="mb-6 font-cormorant text-[1.05rem] italic leading-relaxed text-texte">{a.texte}</p>
                <div className="mb-3 text-sm text-or">★★★★★</div>
                <div className="text-[0.72rem] uppercase tracking-[0.15em] text-muted">{a.auteur}</div>
              </div>
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
