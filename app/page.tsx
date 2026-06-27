import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Gallery } from '@/components/sections/Gallery';
import { Specialites } from '@/components/sections/Specialites';
import { Carte } from '@/components/sections/Carte';
import { PlatsSemaine } from '@/components/sections/PlatsSemaine';
import { Reviews } from '@/components/sections/Reviews';
import { Reservation } from '@/components/sections/Reservation';
import { FacebookSection } from '@/components/sections/FacebookSection';
import { Footer } from '@/components/sections/Footer';
import { Chatbot } from '@/components/ui/Chatbot';
import { ScrollProgress } from '@/components/ui/ScrollProgress';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <PlatsSemaine />
        <Gallery />
        <Specialites />
        <Carte />
        <Reviews />
        <Reservation />
        <FacebookSection />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
