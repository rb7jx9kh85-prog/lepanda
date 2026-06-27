import { NextResponse } from 'next/server';
import { RESTAURANT, HORAIRES, formatService } from '@/lib/restaurant';
import { SPECIALITES, CARTE, PLATS_SEMAINE } from '@/lib/menu-data';
import { MENU_REST_URL } from '@/lib/firebase';

// La clé n'est JAMAIS exposée au navigateur : elle vit uniquement ici, côté serveur.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/* ─── Lecture du menu live publié par le panneau d'admin (Firestore REST) ─── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeFirestore(value: any): any {
  if (!value || typeof value !== 'object') return value;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('nullValue' in value) return null;
  if ('timestampValue' in value) return value.timestampValue;
  if ('mapValue' in value) return decodeFields(value.mapValue?.fields ?? {});
  if ('arrayValue' in value) return (value.arrayValue?.values ?? []).map(decodeFirestore);
  return undefined;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeFields(fields: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const k of Object.keys(fields)) out[k] = decodeFirestore(fields[k]);
  return out;
}

/** Renvoie le bloc texte du menu de la semaine, depuis Firestore si publié,
 *  sinon depuis les données locales (PLATS_SEMAINE). */
async function fetchMenuSemaine(): Promise<string> {
  try {
    const resp = await fetch(MENU_REST_URL, { next: { revalidate: 60 } });
    if (resp.ok) {
      const json = await resp.json();
      if (json?.fields) {
        const data = decodeFields(json.fields);
        const plats: any[] = Array.isArray(data.plats) ? data.plats : [];
        if (plats.length > 0) {
          const lignes = plats
            .map((p) => `  - ${p.emoji ?? ''} ${p.jour ?? ''} (${p.type ?? ''}) : ${p.nom} — ${p.description}`)
            .join('\n');
          const entete = [
            data.semaine ? `Semaine du ${data.semaine}.` : '',
            data.description_menu ? `Formule : ${data.description_menu}.` : '',
            data.prix_menu ? `Menu à ${data.prix_menu} CHF.` : '',
          ]
            .filter(Boolean)
            .join(' ');
          return `${entete}\n${lignes}`;
        }
      }
    }
  } catch {
    /* repli ci-dessous */
  }
  // Repli : données locales
  return PLATS_SEMAINE.map((p) => `  - ${p.tag} ${p.nom} (${p.prix}) : ${p.description}`).join('\n');
}

/**
 * Construit le « system prompt » à partir des données centralisées
 * (lib/restaurant.ts + lib/menu-data.ts). Ainsi, toute mise à jour des
 * horaires, de la carte ou des plats de la semaine se répercute
 * automatiquement sur le chatbot — aucune duplication à maintenir.
 */
function buildSystemPrompt(platsSemaine: string): string {
  const horaires = HORAIRES.map((j) => `  - ${j.nom} : ${formatService(j).join(' / ')}`).join('\n');

  const specialites = SPECIALITES.map((s) => `  - ${s.titre} (${s.prix}) : ${s.description}`).join('\n');

  const carte = CARTE.map((cat) => {
    const plats = cat.plats
      .map((p) => `    • ${p.nom} — ${p.prix}${p.signature ? ' (spécialité signature)' : ''} : ${p.description}`)
      .join('\n');
    return `  ${cat.label} :\n${plats}`;
  }).join('\n');

  return `Tu es « Le Panda », l'hôte virtuel et chaleureux du restaurant Le Panda à ${RESTAURANT.ville} (${RESTAURANT.region}, Suisse).
Tu parles à la première personne au nom du restaurant. Réponds TOUJOURS en français, de façon chaleureuse, naturelle et concise (1-2 emojis max, 🐼 bienvenu).
Ne réponds jamais à une question hors-sujet du restaurant ; ramène poliment la conversation au Panda.

═══ INFORMATIONS COMPLÈTES DE L'ÉTABLISSEMENT ═══
- Nom : ${RESTAURANT.nom} — ${RESTAURANT.cuisine}
- Adresse : ${RESTAURANT.adresse}, ${RESTAURANT.codePostal} ${RESTAURANT.ville}, ${RESTAURANT.region} (${RESTAURANT.etage})
- Téléphone : ${RESTAURANT.telephone}
- Email : ${RESTAURANT.email}
- Facebook : ${RESTAURANT.facebook}
- Note Google : ${RESTAURANT.note}/5 sur ${RESTAURANT.nbAvis} avis
- Budget : ${RESTAURANT.prixMin}-${RESTAURANT.prixMax} CHF par personne
- Menu déjeuner : ${RESTAURANT.menuDejeuner} (2 entrées + plat + dessert), du mardi au dimanche
- Accessible PMR · Plats à emporter disponibles · Réservation possible

HORAIRES (le restaurant est FERMÉ le lundi) :
${horaires}

NOS SPÉCIALITÉS :
${specialites}

CARTE COMPLÈTE :
${carte}

PLATS DE LA SEMAINE (sélection actuelle du chef) :
${platsSemaine}

═══ RÉSERVATION DE TABLE ═══
Quand un client veut réserver, tu dois collecter SEULEMENT 3 informations (une à la fois, simplement) :
  1. Le nom
  2. Le nombre de personnes
  3. Le numéro de téléphone
La date et l'heure sont FACULTATIVES : ne les demande pas d'office. Si le client les mentionne, prends-les ; sinon précise gentiment que nous le rappellerons pour fixer le créneau.

Dès que tu as le nom, le nombre de personnes ET le téléphone, réponds UNIQUEMENT avec ce JSON exact (rien d'autre autour) :
{"reservation":true,"name":"Prénom Nom","personnes":"N","telephone":"numéro","date":"YYYY-MM-DD ou vide","heure":"HHhMM ou vide","message":"message ou vide"}

Ne génère JAMAIS ce JSON tant que tu n'as pas les 3 infos obligatoires (nom, personnes, téléphone).`;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Configuration serveur manquante (OPENAI_API_KEY).' },
      { status: 500 }
    );
  }

  let history: ChatMessage[] = [];
  try {
    const body = await request.json();
    history = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  // Limite stricte : max 16 messages, max 2000 caractères totaux pour éviter abus / surcharge tokens.
  const MAX_MESSAGES = 16;
  const MAX_TOTAL_CHARS = 2000;

  if (history.length > MAX_MESSAGES) {
    return NextResponse.json(
      { error: 'Historique trop long. Veuillez rafraîchir le chat.' },
      { status: 400 }
    );
  }

  const totalChars = history.reduce((sum, m) => sum + (m.content?.length || 0), 0);
  if (totalChars > MAX_TOTAL_CHARS) {
    return NextResponse.json(
      { error: 'Conversation trop longue. Veuillez rafraîchir le chat.' },
      { status: 400 }
    );
  }

  const trimmed = history.slice(-12);

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 450,
        messages: [{ role: 'system', content: buildSystemPrompt(await fetchMenuSemaine()) }, ...trimmed],
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'Erreur OpenAI.' },
        { status: 502 }
      );
    }

    const reply: string = data.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: 'Connexion impossible au service de chat.' },
      { status: 502 }
    );
  }
}
