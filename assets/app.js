/* Atelier Hortus Blanc — script commun à toutes les pages :
   motifs SVG, en-tête, pied de page, espace client, panier, visionneuse photo.
   Démo : les données (comptes, panier, réservations…) restent dans ce navigateur. */
(() => {
  'use strict';

  // Toutes les données modifiables (prix, créations, dates, contact) sont dans assets/donnees.js
  const D = window.HB_DONNEES || {};
  const CONTACT = D.contact || {};
  const IG = CONTACT.instagram;
  const MAIL = CONTACT.mail;
  const TEL = CONTACT.tel;
  const MAPS = CONTACT.plan;
  const page = document.body.dataset.page || '';
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const euro = n => n.toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }) + ' €';
  const cents = n => Math.round(n * 100) / 100;
  const fmtDate = (iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) => new Date(iso).toLocaleDateString('fr-FR', opts);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const icon = (name, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#${name}"/></svg>`;

  // ---------- Stockage local (avec repli en mémoire si le navigateur le bloque) ----------
  const mem = {};
  const db = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); if (v !== null) return JSON.parse(v); } catch {}
      return key in mem ? mem[key] : fallback;
    },
    set(key, val) { mem[key] = val; try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
  };

  // ---------- Motifs SVG ----------
  const G = 'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"';
  document.body.insertAdjacentHTML('afterbegin', `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <symbol id="acanthe" viewBox="0 0 120 240">
    <g fill="none" stroke-linecap="round">
      <path d="M58 228 C 22 226, 14 192, 36 182 C 52 175, 66 190, 56 200 C 49 207, 40 200, 45 194" stroke="currentColor" stroke-width="9"/>
      <path d="M58 228 C 98 214, 96 168, 64 150 C 36 134, 40 96, 66 82 C 88 70, 90 42, 74 18" stroke="currentColor" stroke-width="9"/>
    </g>
    <g fill="currentColor">
      <path d="M64 150 C 84 146, 104 150, 112 128 C 96 126, 78 132, 64 150Z"/>
      <path d="M70 158 C 90 162, 106 174, 114 160 C 100 150, 84 150, 70 158Z"/>
      <path d="M50 120 C 34 118, 20 130, 6 118 C 20 104, 40 104, 50 120Z"/>
      <path d="M46 104 C 34 96, 30 82, 16 82 C 20 98, 32 108, 46 104Z"/>
      <path d="M66 82 C 82 84, 98 78, 104 64 C 88 62, 74 68, 66 82Z"/>
      <path d="M74 18 C 64 12, 66 2, 78 0 C 84 8, 84 14, 74 18Z"/>
      <path d="M86 204 C 102 210, 114 200, 118 212 C 106 224, 92 220, 86 204Z"/>
    </g>
    <g fill="none" stroke="#7E3F20" stroke-width="1.3" stroke-linecap="round" opacity=".75">
      <path d="M58 228 C 22 226, 14 192, 36 182 C 52 175, 66 190, 56 200 C 49 207, 40 200, 45 194"/>
      <path d="M58 228 C 98 214, 96 168, 64 150 C 36 134, 40 96, 66 82 C 88 70, 90 42, 74 18"/>
      <path d="M66 148 C 84 144, 98 140, 108 130M72 158 C 88 160, 100 164, 110 160M48 118 C 34 116, 22 120, 10 118M66 82 C 80 80, 92 74, 100 66"/>
    </g>
  </symbol>
  <symbol id="mark" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="#161412"/><circle cx="50" cy="50" r="42" fill="#FFFFFF"/>
    <use href="#acanthe" x="22" y="16" width="34" height="68" style="color:#C4683A"/>
    <g fill="#161412" font-family="Cormorant Garamond, Georgia, serif" font-weight="600" font-size="11.5">
      <text x="47" y="40">Atelier</text><text x="51" y="53">Hortus</text><text x="55" y="66">Blanc</text>
    </g>
  </symbol>
  <symbol id="arrow" viewBox="0 0 16 16"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="out" viewBox="0 0 16 16"><path d="M5 11l6-6M6 4h5v5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
  <symbol id="close" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>
  <symbol id="ig" viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.6" cy="6.4" r="1.2" fill="currentColor"/></symbol>
  <symbol id="bag" viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12.1a1 1 0 01-1 .9H7.2a1 1 0 01-1-.9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 10V7a3 3 0 016 0v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
  <symbol id="heart" viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.7 3.9 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.9 1.2-1.8 2.8-2.9 4.8-2.9 3.3 0 5.6 3.2 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" fill="var(--hf, none)" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></symbol>
  <symbol id="drop" viewBox="0 0 50 50"><g ${G}><path d="M25 6c7 10 12 17 12 24a12 12 0 01-24 0c0-7 5-14 12-24z"/><path d="M19 31c0 3 2 6 6 6"/></g></symbol>
  <symbol id="sun" viewBox="0 0 50 50"><g ${G}><circle cx="25" cy="25" r="8"/><path d="M25 5v6M25 39v6M5 25h6M39 25h6M11 11l4 4M35 35l4 4M39 11l-4 4M15 35l-4 4"/></g></symbol>
  <symbol id="star" viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17l-5.6 3 1.1-6.2L2.9 9.4l6.3-.9z" fill="currentColor"/></symbol>
  <symbol id="check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-rings" viewBox="0 0 50 50"><g ${G}><circle cx="19" cy="30" r="11"/><circle cx="31" cy="30" r="11"/><path d="M25 8l3 5h-6z"/><path d="M25 13v4"/></g></symbol>
  <symbol id="i-wreath" viewBox="0 0 50 50"><g ${G}><circle cx="25" cy="25" r="17"/><circle cx="25" cy="25" r="9"/><path d="M25 8c3 3 3 6 0 8-3-2-3-5 0-8zM42 25c-3 3-6 3-8 0 2-3 5-3 8 0zM25 42c-3-3-3-6 0-8 3 2 3 5 0 8zM8 25c3-3 6-3 8 0-2 3-5 3-8 0z"/></g></symbol>
  <symbol id="i-building" viewBox="0 0 50 50"><g ${G}><path d="M8 44V18l17-10 17 10v26"/><path d="M4 44h42"/><path d="M19 44V30h12v14"/><path d="M15 22h4M31 22h4"/></g></symbol>
  <symbol id="i-frame" viewBox="0 0 50 50"><g ${G}><rect x="6" y="8" width="38" height="34" rx="1"/><rect x="11" y="13" width="28" height="24"/><path d="M25 34V20M25 26c-5 0-7-3-7-7 5 0 7 3 7 7zM25 23c4 0 6-2 6-6-4 0-6 2-6 6z"/></g></symbol>
  <symbol id="i-jewel" viewBox="0 0 50 50"><g ${G}><path d="M10 6c4 10 26 10 30 0"/><path d="M25 12v6"/><path d="M25 18l9 9-9 15-9-15z"/><path d="M22 27c2-2 4-2 6 0"/></g></symbol>
  <symbol id="i-bouquet" viewBox="0 0 50 50"><g ${G}><path d="M25 46V22M25 30L14 10M25 30l11-20M25 26V6"/><circle cx="14" cy="9" r="3"/><circle cx="36" cy="9" r="3"/><circle cx="25" cy="5" r="3"/><path d="M18 46h14"/></g></symbol>
  <symbol id="i-gift" viewBox="0 0 50 50"><g ${G}><path d="M8 20h34v24H8z"/><path d="M5 14h40v6H5zM25 14v30M25 14c-3-7-12-7-12-2s9 2 12 2c3 0 12 3 12-2s-9-5-12 2"/></g></symbol>
  <symbol id="i-bell" viewBox="0 0 50 50"><g ${G}><path d="M10 42h30M14 42V24a11 11 0 0122 0v18"/><path d="M25 13V8M22 8h6"/><path d="M25 38V28M25 32c-4 0-6-2-6-5 4 0 6 2 6 5z"/></g></symbol>
  <symbol id="i-terrarium" viewBox="0 0 50 50"><g ${G}><path d="M10 22h30l-3 22H13z"/><path d="M14 22c0-8 5-14 11-14s11 6 11 14"/><path d="M19 38c2-6 5-8 6-12M31 38c-2-5-4-7-6-12"/></g></symbol>
  <symbol id="i-baby" viewBox="0 0 50 50"><g ${G}><circle cx="25" cy="18" r="9"/><path d="M11 44c2-9 7-14 14-14s12 5 14 14"/><path d="M21 17h.01M29 17h.01M22 22c2 1.5 4 1.5 6 0"/></g></symbol>
  <symbol id="i-team" viewBox="0 0 50 50"><g ${G}><circle cx="16" cy="17" r="5"/><circle cx="34" cy="17" r="5"/><circle cx="25" cy="13" r="5"/><path d="M6 40c1-7 5-11 10-11M44 40c-1-7-5-11-10-11M14 42c1-8 5-12 11-12s10 4 11 12"/></g></symbol>
  <symbol id="i-cake" viewBox="0 0 50 50"><g ${G}><path d="M9 44h32V28H9z"/><path d="M9 34c4 3 8 3 12 0s8-3 12 0 6 2 8 0"/><path d="M17 28v-6M25 28v-6M33 28v-6"/><path d="M17 18c-1.5-2 0-4 0-5 1.5 1.5 1.5 3 0 5zM25 18c-1.5-2 0-4 0-5 1.5 1.5 1.5 3 0 5zM33 18c-1.5-2 0-4 0-5 1.5 1.5 1.5 3 0 5z"/></g></symbol>
  <symbol id="i-camera" viewBox="0 0 50 50"><g ${G}><rect x="5" y="14" width="40" height="28" rx="3"/><path d="M17 14l3-6h10l3 6"/><circle cx="25" cy="28" r="8"/></g></symbol>
  <symbol id="i-calendar" viewBox="0 0 50 50"><g ${G}><rect x="6" y="10" width="38" height="34" rx="3"/><path d="M6 20h38M16 5v9M34 5v9M16 30h4M24 30h4M32 30h4M16 37h4M24 37h4"/></g></symbol>
</defs></svg>`);

  // Logo officiel, hébergé avec le site (images/logo-*.webp), dans son médaillon
  const logo = (size = 600, alt = 'Logo Atelier Hortus Blanc') =>
    `<span class="logo-badge"><img src="images/logo-${size > 200 ? 480 : 160}.webp" srcset="images/logo-160.webp 160w, images/logo-480.webp 480w" sizes="${size > 200 ? '(max-width: 600px) 60vw, 360px' : '80px'}" width="480" height="480" alt="${alt}" decoding="async" onerror="this.parentNode.classList.add('fallback')"><svg class="fallback-mark" aria-hidden="true"><use href="#mark"/></svg></span>`;
  const fillLogos = root => root.querySelectorAll('[data-logo]').forEach(el => {
    el.outerHTML = logo(+el.dataset.logo || 120, el.dataset.alt ?? 'Logo Atelier Hortus Blanc');
  });

  // ---------- En-tête ----------
  const LINKS = [
    ['home', 'index.html#atelier', "L'atelier"],
    ['nouveautes', 'index.html#inedits', 'Nouveautés'],
    ['ateliers', 'ateliers.html', 'Ateliers'],
    ['boutique', 'boutique.html', 'Boutique'],
    ['souvenirs', 'souvenirs.html', 'Souvenirs'],
    ['pros', 'pros.html', 'Pros &amp; mariages'],
    ['carnet', 'carnet.html', 'Le carnet'],
    ['avis', 'avis.html', 'Avis']
  ];
  const igLink = `<a class="social" href="${IG}" target="_blank" rel="noopener" aria-label="Instagram de l'atelier"><svg><use href="#ig"/></svg></a>`;
  document.querySelector('svg').insertAdjacentHTML('afterend', `
<a class="skip" href="#main">Aller au contenu</a>
<header class="nav${page === 'home' ? '' : ' solid'}" id="nav">
  <div class="wrap">
    <a href="index.html" class="logo" aria-label="Atelier Hortus Blanc, accueil">${logo(120)}<span class="logo-text">Atelier Hortus Blanc<small>fleuriste créateur</small></span></a>
    <nav class="nav-menu" aria-label="Menu principal">
    <ul class="nav-links" id="menu">
      ${LINKS.map(([key, href, label]) => `<li><a href="${href}"${key === page && key !== 'home' ? ' class="active" aria-current="page"' : ''}>${label}</a></li>`).join('')}
      <li class="menu-only"><a href="index.html#contact">Contact</a></li>
      <li class="menu-only"><a href="#" data-open="signup">Mon compte</a></li>
      <li class="menu-socials">${igLink}</li>
    </ul>
    </nav>
    <div class="nav-right">
      ${igLink}
      <button class="acc-btn" id="acc-btn" data-open="signup"><svg><use href="#user"/></svg><span id="acc-label">Mon compte</span></button>
      <button class="cart-btn" id="cart-btn" aria-label="Ouvrir le panier"><svg><use href="#bag"/></svg><span class="cart-count" id="cart-count" hidden>0</span></button>
      <a href="index.html#contact" class="btn btn-primary">Rendez-vous <svg class="go"><use href="#arrow"/></svg></a>
      <button class="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
    </div>
  </div>
</header>`);

  // ---------- Bandeau du moment : ateliers couronne de Noël ----------
  // Dates reprises du calendrier des ateliers ; le bandeau disparaît après la dernière date ou quand on le ferme
  const ANN = D.annonce || {};
  const STRIP = { id: ANN.id, dates: ((D.ateliers || {}).dates || []).filter(s => ANN.atelier && s.title === ANN.atelier).map(s => s.date).sort(), href: ANN.lien };
  const nextStrip = STRIP.dates.find(d => new Date(d) > new Date());
  if (nextStrip && db.get('hb_strip_closed', '') !== STRIP.id) {
    const d = new Date(nextStrip);
    const when = `${d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}, ${d.getHours()} h`;
    const whenShort = `${d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}, ${d.getHours()} h`;
    document.getElementById('nav').insertAdjacentHTML('beforebegin', `<div class="promo-strip" id="promo-strip">
  <p><b>${esc(ANN.texte)}</b> · <span class="strip-long">prochaine date ${when}</span><span class="strip-short">${whenShort}</span> <a href="${STRIP.href}">Réserver<span class="strip-long"> ma place</span></a></p>
  <button type="button" class="strip-x" aria-label="Masquer ce bandeau"><svg><use href="#close"/></svg></button>
</div>`);
    const strip = document.getElementById('promo-strip');
    const fit = () => document.documentElement.style.setProperty('--strip', strip.isConnected ? strip.offsetHeight + 'px' : '0px');
    fit();
    window.addEventListener('resize', fit, { passive: true });
    strip.querySelector('.strip-x').addEventListener('click', () => { db.set('hb_strip_closed', STRIP.id); strip.remove(); fit(); });
  }

  // ---------- Pied de page ----------
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';
  (main || document.body).insertAdjacentHTML('afterend', `
<footer class="site-foot">
  <div class="wrap">
    <div class="foot-top">
      <div>
        <a href="index.html" class="logo">${logo(120)}<span class="logo-text">Atelier Hortus Blanc<small>fleuriste créateur</small></span></a>
        <p>Créateur fleuriste à Tours depuis 2021. Fleurs séchées, stabilisées, plantes et fleurs fraîches sur commande.</p>
        ${igLink}
      </div>
      <div>
        <p class="foot-title">L'atelier</p>
        <ul>
          <li><a href="index.html#atelier">Notre histoire</a></li>
          <li><a href="index.html#inedits">Créations inédites</a></li>
          <li><a href="index.html#galerie">Galerie Instagram</a></li>
          <li><a href="carnet.html">Le carnet : fleur du mois, quiz, herbier</a></li>
          <li><a href="journal.html">Le journal de l'atelier</a></li>
          <li><a href="avis.html">Avis clients</a></li>
          <li><a href="index.html#presence">Sur le web</a></li>
        </ul>
      </div>
      <div>
        <p class="foot-title">Services</p>
        <ul>
          <li><a href="ateliers.html">Ateliers floraux</a></li>
          <li><a href="ateliers.html#prives">Ateliers privés &amp; team building</a></li>
          <li><a href="boutique.html">Boutique</a></li>
          <li><a href="souvenirs.html">Bijoux souvenirs</a></li>
          <li><a href="pros.html#abonnement">Abonnement entreprises</a></li>
          <li><a href="pros.html#partenaires">Partenaires mariage</a></li>
        </ul>
      </div>
      <div>
        <p class="foot-title">Contact</p>
        <ul>
          <li><a href="tel:+33762761773">${TEL}</a></li>
          <li><a href="mailto:${MAIL}">${MAIL}</a></li>
          <li><a href="${MAPS}" target="_blank" rel="noopener">${esc(CONTACT.adresse)}</a></li>
          <li>Sur rendez-vous</li>
        </ul>
      </div>
    </div>
    <div class="foot-word" aria-hidden="true">Hortus Blanc</div>
    <div class="foot-bottom">
      <span>© ${new Date().getFullYear()} Atelier Hortus Blanc · Fleuriste créateur à Tours</span>
      <span>Site de démonstration, prix et dates indicatifs · <a href="mentions-legales.html">Mentions légales et confidentialité</a> · <a href="${IG}" target="_blank" rel="noopener">Instagram</a></span>
    </div>
  </div>
</footer>`);

  // ---------- Fenêtres : espace client, panier, visionneuse, notification ----------
  document.body.insertAdjacentHTML('beforeend', `
<dialog class="modal" id="account" aria-labelledby="acc-title">
  <div class="modal-inner">
    <div class="modal-head">
      ${logo(600, '')}
      <div><p class="kicker">Espace client</p><h2 id="acc-title">Le cercle Hortus Blanc</h2></div>
      <button class="x-btn" data-close aria-label="Fermer"><svg><use href="#close"/></svg></button>
    </div>
    <div class="acc-tabs" id="acc-tabs" role="tablist">
      <button type="button" role="tab" data-tab="signup" aria-selected="true">Créer un compte</button>
      <button type="button" role="tab" data-tab="login" aria-selected="false">Se connecter</button>
    </div>

    <form class="acc-panel" id="signup-form" novalidate>
      <div class="field-row">
        <div class="field"><label for="acc-first">Prénom</label><input id="acc-first" autocomplete="given-name"><small class="err" id="acc-first-err"></small></div>
        <div class="field"><label for="acc-last">Nom</label><input id="acc-last" autocomplete="family-name"><small class="err" id="acc-last-err"></small></div>
      </div>
      <div class="field-row">
        <div class="field"><label for="acc-email">E-mail</label><input id="acc-email" type="email" autocomplete="email"><small class="err" id="acc-email-err"></small></div>
        <div class="field"><label for="acc-tel">Téléphone (facultatif)</label><input id="acc-tel" type="tel" autocomplete="tel"><small class="err" id="acc-tel-err"></small></div>
      </div>
      <div class="field"><label for="acc-ref">Code de parrainage (facultatif)</label><input id="acc-ref" autocomplete="off" placeholder="Ex. HB-CAMILLE"><small class="err" id="acc-ref-err"></small></div>
      <div class="field">
        <label for="acc-pass">Mot de passe</label>
        <div class="pw-wrap"><input id="acc-pass" type="password" autocomplete="new-password"><button type="button" class="pw-toggle" data-for="acc-pass">Afficher</button></div>
        <div class="meter" id="meter" data-score="0"><i></i><i></i><i></i><i></i></div>
        <span class="meter-label" id="meter-label">8 caractères minimum</span>
        <small class="err" id="acc-pass-err"></small>
      </div>
      <div class="field">
        <label for="acc-pass2">Confirmer le mot de passe</label>
        <div class="pw-wrap"><input id="acc-pass2" type="password" autocomplete="new-password"><button type="button" class="pw-toggle" data-for="acc-pass2">Afficher</button></div>
        <small class="err" id="acc-pass2-err"></small>
      </div>
      <div class="field">
        <span class="label">Ce qui vous intéresse</span>
        <div class="chips">
          <label><input type="checkbox" name="interest" value="Ateliers floraux"><span>Ateliers floraux</span></label>
          <label><input type="checkbox" name="interest" value="Mariage"><span>Mariage</span></label>
          <label><input type="checkbox" name="interest" value="Bijoux souvenirs"><span>Bijoux souvenirs</span></label>
          <label><input type="checkbox" name="interest" value="Décoration & tableaux"><span>Décoration &amp; tableaux</span></label>
        </div>
      </div>
      <label class="check"><input type="checkbox" id="acc-news" checked> Recevoir les dates d'ateliers et les nouveautés par e-mail</label>
      <label class="check"><input type="checkbox" id="acc-cgu"> J'accepte que mes informations servent à gérer mon compte client</label>
      <small class="err" id="acc-cgu-err"></small>
      <button type="submit" class="btn btn-primary acc-submit">Créer mon compte <svg class="go"><use href="#arrow"/></svg></button>
      <p class="acc-switch">Déjà membre ? <button type="button" class="link-btn" data-tab-switch="login">Se connecter</button></p>
    </form>

    <form class="acc-panel" id="login-form" novalidate hidden>
      <p class="form-alert" id="login-alert" hidden></p>
      <div class="field"><label for="login-email">E-mail</label><input id="login-email" type="email" autocomplete="email"><small class="err" id="login-email-err"></small></div>
      <div class="field">
        <label for="login-pass">Mot de passe</label>
        <div class="pw-wrap"><input id="login-pass" type="password" autocomplete="current-password"><button type="button" class="pw-toggle" data-for="login-pass">Afficher</button></div>
        <small class="err" id="login-pass-err"></small>
      </div>
      <button type="submit" class="btn btn-primary acc-submit">Se connecter <svg class="go"><use href="#arrow"/></svg></button>
      <p class="acc-switch">Pas encore de compte ? <button type="button" class="link-btn" data-tab-switch="signup">Créer un compte</button></p>
    </form>

    <div class="acc-panel" id="dashboard" hidden>
      <p class="hello">Bonjour <em id="dash-name"></em></p>
      <p class="muted" id="dash-sub"></p>
      <div class="fid-card" id="fid-card"></div>
      <div class="dash-box">
        <h4>Les messages du cercle</h4>
        <p id="fid-mail"></p>
        <ul class="dash-list camp-list" id="fid-camps"></ul>
      </div>
      <div class="dash-box">
        <h4>Historique de ma carte</h4>
        <div id="fid-history"></div>
        <button type="button" class="link-btn" data-fid-demo>Démo : simuler un achat de 80 €</button>
      </div>
      <div class="loyalty">
        <div class="loyalty-top"><b>Mes avantages</b><span>Le cercle Hortus Blanc</span></div>
        <div class="perk-tiles">
          <div class="perk-tile" id="dash-welcome"></div>
          <div class="perk-tile"><small>Mon code parrain</small><b id="dash-code"></b><span id="dash-ref"></span>
            <button type="button" class="link-btn" id="copy-code">Copier le code</button></div>
        </div>
        <small>Un proche utilise votre code pour sa première commande ou son atelier : il a −10 %, vous recevez un petit bouquet séché offert.</small>
      </div>
      <div class="dash-box">
        <h4>Mes dates qui comptent</h4>
        <p>Mariage, naissance, anniversaire, souvenir d'un proche : l'atelier vous fait signe chaque année, une semaine avant, avec −15 % sur un bouquet.</p>
        <ul class="dash-list" id="dash-dates"></ul>
        <form class="date-form" id="date-form" novalidate>
          <input id="dd-label" placeholder="Ex. Anniversaire de mariage" aria-label="Nom de la date">
          <input id="dd-date" type="date" aria-label="Date">
          <button type="submit" class="btn btn-primary btn-small">Ajouter</button>
        </form>
      </div>
      <div class="dash-box"><h4>Mes ateliers</h4><div id="dash-bookings"></div></div>
      <div class="dash-box"><h4>Mes commandes</h4><div id="dash-orders"></div></div>
      <div class="dash-box"><h4>Mes demandes</h4><div id="dash-requests"></div></div>
      <div class="dash-box"><h4>Mes coups de cœur</h4><div id="dash-favs"></div></div>
      <div class="dash-box"><h4>Mes rappels</h4><div id="dash-reminders"></div></div>
      <div class="dash-box"><h4>Mes envies</h4><p id="dash-interests"></p><p id="dash-news" style="margin-top:6px"></p></div>
      <div class="dash-actions">
        <a href="index.html#contact" class="btn btn-primary btn-small" data-close>Faire une demande</a>
        <button type="button" class="btn btn-ghost btn-small" id="logout">Se déconnecter</button>
      </div>
      <div class="danger">
        <button type="button" class="link-btn" id="delete-start">Supprimer mon compte</button>
        <div id="delete-confirm" hidden>
          <span>Supprimer définitivement ce compte ?</span>
          <button type="button" class="btn btn-primary btn-small" id="delete-yes">Oui, supprimer</button>
          <button type="button" class="btn btn-ghost btn-small" id="delete-no">Annuler</button>
        </div>
      </div>
    </div>
    <p class="acc-note">Version de démonstration : le compte est enregistré uniquement dans ce navigateur, et le mot de passe n'y est jamais stocké en clair. Pour un vrai site, il faudra le relier à un service sécurisé.</p>
  </div>
</dialog>

<dialog class="drawer" id="cart" aria-labelledby="cart-title">
  <div class="drawer-head">
    <div><p class="eyebrow">Boutique</p><h2 id="cart-title">Mon panier</h2></div>
    <button class="x-btn" data-close aria-label="Fermer le panier"><svg><use href="#close"/></svg></button>
  </div>
  <div class="drawer-body" id="cart-body"></div>
  <div class="drawer-foot" id="cart-foot"></div>
</dialog>

<dialog class="lightbox" id="lightbox" aria-label="Photo en grand">
  <button class="lb-close" data-close aria-label="Fermer la photo"><svg><use href="#close"/></svg></button>
  <img id="lb-img" alt="">
  <p id="lb-cap"></p>
  <div class="lb-actions" id="lb-actions"></div>
</dialog>

<div class="toast" id="toast" role="status" aria-live="polite"></div>`);

  fillLogos(document);

  // Défilement bloqué tant qu'une fenêtre ou le menu est ouvert
  const syncScroll = () => {
    document.body.style.overflow = document.querySelector('dialog[open]') || document.body.classList.contains('menu-open') ? 'hidden' : '';
  };
  const openDialog = dlg => { document.querySelectorAll('dialog[open]').forEach(d => d !== dlg && d.close()); if (!dlg.open) dlg.showModal(); syncScroll(); };
  document.querySelectorAll('dialog').forEach(dlg => {
    dlg.addEventListener('close', syncScroll);
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
  });

  // Notification
  let toastTimer;
  const toast = msg => {
    const t = $('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  };

  // ---------- Navigation ----------
  const nav = $('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const burger = $('burger');
  const toggleMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    syncScroll();
  };
  burger.addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  // Échap referme le menu du téléphone et rend la main au bouton
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { toggleMenu(false); burger.focus(); }
  });

  // Apparition des éléments juste avant leur entrée à l'écran (contenu visible par défaut)
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px 8% 0px' });
  const observe = root => root.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
  observe(document);

  // ---------- Visionneuse photo ----------
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-lightbox]');
    if (!el) return;
    e.preventDefault();
    const img = $('lb-img');
    img.src = el.dataset.lightbox;
    img.alt = el.dataset.alt || '';
    $('lb-cap').innerHTML = `${esc(el.dataset.title || '')}${el.dataset.sub ? `<small>${esc(el.dataset.sub)}</small>` : ''}`;
    // La photo d'une création en vente : on peut l'acheter sans quitter la visionneuse
    const p = byId[el.dataset.product];
    $('lb-actions').innerHTML = p ? `<button type="button" class="btn btn-light btn-small" data-add="${p.id}" data-lb-add>Ajouter au panier · ${euro(p.price)}</button>${page !== 'boutique' ? '<a class="btn btn-ghost btn-small" href="boutique.html">Voir toute la boutique</a>' : ''}` : '';
    openDialog($('lightbox'));
  });
  // Ajouté depuis la visionneuse : on ferme la photo et on montre le panier
  $('lightbox').addEventListener('click', e => {
    if (!e.target.closest('[data-lb-add]')) return;
    $('lightbox').close();
    setTimeout(openCart, 0);
  });

  // ---------- Formulaires : erreurs et e-mails pré-rédigés ----------
  const setErr = (input, msg) => {
    input.classList.toggle('invalid', !!msg);
    let el = $(input.id + '-err');
    if (!el && msg) {
      el = document.createElement('small');
      el.className = 'err'; el.id = input.id + '-err';
      (input.closest('.field') || input.parentNode).appendChild(el);
    }
    if (el) el.textContent = msg || '';
    return !msg;
  };
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const validTel = v => !v.trim() || /^[+\d][\d\s.-]{8,}$/.test(v.trim());
  const mailto = (subject, lines) =>
    `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.filter(l => l !== '' && l != null).join('\n'))}`;

  // ---------- Envoi des demandes ----------
  // Si un service de formulaires est réglé dans assets/donnees.js (envoi.adresse), la demande part
  // directement dans la boîte de l'atelier. Sinon, la messagerie du visiteur s'ouvre avec le message rédigé.
  const ENVOI = D.envoi || {};
  const direct = !!ENVOI.adresse;
  async function envoyer(subject, lines, from = {}) {
    if (!direct) { window.location.href = mailto(subject, lines); return 'mailto'; }
    const message = lines.filter(l => l !== '' && l != null).join('\n');
    const email = from.email || (message.match(/[^\s@·]+@[^\s@·]+\.[a-z]{2,}/i) || [''])[0];
    try {
      const res = await fetch(ENVOI.adresse, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...(ENVOI.cle ? { access_key: ENVOI.cle } : {}), subject, _subject: subject, from_name: 'Site Atelier Hortus Blanc', email, replyto: email, message })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      toast('Message bien envoyé à l\'atelier');
      return 'direct';
    } catch (err) {
      toast('Envoi impossible pour le moment : votre messagerie s\'ouvre à la place.');
      window.location.href = mailto(subject, lines);
      return 'mailto';
    }
  }
  // Textes des formulaires : en envoi direct, on ne parle plus de messagerie
  if (direct) document.querySelectorAll('[data-direct]').forEach(el => { el.textContent = el.dataset.direct; });

  // ---------- Espace client ----------
  // Les comptes créés avant le nouveau programme reçoivent les champs manquants
  const accounts = () => {
    const all = db.get('hb_accounts', {});
    Object.values(all).forEach(a => {
      a.referrals ??= []; a.dates ??= []; a.welcomeUsed ??= false;
      a.code ??= makeCode(a.first || 'membre', all);
      a.card ??= newCard(a.email); a.rsvp ??= {};
    });
    return all;
  };
  const current = () => { const e = db.get('hb_session', null); return e ? accounts()[e] || null : null; };
  const saveAccount = acc => { const all = accounts(); all[acc.email] = acc; db.set('hb_accounts', all); };

  // ---------- Le cercle Hortus Blanc : avantages pensés pour des clients ponctuels ----------
  // Un avantage dès la première fois, une carte de fidélité qui cumule, le parrainage
  // et les rappels des dates qui comptent.
  const WELCOME = 'BIENVENUE10';
  const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8) || 'MEMBRE';
  function makeCode(first, all) {
    const used = new Set(Object.values(all).map(a => a.code).filter(Boolean));
    const base = 'HB-' + slug(first);
    let code = base, n = 2;
    while (used.has(code)) code = base + n++;
    return code;
  }
  const ownerOf = (code, all = accounts()) => Object.values(all).find(a => a.code === code.trim().toUpperCase()) || null;
  const usedReferral = email => [...db.get('hb_orders', []), ...db.get('hb_bookings', [])].some(x => x.email === email && x.codeKind === 'referral');

  // Vérifie un code avantage pour un achat ou une réservation (−10 %)
  function checkCode(raw, email) {
    const code = (raw || '').trim().toUpperCase();
    const mail = (email || '').trim().toLowerCase();
    if (!code) return { ok: false, msg: '' };
    // Un seul avantage de bienvenue : les 10 % du premier achat crédités sur la carte du cercle.
    // L'ancien code BIENVENUE10 ne se cumule donc plus avec la carte.
    if (code === WELCOME) return { ok: false, msg: 'Ce code est remplacé par la carte du cercle : votre premier achat vous rapporte 10 % sur votre carte.' };
    if (code === CERCLE_CODE) {
      if (!activeCampaigns().some(c => c.id === 'c-tableaux')) return { ok: false, msg: 'Cette offre du cercle est terminée.' };
      if (!current()) return { ok: false, msg: 'Offre réservée aux membres du cercle : connectez-vous.' };
      return { ok: true, code, kind: 'cercle', rate: .15, label: 'Offre du cercle −15 % sur les tableaux', scope: 'tableaux' };
    }
    if (code === 'MADATE15') {
      const acc = current();
      // Une utilisation par date et par an
      const key = dt => `${dt.id}-${nextAnniv(dt.date).date.getFullYear()}`;
      const soon = acc ? acc.dates.filter(dt => nextAnniv(dt.date).days <= 7) : [];
      const free = soon.find(dt => !(acc.datesUsed || []).includes(key(dt)));
      if (free) return { ok: true, code, kind: 'date', rate: .15, label: 'Votre date qui compte −15 %', dateKey: key(free) };
      return { ok: false, msg: soon.length ? 'Ce code a déjà été utilisé pour cette date cette année.' : 'Ce code est valable la semaine d\'une de vos « dates qui comptent ».' };
    }
    const owner = ownerOf(code);
    if (!owner) return { ok: false, msg: 'Code inconnu.' };
    if (owner.email === mail) return { ok: false, msg: 'Votre propre code est à partager avec vos proches.' };
    if (mail && usedReferral(mail)) return { ok: false, msg: 'Un code de parrainage a déjà été utilisé avec cet e-mail.' };
    return { ok: true, code, kind: 'referral', rate: .1, label: `Parrainage de ${owner.first} −10 %`, owner: owner.email };
  }
  function useCode(result, email) {
    if (!result || !result.ok) return;
    const all = accounts();
    if (result.kind === 'welcome') { const acc = current(); if (acc) all[acc.email].welcomeUsed = true; }
    if (result.kind === 'date') { const acc = current(); if (acc) all[acc.email].datesUsed = [...(all[acc.email].datesUsed || []), result.dateKey]; }
    if (result.kind === 'referral' && all[result.owner] && !all[result.owner].referrals.includes(email)) all[result.owner].referrals.push(email);
    db.set('hb_accounts', all);
  }
  // Prochain anniversaire d'une date (aujourd'hui compris) et nombre de jours avant
  const nextAnniv = iso => {
    const d = new Date(iso + 'T12:00:00'), today = new Date(); today.setHours(0, 0, 0, 0);
    const next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
    if (next < today) next.setFullYear(next.getFullYear() + 1);
    return { date: next, days: Math.round((next - today) / 864e5) };
  };
  // Le rappel tombe 7 jours avant la prochaine date ; dans la semaine, le code MADATE15 est actif
  const reminderText = iso => {
    const { date, days } = nextAnniv(iso);
    if (days <= 7) return days === 0 ? "c'est aujourd'hui · −15 % avec MADATE15" : `dans ${days} jour${days > 1 ? 's' : ''} · −15 % avec MADATE15`;
    const r = new Date(date); r.setDate(r.getDate() - 7);
    return `rappel le ${fmtDate(r)}`;
  };
  // ---------- Carte de fidélité du cercle ----------
  // Premier achat : 10 % de son montant versés dans la cagnotte de la carte.
  // Achats suivants : 1 point par euro payé ; chaque palier de 100 points ajoute 5 € à la cagnotte.
  // Les points cumulés font monter de niveau : avant-premières, puis soirées privées de l'atelier.
  const CARD = { firstRate: .1, step: 100, stepValue: 5 };
  const LEVELS = [
    { min: 0, name: 'Bouton', perk: 'La cagnotte, les points et les offres réservées aux membres' },
    { min: 150, name: 'Éclose', perk: 'Les nouvelles pièces en avant-première' },
    { min: 400, name: 'Bouquet', perk: 'Les soirées privées de l\'atelier' }
  ];
  function newCard(email) {
    let h = 7; for (const c of email || '') h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const part = n => String(n % 10000).padStart(4, '0');
    return { no: `HB ${part(h)} ${part(h >>> 13)}`, balance: 0, points: 0, lifetime: 0, firstDone: false, history: [] };
  }
  const levelOf = card => LEVELS.reduce((k, l, i) => card.lifetime >= l.min ? i : k, 0);
  // Crédite un achat payé (hors livraison) sur la carte du membre et renvoie ce qu'il rapporte
  function creditCard(email, amount, label) {
    const all = accounts(), acc = all[(email || '').trim().toLowerCase()];
    if (!acc || !(amount > 0)) return null;
    const card = acc.card, at = new Date().toISOString(), before = levelOf(card);
    let gain;
    if (!card.firstDone) {
      const eur = cents(amount * CARD.firstRate);
      card.firstDone = true;
      card.balance = cents(card.balance + eur);
      card.history.unshift({ at, label, text: `10 % du premier achat : +${euro(eur)}` });
      gain = { eur, pts: 0 };
    } else {
      const pts = Math.floor(amount);
      let steps = 0;
      card.points += pts; card.lifetime += pts;
      while (card.points >= CARD.step) { card.points -= CARD.step; steps++; }
      card.balance = cents(card.balance + steps * CARD.stepValue);
      card.history.unshift({ at, label, text: `+${pts} points${steps ? ` · +${euro(steps * CARD.stepValue)} dans la cagnotte` : ''}` });
      gain = { eur: steps * CARD.stepValue, pts };
    }
    const after = levelOf(card);
    gain.levelUp = after > before ? LEVELS[after].name : null;
    card.history = card.history.slice(0, 20);
    db.set('hb_accounts', all);
    return gain;
  }
  function spendCard(email, amount, label) {
    const all = accounts(), acc = all[email];
    if (!acc || !(amount > 0)) return;
    acc.card.balance = cents(Math.max(0, acc.card.balance - amount));
    acc.card.history.unshift({ at: new Date().toISOString(), label, text: `Cagnotte utilisée : −${euro(amount)}` });
    db.set('hb_accounts', all);
  }
  // Ce que rapporterait un montant, pour l'annoncer avant la commande
  const cardPreview = (acc, amount) => !acc || !acc.card.firstDone ? `${euro(cents(amount * CARD.firstRate))} crédités sur votre carte (10 % du premier achat)` : `+${Math.floor(amount)} points sur votre carte`;
  const gainText = g => !g ? '' : (g.pts
    ? `+${g.pts} points sur votre carte du cercle${g.eur ? `, et ${euro(g.eur)} de plus dans votre cagnotte` : ''}`
    : `${euro(g.eur)} crédités sur votre carte du cercle : 10 % de votre premier achat`) + (g.levelUp ? `. Nouveau niveau : ${g.levelUp}` : '');

  // ---------- Relances du cercle : offres, nouveautés, avant-premières, invitations ----------
  // Dates de démonstration. Chaque message s'affiche aux membres pendant sa période, selon leur niveau,
  // dans leur espace et dans l'encart « Pour vous » ; il part aussi par e-mail s'ils l'ont accepté.
  const CERCLE_CODE = 'CERCLE15';
  const CAMPAIGNS = D.messagesCercle || [];
  const isoToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const activeCampaigns = () => CAMPAIGNS.filter(c => c.from <= isoToday() && isoToday() <= c.to);

  const randomSalt = () => [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
  async function hashPassword(pw, salt) {
    const data = new TextEncoder().encode(salt + ':' + pw);
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', data);
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 0; for (const c of salt + pw) h = (h * 31 + c.charCodeAt(0)) | 0;
    return 'x' + h;
  }

  const accDlg = $('account');
  const signupForm = $('signup-form'), loginForm = $('login-form'), dashboard = $('dashboard');
  const panels = { signup: signupForm, login: loginForm, dashboard };
  const tabButtons = [...accDlg.querySelectorAll('[data-tab]')];
  function showPanel(name) {
    Object.entries(panels).forEach(([k, el]) => { el.hidden = k !== name; });
    $('acc-tabs').hidden = name === 'dashboard';
    tabButtons.forEach(b => b.setAttribute('aria-selected', b.dataset.tab === name));
    const first = panels[name].querySelector('input');
    if (first && accDlg.open) first.focus();
  }
  function openAccount(tab) {
    toggleMenu(false);
    openDialog(accDlg);
    const acc = current();
    if (acc) { renderDashboard(acc); showPanel('dashboard'); }
    else showPanel(tab === 'login' ? 'login' : 'signup');
  }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-open]');
    if (!el) return;
    e.preventDefault(); openAccount(el.dataset.open);
  });
  tabButtons.forEach(b => b.addEventListener('click', () => showPanel(b.dataset.tab)));
  accDlg.querySelectorAll('[data-tab-switch]').forEach(b => b.addEventListener('click', () => showPanel(b.dataset.tabSwitch)));
  accDlg.querySelectorAll('.pw-toggle').forEach(b => b.addEventListener('click', () => {
    const input = $(b.dataset.for);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    b.textContent = show ? 'Masquer' : 'Afficher';
  }));

  const scorePassword = pw => pw.length < 8 ? (pw ? 1 : 0) : 1 + [/[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length;
  $('acc-pass').addEventListener('input', e => {
    const s = scorePassword(e.target.value);
    $('meter').dataset.score = s;
    $('meter-label').textContent = ['8 caractères minimum', 'Trop court', 'Correct', 'Bon', 'Excellent'][s];
  });

  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    const first = $('acc-first'), last = $('acc-last'), email = $('acc-email'), tel = $('acc-tel');
    const pass = $('acc-pass'), pass2 = $('acc-pass2'), cgu = $('acc-cgu'), ref = $('acc-ref');
    const all = accounts();
    const mail = email.value.trim().toLowerCase();
    const sponsor = ref.value.trim() ? ownerOf(ref.value, all) : null;
    const checks = [
      setErr(first, first.value.trim() ? '' : 'Indiquez votre prénom.'),
      setErr(last, last.value.trim() ? '' : 'Indiquez votre nom.'),
      setErr(email, !validEmail(mail) ? 'Saisissez une adresse e-mail valide, par exemple nom@mail.fr.'
        : all[mail] ? 'Un compte existe déjà avec cet e-mail : connectez-vous.' : ''),
      setErr(tel, validTel(tel.value) ? '' : 'Numéro invalide, par exemple 06 12 34 56 78.'),
      setErr(ref, ref.value.trim() && !sponsor ? 'Code inconnu : vérifiez-le auprès de la personne qui vous parraine.' : ''),
      setErr(pass, pass.value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères.' : ''),
      setErr(pass2, pass2.value !== pass.value || !pass2.value ? 'Les deux mots de passe ne correspondent pas.' : ''),
      setErr(cgu, cgu.checked ? '' : 'Cochez cette case pour créer votre compte.')
    ];
    if (checks.includes(false)) { signupForm.querySelector('.invalid')?.focus(); return; }
    const salt = randomSalt();
    const acc = {
      first: first.value.trim(), last: last.value.trim(), email: mail, tel: tel.value.trim(),
      interests: [...signupForm.querySelectorAll('input[name="interest"]:checked')].map(i => i.value),
      news: $('acc-news').checked, since: new Date().toISOString(),
      code: makeCode(first.value, all), referrals: [], dates: [], welcomeUsed: false,
      referredBy: sponsor ? sponsor.email : null,
      salt, hash: await hashPassword(pass.value, salt)
    };
    if (sponsor && !sponsor.referrals.includes(mail)) sponsor.referrals.push(mail);
    all[mail] = acc;
    db.set('hb_accounts', all);
    db.set('hb_session', mail);
    signupForm.reset();
    $('meter').dataset.score = 0; $('meter-label').textContent = '8 caractères minimum';
    renderDashboard(acc, true);
    showPanel('dashboard');
    accountChanged();
  });

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('login-email'), pass = $('login-pass'), alert = $('login-alert');
    const mail = email.value.trim().toLowerCase();
    const ok = [
      setErr(email, validEmail(mail) ? '' : 'Saisissez votre adresse e-mail.'),
      setErr(pass, pass.value ? '' : 'Saisissez votre mot de passe.')
    ];
    if (ok.includes(false)) return;
    const acc = accounts()[mail];
    if (!acc || await hashPassword(pass.value, acc.salt) !== acc.hash) {
      alert.textContent = 'E-mail ou mot de passe incorrect. Vérifiez votre saisie ou créez un compte.';
      alert.hidden = false;
      return;
    }
    alert.hidden = true;
    loginForm.reset();
    db.set('hb_session', mail);
    renderDashboard(acc);
    showPanel('dashboard');
    accountChanged();
  });

  // Réservations, commandes et demandes, rattachées à l'e-mail du client
  const mine = (key, acc) => db.get(key, []).filter(x => x.email === acc.email);
  const emptyLine = (text, href, link) => `<p>${text}</p>${href ? `<a href="${href}">${link}</a>` : ''}`;

  function renderDashboard(acc, isNew) {
    $('dash-name').textContent = acc.first;
    $('dash-sub').textContent = isNew
      ? 'Bienvenue dans le cercle Hortus Blanc. Votre carte et votre code parrain sont prêts.'
      : `Membre du cercle depuis le ${fmtDate(acc.since)}.`;
    const bookings = mine('hb_bookings', acc), orders = mine('hb_orders', acc), reqs = mine('hb_requests', acc);
    $('dash-welcome').innerHTML = acc.card.firstDone
      ? `<small>Bienvenue</small><b>Reçu ✓</b><span>Les 10 % de votre premier achat sont sur votre carte</span>`
      : `<small>Bienvenue</small><b>10 %</b><span>de votre premier achat ou atelier crédités sur votre carte</span>`;
    const n = acc.referrals.length;
    $('dash-code').textContent = acc.code;
    $('dash-ref').textContent = n ? `${n} proche${n > 1 ? 's' : ''} parrainé${n > 1 ? 's' : ''} · ${n} bouquet${n > 1 ? 's' : ''} offert${n > 1 ? 's' : ''}` : 'Aucun proche parrainé pour le moment';
    $('dash-dates').innerHTML = acc.dates.map(d => `<li><div><b>${esc(d.label)}</b><small>${fmtDate(d.date + 'T12:00:00', { day: 'numeric', month: 'long' })} · ${reminderText(d.date)}</small></div><button type="button" class="link-btn" data-date-del="${d.id}">Retirer</button></li>`).join('');
    $('dash-dates').hidden = !acc.dates.length;
    $('dash-bookings').innerHTML = bookings.length
      ? `<ul class="dash-list">${bookings.map(b => {
          // Annulation en ligne jusqu'à 48 h avant ; ensuite, on appelle l'atelier
          const hoursLeft = b.start ? (new Date(b.start) - Date.now()) / 36e5 : Infinity;
          const action = hoursLeft < 0 ? '<small>Atelier passé</small>'
            : hoursLeft < 48 ? `<small>Moins de 48 h : appelez le ${TEL}</small>`
            : `<button type="button" class="link-btn" data-cancel="${b.id}">Annuler</button>`;
          return `<li><div><b>${esc(b.title)}</b><small>${esc(b.when)} · ${b.seats} place${b.seats > 1 ? 's' : ''}</small></div>${action}</li>`;
        }).join('')}</ul>`
      : emptyLine('Aucun atelier réservé pour le moment.', 'ateliers.html', 'Voir le calendrier des ateliers');
    $('dash-orders').innerHTML = orders.length
      ? `<ul class="dash-list">${orders.map(o => `<li><div><b>Commande ${esc(o.ref)}</b><small>${fmtDate(o.createdAt)} · ${o.items.reduce((n, i) => n + i.qty, 0)} article(s) · ${o.mode === 'livraison' ? 'livraison' : 'retrait à l\'atelier'}</small></div><b>${euro(o.total)}</b></li>`).join('')}</ul>`
      : emptyLine('Aucune commande pour le moment.', 'boutique.html', 'Découvrir la boutique');
    $('dash-requests').innerHTML = reqs.length
      ? `<ul class="dash-list">${reqs.map(r => `<li><div><b>${esc(r.kind)}</b><small>${fmtDate(r.createdAt)} · ${esc(r.summary)}</small></div></li>`).join('')}</ul>`
      : emptyLine('Mariage, bijou souvenir, devis entreprise : vos demandes apparaîtront ici.');
    const favs = favorites().map(id => byId[id]).filter(Boolean);
    $('dash-favs').innerHTML = favs.length
      ? `<ul class="dash-list">${favs.map(p => `<li><div><b>${esc(p.name)}</b><small>${esc(p.kind)} · ${euro(p.price)}</small></div><button type="button" class="link-btn" data-add="${p.id}">Ajouter au panier</button></li>`).join('')}</ul>`
      : emptyLine('Touchez le cœur d\'une création en boutique pour la garder ici.', 'boutique.html', 'Voir la boutique');
    const rem = EVENTS.filter(ev => reminders().includes(ev.id));
    $('dash-reminders').innerHTML = rem.length
      ? `<ul class="dash-list">${rem.map(ev => `<li><div><b>${esc(ev.name)}</b><small>${fmtDate(ev.date)} · ${inDays(daysUntil(ev.date))}</small></div></li>`).join('')}</ul>`
      : emptyLine('Noël, Saint-Valentin, fête des mères… Activez vos rappels dans le carnet.', 'carnet.html#fetes', 'Choisir mes rappels');
    $('dash-interests').textContent = acc.interests.length ? acc.interests.join(' · ') : 'Aucune préférence choisie.';
    $('dash-news').textContent = acc.news ? 'Vous recevrez les dates d\'ateliers par e-mail.' : 'Pas d\'e-mails de nouveautés.';
    $('delete-confirm').hidden = true;
    renderCard(acc);
  }

  function renderCard(acc) {
    const c = acc.card, lv = levelOf(c), next = LEVELS[lv + 1];
    $('fid-card').innerHTML = `
      <svg class="acanthe-bg" aria-hidden="true"><use href="#acanthe"/></svg>
      <div class="fid-top"><div><small>Carte du cercle</small><b>Hortus Blanc</b></div><span class="fid-level">${LEVELS[lv].name}</span></div>
      <div class="fid-balance"><b>${euro(c.balance)}</b><span>dans votre cagnotte, à utiliser au panier</span></div>
      ${c.firstDone
        ? `<div class="fid-bar" role="img" aria-label="${c.points} points sur ${CARD.step}"><i style="width:${c.points / CARD.step * 100}%"></i></div>
           <p class="fid-next">${c.points} / ${CARD.step} points · encore ${CARD.step - c.points} pour ${euro(CARD.stepValue)} de plus</p>`
        : `<p class="fid-next">Votre premier achat vous rapporte 10 % de son montant, crédités ici. Ensuite, 1 point par euro.</p>`}
      <p class="fid-next">${next ? `Niveau ${next.name} à ${next.min} points cumulés (vous en avez ${c.lifetime}) : ${next.perk.toLowerCase()}.` : `Niveau le plus haut : ${LEVELS[lv].perk.toLowerCase()}.`}</p>
      <div class="fid-foot"><span>${esc(acc.first)} ${esc(acc.last)}</span><span>${c.no}</span></div>`;
    const camps = activeCampaigns();
    $('fid-camps').innerHTML = camps.length ? camps.map(cp => {
      const locked = lv < cp.level, rs = acc.rsvp[cp.id];
      const action = locked ? ''
        : cp.rsvp ? (rs
          ? `<div class="camp-act"><span class="camp-ok">${rs === 'oui' ? 'Venue notée ✓' : 'Absence notée'}</span><button type="button" class="link-btn" data-rsvp="${cp.id}" data-v="">Modifier</button></div>`
          : `<div class="camp-act"><button type="button" class="btn btn-primary btn-small" data-rsvp="${cp.id}" data-v="oui">Je viens</button><button type="button" class="link-btn" data-rsvp="${cp.id}" data-v="non">Je ne pourrai pas</button></div>`)
        : `<a href="${cp.href}" data-close>${esc(cp.cta)} →</a>`;
      return `<li class="camp${locked ? ' locked' : ''}"><div><span class="camp-type">${esc(cp.type)}</span><b>${esc(cp.title)}</b>
        <small>${locked ? `Réservé au niveau ${LEVELS[cp.level].name} : encore ${LEVELS[cp.level].min - c.lifetime} points.` : esc(cp.text)}</small></div>${action}</li>`;
    }).join('') : '<li><small>Aucun message en ce moment.</small></li>';
    $('fid-mail').innerHTML = acc.news
      ? 'Ces messages vous sont aussi envoyés par e-mail. <button type="button" class="link-btn" data-news-toggle>Ne plus les recevoir par e-mail</button>'
      : 'Vous les retrouvez ici et sur le site. <button type="button" class="link-btn" data-news-toggle>Les recevoir aussi par e-mail</button>';
    $('fid-history').innerHTML = c.history.length
      ? `<ul class="dash-list">${c.history.slice(0, 6).map(h => `<li><div><b>${esc(h.label)}</b><small>${fmtDate(h.at)} · ${esc(h.text)}</small></div></li>`).join('')}</ul>`
      : '<p>Vos achats, vos points et votre cagnotte apparaîtront ici.</p>';
  }
  // Réponses aux invitations, préférences d'e-mail et démonstration
  accDlg.addEventListener('click', e => {
    const acc = current();
    if (!acc) return;
    const all = accounts(), me = all[acc.email];
    const r = e.target.closest('[data-rsvp]');
    if (r) {
      if (r.dataset.v) me.rsvp[r.dataset.rsvp] = r.dataset.v; else delete me.rsvp[r.dataset.rsvp];
      db.set('hb_accounts', all);
      if (r.dataset.v) toast(r.dataset.v === 'oui' ? 'C\'est noté : l\'atelier vous attend jeudi 10 décembre.' : 'C\'est noté, merci de nous avoir répondu.');
    } else if (e.target.closest('[data-news-toggle]')) {
      me.news = !me.news;
      db.set('hb_accounts', all);
      toast(me.news ? 'Vous recevrez aussi les messages du cercle par e-mail.' : 'Vous ne recevrez plus d\'e-mails du cercle.');
    } else if (e.target.closest('[data-fid-demo]')) {
      toast(gainText(creditCard(acc.email, 80, 'Démo : achat de 80 €')));
    } else return;
    renderDashboard(current());
    renderNotices();
  });
  $('date-form').addEventListener('submit', e => {
    e.preventDefault();
    const label = $('dd-label'), date = $('dd-date');
    const ok = [setErr(label, label.value.trim() ? '' : 'Donnez un nom à cette date.'), setErr(date, date.value ? '' : 'Choisissez la date.')];
    if (ok.includes(false)) return;
    const acc = current();
    acc.dates.push({ id: uid(), label: label.value.trim(), date: date.value });
    saveAccount(acc);
    e.target.reset();
    renderDashboard(acc);
    renderNotices();
    toast('Date enregistrée : l\'atelier vous fera signe');
  });
  $('copy-code').addEventListener('click', () => {
    const code = $('dash-code').textContent;
    const fallback = () => { getSelection().selectAllChildren($('dash-code')); toast('Code sélectionné : copiez-le avec Ctrl+C'); };
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(() => toast(`Code ${code} copié`), fallback);
    else fallback();
  });
  dashboard.addEventListener('click', e => {
    const del = e.target.closest('[data-date-del]');
    if (del) {
      const acc = current();
      acc.dates = acc.dates.filter(d => d.id !== del.dataset.dateDel);
      saveAccount(acc); renderDashboard(acc); renderNotices();
      return;
    }
    const btn = e.target.closest('[data-cancel]');
    if (!btn) return;
    const cancelled = db.get('hb_bookings', []).find(b => b.id === btn.dataset.cancel);
    db.set('hb_bookings', db.get('hb_bookings', []).filter(b => b.id !== btn.dataset.cancel));
    if (cancelled) freeSeat(cancelled.sessionId);
    // Le code de bienvenue utilisé pour cette réservation redevient disponible
    if (cancelled && cancelled.codeKind === 'welcome') { const acc = current(); acc.welcomeUsed = false; saveAccount(acc); }
    renderDashboard(current());
    toast('Réservation annulée');
    document.dispatchEvent(new CustomEvent('hb:data'));
  });

  // Pré-remplissage des formulaires pour les membres connectés
  const prefills = [];
  const prefill = map => { prefills.push(map); applyPrefill(); };
  function applyPrefill() {
    const acc = current();
    if (!acc) return;
    const values = { name: `${acc.first} ${acc.last}`, first: acc.first, email: acc.email, tel: acc.tel };
    prefills.forEach(map => Object.entries(map).forEach(([k, id]) => {
      const el = $(id);
      if (el && !el.value && values[k]) el.value = values[k];
    }));
  }
  function accountChanged() {
    const acc = current();
    $('acc-label').textContent = acc ? acc.first : 'Mon compte';
    $('acc-btn').classList.toggle('logged', !!acc);
    applyPrefill();
    document.dispatchEvent(new CustomEvent('hb:account'));
  }
  $('logout').addEventListener('click', () => { db.set('hb_session', null); accountChanged(); showPanel('login'); });
  $('delete-start').addEventListener('click', () => { $('delete-confirm').hidden = false; });
  $('delete-no').addEventListener('click', () => { $('delete-confirm').hidden = true; });
  $('delete-yes').addEventListener('click', () => {
    const all = accounts();
    delete all[db.get('hb_session', null)];
    db.set('hb_accounts', all);
    db.set('hb_session', null);
    accountChanged();
    showPanel('signup');
  });

  // Enregistre une demande (devis, partenariat, bijou…) pour le suivi dans l'espace client
  const saveRequest = (kind, summary, email) => {
    const list = db.get('hb_requests', []);
    list.push({ id: uid(), kind, summary, email: (email || '').trim().toLowerCase(), createdAt: new Date().toISOString() });
    db.set('hb_requests', list);
  };

  // ---------- Boutique : catalogue et panier ----------
  // Prix indicatifs pour la démonstration, à valider avec l'atelier.
  // Les bustes servent de support de présentation : seule la composition florale est vendue.
  const PRODUCTS = D.creations || [];
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  // Les prix écrits dans les pages (mosaïque de l'accueil, prix d'un atelier) suivent assets/donnees.js
  document.querySelectorAll('[data-product]').forEach(el => {
    const p = byId[el.dataset.product];
    if (!p) return;
    const tag = el.querySelector('.price');
    if (tag) tag.textContent = euro(p.price);
    if (el.dataset.sub) el.dataset.sub = el.dataset.sub.replace(/\d[\d\s.,]* €$/, euro(p.price));
  });
  document.querySelectorAll('[data-prix-atelier]').forEach(el => { el.textContent = euro((D.ateliers || {}).prix ?? 45); });
  const media = p => p.img
    ? `<img width="800" height="${p.img === 'couronne-hortensias' ? 600 : 1067}" src="images/${p.img}-800.webp" srcset="images/${p.img}-800.webp 800w, images/${p.img}-large.webp ${p.img === 'mur-vegetal-bambou' ? 1125 : 1400}w" sizes="(max-width: 600px) 100vw, (max-width: 1080px) 50vw, 25vw" alt="${esc(p.alt)}" loading="lazy" decoding="async">`
    : `<div class="tile-art t-${p.tone}">${icon(p.ico)}</div>`;
  const DELIVERY = (D.paiement || {}).livraison ?? 5;

  const cart = {
    items: () => db.get('hb_cart', []).filter(i => byId[i.id]),
    count: () => cart.items().reduce((n, i) => n + i.qty, 0),
    subtotal: () => cart.items().reduce((n, i) => n + i.qty * byId[i.id].price, 0),
    save(items) { db.set('hb_cart', items); updateBadge(true); if ($('cart').open) renderCart(); },
    add(id) {
      const p = byId[id], items = cart.items(), line = items.find(i => i.id === id);
      const max = p.unique ? 1 : 10;
      if (line && line.qty >= max) { toast(p.unique ? 'Pièce unique : elle est déjà dans votre panier.' : 'Quantité maximale atteinte.'); return; }
      line ? line.qty++ : items.push({ id, qty: 1 });
      cart.save(items);
      toast(`${p.name} ajouté au panier`);
    },
    setQty(id, qty) {
      const max = byId[id].unique ? 1 : 10;
      cart.save(cart.items().map(i => i.id === id ? { ...i, qty: Math.min(max, qty) } : i).filter(i => i.qty > 0));
    }
  };
  function updateBadge(bump) {
    const n = cart.count(), badge = $('cart-count');
    badge.textContent = n; badge.hidden = !n;
    $('cart-btn').setAttribute('aria-label', n ? `Ouvrir le panier, ${n} article${n > 1 ? 's' : ''}` : 'Ouvrir le panier');
    if (bump && n) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
  }

  let cartView = 'list', lastOrder = null;
  const orderLines = o => [
    'Bonjour,', '', `Voici ma commande ${o.ref} passée sur le site :`,
    ...o.items.map(i => `- ${i.qty} × ${i.name} (${euro(i.price)})`),
    o.discount ? `Code avantage ${o.code} : −${euro(o.discount)}` : '',
    o.wallet ? `Cagnotte du cercle : −${euro(o.wallet)}` : '',
    `Total : ${euro(o.total)}`, `Mode : ${o.mode === 'livraison' ? 'livraison à Tours' : 'retrait à l\'atelier'}`,
    o.date ? `Date souhaitée : ${fmtDate(o.date)}` : '', o.msg ? `Message : ${o.msg}` : '', '',
    `${o.name} · ${o.email}${o.tel ? ' · ' + o.tel : ''}`
  ];
  // Lien de paiement réglé dans assets/donnees.js ; {montant} reçoit le total (ex. 51.15)
  const payLink = total => { const l = (D.paiement || {}).lien; return l ? l.replace('{montant}', total.toFixed(2)) : ''; };
  function renderCart() {
    const body = $('cart-body'), foot = $('cart-foot'), items = cart.items();
    if (cartView === 'done' && lastOrder) {
      const o = lastOrder;
      body.innerHTML = `<div class="thanks">${logo(600, '')}<h3>Merci <em>${esc(o.name.split(' ')[0])}</em> !</h3>
        <p>Votre commande <b>${esc(o.ref)}</b> est enregistrée. L'atelier vous recontacte pour confirmer la disponibilité et ${o.mode === 'livraison' ? 'le créneau de livraison' : 'le jour de retrait'}.</p>
        ${o.cardGain ? `<p class="card-gain">${gainText(o.cardGain)}.</p>` : `<p class="card-gain">Avec un compte du cercle, cette commande vous aurait rapporté ${euro(cents((o.total - (o.mode === 'livraison' ? DELIVERY : 0)) * CARD.firstRate))} sur votre carte. <button type="button" class="link-btn" data-open="signup">Créer mon compte</button></p>`}</div>
        <div class="recap"><b>${euro(o.total)}</b>${o.items.map(i => `<span>${i.qty} × ${esc(i.name)}</span>`).join('')}${o.discount ? `<span>Code ${esc(o.code)} : −${euro(o.discount)}</span>` : ''}${o.wallet ? `<span>Cagnotte du cercle : −${euro(o.wallet)}</span>` : ''}<span>${o.mode === 'livraison' ? 'Livraison à Tours' : 'Retrait à l\'atelier, 31 rue de la Tour d\'Auvergne'}</span></div>`;
      fillLogos(body);
      const pay = payLink(o.total);
      foot.innerHTML = `${o.sent
          ? `<p class="sent-note">${icon('check')} Récapitulatif envoyé à l'atelier</p>`
          : `<a class="btn ${pay ? 'btn-ghost' : 'btn-primary'}" href="${mailto(`Commande ${o.ref}`, orderLines(o))}">Envoyer le récapitulatif à l'atelier <svg class="go"><use href="#arrow"/></svg></a>`}
        ${pay ? `<a class="btn btn-primary" href="${pay}" target="_blank" rel="noopener">Payer ${euro(o.total)} en ligne <svg class="go"><use href="#arrow"/></svg></a>` : ''}
        <p class="note">${pay ? 'Paiement sécurisé chez notre prestataire. Vous pouvez aussi régler à l\'atelier ou à la livraison.' : 'Pas de paiement en ligne : le règlement se fait à l\'atelier ou à la livraison.'}</p>`;
      return;
    }
    if (!items.length) {
      cartView = 'list';
      body.innerHTML = `<div class="empty-state"><b>Votre panier est vide</b>Pièces uniques, tableaux végétaux, bijoux et bouquets vous attendent.</div>`;
      foot.innerHTML = `<a class="btn btn-primary" href="boutique.html">Découvrir la boutique <svg class="go"><use href="#arrow"/></svg></a>`;
      return;
    }
    const sub = cart.subtotal();
    if (cartView === 'checkout') {
      const min = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10);
      body.innerHTML = `<form id="co-form" novalidate>
        <div class="field"><label for="co-name">Nom et prénom</label><input id="co-name" autocomplete="name"></div>
        <div class="field"><label for="co-email">E-mail</label><input id="co-email" type="email" autocomplete="email"></div>
        <div class="field"><label for="co-tel">Téléphone</label><input id="co-tel" type="tel" autocomplete="tel"></div>
        <div class="field"><span class="label">Réception</span>
          <div class="radio-cards">
            <label><input type="radio" name="mode" value="retrait" checked><b>Retrait à l'atelier</b>Gratuit, sur rendez-vous</label>
            <label><input type="radio" name="mode" value="livraison"><b>Livraison à Tours</b>${euro(DELIVERY)}</label>
          </div>
        </div>
        <div class="field"><label for="co-date">Date souhaitée</label><input id="co-date" type="date" min="${min}"></div>
        <div class="field"><label for="co-code">Code avantage (facultatif)</label><input id="co-code" autocomplete="off" placeholder="Ex. code de parrainage"><small class="err ok-msg" id="co-code-err"></small></div>
        ${current() && current().card.balance > 0 ? `<label class="check"><input type="checkbox" id="co-wallet"> Utiliser ma cagnotte : ${euro(current().card.balance)} disponibles</label>` : ''}
        <p class="card-hint" id="co-card"></p>
        <div class="field"><label for="co-msg">Message (carte, couleurs…)</label><textarea id="co-msg" rows="3"></textarea></div>
      </form>`;
      prefill({ name: 'co-name', email: 'co-email', tel: 'co-tel' });
      // Texte d'une carte cadeau personnalisée, repris dans le message de la commande
      const giftNote = db.get('hb_gift_note', '');
      if (giftNote && cart.items().some(i => byId[i.id].cat === 'cadeaux')) $('co-msg').value = giftNote;
      // MADATE15 ne porte que sur les bouquets du panier
      const bouquets = cart.items().filter(i => byId[i.id].cat === 'bouquets').reduce((n, i) => n + i.qty * byId[i.id].price, 0);
      const tableaux = cart.items().filter(i => byId[i.id].cat === 'tableaux').reduce((n, i) => n + i.qty * byId[i.id].price, 0);
      const codeCheck = () => {
        const c = checkCode($('co-code').value, $('co-email').value);
        if (c.ok && c.kind === 'date' && !bouquets) return { ok: false, msg: "MADATE15 s'applique aux bouquets : ajoutez-en un à votre panier." };
        if (c.ok && c.kind === 'cercle' && !tableaux) return { ok: false, msg: 'CERCLE15 s\'applique aux tableaux végétaux : ajoutez-en un à votre panier.' };
        return c;
      };
      const discount = () => { const c = codeCheck(); return c.ok ? cents((c.kind === 'date' ? bouquets : c.kind === 'cercle' ? tableaux : sub) * c.rate) : 0; };
      // Carte du cercle : la cagnotte se déduit avant la livraison
      const member = current(), balance = member ? member.card.balance : 0;
      const wallet = () => $('co-wallet')?.checked ? Math.min(balance, cents(sub - discount())) : 0;
      const shipping = () => body.querySelector('input[name="mode"]:checked').value === 'livraison' ? DELIVERY : 0;
      const total = () => cents(sub - discount() - wallet() + shipping());
      const refreshTotal = () => {
        const c = codeCheck(), msg = $('co-code-err');
        msg.textContent = c.ok ? `${c.label} : −${euro(discount())}` : c.msg;
        msg.classList.toggle('good', c.ok);
        $('co-total').textContent = euro(total());
        const paid = cents(total() - shipping()), hint = $('co-card');
        hint.innerHTML = member
          ? `<b>Carte du cercle</b> Cette commande vous rapporte ${cardPreview(member, paid)}.`
          : `<b>Carte du cercle</b> Membre, cette commande vous rapporterait ${euro(cents(paid * CARD.firstRate))} sur votre carte. <button type="button" class="link-btn" data-open="signup">Créer mon compte</button> <button type="button" class="link-btn" data-open="login">Me connecter</button>`;
      };
      foot.innerHTML = `<div class="total-row"><span>Total</span><b id="co-total">${euro(total())}</b></div>
        <button class="btn btn-primary" type="submit" form="co-form">Confirmer la commande <svg class="go"><use href="#arrow"/></svg></button>
        <button class="btn btn-ghost" type="button" id="co-back">Retour au panier</button>`;
      body.querySelectorAll('input[name="mode"]').forEach(r => r.addEventListener('change', refreshTotal));
      $('co-wallet')?.addEventListener('change', refreshTotal);
      $('co-code').addEventListener('input', refreshTotal);
      refreshTotal();
      $('co-email').addEventListener('change', refreshTotal);
      $('co-back').addEventListener('click', () => { cartView = 'list'; renderCart(); });
      $('co-form').addEventListener('submit', e => {
        e.preventDefault();
        const name = $('co-name'), email = $('co-email'), tel = $('co-tel');
        const ok = [
          setErr(name, name.value.trim() ? '' : 'Indiquez votre nom.'),
          setErr(email, validEmail(email.value) ? '' : 'Saisissez une adresse e-mail valide.'),
          setErr(tel, tel.value.trim() && validTel(tel.value) ? '' : 'Indiquez un numéro pour être recontacté.')
        ];
        if (ok.includes(false)) { body.querySelector('.invalid')?.focus(); return; }
        const mode = body.querySelector('input[name="mode"]:checked').value;
        const code = codeCheck();
        lastOrder = {
          code: code.ok ? code.code : null, codeKind: code.ok ? code.kind : null, discount: discount(),
          ref: 'CMD-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
          name: name.value.trim(), email: email.value.trim().toLowerCase(), tel: tel.value.trim(), mode,
          date: $('co-date').value, msg: $('co-msg').value.trim(),
          items: cart.items().map(i => ({ id: i.id, name: byId[i.id].name, qty: i.qty, price: byId[i.id].price })),
          wallet: wallet(), total: total(), createdAt: new Date().toISOString()
        };
        useCode(code, lastOrder.email);
        if (lastOrder.wallet) spendCard(member.email, lastOrder.wallet, `Commande ${lastOrder.ref}`);
        lastOrder.cardGain = creditCard(lastOrder.email, cents(lastOrder.total - shipping()), `Commande ${lastOrder.ref}`);
        db.set('hb_gift_note', '');
        db.set('hb_orders', [...db.get('hb_orders', []), lastOrder]);
        cartView = 'done';
        cart.save([]);
        renderCart();
        document.dispatchEvent(new CustomEvent('hb:data'));
        // Envoi direct : la commande part toute seule dans la boîte de l'atelier
        if (direct) {
          const o = lastOrder;
          envoyer(`Commande ${o.ref}`, orderLines(o), o).then(r => { if (r === 'direct' && lastOrder === o) { o.sent = true; renderCart(); } });
        }
      });
      return;
    }
    body.innerHTML = items.map(i => {
      const p = byId[i.id];
      return `<div class="cart-line">
        <div class="thumb">${media(p)}</div>
        <div><b>${esc(p.name)}</b><small>${esc(p.kind)} · ${euro(p.price)}</small><br>
          <span class="qty"><button type="button" data-qty="${p.id}" data-d="-1" aria-label="Retirer un ${esc(p.name)}">−</button><span>${i.qty}</span><button type="button" data-qty="${p.id}" data-d="1" aria-label="Ajouter un ${esc(p.name)}"${p.unique ? ' disabled' : ''}>+</button></span>
        </div>
        <div class="line-price">${euro(p.price * i.qty)}</div>
      </div>`;
    }).join('');
    foot.innerHTML = `<div class="total-row"><span>Sous-total</span><b>${euro(sub)}</b></div>
      <p class="note">Prix indicatifs. Retrait gratuit à l'atelier ou livraison à Tours.</p>
      <button class="btn btn-primary" type="button" id="co-start">Passer commande <svg class="go"><use href="#arrow"/></svg></button>`;
    $('co-start').addEventListener('click', () => { cartView = 'checkout'; renderCart(); $('co-name')?.focus(); });
  }
  $('cart-body').addEventListener('click', e => {
    const b = e.target.closest('[data-qty]');
    if (!b) return;
    const line = cart.items().find(i => i.id === b.dataset.qty);
    if (line) cart.setQty(line.id, line.qty + +b.dataset.d);
  });
  const openCart = () => {
    toggleMenu(false);
    if (cartView === 'done') cartView = 'list';
    renderCart();
    openDialog($('cart'));
  };
  $('cart-btn').addEventListener('click', openCart);
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) { cart.add(add.dataset.add); return; }
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); openCart(); }
  });
  $('cart').addEventListener('close', () => { if (cartView === 'done') { cartView = 'list'; lastOrder = null; } });

  // Les autres onglets restent à jour (panier, compte)
  window.addEventListener('storage', () => { updateBadge(); accountChanged(); });

  // ---------- Revenir sur le site : coups de cœur, rappels, liste d'attente, notifications ----------
  const daysUntil = iso => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.round((new Date(iso + 'T00:00:00') - today) / 864e5);
  };

  const inDays = d => d === 0 ? "aujourd'hui" : d === 1 ? 'demain' : `dans ${d} jours`;

  // Coups de cœur (boutique)
  const favorites = () => db.get('hb_wishlist', []);
  const favBtn = id => `<button type="button" class="fav-btn" data-fav="${id}" aria-pressed="${favorites().includes(id)}" aria-label="Ajouter à mes coups de cœur"><svg aria-hidden="true"><use href="#heart"/></svg></button>`;
  const syncFavButtons = () => document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favorites().includes(b.dataset.fav);
    b.setAttribute('aria-pressed', on);
    b.setAttribute('aria-label', `${on ? 'Retirer de' : 'Ajouter à'} mes coups de cœur : ${byId[b.dataset.fav]?.name || ''}`);
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    const id = b.dataset.fav, list = favorites();
    const on = !list.includes(id);
    db.set('hb_wishlist', on ? [...list, id] : list.filter(x => x !== id));
    syncFavButtons();
    toast(on ? `${byId[id].name} ajouté à vos coups de cœur` : 'Retiré de vos coups de cœur');
    if (accDlg.open && current()) renderDashboard(current());
    document.dispatchEvent(new CustomEvent('hb:data'));
  });

  // Fêtes de l'année : le client choisit celles dont on lui rappelle l'approche
  const EVENTS = D.fetes || [];
  const reminders = () => db.get('hb_reminders', []);
  const toggleReminder = id => {
    const list = reminders(), on = !list.includes(id);
    db.set('hb_reminders', on ? [...list, id] : list.filter(x => x !== id));
    renderNotices();
    return on;
  };

  // Liste d'attente des ateliers complets
  const waitlist = () => db.get('hb_waitlist', []);
  const joinWaitlist = entry => {
    const list = waitlist().filter(w => !(w.sessionId === entry.sessionId && w.email === entry.email));
    db.set('hb_waitlist', [...list, { id: uid(), freed: false, ...entry, at: new Date().toISOString() }]);
  };
  // Une place se libère : les personnes en attente sont prévenues à leur prochaine visite
  function freeSeat(sessionId) {
    let any = false;
    db.set('hb_waitlist', waitlist().map(w => {
      if (w.sessionId !== sessionId || w.freed) return w;
      any = true;
      return { ...w, freed: true };
    }));
    renderNotices();
    return any;
  }

  // Carte « Pour vous » : ce qui attend le client quand il revient
  document.body.insertAdjacentHTML('beforeend', `<aside class="notice" id="notice" aria-live="polite" hidden></aside>`);
  function noticeList() {
    const seen = db.get('hb_seen', []), out = [];
    waitlist().filter(w => w.freed).forEach(w => out.push({
      key: 'w-' + w.id, kicker: 'Une place s\'est libérée', text: `« ${w.title} », ${w.when}. Elle est à vous si vous réservez rapidement.`, href: 'ateliers.html#calendrier', cta: 'Réserver ma place'
    }));
    EVENTS.forEach(ev => {
      const d = daysUntil(ev.date);
      if (reminders().includes(ev.id) && d >= 0 && d <= ev.lead) out.push({
        key: `e-${ev.id}-${ev.date}`, kicker: `${ev.name} ${inDays(d)}`, text: ev.idea, href: ev.href, cta: ev.cta
      });
    });
    const acc = current();
    if (acc) acc.dates.forEach(dt => {
      const { date, days: d } = nextAnniv(dt.date);
      if (d <= 7) out.push({
        key: `d-${dt.id}-${date.getFullYear()}`, kicker: `${dt.label} ${inDays(d)}`, text: 'Pour l\'occasion, −15 % sur un bouquet avec le code MADATE15.', href: 'boutique.html', cta: 'Choisir un bouquet'
      });
    });
    if (acc) activeCampaigns().filter(cp => levelOf(acc.card) >= cp.level && !(cp.rsvp && acc.rsvp[cp.id])).forEach(cp => out.push({
      key: 'c-' + cp.id, kicker: `${cp.type} · ${cp.title}`, text: cp.text, href: cp.href || '#', cta: cp.cta || 'Répondre à l\'invitation', open: cp.rsvp
    }));
    return out.filter(n => !seen.includes(n.key));
  }
  function renderNotices() {
    const box = $('notice'), list = noticeList();
    box.hidden = !list.length;
    if (!list.length) return;
    const n = list[0];
    box.innerHTML = `<div class="notice-top"><span class="notice-kicker">Pour vous${list.length > 1 ? ` · 1 / ${list.length}` : ''}</span>
        <button type="button" class="x-btn" data-notice-close="${esc(n.key)}" aria-label="Masquer cette notification"><svg><use href="#close"/></svg></button></div>
      <b>${esc(n.kicker)}</b><p>${esc(n.text)}</p>
      <a class="btn btn-primary btn-small" href="${n.href}" data-notice-close="${esc(n.key)}"${n.open ? ' data-open="login"' : ''}>${esc(n.cta)} <svg class="go"><use href="#arrow"/></svg></a>`;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-notice-close]');
    if (!b) return;
    db.set('hb_seen', [...db.get('hb_seen', []), b.dataset.noticeClose]);
    if (b.tagName === 'BUTTON') renderNotices();
  });
  document.addEventListener('hb:account', renderNotices);

  updateBadge();
  accountChanged();
  syncFavButtons();
  renderNotices();

  window.HB = { db, $, esc, euro, fmtDate, uid, icon, logo, fillLogos, observe, toast, setErr, validEmail, validTel, mailto, prefill, current, openAccount, saveRequest, checkCode, useCode, WELCOME, creditCard, gainText,
    favorites, favBtn, syncFavButtons, EVENTS, reminders, toggleReminder, daysUntil, waitlist, joinWaitlist, freeSeat, renderNotices, PRODUCTS, media, cart, IG, MAIL, TEL, MAPS, envoyer, direct, ATELIERS: D.ateliers || { places: 8, prix: 45, dates: [] } };
})();
