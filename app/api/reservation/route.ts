import { NextResponse } from 'next/server';

// Clé d'accès Web3Forms — lue uniquement côté serveur via l'environnement.
// À définir dans les variables d'environnement Vercel (et .env.local en local).
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;

export interface ReservationPayload {
  name: string;
  telephone: string;
  email?: string;
  date: string;
  heure: string;
  personnes: string;
  message?: string;
  source?: string;
}

export async function POST(request: Request) {
  if (!WEB3FORMS_ACCESS_KEY) {
    return NextResponse.json(
      { success: false, error: 'Configuration serveur manquante (WEB3FORMS_ACCESS_KEY).' },
      { status: 500 }
    );
  }

  let data: ReservationPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Requête invalide.' }, { status: 400 });
  }

  if (!data.name || !data.telephone || !data.date || !data.heure || !data.personnes) {
    return NextResponse.json(
      { success: false, error: 'Champs obligatoires manquants.' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Nouvelle réservation (${data.source || 'site'}) - Le Panda Leytron`,
        name: data.name,
        telephone: data.telephone,
        email: data.email || 'non fourni',
        date: data.date,
        heure: data.heure,
        personnes: data.personnes,
        message: data.message || 'aucun message',
      }),
    });
    const result = await res.json();
    return NextResponse.json({ success: Boolean(result.success) });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erreur réseau lors de l’envoi.' },
      { status: 502 }
    );
  }
}
