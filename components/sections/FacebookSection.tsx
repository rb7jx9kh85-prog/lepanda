import { Reveal } from '@/components/ui/Reveal';
import { GlassButton } from '@/components/ui/GlassButton';
import { RESTAURANT } from '@/lib/restaurant';

export function FacebookSection() {
  return (
    <section
      className="border-t border-[#1877f2]/20 px-6 py-16 md:px-12"
      style={{ background: 'linear-gradient(135deg, #1a1108 0%, rgba(24,119,242,0.35) 220%)' }}
    >
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[#1877f2] text-3xl">
            🐼
          </div>
          <div className="text-center md:text-left">
            <h2 className="mb-1 font-cormorant text-2xl font-medium text-creme">Suivez-nous sur Facebook</h2>
            <p className="text-sm tracking-wide text-creme/60">
              Photos, menus du jour, événements &amp; actualités du Panda
            </p>
          </div>
        </div>
        <GlassButton href={RESTAURANT.facebook} external>
          👍 Voir notre page
        </GlassButton>
      </Reveal>
    </section>
  );
}
