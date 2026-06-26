# 🐼 Le Panda — Site web

Site du restaurant asiatique **Le Panda** à Leytron (Valais), construit avec
**Next.js 14**, **TypeScript**, **Tailwind CSS** et **Framer Motion**.

## 🚀 Démarrage

```bash
npm install
cp .env.example .env.local   # puis remplir les clés
npm run dev                  # http://localhost:3000
```

## 🔑 Variables d'environnement

À définir dans `.env.local` (local) **et** dans les *Environment Variables*
de Vercel / GitHub. Elles ne sont **jamais** exposées au navigateur : elles ne
sont lues que côté serveur, dans les routes `app/api/*`.

| Variable | Rôle |
|----------|------|
| `OPENAI_API_KEY` | Clé OpenAI du chatbot « Mei » (route `app/api/chat`) |
| `WEB3FORMS_ACCESS_KEY` | Envoi des réservations par email (route `app/api/reservation`) |

> ⚠️ **Sécurité** : l'ancienne clé OpenAI était codée en dur dans le HTML public.
> Elle doit être **révoquée** sur platform.openai.com et remplacée par une
> nouvelle clé, placée uniquement dans les variables d'environnement.

## 🖼️ Images à fournir

Trois photos doivent être déposées dans `public/images/` (placeholders actuels
à remplacer) :

| Fichier | Contenu attendu |
|---------|-----------------|
| `exterieur.jpg` | Façade extérieure du restaurant (fond du hero) |
| `plat.jpg` | Plat signature (média qui se déploie au scroll) |
| `homard.jpg` | Plateau de homard (révélation à l'encre, section « Une carte généreuse ») |

`logo.jpg` est déjà extrait de l'ancien site.

## 🗂️ Architecture

```
app/
  layout.tsx          → polices, métadonnées, JSON-LD SEO
  page.tsx            → composition des sections
  globals.css         → base Tailwind + classes utilitaires
  api/
    chat/route.ts        → proxy OpenAI (clé cachée)
    reservation/route.ts → envoi Web3Forms (clé cachée)
components/
  sections/           → Navbar, Hero, About, Gallery, Specialites,
                        Carte, PlatsSemaine, Reviews, Reservation,
                        FacebookSection, Infos, Footer
  ui/                 → ScrollExpandMedia, InkReveal, PortfolioGallery,
                        GlassButton, Reveal (animations), Chatbot
lib/
  restaurant.ts       → infos + horaires + calcul ouvert/fermé
  menu-data.ts        → spécialités, carte, plats de la semaine, avis, galerie
  utils.ts            → helper cn()
public/images/        → logo + photos
legacy/               → ancien site HTML (archive)
```

## ✨ Points clés

- **Hero** : effet *scroll-to-expand* (extérieur → plat).
- **« Une carte généreuse »** : révélation à l'encre au survol (image du homard).
- **Galerie** : composant 3D superposé (desktop) / marquee (mobile).
- **Boutons** : style *glassmorphism* translucide réutilisable (`GlassButton`).
- **Horaires** : deux services par jour + badge **Ouvert / Fermé en temps réel**
  (fuseau Europe/Zurich).
- **Chatbot Mei** : appelle `/api/chat` (aucune clé côté client) et peut créer
  une réservation.
- **Plats de la semaine** : données dans `lib/menu-data.ts`, prêtes à être
  branchées sur une future application de gestion.

## ☁️ Déploiement

Push sur la branche → Vercel détecte Next.js et build automatiquement.
Ne pas oublier d'ajouter `OPENAI_API_KEY` et `WEB3FORMS_ACCESS_KEY` dans les
*Environment Variables* du projet Vercel.
