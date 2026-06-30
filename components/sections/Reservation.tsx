'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, RESTAURANT_ID } from '@/lib/firebase';
import { Reveal } from '@/components/ui/Reveal';
import { GlowAccent } from '@/components/ui/GlowAccent';
import { RESTAURANT } from '@/lib/restaurant';

const HEURES = ['11h30', '12h00', '12h30', '13h00', '18h30', '19h00', '19h30', '20h00', '20h30', '21h00'];

function prochainsJours(n: number) {
  const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const mois = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'];
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      label: i === 0 ? 'Auj.' : `${jours[d.getDay()]}. ${d.getDate()}`,
      mois: mois[d.getMonth()],
    };
  });
}

export function Reservation() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [personnes, setPersonnes] = useState('2');
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const jours = prochainsJours(5);

  function next() {
    setError('');
    if (step === 1 && !date) return setError('Veuillez choisir une date.');
    if (step === 2 && (!heure || !personnes)) return setError('Choisissez l'heure et le nombre de personnes.');
    setStep((s) => s + 1);
  }

  async function submit() {
    if (!name || !tel) return setError('Nom et téléphone obligatoires.');

    setSending(true);
    setError('');
    try {
      await addDoc(
        collection(db, 'restaurants', RESTAURANT_ID, 'reservations'),
        {
          nom: name,
          telephone: tel,
          email: email || '',
          date: date || '',
          heure: heure || '',
          nb_personnes: Number(personnes),
          message: message || '',
          statut: 'en_attente',
          cree_le: serverTimestamp(),
        }
      );
      setDone(true);
    } catch {
      setError(`Erreur réseau. Appelez le ${RESTAURANT.telephone}.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="reservation" className="relative border-t border-or/10 bg-sombre px-6 py-24 md:px-12">
      <GlowAccent />
      <div className="relative mx-auto grid max-w-5xl items-start gap-16 md:grid-cols-2">
        <Reveal direction="right">
          <span className="section-tag">Réservation en ligne</span>
          <h2 className="section-title">
            Réservez votre <em>table</em>
          </h2>
          <p className="mb-8 leading-loose text-muted">
            Choisissez votre date, votre heure et le nombre de personnes. Nous
            confirmerons votre réservation dans les plus brefs délais.
          </p>
          <div className="flex flex-col gap-3.5 text-sm text-muted">
            <div className="flex items-center gap-3"><span className="text-or">📅</span> Mar - Dim · 11h30 - 23h00 (Lundi fermé)</div>
            <div className="flex items-center gap-3"><span className="text-or">☏</span> <a href={`tel:${RESTAURANT.telephoneRaw}`} className="hover:text-or">{RESTAURANT.telephone}</a></div>
            <div className="flex items-center gap-3"><span className="text-or">✉</span> <a href={`mailto:${RESTAURANT.email}`} className="hover:text-or">{RESTAURANT.email}</a></div>
            <div className="flex items-center gap-3"><span className="text-or">📍</span> {RESTAURANT.adresse}, {RESTAURANT.codePostal} {RESTAURANT.ville}</div>
            <div className="flex items-center gap-3"><span className="text-or">🐼</span> Réservation possible aussi via le chatbot</div>
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <div className="rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            {/* indicateur d'étapes */}
            {!done && (
              <div className="mb-6 flex justify-center gap-1.5">
                {[1, 2, 3].map((s) => (
                  <span key={s} className={`h-1.5 w-1.5 rounded-full transition-colors ${s <= step ? 'bg-[#D4956A]' : 'bg-[#e0d5c5]'}`} />
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 text-center">
                  <div className="mb-3 text-5xl">✅</div>
                  <h3 className="mb-2 font-cormorant text-2xl text-[#1a1108]">Demande envoyée !</h3>
                  <p className="text-sm leading-relaxed text-[#6b5c40]">
                    Merci ! Nous avons bien reçu votre demande et vous confirmerons très
                    rapidement.<br />
                    <br />En cas d'urgence : <a href={`tel:${RESTAURANT.telephoneRaw}`} className="font-semibold text-[#D4956A]">{RESTAURANT.telephone}</a>
                  </p>
                </motion.div>
              ) : (
                <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                  <h3 className="mb-6 text-center font-cormorant text-2xl font-semibold text-[#1a1108]">Réserver une table</h3>

                  {step === 1 && (
                    <>
                      <p className="mb-2.5 text-[0.78rem] font-medium text-[#6b5c40]">Date</p>
                      <div className="mb-6 flex flex-wrap gap-2">
                        {jours.map((j) => (
                          <button
                            key={j.iso}
                            onClick={() => setDate(j.iso)}
                            className={`flex min-w-[68px] flex-1 flex-col items-center rounded-xl border-2 px-2 py-3 transition-all ${
                              date === j.iso ? 'border-[#D4956A] bg-[#D4956A] text-white' : 'border-transparent bg-[#f5f0e8] text-[#3a2c1a] hover:bg-[#ede5d4]'
                            }`}
                          >
                            <span className="text-[0.82rem] font-semibold">{j.label}</span>
                            <span className={`text-[0.72rem] ${date === j.iso ? 'text-white' : 'text-[#8a7060]'}`}>{j.mois}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <p className="mb-2.5 text-[0.78rem] font-medium text-[#6b5c40]">Nombre de personnes</p>
                      <select value={personnes} onChange={(e) => setPersonnes(e.target.value)} className="mb-4 w-full rounded-[10px] border-[1.5px] border-[#e0d5c5] bg-[#faf7f2] px-4 py-3 text-sm text-[#3a2c1a] outline-none focus:border-[#D4956A]">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                      <p className="mb-2.5 text-[0.78rem] font-medium text-[#6b5c40]">Heure</p>
                      <select value={heure} onChange={(e) => setHeure(e.target.value)} className="w-full rounded-[10px] border-[1.5px] border-[#e0d5c5] bg-[#faf7f2] px-4 py-3 text-sm text-[#3a2c1a] outline-none focus:border-[#D4956A]">
                        <option value="">Choisir une heure</option>
                        {HEURES.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </>
                  )}

                  {step === 3 && (
                    <div className="flex flex-col gap-3.5">
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet *" className="w-full rounded-[10px] border-[1.5px] border-[#e0d5c5] bg-[#faf7f2] px-4 py-3 text-sm text-[#3a2c1a] outline-none placeholder:text-[#b0a090] focus:border-[#D4956A]" />
                      <input value={tel} onChange={(e) => setTel(e.target.value)} type="tel" placeholder="Téléphone *" className="w-full rounded-[10px] border-[1.5px] border-[#e0d5c5] bg-[#faf7f2] px-4 py-3 text-sm text-[#3a2c1a] outline-none placeholder:text-[#b0a090] focus:border-[#D4956A]" />
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email (optionnel)" className="w-full rounded-[10px] border-[1.5px] border-[#e0d5c5] bg-[#faf7f2] px-4 py-3 text-sm text-[#3a2c1a] outline-none placeholder:text-[#b0a090] focus:border-[#D4956A]" />
                      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message ou occasion spéciale (optionnel)" className="min-h-[80px] w-full resize-y rounded-[10px] border-[1.5px] border-[#e0d5c5] bg-[#faf7f2] px-4 py-3 text-sm text-[#3a2c1a] outline-none placeholder:text-[#b0a090] focus:border-[#D4956A]" />
                    </div>
                  )}

                  {error && <p className="mt-4 text-center text-sm text-rouge">{error}</p>}

                  <button
                    onClick={step === 3 ? submit : next}
                    disabled={sending}
                    className="mt-5 w-full rounded-xl bg-[#D4956A] py-3.5 text-[0.85rem] font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#c4854a] hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {sending ? 'Envoi…' : step === 3 ? 'Confirmer la réservation' : 'Continuer'}
                  </button>
                  {step > 1 && (
                    <button onClick={() => { setError(''); setStep((s) => s - 1); }} className="mt-2.5 w-full rounded-[10px] border-[1.5px] border-[#e0d5c5] py-2.5 text-[0.8rem] tracking-wide text-[#8a7060] transition-colors hover:border-[#c4956a] hover:text-[#c4956a]">
                      Retour
                    </button>
                  )}

                  <div className="mt-4.5 mt-5 flex items-center justify-center gap-1.5 text-[0.82rem] text-[#8a7060]">
                    ● <a href={`tel:${RESTAURANT.telephoneRaw}`} className="font-semibold text-[#D4956A]">{RESTAURANT.telephone}</a> ●
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
