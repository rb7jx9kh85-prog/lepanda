'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  /** 'light' = texte noir sur verre clair (par défaut) · 'gold' = accent doré */
  variant?: 'light' | 'gold';
  className?: string;
  type?: 'button' | 'submit';
}

/**
 * Bouton glassmorphism réutilisable : verre dépoli translucide,
 * reflet de lumière au survol, léger soulèvement.
 */
export function GlassButton({
  children,
  href,
  onClick,
  external,
  variant = 'light',
  className,
  type = 'button',
}: GlassButtonProps) {
  const base = cn(
    'group relative inline-flex items-center justify-center overflow-hidden',
    'px-9 py-4 rounded-full font-semibold tracking-wide text-[15px]',
    'border backdrop-blur-[14px] transition-all duration-300',
    '-translate-y-0 hover:-translate-y-[3px] active:translate-y-0',
    variant === 'gold'
      ? 'bg-or/20 border-or/40 text-or-clair hover:bg-or/30 hover:border-or/70'
      : 'bg-white/[0.18] border-white/30 text-creme hover:bg-white/[0.28] hover:border-white/50',
    'shadow-[0_10px_30px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)]',
    'hover:shadow-[0_18px_40px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)]',
    className
  );

  const shine = (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute top-0 left-[-120%] h-full w-[55%]',
        'bg-gradient-to-r from-transparent via-white/70 to-transparent',
        'skew-x-[-25deg] transition-[left] duration-700 ease-out',
        'group-hover:left-[170%]'
      )}
    />
  );

  const content = (
    <>
      {shine}
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={base}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={base}>
      {content}
    </button>
  );
}
