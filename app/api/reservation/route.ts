import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.RESERVATION_EMAIL || 'lepanda@bluewin.ch';

export interface ReservationPayload {
  name: string;
  telephone: string;
  email?: string;
  date?: string;
  heure?: string;
  personnes: string;
  message?: string;
  source?: string;
}

function sanitize(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function isValidPhone(phone: string): boolean {
  return /^[\d\s\+\-\(\)\.]{7,20}$/.test(phone);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Configuration serveur manquante.' },
      { status: 500 }
    );
  }

  let body: ReservationPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Requête invalide.' }, { status: 400 });
  }

  // Validation des champs obligatoires
  if (!body.name?.trim() || !body.telephone?.trim() || !body.personnes?.trim()) {
    return NextResponse.json(
      { success: false, error: 'Nom, téléphone et nombre de personnes sont obligatoires.' },
      { status: 400 }
    );
  }

  // Validation des formats
  if (!isValidPhone(body.telephone)) {
    return NextResponse.json({ success: false, error: 'Numéro de téléphone invalide.' }, { status: 400 });
  }
  if (body.email && !isValidEmail(body.email)) {
    return NextResponse.json({ success: false, error: 'Adresse email invalide.' }, { status: 400 });
  }

  // Limites de longueur
  if (body.name.length > 100 || body.message && body.message.length > 500) {
    return NextResponse.json({ success: false, error: 'Données trop longues.' }, { status: 400 });
  }

  // Sanitization avant injection dans HTML
  const name = sanitize(body.name.trim());
  const telephone = sanitize(body.telephone.trim());
  const email = body.email ? sanitize(body.email.trim()) : '—';
  const date = body.date ? sanitize(body.date) : 'À définir (rappeler le client)';
  const heure = body.heure ? sanitize(body.heure) : 'À définir';
  const personnes = sanitize(body.personnes);
  const message = body.message ? sanitize(body.message.trim()) : '—';
  const source = sanitize(body.source || 'site web');

  try {
    const { error } = await resend.emails.send({
      from: 'Réservations Le Panda <onboarding@resend.dev>',
      to: TO_EMAIL,
      replyTo: body.email || undefined,
      subject: `Nouvelle réservation – ${name} · ${date} ${heure} · ${personnes} pers.`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#faf7f2;border-radius:12px;border:1px solid #e0d5c5">
          <h2 style="color:#1a1108;margin-bottom:24px">🐼 Nouvelle réservation — Le Panda</h2>
          <table style="width:100%;border-collapse:collapse;font-size:15px">
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5;width:40%">Nom</td><td style="padding:10px 0;color:#1a1108;font-weight:600;border-bottom:1px solid #e0d5c5">${name}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Téléphone</td><td style="padding:10px 0;color:#1a1108;font-weight:600;border-bottom:1px solid #e0d5c5">${telephone}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Email</td><td style="padding:10px 0;color:#1a1108;border-bottom:1px solid #e0d5c5">${email}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Date</td><td style="padding:10px 0;color:#D4956A;font-weight:700;border-bottom:1px solid #e0d5c5">${date}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Heure</td><td style="padding:10px 0;color:#D4956A;font-weight:700;border-bottom:1px solid #e0d5c5">${heure}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Personnes</td><td style="padding:10px 0;color:#1a1108;font-weight:700;border-bottom:1px solid #e0d5c5">${personnes}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40">Message</td><td style="padding:10px 0;color:#1a1108">${message}</td></tr>
          </table>
          <p style="margin-top:24px;font-size:12px;color:#b0a090">Source : ${source} · ${new Date().toLocaleString('fr-CH', { timeZone: 'Europe/Zurich' })}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ success: false, error: "Erreur d'envoi email." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reservation error:', err);
    return NextResponse.json(
      { success: false, error: "Erreur réseau lors de l'envoi." },
      { status: 502 }
    );
  }
}
