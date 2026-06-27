'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  /** Conservé pour compat — 'gold' ajoute une légère teinte dorée. */
  variant?: 'light' | 'gold';
  className?: string;
  type?: 'button' | 'submit';
}

/**
 * Bouton « liquid glass » : verre dépoli translucide, reflet qui balaye,
 * halo lumineux au survol, léger soulèvement + scale.
 * Style unifié sur tout le site.
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
    'group/liquid relative inline-flex items-center justify-center overflow-hidden',
    'rounded-full px-10 py-4 text-[17px] font-semibold tracking-[0.4px] text-white',
    'border backdrop-blur-[18px] transition-all duration-[450ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)]',
    'hover:-translate-y-1 hover:scale-[1.04] active:scale-[0.98]',
    variant === 'gold'
      ? 'border-or/30 bg-or/[0.10] hover:border-or/50 hover:bg-or/[0.16]'
      : 'border-white/[0.18] bg-white/[0.08] hover:border-white/30 hover:bg-white/[0.12]',
    'shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_12px_35px_rgba(0,0,0,0.25)]',
    'hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_18px_45px_rgba(0,0,0,0.35)]',
    className
  );

  const decorations = (
    <>
      {/* Reflet qui balaye */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[-140%] top-[-60%] h-[220%] w-[180%] rotate-[12deg] transition-[left] duration-[1000ms] group-hover/liquid:left-[120%]"
        style={{
          background:
            'linear-gradient(110deg, transparent 20%, rgba(255,255,255,.35) 50%, transparent 80%)',
        }}
      />
      {/* Halo */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-[400ms] group-hover/liquid:opacity-100"
        style={{
          background: 'radial-gradient(circle at top, rgba(255,255,255,.18), transparent 70%)',
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
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
        {decorations}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={base}>
      {decorations}
    </button>
  );
}
