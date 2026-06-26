'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  /** Valeur finale (peut contenir des décimales) */
  value: number;
  /** Texte affiché tel quel si la valeur n'est pas numérique (ex: "Mar-Dim") */
  fallback?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

/** Compteur qui s'incrémente quand il entre dans le viewport. */
export function CountUp({ value, fallback, decimals = 0, duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || fallback) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, fallback]);

  return (
    <span ref={ref} className={className}>
      {fallback ?? display.toFixed(decimals)}
    </span>
  );
}
