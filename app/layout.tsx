import type { Metadata } from 'next';
import { Noto_Serif_SC, Cormorant_Garamond, Raleway } from 'next/font/google';
import { RESTAURANT } from '@/lib/restaurant';
import { CookieBanner } from '@/components/ui/CookieBanner';
import './globals.css';

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lepanda-leytron.netlify.app'),
  title: `${RESTAURANT.nom} — ${RESTAURANT.cuisine} à ${RESTAURANT.ville}, ${RESTAURANT.region} | ${RESTAURANT.telephone}`,
  description: `${RESTAURANT.nom}, restaurant asiatique à ${RESTAURANT.ville} (${RESTAURANT.region}). Crispy Beef, dim sum, nouilles. Mar-Dim 11h30-23h. Tél: ${RESTAURANT.telephone}. Email: ${RESTAURANT.email}`,
  robots: 'index,follow',
  openGraph: {
    title: `${RESTAURANT.nom} — ${RESTAURANT.cuisine} · ${RESTAURANT.ville}, ${RESTAURANT.region}`,
    description: `Cuisine asiatique authentique. Mar-Dim 11h30-23h00 (fermé lundi). Réservez au ${RESTAURANT.telephone}.`,
    url: 'https://lepanda-leytron.netlify.app/',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: RESTAURANT.nom,
  telephone: RESTAURANT.telephoneIntl,
  email: RESTAURANT.email,
  priceRange: 'CHF 20-50',
  servesCuisine: ['Asiatique', 'Chinois'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: RESTAURANT.adresse,
    addressLocality: RESTAURANT.ville,
    postalCode: RESTAURANT.codePostal,
    addressRegion: RESTAURANT.region,
    addressCountry: 'CH',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '11:15',
      closes: '23:00',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: RESTAURANT.note,
    reviewCount: String(RESTAURANT.nbAvis),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${notoSerifSC.variable} ${cormorant.variable} ${raleway.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
