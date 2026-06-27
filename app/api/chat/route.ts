import { NextResponse } from 'next/server';
import { RESTAURANT, HORAIRES, formatService } from '@/lib/restaurant';
import { SPECIALITES, CARTE, PLATS_SEMAINE } from '@/lib/menu-data';

// La clé n'est JAMAIS exposée au navigateur : elle vit uniquement ici, côté serveur.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Construit le « system prompt » à partir des données centralisées
 * (lib/restaurant.ts + lib/menu-data.ts). Ainsi, toute mise à jour des
 * horaires, de la carte ou des plats de la semaine se répercute
 * automatiquement sur le chatbot — aucune duplication à maintenir.
 */
function buildSystemPrompt(): string {
  const horaires = HORAIRES.map((j) => `  - ${j.nom} : ${formatService(j).join(' / ')}`).join('\n');

  const specialites = SPECIALITES.map((s) => `  - ${s.titre} (${s.prix}) : ${s.description}`).join('\n');

  const carte = CARTE.map((cat) => {
    const plats = cat.plats
      .map((p) => `    • ${p.nom} — ${p.prix}${p.signature ? ' (spécialité signature)' : ''} : ${p.description}`)
      .join('\n');
    return `  ${cat.label} :\n${plats}`;
  }).join('\n');

  const platsSemaine = PLATS_SEMAINE.map((p) => `  - ${p.tag} ${p.nom} (${p.prix}) : ${p.description}`).join('\n');

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

  // On borne l'historique pour limiter les coûts / abus.
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
        messages: [{ role: 'system', content: buildSystemPrompt() }, ...trimmed],
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
