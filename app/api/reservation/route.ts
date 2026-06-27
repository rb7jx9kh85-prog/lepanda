import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.RESERVATION_EMAIL ?? 'lepanda@bluewin.ch';

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
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Configuration serveur manquante (RESEND_API_KEY).' },
      { status: 500 }
    );
  }

  let data: ReservationPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Requête invalide.' }, { status: 400 });
  }

  if (!data.name || !data.telephone || !data.personnes) {
    return NextResponse.json(
      { success: false, error: 'Nom, téléphone et nombre de personnes sont obligatoires.' },
      { status: 400 }
    );
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Réservations Le Panda <reservations@lepanda-leytron.ch>',
      to: TO_EMAIL,
      replyTo: data.email || undefined,
      subject: `Nouvelle réservation – ${data.name} · ${data.date || 'date à définir'} ${data.heure || ''} · ${data.personnes} pers.`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#faf7f2;border-radius:12px;border:1px solid #e0d5c5">
          <h2 style="color:#1a1108;margin-bottom:24px">🐼 Nouvelle réservation — Le Panda</h2>
          <table style="width:100%;border-collapse:collapse;font-size:15px">
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5;width:40%">Nom</td><td style="padding:10px 0;color:#1a1108;font-weight:600;border-bottom:1px solid #e0d5c5">${data.name}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Téléphone</td><td style="padding:10px 0;color:#1a1108;font-weight:600;border-bottom:1px solid #e0d5c5">${data.telephone}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Email</td><td style="padding:10px 0;color:#1a1108;border-bottom:1px solid #e0d5c5">${data.email || '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Date</td><td style="padding:10px 0;color:#D4956A;font-weight:700;border-bottom:1px solid #e0d5c5">${data.date || 'À définir (rappeler le client)'}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Heure</td><td style="padding:10px 0;color:#D4956A;font-weight:700;border-bottom:1px solid #e0d5c5">${data.heure || 'À définir'}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Personnes</td><td style="padding:10px 0;color:#1a1108;font-weight:700;border-bottom:1px solid #e0d5c5">${data.personnes}</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40">Message</td><td style="padding:10px 0;color:#1a1108">${data.message || '—'}</td></tr>
          </table>
          <p style="margin-top:24px;font-size:12px;color:#b0a090">Source : ${data.source || 'site web'} · ${new Date().toLocaleString('fr-CH', { timeZone: 'Europe/Zurich' })}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ success: false, error: 'Erreur d\'envoi email.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reservation error:', err);
    return NextResponse.json(
      { success: false, error: 'Erreur réseau lors de l\'envoi.' },
      { status: 502 }
    );
  }
}
