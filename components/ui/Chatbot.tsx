'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { RESTAURANT } from '@/lib/restaurant';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Quels sont vos horaires ?',
  'Je voudrais réserver une table',
  'Quelles sont vos spécialités ?',
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Msg[]>([
    { role: 'assistant', content: 'Bonjour 🐼 Je suis Mei, l’assistante du Panda. Comment puis-je vous aider ?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [history, typing]);

  async function sendReservation(data: Record<string, string>) {
    setHistory((h) => [...h, { role: 'assistant', content: 'Parfait, j’envoie votre réservation… 📅' }]);
    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'chatbot' }),
      });
      const result = await res.json();
      if (result.success) {
        setHistory((h) => [
          ...h,
          {
            role: 'assistant',
            content: `✅ Réservation confirmée ! Nous vous attendons le ${data.date} à ${data.heure} pour ${data.personnes} personne(s). À bientôt 🐼`,
          },
        ]);
      } else {
        throw new Error();
      }
    } catch {
      setHistory((h) => [
        ...h,
        { role: 'assistant', content: `Erreur d’envoi. Appelez-nous au ${RESTAURANT.telephone}.` },
      ]);
    }
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setShowSugg(false);
    const next: Msg[] = [...history, { role: 'user', content: trimmed }];
    setHistory(next);
    setInput('');
    setTyping(true);

    try {
      const filtered = next.filter((m) => m.role !== 'assistant' || m.content).map(({ role, content }) => ({ role, content }));
      const trimmedHistory = filtered.slice(-16);
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: trimmedHistory }),
      });
      const data = await resp.json();
      setTyping(false);

      if (!resp.ok) {
        setHistory((h) => [...h, { role: 'assistant', content: `Désolée, ${data.error || 'une erreur est survenue'}.` }]);
        return;
      }

      const reply: string = data.reply || '';
      const jsonMatch = reply.match(/\{"reservation":true[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          const resaData = JSON.parse(jsonMatch[0]);
          await sendReservation(resaData);
          return;
        } catch {
          /* fallthrough : on affiche le texte */
        }
      }
      setHistory((h) => [...h, { role: 'assistant', content: reply }]);
    } catch {
      setTyping(false);
      setHistory((h) => [...h, { role: 'assistant', content: `Connexion impossible. Appelez le ${RESTAURANT.telephone}.` }]);
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        aria-label="Ouvrir le chat"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-8 right-8 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-rouge text-white shadow-[0_12px_40px_rgba(192,57,43,0.5)] transition-transform hover:scale-105 active:scale-95"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-28 right-4 sm:right-8 z-[998] flex h-[min(580px,75vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-or/25 bg-sombre/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-or/15 bg-noir/80 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rouge text-lg">🐼</div>
              <div>
                <p className="font-cormorant text-lg leading-none text-creme">Mei</p>
                <p className="text-[0.7rem] text-muted">Assistante · Le Panda</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
              {history.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'self-end bg-rouge text-white'
                      : 'self-start bg-noir/60 text-texte border border-or/10'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {typing && (
                <div className="self-start rounded-2xl border border-or/10 bg-noir/60 px-4 py-3">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-or" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </span>
                </div>
              )}
              {showSugg && (
                <div className="mt-1 flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="self-start rounded-full border border-or/25 bg-or/5 px-3.5 py-1.5 text-left text-xs text-texte transition-colors hover:bg-or/15"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-or/15 bg-noir/80 px-4 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder="Écrivez votre message…"
                className="flex-1 rounded-full border border-or/15 bg-sombre px-4 py-2 text-sm text-texte outline-none placeholder:text-muted focus:border-or/40"
              />
              <button
                onClick={() => send(input)}
                aria-label="Envoyer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-or text-noir transition-transform hover:scale-105 active:scale-95"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
