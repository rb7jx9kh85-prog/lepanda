'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RESTAURANT } from '@/lib/restaurant';

const LINKS = [
  { href: '#about', label: 'À propos' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#menu', label: 'Spécialités' },
  { href: '#carte', label: 'La carte' },
  { href: '#plats-semaine', label: 'Plats du moment' },
  { href: '#avis', label: 'Avis' },
  { href: '#reservation', label: 'Réserver', accent: true },
  { href: '#infos', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-6 md:px-12 transition-all duration-300',
        scrolled
          ? 'bg-noir/95 py-2.5 backdrop-blur-md'
          : 'bg-gradient-to-b from-noir/95 to-transparent py-4'
      )}
    >
      <Link href="#" className="group flex items-center gap-3">
        <Image
          src="/images/logo.jpg"
          alt={`Logo ${RESTAURANT.nom}`}
          width={48}
          height={48}
          className="h-11 w-11 rounded-full border-2 border-or/40 object-cover transition-colors group-hover:border-or"
        />
        <span className="font-serifsc text-[1.3rem] tracking-widest text-or">Le Panda</span>
      </Link>

      <ul className="hidden items-center gap-7 lg:flex">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={cn(
                'group relative text-[0.74rem] uppercase tracking-[0.18em] transition-colors hover:text-or',
                l.accent ? 'text-or' : 'text-texte'
              )}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-or transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          </li>
        ))}
      </ul>

      <a
        href={`tel:${RESTAURANT.telephoneRaw}`}
        className="rounded-full border border-or/40 px-4 py-2 text-[0.72rem] tracking-wider text-or transition-colors hover:border-or hover:text-creme lg:hidden"
      >
        ☏ {RESTAURANT.telephone}
      </a>
    </nav>
  );
}
