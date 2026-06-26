import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette Le Panda — luxe asiatique
        rouge: '#C0392B',
        'rouge-fonce': '#8B1A10',
        or: '#D4AF5A',
        'or-clair': '#F0D080',
        noir: '#0D0A08',
        sombre: '#1A1108',
        brun: '#2C1810',
        creme: '#F5ECD7',
        texte: '#E8D5B0',
        muted: '#9A8060',
        // alias sémantiques utilisés par les composants importés
        background: '#0D0A08',
        foreground: '#F5ECD7',
        border: 'rgba(212,175,90,0.15)',
      },
      fontFamily: {
        serifsc: ['var(--font-noto-serif-sc)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-raleway)', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        fadeUp: 'fadeUp 0.8s ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;
