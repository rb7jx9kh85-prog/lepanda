'use client';

import { useEffect, useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { RESTAURANT, HORAIRES, formatService, statutOuverture } from '@/lib/restaurant';

export function Infos() {
  const [statut, setStatut] = useState<{ ouvert: boolean; texte: string; jourCle: string } | null>(null);

  useEffect(() => {
    const update = () => {
      // Heure locale du restaurant (Europe/Zurich)
      const zurich = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Zurich' }));
      setStatut(statutOuverture(zurich));
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="infos" className="border-t border-or/10 bg-sombre">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px md:grid-cols-[1.3fr_1fr_1fr]">
        {/* Nous trouver */}
        <Reveal>
          <div className="h-full rounded-2xl border border-or/[0.06] bg-noir px-9 py-12">
            <h3 className="mb-5 text-[0.7rem] uppercase tracking-[0.25em] text-or">Nous trouver</h3>
            <ul className="space-y-1 text-[0.92rem] leading-loose text-muted">
              <li>{RESTAURANT.adresse}</li>
              <li>{RESTAURANT.codePostal} {RESTAURANT.ville}, {RESTAURANT.region}</li>
              <li>{RESTAURANT.etage}</li>
              <li className="pt-3">♿ Accessible PMR</li>
              <li className="pt-3">
                <a href={RESTAURANT.googleMaps} target="_blank" rel="noopener noreferrer" className="text-texte transition-colors hover:text-or">
                  Itinéraire Google Maps
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        {/* Horaires */}
        <Reveal delay={0.08}>
          <div className="h-full rounded-2xl border border-or/[0.06] bg-noir px-9 py-12">
            <h3 className="mb-5 text-[0.7rem] uppercase tracking-[0.25em] text-or">Horaires</h3>

            {statut && (
              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[0.78rem] font-semibold tracking-wide ${
                  statut.ouvert
                    ? 'border-[#2ecc71]/30 bg-[#2ecc71]/15 text-[#2ecc71]'
                    : 'border-[#e74c3c]/30 bg-[#e74c3c]/15 text-[#e74c3c]'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statut.ouvert ? 'animate-pulse bg-[#2ecc71]' : 'bg-[#e74c3c]'}`} />
                {statut.texte}
              </div>
            )}

            <div className="space-y-0">
              {HORAIRES.map((j) => {
                const isToday = statut?.jourCle === j.cle;
                return (
                  <div key={j.cle} className="border-b border-or/[0.06] py-2.5 last:border-0">
                    <div className={`mb-1 flex items-center justify-between text-[0.82rem] ${j.ferme ? 'text-rouge' : 'text-texte'}`}>
                      <span>{j.nom}</span>
                      {isToday && <span className="rounded-lg bg-or px-1.5 py-0.5 text-[0.62rem] tracking-wide text-noir">Aujourd’hui</span>}
                    </div>
                    {formatService(j).map((s, i) => (
                      <div key={i} className={`flex items-center gap-2 text-[0.8rem] ${j.ferme ? 'text-rouge/70' : 'text-muted'}`}>
                        {!j.ferme && <span className="h-1 w-1 rounded-full bg-or/50" />}
                        {s}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Contact */}
        <Reveal delay={0.16}>
          <div className="h-full rounded-2xl border border-or/[0.06] bg-noir px-9 py-12">
            <h3 className="mb-5 text-[0.7rem] uppercase tracking-[0.25em] text-or">Contact</h3>
            <ul className="space-y-3 text-[0.92rem] leading-loose text-muted">
              <li><a href={`tel:${RESTAURANT.telephoneRaw}`} className="text-texte transition-colors hover:text-or">{RESTAURANT.telephone}</a></li>
              <li><a href={`mailto:${RESTAURANT.email}`} className="text-texte transition-colors hover:text-or">{RESTAURANT.email}</a></li>
              <li><a href={RESTAURANT.facebook} target="_blank" rel="noopener noreferrer" className="text-texte transition-colors hover:text-or">Facebook</a></li>
              <li><a href={RESTAURANT.googleMaps} target="_blank" rel="noopener noreferrer" className="text-texte transition-colors hover:text-or">Nos avis Google</a></li>
              <li><a href="#reservation" className="text-texte transition-colors hover:text-or">Réserver en ligne</a></li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
