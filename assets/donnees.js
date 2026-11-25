/* ============================================================================
   ATELIER HORTUS BLANC · LES DONNÉES DU SITE
   C'est le SEUL fichier à ouvrir pour changer un prix, ajouter une création,
   une date d'atelier, l'annonce du haut de page ou les messages du cercle.

   Comment faire :
   - Ouvrir ce fichier avec un éditeur de texte (Bloc-notes, VS Code…).
   - Modifier seulement ce qui est entre guillemets '…' ou les nombres.
   - Garder les virgules en fin de ligne et les apostrophes écrites \' dans les textes.
   - Enregistrer, puis recharger la page du site pour vérifier.
   Les dates s'écrivent AAAA-MM-JJ (ex. '2026-12-12') et les heures AAAA-MM-JJTHH:MM.
   ============================================================================ */
window.HB_DONNEES = {

  // ---------- Coordonnées ----------
  contact: {
    mail: 'atelierhortusblanc@gmail.com',
    tel: '07 62 76 17 73',
    instagram: 'https://www.instagram.com/atelierhortusblanc_fleuriste/',
    adresse: '31 rue de la Tour d\'Auvergne, Tours',
    plan: 'https://www.google.com/maps/search/?api=1&query=31+rue+de+la+Tour+d%27Auvergne+Tours'
  },

  // ---------- Envoi des demandes et des commandes ----------
  // Vide : le site ouvre la messagerie du visiteur avec le message déjà rédigé.
  // Rempli : les demandes partent directement dans la boîte de l'atelier, sans messagerie.
  //   adresse : l'adresse d'envoi donnée par un service de formulaires
  //             (ex. Web3Forms : 'https://api.web3forms.com/submit', ou Formspree : 'https://formspree.io/f/xxxxxxx')
  //   cle     : la clé d'accès si le service en donne une (Web3Forms), sinon laisser vide
  envoi: {
    adresse: '',
    cle: ''
  },

  // ---------- Paiement en ligne ----------
  // Vide : pas de paiement sur le site, on règle à l'atelier ou à la livraison.
  // Rempli : après une commande, un bouton « Payer en ligne » ouvre ce lien.
  //   {montant} est remplacé par le total de la commande (ex. 51.15).
  //   Exemples : 'https://paypal.me/atelierhortusblanc/{montant}EUR' ou un lien de paiement SumUp.
  paiement: {
    lien: '',
    livraison: 5          // prix de la livraison à Tours, en euros
  },

  // ---------- Créations de la boutique ----------
  // id : nom technique unique, sans espace (ne plus le changer une fois en ligne)
  // cat : uniques, tableaux, mariage, bouquets, bijoux ou cadeaux
  // price : prix en euros · unique: true = pièce unique (une seule en stock)
  // img : nom de la photo dans le dossier images (sans -800.webp) · sinon tone + ico pour une illustration
  // hidden: true = vendue mais pas affichée dans la liste (cartes cadeaux à montant)
  creations: [
    { id: 'buste-paon', cat: 'uniques', kind: 'Composition séchée', name: 'Composition « Paon »', price: 75, unique: true, img: 'buste-paon', alt: 'Composition de plumes de paon, blé doré, pampa et perles, présentée sur un buste blanc', desc: 'Plumes de paon, blé doré, pampa et perles nacrées. Composition seule : le buste reste à l\'atelier.' },
    { id: 'buste-flamboyant', cat: 'uniques', kind: 'Composition séchée', name: 'Composition « Flamboyant »', price: 75, unique: true, img: 'buste-flamboyant', alt: 'Composition de palmes rouille, phalaris orange et amarante rouge, présentée sur un buste blanc', desc: 'Palmes rouille, phalaris orange, ruscus rouge et amarante. Composition seule : le buste reste à l\'atelier.' },
    { id: 'triptyque', cat: 'tableaux', kind: 'Tableau végétal', name: 'Triptyque Bambou', price: 190, unique: true, img: 'tableaux-vegetaux', alt: 'Trois tableaux de mousse stabilisée verte avec bambou et lierre', desc: 'Trois panneaux de mousse stabilisée, bambou, lierre et palmes. Sans entretien.' },
    { id: 'tableau-mousse', cat: 'tableaux', kind: 'Tableau végétal', name: 'Tableau « Sous-bois »', price: 69, img: 'mur-vegetal-bambou', alt: 'Panneau de mousse stabilisée vert tendre et vert profond avec bambou', desc: 'Mousse stabilisée vert tendre et vert profond, bambou et amarante.' },
    { id: 'couronne-tete', cat: 'mariage', kind: 'Mariage & séance photo', name: 'Couronne Hortensia', price: 39, img: 'couronne-hortensias', alt: 'Couronne de tête en hortensias stabilisés verts, lavande et eucalyptus', desc: 'Hortensias stabilisés, lavande, fougère et eucalyptus. À porter ou à poser.' },
    { id: 'bouquet-saison', cat: 'bouquets', kind: 'Fleurs séchées', name: 'Bouquet de saison', price: 35, tone: 'terra', ico: 'i-bouquet', desc: 'Fleurs séchées aux couleurs accentuées, composé à l\'atelier selon la saison.' },
    { id: 'petit-bouquet', cat: 'bouquets', kind: 'Fleurs séchées', name: 'Petit bouquet à offrir', price: 18, tone: 'ochre', ico: 'i-bouquet', desc: 'Un bouquet de poche pour dire merci, joliment emballé.' },
    { id: 'cloche', cat: 'bouquets', kind: 'Fleurs stabilisées', name: 'Cloche florale', price: 35, tone: 'olive', ico: 'i-bell', desc: 'Composition stabilisée sous globe de verre, qui dure des années.' },
    { id: 'terrarium', cat: 'bouquets', kind: 'Plantes', name: 'Terrarium', price: 29, tone: 'olive', ico: 'i-terrarium', desc: 'Petit jardin sous verre, mousses et plantes faciles à vivre.' },
    { id: 'pendentif', cat: 'bijoux', kind: 'Bijou floral', name: 'Pendentif fleur', price: 25, tone: 'ink', ico: 'i-jewel', desc: 'Une vraie fleur figée dans la résine, montée sur chaîne dorée.' },
    { id: 'boucles', cat: 'bijoux', kind: 'Bijou floral', name: 'Boucles d\'oreilles pétales', price: 22, tone: 'terra', ico: 'i-jewel', desc: 'Pétales véritables en résine, légères et uniques.' },
    { id: 'carte-30', cat: 'cadeaux', hidden: true, kind: 'Carte cadeau', name: 'Carte cadeau 30 €', price: 30, tone: 'ink', ico: 'i-gift', desc: 'Valable un an sur toute la boutique et les ateliers.' },
    { id: 'carte-50', cat: 'cadeaux', hidden: true, kind: 'Carte cadeau', name: 'Carte cadeau 50 €', price: 50, tone: 'ink', ico: 'i-gift', desc: 'Valable un an sur toute la boutique et les ateliers.' },
    { id: 'carte-80', cat: 'cadeaux', hidden: true, kind: 'Carte cadeau', name: 'Carte cadeau 80 €', price: 80, tone: 'ink', ico: 'i-gift', desc: 'Valable un an sur toute la boutique et les ateliers.' },
    { id: 'carte-cadeau', cat: 'cadeaux', kind: 'Carte cadeau', name: 'Atelier floral à offrir', price: 45, tone: 'ink', ico: 'i-gift', desc: 'Une place pour un atelier de 2 heures, au choix dans le calendrier.' }
  ],

  // ---------- Ateliers ----------
  // places : nombre de participants par atelier · prix : prix d'une place en euros
  // taken : places déjà prises en dehors du site (téléphone, Instagram…)
  ateliers: {
    places: 8,
    prix: 45,
    dates: [
      { id: 's1', date: '2026-11-14T10:00', title: 'Couronne de l\'Avent', theme: 'Fleurs séchées', taken: 5 },
      { id: 's2', date: '2026-11-21T14:00', title: 'Couronne de Noël', theme: 'Sapin et fleurs séchées', taken: 8 },
      { id: 's3', date: '2026-11-28T10:00', title: 'Couronne de Noël', theme: 'Sapin et fleurs séchées', taken: 6 },
      { id: 's4', date: '2026-12-05T14:00', title: 'Centre de table de fête', theme: 'Fleurs stabilisées', taken: 3 },
      { id: 's5', date: '2026-12-12T10:00', title: 'Couronne de Noël', theme: 'Sapin et fleurs séchées', taken: 5 },
      { id: 's6', date: '2026-12-19T14:00', title: 'Cloche florale', theme: 'Fleurs stabilisées sous verre', taken: 2 },
      { id: 's7', date: '2027-01-16T14:00', title: 'Terrarium', theme: 'Mousses et plantes', taken: 1 },
      { id: 's8', date: '2027-01-30T10:00', title: 'Bouquet séché', theme: 'Couleurs d\'hiver', taken: 0 },
      { id: 's9', date: '2027-02-13T14:00', title: 'Cœur floral', theme: 'Spécial Saint-Valentin', taken: 4 },
      { id: 's10', date: '2027-02-27T10:00', title: 'Tableau végétal', theme: 'Mousses stabilisées', taken: 2 }
    ]
  },

  // ---------- Bandeau d'annonce en haut des pages ----------
  // Il annonce la prochaine date de l'atelier qui porte ce titre, puis disparaît après la dernière.
  // Pour une nouvelle annonce, changer aussi l'id (ex. 'paques-2027') : il réapparaît chez ceux qui l'avaient fermé.
  // Mettre atelier: '' pour ne plus afficher de bandeau.
  annonce: {
    id: 'noel-2026',
    atelier: 'Couronne de Noël',
    texte: 'Atelier couronne de Noël',
    lien: 'ateliers.html#calendrier'
  },

  // ---------- Messages du cercle (membres connectés) ----------
  // from / to : période d'affichage · level : 0 = tous les membres, 1 = Éclose et plus, 2 = Bouquet
  messagesCercle: [
    { id: 'c-noel', type: 'Nouveauté', from: '2026-11-01', to: '2026-12-12', level: 0, title: 'Les ateliers couronne de Noël sont ouverts', text: 'Trois samedis pour fabriquer la vôtre : 21 et 28 novembre, 12 décembre.', href: 'ateliers.html#calendrier', cta: 'Choisir ma date' },
    { id: 'c-tableaux', type: 'Offre membres', from: '2026-11-15', to: '2026-11-30', level: 0, title: '−15 % sur les tableaux végétaux', text: 'Jusqu\'au 30 novembre avec le code CERCLE15, réservé aux membres du cercle.', href: 'boutique.html', cta: 'Voir les tableaux' },
    { id: 'c-inedits', type: 'Avant-première', from: '2026-11-10', to: '2026-12-31', level: 1, title: 'Les nouvelles pièces, avant tout le monde', text: 'Les pièces inédites sont réservables par les membres Éclose et Bouquet 48 h avant leur mise en boutique.', href: 'index.html#inedits', cta: 'Voir les pièces' },
    { id: 'c-soiree', type: 'Invitation', from: '2026-11-15', to: '2026-12-10', level: 2, rsvp: true, title: 'Soirée du cercle à l\'atelier', text: 'Jeudi 10 décembre à 18 h 30 : démonstration de couronne et découverte de la collection d\'hiver. Sur invitation, places limitées.' }
  ],

  // ---------- Fêtes de l'année (carnet et rappels) ----------
  // lead : nombre de jours avant la fête où l'idée commence à s'afficher
  fetes: [
    { id: 'noel', name: 'Noël', date: '2026-12-25', lead: 60, idea: 'Couronnes de l\'Avent, centres de table et ateliers de Noël.', href: 'ateliers.html', cta: 'Voir les ateliers de Noël' },
    { id: 'valentin', name: 'Saint-Valentin', date: '2027-02-14', lead: 21, idea: 'Cloche florale, bouquet séché ou atelier « Cœur floral » à deux.', href: 'boutique.html', cta: 'Trouver une idée' },
    { id: 'grands-meres', name: 'Fête des grands-mères', date: '2027-03-07', lead: 21, idea: 'Un petit bouquet à offrir ou un terrarium facile à vivre.', href: 'boutique.html', cta: 'Voir la boutique' },
    { id: 'muguet', name: '1er mai', date: '2027-05-01', lead: 14, idea: 'Le muguet porte-bonheur, en bouquet ou en composition.', href: 'index.html#contact', cta: 'Réserver mon muguet' },
    { id: 'meres', name: 'Fête des mères', date: '2027-05-30', lead: 21, idea: 'Bijou floral, bouquet de saison ou atelier à offrir.', href: 'boutique.html', cta: 'Trouver une idée' },
    { id: 'peres', name: 'Fête des pères', date: '2027-06-20', lead: 21, idea: 'Un tableau végétal ou un terrarium pour le bureau.', href: 'boutique.html', cta: 'Voir les tableaux' },
    { id: 'toussaint', name: 'Toussaint', date: '2027-11-01', lead: 21, idea: 'Compositions durables pour fleurir un souvenir.', href: 'souvenirs.html', cta: 'Voir les compositions' }
  ]
};
