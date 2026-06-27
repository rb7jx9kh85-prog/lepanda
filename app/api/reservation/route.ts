import { NextResponse } from 'next/server';

// Clé d'accès Web3Forms — lue uniquement côté serveur via l'environnement.
// À définir dans les variables d'environnement Vercel (et .env.local en local).
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;

export interface ReservationPayload {
  name: string;
  telephone: string;
  personnes: string;
  email?: string;
  date?: string;
  heure?: string;
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

  // Seuls le nom, le nombre de personnes et le téléphone sont obligatoires.
  if (!data.name || !data.telephone || !data.personnes) {
    return NextResponse.json(
      { success: false, error: 'Nom, nombre de personnes et téléphone sont obligatoires.' },
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
        date: data.date || 'à définir (rappeler le client)',
        heure: data.heure || 'à définir (rappeler le client)',
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
