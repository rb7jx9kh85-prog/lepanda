import React from 'react';
import { RESTAURANT, HORAIRES, formatService } from '@/lib/restaurant';

export function Footer() {
  return (
    <footer className="bg-[#24160C] px-5 py-16 md:px-10">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[28px] border border-or/[0.08] bg-[#0E0A08] px-8 py-14 md:px-16 md:py-[70px]">
        {/* Halo décoratif */}
        <div
          className="pointer-events-none absolute right-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8d6027 0%, transparent 70%)' }}
        />

        {/* Header */}
        <div className="mb-14 flex flex-col items-start justify-between gap-8 border-b border-white/[0.05] pb-14 md:flex-row md:items-end">
          <div>
            <h2 className="font-cormorant text-[3.5rem] font-semibold leading-none tracking-[-2px] text-or md:text-[5rem]">
              Le Panda
            </h2>
            <p className="mt-2 text-[0.75rem] uppercase tracking-[0.3em] text-or/40">
              {RESTAURANT.cuisine} · {RESTAURANT.ville}
            </p>
          </div>
          <p className="max-w-[320px] text-[0.92rem] leading-[1.9] text-[#8E7658]">
            Une cuisine raffinée inspirée de l&apos;Asie, dans un lieu chaleureux où chaque détail est pensé pour offrir une expérience unique.
          </p>
        </div>

        {/* Grille 3 colonnes */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Colonne 1 — Adresse */}
          <div className="group rounded-2xl border border-white/[0.04] bg-white/[0.015] p-8 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-or/20 hover:bg-white/[0.025]">
            <small className="mb-7 block text-[11px] uppercase tracking-[0.35em] text-or/70">Nous trouver</small>
            <h3 className="mb-6 font-cormorant text-[1.7rem] font-medium text-[#F3D5A4]">Restaurant</h3>
            <p className="text-[0.9rem] leading-[2] text-[#9A866D]">
              {RESTAURANT.adresse}<br />
              {RESTAURANT.codePostal} {RESTAURANT.ville}, {RESTAURANT.region}<br />
              {RESTAURANT.etage}
            </p>
            <div className="mt-5">
              <FooterLink href={RESTAURANT.googleMaps} external>Google Maps</FooterLink>
              <FooterLink href={RESTAURANT.googleMaps} external>Accessible PMR</FooterLink>
            </div>
          </div>

          {/* Colonne 2 — Horaires */}
          <div className="group rounded-2xl border border-white/[0.04] bg-white/[0.015] p-8 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-or/20 hover:bg-white/[0.025]">
            <small className="mb-7 block text-[11px] uppercase tracking-[0.35em] text-or/70">Horaires</small>
            <div className="space-y-0">
              {HORAIRES.map((j) => {
                const services = formatService(j);
                return (
                  <div key={j.cle} className="flex justify-between border-b border-white/[0.05] py-3 last:border-0 text-[0.87rem]">
                    <span className="text-[#E5C48C]">{j.nom}</span>
                    <span className={j.ferme ? 'text-rouge/70' : 'text-[#8D755A]'}>
                      {services.join(' · ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colonne 3 — Contact */}
          <div className="group rounded-2xl border border-white/[0.04] bg-white/[0.015] p-8 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-or/20 hover:bg-white/[0.025]">
            <small className="mb-7 block text-[11px] uppercase tracking-[0.35em] text-or/70">Contact</small>
            <div>
              <FooterLink href={`tel:${RESTAURANT.telephoneRaw}`}>{RESTAURANT.telephone}</FooterLink>
              <FooterLink href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</FooterLink>
              <FooterLink href="#reservation">Réserver une table</FooterLink>
              <FooterLink href={RESTAURANT.facebook} external>Facebook</FooterLink>
              <FooterLink href={RESTAURANT.googleMaps} external>Avis Google</FooterLink>
            </div>
          </div>
        </div>

        {/* Barre du bas */}
        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-white/[0.05] pt-8 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[0.82rem] text-[#6E604E]">
              © {new Date().getFullYear()} Le Panda · Tous droits réservés
            </span>
            <a href="/mentions-legales" className="text-[0.78rem] text-[#6E604E] underline underline-offset-2 transition-colors hover:text-[#B99053]">
              Mentions légales & Cookies
            </a>
          </div>
          <div className="flex gap-8">
            <SocialLink href={RESTAURANT.facebook} external>Facebook</SocialLink>
            <SocialLink href={RESTAURANT.googleMaps} external>Google Maps</SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex justify-between border-b border-white/[0.05] py-4 text-[0.9rem] text-[#E3BF87] transition-all duration-300 last:border-0 hover:pl-2 hover:text-white"
    >
      <span>{children}</span>
      <span className="opacity-60">→</span>
    </a>
  );
}

function SocialLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-[0.9rem] text-[#B99053] transition-colors duration-300 hover:text-white"
    >
      {children}
    </a>
  );
}
