import Link from 'next/link';
import { RESTAURANT } from '@/lib/restaurant';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Mentions légales & Confidentialité — ${RESTAURANT.nom}`,
  description: 'Mentions légales, politique de confidentialité et gestion des cookies du restaurant Le Panda à Leytron.',
  robots: 'noindex,nofollow',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-cormorant text-2xl font-medium text-or">{title}</h2>
      <div className="space-y-3 text-[0.92rem] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function MentionsLegales() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-noir px-6 py-16 md:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-or"
        >
          ← Retour au site
        </Link>

        <h1 className="mb-2 font-cormorant text-4xl font-semibold text-creme">
          Mentions légales & Confidentialité
        </h1>
        <p className="mb-12 text-sm text-muted">Dernière mise à jour : {year}</p>

        <Section title="1. Éditeur du site">
          <p><strong className="text-texte">{RESTAURANT.nom}</strong> — {RESTAURANT.cuisine}</p>
          <p>{RESTAURANT.adresse}, {RESTAURANT.codePostal} {RESTAURANT.ville}, {RESTAURANT.region}, Suisse</p>
          <p>Téléphone : <a href={`tel:${RESTAURANT.telephoneRaw}`} className="text-or hover:underline">{RESTAURANT.telephone}</a></p>
          <p>Email : <a href={`mailto:${RESTAURANT.email}`} className="text-or hover:underline">{RESTAURANT.email}</a></p>
        </Section>

        <Section title="2. Hébergement">
          <p>Ce site est hébergé par <strong className="text-texte">Vercel Inc.</strong>, 340 Pine Street Suite 701, San Francisco, CA 94104, États-Unis.</p>
          <p>Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-or hover:underline">vercel.com</a></p>
        </Section>

        <Section title="3. Données personnelles & RGPD">
          <p>
            Conformément au Règlement (UE) 2016/679 (RGPD) et à la Loi fédérale suisse sur la protection
            des données (LPD), vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement
            et d&apos;opposition concernant vos données personnelles.
          </p>
          <p>
            Les données collectées via le formulaire de réservation (nom, téléphone, email, date souhaitée)
            sont utilisées <strong className="text-texte">uniquement pour traiter votre réservation</strong>.
            Elles ne sont ni vendues, ni partagées avec des tiers, ni conservées au-delà de 90 jours.
          </p>
          <p>
            Pour exercer vos droits ou demander la suppression de vos données :{' '}
            <a href={`mailto:${RESTAURANT.email}`} className="text-or hover:underline">{RESTAURANT.email}</a>
          </p>
        </Section>

        <Section title="4. Cookies">
          <p>Ce site utilise des cookies <strong className="text-texte">strictement fonctionnels</strong> :</p>
          <ul className="mt-2 space-y-2 pl-4">
            <li>
              <strong className="text-texte">Firebase / Firestore</strong> — lecture du menu de la semaine en temps réel.
              Aucune donnée personnelle collectée. Politique de confidentialité Google :{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-or hover:underline">policies.google.com/privacy</a>
            </li>
            <li>
              <strong className="text-texte">Préférence cookies</strong> — stocké localement (localStorage)
              pour mémoriser votre choix d&apos;acceptation ou de refus. Aucune donnée envoyée à un serveur.
            </li>
          </ul>
          <p className="mt-3">
            Ce site <strong className="text-texte">n&apos;utilise pas</strong> de cookies publicitaires,
            de tracking, ni de partage sur réseaux sociaux tiers.
          </p>
          <p>
            Vous pouvez modifier votre choix à tout moment en effaçant les données de navigation de votre navigateur.
          </p>
        </Section>

        <Section title="5. Services tiers">
          <ul className="space-y-2 pl-4">
            <li>
              <strong className="text-texte">OpenAI</strong> — Le chatbot utilise l&apos;API OpenAI (gpt-4o-mini).
              Les messages envoyés au chatbot sont traités par OpenAI conformément à leur{' '}
              <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-or hover:underline">politique de confidentialité</a>.
              Ne partagez pas d&apos;informations sensibles via le chatbot.
            </li>
            <li>
              <strong className="text-texte">Web3Forms</strong> — Les demandes de réservation envoyées via
              le formulaire sont transmises par e-mail au restaurant via le service Web3Forms.
              Les données saisies (nom, téléphone, e-mail, date, nombre de personnes, message) sont uniquement
              utilisées pour traiter votre demande de réservation et ne sont pas conservées par Web3Forms
              au-delà de l&apos;acheminement du message. Politique de confidentialité :{' '}
              <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer" className="text-or hover:underline">web3forms.com/privacy</a>
            </li>
            <li>
              <strong className="text-texte">Google Fonts</strong> — Les polices de caractères sont chargées
              depuis les serveurs Google.
            </li>
          </ul>
        </Section>

        <Section title="6. Propriété intellectuelle">
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, images, design) est la propriété
            exclusive de {RESTAURANT.nom} ou de ses fournisseurs de contenu. Toute reproduction,
            représentation ou diffusion sans autorisation écrite est interdite.
          </p>
        </Section>

        <Section title="7. Responsabilité">
          <p>
            {RESTAURANT.nom} s&apos;efforce de maintenir les informations publiées à jour mais ne peut
            garantir l&apos;exactitude, l&apos;exhaustivité ou l&apos;actualité des informations.
            Le restaurant se réserve le droit de modifier les horaires, menus et tarifs à tout moment.
          </p>
        </Section>

        <div className="mt-12 border-t border-or/10 pt-8 text-center text-xs text-muted/50">
          © {year} {RESTAURANT.nom} · {RESTAURANT.ville}, {RESTAURANT.region}, Suisse
        </div>
      </div>
    </div>
  );
}
