import Image from 'next/image';
import { RESTAURANT } from '@/lib/restaurant';

const NAV = [
  { href: '#about', label: 'Notre histoire' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#menu', label: 'Spécialités' },
  { href: '#carte', label: 'La carte' },
  { href: '#plats-semaine', label: 'Plats du moment' },
  { href: '#reservation', label: 'Réserver' },
  { href: '#infos', label: 'Contact' },
  { href: RESTAURANT.facebook, label: 'Facebook', external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-or/10 bg-noir px-6 pb-10 pt-14 md:px-12">
      <div className="mx-auto mb-10 grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <Image src="/images/logo.jpg" alt={`Logo ${RESTAURANT.nom}`} width={56} height={56} className="h-14 w-14 rounded-full border-2 border-or/30 object-cover" />
            <span className="font-serifsc text-[1.4rem] text-or">Le Panda</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Restaurant asiatique à {RESTAURANT.ville}, au cœur du {RESTAURANT.region}.
            Cuisine authentique, portions généreuses, accueil chaleureux.
          </p>
        </div>

        <div>
          <h4 className="mb-5 text-[0.68rem] uppercase tracking-[0.25em] text-or">Navigation</h4>
          <ul className="flex flex-col gap-2.5">
            {NAV.map((l) => (
              <li key={l.label}>
                <a href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined} className="text-sm text-muted transition-colors hover:text-or">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-[0.68rem] uppercase tracking-[0.25em] text-or">Informations</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-muted">
            <li>{RESTAURANT.adresse}, {RESTAURANT.ville}</li>
            <li><a href={`tel:${RESTAURANT.telephoneRaw}`} className="transition-colors hover:text-or">{RESTAURANT.telephone}</a></li>
            <li><a href={`mailto:${RESTAURANT.email}`} className="transition-colors hover:text-or">{RESTAURANT.email}</a></li>
            <li>Mar-Dim, jusqu’à 23h</li>
            <li>À emporter disponible</li>
            <li>Accès PMR</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-5xl border-t border-or/[0.08] pt-6 text-center">
        <p className="text-[0.72rem] tracking-wider text-muted/50">
          © {new Date().getFullYear()} {RESTAURANT.nom} · {RESTAURANT.cuisine} · {RESTAURANT.ville}, {RESTAURANT.region} ·{' '}
          <a href={`tel:${RESTAURANT.telephoneRaw}`} className="text-or">{RESTAURANT.telephone}</a>
        </p>
      </div>
    </footer>
  );
}
