'use client';

import InkReveal from '@/components/ui/InkReveal';
import { Reveal } from '@/components/ui/Reveal';
import { SPECIALITES } from '@/lib/menu-data';

export function Specialites() {
  return (
    <section id="menu" className="border-y border-or/10 bg-sombre">
      {/* Bandeau titre avec révélation à l'encre sur l'image du homard */}
      <div className="relative mx-4 mt-6 h-[60vh] min-h-[420px] overflow-hidden rounded-3xl md:mx-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ChatGPT Image 26 juin 2026, 18_16_04.png"
          alt="Plateau de homard du Panda"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Masque crème « gratté » au survol pour révéler le plat */}
        <InkReveal maskColor={[26, 17, 8]} brushSize={140} lifetime={650} />

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <span className="mb-3 text-[0.68rem] uppercase tracking-[0.35em] text-rouge drop-shadow">
            Nos spécialités
          </span>
          <h2 className="px-6 font-cormorant text-[clamp(2.5rem,7vw,5rem)] font-medium leading-none text-creme drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
            Une carte <em className="not-italic text-or">généreuse</em>
          </h2>
          <p className="mt-4 text-sm tracking-wide text-creme/80 drop-shadow">
            Passez la souris pour révéler le plat
          </p>
        </div>
      </div>

      {/* Grille des spécialités */}
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-12">
        <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALITES.map((s, i) => (
            <Reveal key={s.titre} delay={(i % 3) * 0.08}>
              <div className="h-full rounded-2xl border border-or/[0.06] bg-noir px-8 py-10 transition-all duration-300 hover:-translate-y-1 hover:border-or/25 hover:shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
                <div className="mb-5 text-3xl">{s.icone}</div>
                <h3 className="mb-3 font-cormorant text-2xl font-medium text-creme">{s.titre}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.description}</p>
                <div className="mt-5 font-cormorant text-xl text-or">{s.prix}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
