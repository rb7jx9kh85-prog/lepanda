import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key') || process.env.RESEND_API_KEY;

  if (!key) {
    return NextResponse.json(
      { error: 'Clé Resend manquante. Usage: /api/test-email?key=re_xxxxx', success: false },
      { status: 400 }
    );
  }

  const resend = new Resend(key);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Réservations Le Panda <onboarding@resend.dev>',
      to: 'noevouillamoz3@gmail.com',
      subject: '🐼 Test Resend - Le Panda',
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#faf7f2;border-radius:12px;border:1px solid #e0d5c5">
          <h2 style="color:#1a1108">🐼 Test Réservation — Le Panda</h2>
          <p style="color:#6b5c40;margin-top:16px">Si tu reçois cet email, <strong>Resend fonctionne parfaitement !</strong></p>
          <table style="width:100%;border-collapse:collapse;font-size:15px;margin-top:24px">
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Nom</td><td style="padding:10px 0;color:#1a1108;font-weight:600">Test User</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Téléphone</td><td style="padding:10px 0;color:#1a1108;font-weight:600">+41 77 000 0000</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Date</td><td style="padding:10px 0;color:#D4956A;font-weight:700">2026-06-29</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40;border-bottom:1px solid #e0d5c5">Heure</td><td style="padding:10px 0;color:#D4956A;font-weight:700">19h30</td></tr>
            <tr><td style="padding:10px 0;color:#6b5c40">Personnes</td><td style="padding:10px 0;color:#1a1108;font-weight:700">4</td></tr>
          </table>
          <p style="margin-top:24px;font-size:12px;color:#b0a090">Test envoyé: ${new Date().toLocaleString('fr-CH')}</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, email_id: data.id });
  } catch (err) {
    return NextResponse.json(
      { error: String(err), success: false },
      { status: 500 }
    );
  }
}
