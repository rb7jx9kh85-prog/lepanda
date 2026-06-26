/**
 * Informations centrales du restaurant.
 * Source unique de vérité — réutilisable par le site ET par la future
 * application de gestion (mise à jour des horaires / plats via IA).
 */

export const RESTAURANT = {
  nom: 'Le Panda',
  cuisine: 'Restaurant Asiatique',
  ville: 'Leytron',
  region: 'Valais',
  adresse: '2, chemin d’En Bas',
  codePostal: '1912',
  etage: 'Étage G',
  telephone: '077 269 59 71',
  telephoneRaw: '0772695971',
  telephoneIntl: '+41772695971',
  email: 'lepanda@bluewin.ch',
  facebook: 'https://www.facebook.com/lepanda.leytron',
  googleMaps: 'https://maps.app.goo.gl/uHgmzGYbQ5pniqoJ8?g_st=ic',
  note: '4.6',
  nbAvis: 361,
  prixMin: 20,
  prixMax: 50,
  menuDejeuner: 'CHF 21.50',
} as const;

export interface ServiceJour {
  /** Index JS getDay() : 0 = dimanche … 6 = samedi */
  index: number;
  cle: string;
  nom: string;
  ferme?: boolean;
  /** [début, fin] en minutes depuis minuit */
  midi?: [number, number];
  soir?: [number, number];
}

const hm = (h: number, m: number) => h * 60 + m;

/** Horaires officiels (source : Facebook). Lundi fermé. */
export const HORAIRES: ServiceJour[] = [
  { index: 1, cle: 'lun', nom: 'Lundi', ferme: true },
  { index: 2, cle: 'mar', nom: 'Mardi', midi: [hm(11, 15), hm(14, 30)], soir: [hm(18, 30), hm(23, 0)] },
  { index: 3, cle: 'mer', nom: 'Mercredi', midi: [hm(11, 15), hm(14, 30)], soir: [hm(18, 30), hm(23, 0)] },
  { index: 4, cle: 'jeu', nom: 'Jeudi', midi: [hm(11, 15), hm(14, 30)], soir: [hm(18, 30), hm(23, 0)] },
  { index: 5, cle: 'ven', nom: 'Vendredi', midi: [hm(11, 30), hm(14, 30)], soir: [hm(18, 30), hm(23, 0)] },
  { index: 6, cle: 'sam', nom: 'Samedi', midi: [hm(11, 30), hm(14, 30)], soir: [hm(18, 30), hm(23, 30)] },
  { index: 0, cle: 'dim', nom: 'Dimanche', midi: [hm(11, 30), hm(15, 0)], soir: [hm(18, 30), hm(23, 0)] },
];

const fmt = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h${m.toString().padStart(2, '0')}`;
};

export function formatService(s: ServiceJour): string[] {
  if (s.ferme) return ['Fermé'];
  const out: string[] = [];
  if (s.midi) out.push(`${fmt(s.midi[0])} – ${fmt(s.midi[1])}`);
  if (s.soir) out.push(`${fmt(s.soir[0])} – ${fmt(s.soir[1])}`);
  return out;
}

/** Calcule l'état d'ouverture pour une date donnée (fuseau Europe/Zurich géré en amont). */
export function statutOuverture(date: Date): { ouvert: boolean; texte: string; jourCle: string } {
  const day = date.getDay();
  const mins = date.getHours() * 60 + date.getMinutes();
  const jour = HORAIRES.find((h) => h.index === day)!;

  if (jour.ferme) {
    return { ouvert: false, texte: 'Fermé le lundi', jourCle: jour.cle };
  }
  const dans = (plage?: [number, number]) => plage && mins >= plage[0] && mins < plage[1];
  const ouvert = Boolean(dans(jour.midi) || dans(jour.soir));
  return {
    ouvert,
    texte: ouvert ? 'Ouvert maintenant' : 'Fermé actuellement',
    jourCle: jour.cle,
  };
}
