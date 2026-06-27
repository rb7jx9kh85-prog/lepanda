import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Configuration Firebase du projet "le-panda".
 * Ces valeurs sont PUBLIQUES par nature (elles partent dans le bundle
 * navigateur). La sécurité repose sur les règles Firestore, pas sur ces clés.
 */
const firebaseConfig = {
  apiKey: 'AIzaSyCsTOmKrSHUDuEfo81coIigi_vB_4VWEAE',
  authDomain: 'le-panda.firebaseapp.com',
  projectId: 'le-panda',
  storageBucket: 'le-panda.firebasestorage.app',
  messagingSenderId: '322625286794',
  appId: '1:322625286794:web:d48e60a23a5fca03c5b373',
  measurementId: 'G-NSE3JPMW0K',
};

// Évite la ré-initialisation en mode HMR / multi-import.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

/** Identifiant du restaurant dans Firestore. */
export const MENU_DOC_PATH = ['restaurants', 'panda_leytron', 'live', 'current'] as const;

/** Référence REST publique au document (utilisée côté serveur par le chatbot). */
export const MENU_REST_URL =
  'https://firestore.googleapis.com/v1/projects/le-panda/databases/(default)/documents/restaurants/panda_leytron/live/current';

/** Un plat publié par le panneau d'administration. */
export interface PlatLive {
  id: string;
  jour: string;
  type: string;
  emoji: string;
  nom: string;
  description: string;
  prix: number | null;
  menu_prix: number | null;
}

/** Document du menu de la semaine publié sur Firestore. */
export interface LiveMenu {
  semaine: string;
  prix_menu: number;
  description_menu: string;
  plats: PlatLive[];
  publie_le?: unknown;
  publie_par?: string;
}
