/**
 * Données du menu. Structurées pour être facilement éditables — y compris
 * à terme par une application de gestion (les "plats de la semaine" sont
 * pensés pour être remplacés dynamiquement via une API).
 */

export interface Specialite {
  icone: string;
  titre: string;
  description: string;
  prix: string;
}

export const SPECIALITES: Specialite[] = [
  { icone: '🌐', titre: 'Fruits de mer', description: 'Crevettes, gambas et fruits de mer frais préparés selon les traditions d’Asie.', prix: 'dès 32 CHF' },
  { icone: '🥩', titre: 'Crispy Beef', description: 'Notre célèbre Crispy Beef, croustillant, nappé d’une sauce sucrée-salée.', prix: 'dès 25 CHF' },
  { icone: '🍜', titre: 'Nouilles & Riz', description: 'Plats généreux et savoureux, parfaits sur place ou à emporter.', prix: 'dès 20 CHF' },
  { icone: '🥟', titre: 'Dim Sum', description: 'Rouleaux de printemps, bouchées vapeur, raviolis maison.', prix: 'dès 12 CHF' },
  { icone: '🍱', titre: 'Menu Déjeuner', description: '2 entrées + plat + dessert. Complet et généreux, du mardi au dimanche.', prix: 'CHF 21.50' },
  { icone: '🥡', titre: 'À Emporter', description: 'Vos plats préférés conditionnés avec soin pour déguster chez vous.', prix: 'sur demande' },
];

export interface PlatCarte {
  nom: string;
  description: string;
  prix: string;
  signature?: boolean;
}

export interface CategorieCarte {
  cle: string;
  label: string;
  plats: PlatCarte[];
}

export const CARTE: CategorieCarte[] = [
  {
    cle: 'entrees',
    label: 'Entrées',
    plats: [
      { nom: 'Rouleaux de printemps (x4)', description: 'Légumes croquants, vermicelles, sauce nuoc-mâm', prix: '14 CHF' },
      { nom: 'Bouchées vapeur au porc (x6)', description: 'Dim sum traditionnels, sauce soja-gingembre', prix: '16 CHF' },
      { nom: 'Soupe wonton maison', description: 'Bouillon clair, raviolis au porc, ciboule', prix: '16 CHF' },
      { nom: 'Salade de crevettes thaï', description: 'Mangue, coriandre, vinaigrette citron vert', prix: '19 CHF' },
      { nom: 'Raviolis frits (x8)', description: 'Porc et crevettes, sauce aigre-douce', prix: '17 CHF' },
      { nom: 'Planche apéritif Le Panda', description: 'Assortiment d’entrées pour 2', prix: '28 CHF' },
    ],
  },
  {
    cle: 'mer',
    label: 'Fruits de mer',
    plats: [
      { nom: 'Crevettes sautées au wok', description: 'Sauce XO, légumes croquants, gingembre', prix: '32 CHF' },
      { nom: 'Poisson vapeur entier', description: 'Sauce soja douce, sésame, citronnelle', prix: '35 CHF' },
      { nom: 'Gambas sautées', description: 'Ail, gingembre, sauce huître', prix: '36 CHF' },
      { nom: 'Calamars sautés', description: 'Poivrons, sauce huître, piment doux', prix: '30 CHF' },
      { nom: 'Crevettes au curry rouge', description: 'Lait de coco, basilic thaï, riz jasmin', prix: '33 CHF' },
      { nom: 'Moules sautées', description: 'Sauce noire au gingembre et citronnelle', prix: '28 CHF' },
    ],
  },
  {
    cle: 'viandes',
    label: 'Viandes',
    plats: [
      { nom: 'Crispy Beef', description: 'Bœuf croustillant, sauce sucrée-salée, sésame', prix: '29 CHF', signature: true },
      { nom: 'Canard laqué façon Pékin', description: 'Crêpes mandarin, concombre, sauce hoisin', prix: '35 CHF' },
      { nom: 'Poulet kung pao', description: 'Cacahuètes, piment rouge, sauce épicée', prix: '26 CHF' },
      { nom: 'Porc au caramel', description: 'Effiloché de porc fondant, sauce caramel soja', prix: '28 CHF' },
      { nom: 'Bœuf sauté au basilic thaï', description: 'Sésame, sauce poisson, riz jasmin', prix: '28 CHF' },
      { nom: 'Brochettes mixtes', description: 'Bœuf, poulet, porc marinés, sauce satay', prix: '30 CHF' },
    ],
  },
  {
    cle: 'nouilles',
    label: 'Nouilles & Riz',
    plats: [
      { nom: 'Pad Thaï aux crevettes', description: 'Nouilles de riz, œuf, cacahuètes, citron vert', prix: '24 CHF' },
      { nom: 'Riz sauté Le Panda', description: 'Poulet, crevettes, légumes, sauce spéciale', prix: '22 CHF' },
      { nom: 'Ramen au bouillon', description: 'Bouillon umami, porc effiloché, œuf mollet', prix: '26 CHF' },
      { nom: 'Udon sautés', description: 'Sauce teriyaki, champignons shiitake', prix: '22 CHF' },
      { nom: 'Riz cantonais', description: 'Petits pois, carottes, œuf brouillé', prix: '8 CHF' },
      { nom: 'Riz blanc', description: 'Accompagnement', prix: '5 CHF' },
    ],
  },
  {
    cle: 'desserts',
    label: 'Desserts',
    plats: [
      { nom: 'Glace au thé matcha', description: 'Deux boules, coulis de fruits rouges', prix: '9 CHF' },
      { nom: 'Mochi glacés (x3)', description: 'Assortiment de saveurs japonaises', prix: '12 CHF' },
      { nom: 'Bananes flambées', description: 'Caramel, noix de coco, glace vanille', prix: '11 CHF' },
      { nom: 'Perles de coco et mangue', description: 'Tapioca, lait de coco, mangue fraîche', prix: '10 CHF' },
    ],
  },
];

export interface PlatSemaine {
  tag: string;
  nom: string;
  description: string;
  prix: string;
  badge?: string;
}

/**
 * Sélection hebdomadaire — exemple.
 * Destinée à être remplacée par les données de l'application de gestion.
 */
export const PLATS_SEMAINE: PlatSemaine[] = [
  { tag: '🥟 Entrée', nom: 'Raviolis vapeur au porc', description: 'Dim sum maison, sauce soja-gingembre, ciboule fraîche', prix: '16 CHF', badge: 'Nouveau' },
  { tag: '🍱 Plat du jour', nom: 'Crispy Beef du chef', description: 'Bœuf croustillant, sauce aigre-douce maison, sésame grillé, riz jasmin', prix: '28 CHF' },
  { tag: '🍮 Dessert', nom: 'Bananes flambées coco', description: 'Caramel de lait de coco, glace vanille, noix de cajou', prix: '10 CHF' },
  { tag: '🥟 Entrée', nom: 'Rouleaux de printemps (x4)', description: 'Légumes croquants, vermicelles de riz, sauce nuoc-mâm', prix: '14 CHF' },
  { tag: '🍱 Plat', nom: 'Poulet sauté aux noix de cajou', description: 'Sauce hoisin, poivrons, champignons noirs, riz cantonais', prix: '24 CHF', badge: 'Coup de cœur' },
  { tag: '🍱 Plat', nom: 'Crevettes sautées au wok', description: 'Ail, gingembre, sauce XO, légumes de saison', prix: '32 CHF' },
];

export interface Avis {
  texte: string;
  auteur: string;
}

export const AVIS: Avis[] = [
  { texte: ‘Restaurant très agréable avec un personnel souriant. La cuisine est excellente et les portions généreuses !’, auteur: ‘Client Google · Leytron’ },
  { texte: ‘Personnel très accueillant ! Nourriture excellente. Nous avons pris à l’emporter, ils nous ont très bien servis.’, auteur: ‘Robin Ebener · Local Guide’ },
  { texte: ‘Les plats sont excellents ! Une adresse que je recommande chaleureusement à tous les amateurs de cuisine asiatique.’, auteur: ‘Client Google · Leytron’ },
  { texte: ‘Le Crispy Beef est à tomber ! On y retourne régulièrement, c’est notre restaurant préféré en Valais.’, auteur: ‘Sophie M. · Saxon’ },
  { texte: ‘Accueil chaleureux, cadre intimiste et cuisine raffinée. Le menu déjeuner à 21.50 CHF est une belle surprise.’, auteur: ‘Marc D. · Martigny’ },
  { texte: ‘Les dim sum maison sont une merveille. L’équipe prend vraiment soin de ses clients, on se sent comme à la maison.’, auteur: ‘Local Guide · Valais’ },
  { texte: ‘Vraiment délicieux, les portions sont généreuses et les prix très corrects pour la qualité proposée.’, auteur: ‘Julie F. · Sion’ },
  { texte: ‘Un coup de cœur ! Le cadre est très agréable et les plats de fruits de mer sont frais et savoureux.’, auteur: ‘Client Google · Conthey’ },
  { texte: ‘Service impeccable et cuisine authentique. Le riz sauté aux fruits de mer est ma commande systématique.’, auteur: ‘Thomas B. · Leytron’ },
];

export const GALERIE: { src: string; alt: string }[] = [
  { src: 'https://media-cdn.tripadvisor.com/media/photo-o/0e/18/a1/a3/plateau-de-fruits-du.jpg', alt: 'Plateau de fruits de mer' },
  { src: 'https://foto1.sluurpy.com/locali/ch/6983402/16275372.jpg', alt: 'Plat du Panda' },
  { src: 'https://foto1.sluurpy.com/locali/ch/6983402/16275374.jpg', alt: 'Spécialité maison' },
  { src: 'https://foto1.sluurpy.com/locali/ch/6983402/16275365.jpg', alt: 'Plat asiatique' },
  { src: 'https://foto1.sluurpy.com/locali/ch/6983402/16275351.jpg', alt: 'Cuisine du Panda' },
  { src: 'https://foto1.sluurpy.com/locali/ch/6983402/16275355.jpg', alt: 'Saveurs d’Asie' },
  { src: 'https://foto1.sluurpy.com/locali/ch/6983402/16275361.jpg', alt: 'Spécialité' },
  { src: 'https://foto1.sluurpy.com/locali/ch/6983402/16275341.jpg', alt: 'Plat signature' },
  { src: 'https://foto1.sluurpy.com/locali/ch/6983402/16275347.jpg', alt: 'Création du chef' },
  { src: 'https://foto1.sluurpy.com/locali/ch/6983402/16275333.jpg', alt: 'Cuisine asiatique' },
];
