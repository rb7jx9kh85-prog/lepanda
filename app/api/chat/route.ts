import { NextResponse } from 'next/server';
import { RESTAURANT, HORAIRES, formatService } from '@/lib/restaurant';
import { SPECIALITES, CARTE, PLATS_SEMAINE } from '@/lib/menu-data';
import { MENU_REST_URL } from '@/lib/firebase';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function decodeFirestore(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const v = value as Record<string, unknown>;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue' in v) return decodeFields((v.mapValue as Record<string, unknown>)?.fields as Record<string, unknown> ?? {});
  if ('arrayValue' in v) return ((v.arrayValue as Record<string, unknown>)?.values as unknown[] ?? []).map(decodeFirestore);
  return undefined;
}

function decodeFields(fields: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(fields)) out[k] = decodeFirestore(fields[k]);
  return out;
}

async function fetchMenuSemaine(): Promise<string> {
  try {
    const resp = await fetch(MENU_REST_URL, { next: { revalidate: 60 } });
    if (resp.ok) {
      const json = await resp.json();
      if (json?.fields) {
        const data = decodeFields(json.fields);
        const plats = Array.isArray(data.plats) ? data.plats as Record<string, unknown>[] : [];
        if (plats.length > 0) {
          const lignes = plats
            .map((p) => `  - ${p.emoji ?? ''} ${p.jour ?? ''} (${p.type ?? ''}) : ${p.nom} — ${p.description}`)
            .join('\n');
          const entete = [
            data.semaine ? `Semaine du ${data.semaine}.` : '',
            data.description_menu ? `Formule : ${data.description_menu}.` : '',
            data.prix_menu ? `Menu à ${data.prix_menu} CHF.` : '',
          ].filter(Boolean).join(' ');
          return `${entete}\n${lignes}`;
        }
      }
    }
  } catch { /* repli */ }
  return PLATS_SEMAINE.map((p) => `  - ${p.tag} ${p.nom} (${p.prix}) : ${p.description}`).join('\n');
}

function buildSystemPrompt(platsSemaine: string): string {
  const horaires = HORAIRES.map((j) => `  - ${j.nom} : ${formatService(j).join(' / ')}`).join('\n');
  const specialites = SPECIALITES.map((s) => `  - ${s.titre} (${s.prix}) : ${s.description}`).join('\n');
  const carte = CARTE.map((cat) => {
    const plats = cat.plats
      .map((p) => `    • ${p.nom} — ${p.prix}${p.signature ? ' (spécialité signature)' : ''} : ${p.description}`)
      .join('\n');
    return `  ${cat.label} :\n${plats}`;
  }).join('\n');

  return `Tu es l'assistant du restaurant Le Panda à ${RESTAURANT.ville} (${RESTAURANT.region}, Suisse).
Réponds TOUJOURS en français, de façon chaleureuse et concise (1-2 emojis max). Ne réponds pas aux questions hors-sujet du restaurant.

INFOS RESTAURANT :
- Adresse : ${RESTAURANT.adresse}, ${RESTAURANT.codePostal} ${RESTAURANT.ville} (${RESTAURANT.etage})
- Tél : ${RESTAURANT.telephone} · Email : ${RESTAURANT.email}
- Facebook : ${RESTAURANT.facebook}
- Note : ${RESTAURANT.note}/5 · ${RESTAURANT.nbAvis} avis Google
- Budget : ${RESTAURANT.prixMin}–${RESTAURANT.prixMax} CHF · Menu déjeuner : ${RESTAURANT.menuDejeuner}
- Accessible PMR · Plats à emporter · Fermé le lundi

HORAIRES :
${horaires}

SPÉCIALITÉS :
${specialites}

CARTE :
${carte}

PLATS DE LA SEMAINE :
${platsSemaine}

RÉSERVATION : Collecte obligatoirement 5 informations (une question à la fois, dans cet ordre) : date souhaitée, heure, nombre de personnes, nom complet, téléphone.
Ne génère le JSON QUE quand tu as les 5. Réponds alors UNIQUEMENT avec ce JSON (rien d'autre) :
{"reservation":true,"name":"Prénom Nom","personnes":"N","telephone":"numéro","date":"YYYY-MM-DD","heure":"HHhMM","message":""}`;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function isValidMessage(m: unknown): m is ChatMessage {
  if (!m || typeof m !== 'object') return false;
  const msg = m as Record<string, unknown>;
  return (msg.role === 'user' || msg.role === 'assistant') && typeof msg.content === 'string';
}

export async function POST(request: Request) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Configuration serveur manquante.' }, { status: 500 });
  }

  let history: ChatMessage[] = [];
  try {
    const body = await request.json();
    const raw = Array.isArray(body.messages) ? body.messages : [];
    history = raw.filter(isValidMessage);
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  if (history.length > 16) {
    return NextResponse.json({ error: 'Historique trop long. Veuillez rafraîchir.' }, { status: 400 });
  }

  const totalChars = history.reduce((sum, m) => sum + m.content.length, 0);
  if (totalChars > 2000) {
    return NextResponse.json({ error: 'Conversation trop longue. Veuillez rafraîchir.' }, { status: 400 });
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
      return NextResponse.json({ error: data?.error?.message || 'Erreur OpenAI.' }, { status: 502 });
    }

    const reply: string = data.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'Connexion impossible au service de chat.' }, { status: 502 });
  }
}
