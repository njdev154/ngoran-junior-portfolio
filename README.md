# N'Goran Junior — Portfolio

Portfolio statique (HTML, CSS et JavaScript vanilla, sans framework) d'un étudiant en
Informatique Développeur d'Applications à Abidjan. Direction éditoriale claire,
captures de projets affichées sans zoom et animations réduites pour privilégier
la lisibilité et la rapidité : carrousel, compteurs, boutons et transitions.

## Structure

- `index.html` : accueil (hero, marquee technos, projets + filtres, marquee géant,
  matrice de compétences, parcours, à propos, contact)
- `pages/projets.html` : les 6 projets + filtres
- `pages/parcours.html` : timeline complète + « Ce que j'explore »
- `pages/a-propos.html` : portrait, bio, faits, démarche
- `pages/contact.html` : email, WhatsApp, GitHub, LinkedIn, formulaire, horloge d'Abidjan
- `pages/certificats.html` : certifications
- `projets/` : une étude de cas par projet
  (`cibanque`, `dona-ci`, `pigier-connect`, `jeuneavenir-ci`, `passerelle`, `bizflow`)
- `404.html` : page d'erreur (servie par GitHub Pages)
- `css/style.css` : tout le design (tokens, composants, responsive, motion réduite)
- `js/main.js` : curseur contextuel, compteurs, filtres, menu mobile,
  voile de transition, bilingue FR/EN, formulaire, horloge, timeline
- `assets/` : images (WebP), logo, CV (PDF), certificat Excel (PDF)

## Bilingue FR / EN

Chaque texte porte `data-i18n="clé"`. Les traductions anglaises vivent dans le bloc
`window.PF_PAGE_EN` en bas de chaque page (les clés communes — `skip`, `nav.*`,
`foot.*`, `status.*`, `f.*`, `k.time`, `back.projects` — sont déjà dans `main.js`,
ne les redéfinis pas). Les attributs `alt` ont leur version anglaise
(`data-alt-en`). Le choix de langue est mémorisé (localStorage).

## Mettre à jour le contenu

- **Un nouveau projet** : ajoute une `.card` dans `index.html` et
  `pages/projets.html` (même markup, `data-cat` parmi `front`, `laravel`,
  `live`, `wip`), puis crée `projets/nom.html` en copiant `projets/bizflow.html`.
- **CV** : remplace `assets/cv/CV_NGoran_Junior.pdf` en gardant le même nom.
- **Formulaire de contact** : relié à Formspree. Pour changer de destinataire,
  crée un formulaire sur [formspree.io](https://formspree.io) et remplace
  l'identifiant dans l'attribut `action` (`formspree.io/f/...`) de
  `index.html` et `pages/contact.html`.
- **Traductions** : ajoute la clé FR avec `data-i18n` + son équivalent EN dans
  `window.PF_PAGE_EN` de la page.

## Publication

Le nom choisi pour le dépôt dédié est `njdev154/ngoran-junior-portfolio`.
Après sa création, son workflow GitHub Actions publiera le site sur
`https://njdev154.github.io/ngoran-junior-portfolio/`.

Pour publier une mise à jour, pousse les changements sur la branche `main`.

## Bonnes pratiques

- Ne publie jamais de clé secrète ou de fichier `.env`.
- Les captures des projets sont en WebP (`assets/images/`) pour un chargement rapide.
- Le site respecte `prefers-reduced-motion` : les animations sont désactivées
  pour les utilisateurs qui le demandent.
