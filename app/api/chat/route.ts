import { NextResponse } from 'next/server';
import { RESTAURANT } from '@/lib/restaurant';

// La clé n'est JAMAIS exposée au navigateur : elle vit uniquement ici, côté serveur.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `Tu es Mei, l'assistante virtuelle du restaurant Le Panda à Leytron, Valais.
Réponds TOUJOURS en français. Sois chaleureuse, concise, utilise 1-2 emojis max.

Infos restaurant:
- Adresse: ${RESTAURANT.adresse}, ${RESTAURANT.codePostal} ${RESTAURANT.ville} (${RESTAURANT.etage})
- Tél: ${RESTAURANT.telephone}
- Horaires: Mar-Dim 11h30-23h00 (fermé le lundi)
- Email: ${RESTAURANT.email}
- Spécialités: Crispy Beef, dim sum, nouilles, riz sauté, fruits de mer
- Menu déjeuner: ${RESTAURANT.menuDejeuner} (2 entrées + plat + dessert)
- Prix: ${RESTAURANT.prixMin}-${RESTAURANT.prixMax} CHF par personne
- Accessible PMR, à emporter disponible
- Note Google: ${RESTAURANT.note}/5 sur ${RESTAURANT.nbAvis} avis

COLLECTE DE RÉSERVATION:
Si quelqu'un demande à réserver, collecte dans cet ordre (une info à la fois):
1. La date souhaitée
2. L'heure souhaitée
3. Le nombre de personnes
4. Le nom complet
5. Le numéro de téléphone
6. Un email (optionnel)
7. Un message ou occasion spéciale (optionnel)

Une fois tout collecté, réponds UNIQUEMENT avec ce JSON exact (rien d'autre):
{"reservation":true,"date":"YYYY-MM-DD","heure":"HHhMM","personnes":"N","name":"Prénom Nom","telephone":"numéro","email":"email ou vide","message":"message ou vide"}

Important: ne génère le JSON que quand tu as AU MINIMUM: date, heure, personnes, nom, téléphone.`;

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
        max_tokens: 400,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed],
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
