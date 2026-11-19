# Journal du projet

## 2026-11-15 — Initialisation du portfolio
- Fait : séparé le portfolio personnel de tout autre projet et créé le dépôt public dédié `njdev154/ngoran-junior-portfolio`.
- À faire : terminer la première publication GitHub Pages et vérifier le site en ligne.

## 2026-11-15
- Fait : analysé le portfolio, son rendu responsive, ses filtres, ses traductions, ses formulaires et ses liens locaux. Les filtres fonctionnent, les images et chemins locaux sont présents, et aucun débordement horizontal n'a été relevé aux largeurs testées. Aucun code n'a été modifié.
- À faire : tester le formulaire, vérifier l'accessibilité des animations, et continuer à actualiser le parcours et les dates.

## 2026-11-15 — Rapidité et images
- Fait : supprimé le rideau qui retardait l'accès au contenu, les boucles d'animation coûteuses et le grain superposé aux images; retiré le zoom et les déplacements qui rendaient les captures floues ou coupées. Les captures gardent maintenant leur ratio, la photo de profil n'est plus animée, et le texte du titre ne disparaît plus entre deux mots.
- À faire : vérifier le rendu final sur un téléphone réel et poursuivre la mise à jour des dates du parcours.

## 2026-11-15 — Documentation
- Fait : actualisé le README et les commentaires du code pour refléter les effets visuels conservés après l'allègement.
- À faire : vérifier le rendu sur un téléphone réel, le formulaire de contact et les dates du parcours.

## 2026-11-15 — Publication finale
- Fait : rétabli la validation native du formulaire, corrigé les identifiants SVG dupliqués, créé le dépôt public, puis publié le site sur GitHub Pages.
- Vérifications : site et images accessibles, affichage mobile sans débordement horizontal, filtre Laravel (2 projets) et validation native du formulaire.
- Fait ensuite : test réel du formulaire confirmé par réception du message dans la boîte mail.
- À faire : vérifier le rendu sur un téléphone.

## 2026-11-15 — Affichage du contact
- Fait : réduit la taille de l'adresse e-mail dans le bloc contact et ajouté un point de coupure propre après « @ » pour éviter une dernière lettre seule sur sa ligne.
- Vérifications : rendu en ligne contrôlé de 320 px à 1700 px, sans débordement horizontal; l'adresse tient sur une ligne sauf sur le plus petit écran, où elle se coupe proprement après « @ ».

## 2026-11-18 — Analyse d'un portfolio de référence
- Agent : Copilot
- Fait : analysé la page d'accueil et le parcours de demande de projet d'AquilasDev. Repéré ses choix visuels, ses preuves sociales, ses réalisations, ses témoignages, ses appels à l'action et ses points de vigilance éditoriaux.
- À faire : comparer ces idées au portfolio de N'Goran Junior et choisir celles qui servent son objectif professionnel, sans copier le site de référence.

## 2026-11-18 — Intro et revue du portfolio
- Agent : Copilot
- Fait : réactivé sur l'accueil une intro typographique courte, affichée une fois par navigateur, avec bouton pour la passer et respect de la préférence de mouvement réduit. Les autres pages restent sans intro.
- Analyse : le portfolio a déjà des études de cas détaillées, des projets ivoiriens, des compétences reliées aux projets, un CV, un contact fonctionnel et un style cohérent. Les priorités d'évolution sont d'actualiser le parcours et les chiffres, de clarifier l'objectif professionnel dès l'accroche et de rendre les projets phares visibles sans dépendre uniquement du carrousel.
- À faire : tester l'intro sur téléphone et vérifier que les informations de formation, de stage et de projets sont à jour; décider ensuite si l'on retravaille l'accueil et les études de cas.

## 2026-11-18 — Parcours de demande et interactions
- Agent : Copilot
- Fait : renforcé l'intro avec une sortie en rideau et un bouton de passage; rendu le portrait réactif au pointeur; ajouté des révélations au défilement et remplacé les logos raster par des monogrammes SVG transparents. Créé un parcours de demande en quatre étapes, avec sélection de fonctions, délai, résumé, lien WhatsApp et formulaire prérempli; complété les traductions et la documentation.
- Vérifications : intro temporisée, passage manuel et préférence de mouvement réduit; interactions du portrait; navigation, sélection/réinitialisation, résumé, traductions, WhatsApp et préremplissage; affichage mobile à 375 px sans débordement horizontal. `node --check js\\main.js` et `git diff --check` réussis.
- Contributions précisées par Junior : IA caméra (OpenCV, YOLO, EasyOCR, Python), base de données et MCD pour WashMatic; partie satellite et spectre, encore expérimentale, pour YA SatScope. Le sens exact de « MC » reste à confirmer.
- À faire : intégrer les études de cas après réception de captures réelles des deux projets et des sources ou d'un cahier WashMatic lisible. Le scan local est illisible et l'accès Drive aux sources reste incomplet.

## 2026-11-18 — Refonte intro et parcours de projet
- Agent : Copilot
- Fait : remplacé le rideau par une intro claire aux couleurs du site, avec apparition distincte du N puis du J; redessiné le curseur fluide et limité le mouvement du portrait; étendu le parcours aux six catégories avec options propres à chaque besoin et formulaire final. Corrigé aussi le défilement des étapes pour que l'en-tête flottant ne recouvre plus les options.
- Vérifications : les six sélections affichent les bons modules; changer de catégorie réinitialise les fonctions; résumé, champs Formspree cachés, validation native, WhatsApp et traductions FR/EN contrôlés sans envoi réel. Parcours complet recliqué dans un onglet visible; défilement des panneaux sous l'en-tête vérifié. À 375 px, aucun débordement horizontal; inclinaison/panoramique du portrait, réinitialisation et libellé du curseur vérifiés. `node --check js\\main.js` et `git diff --check` réussis.
- Démo enregistrée : `portfolio-intro-et-demande.webm`; script : `portfolio-intro-et-demande.js` (stockés dans le dossier de session).
- À faire : tester sur un téléphone réel et ne pas envoyer de vraie demande pendant les tests. Les études de cas WashMatic et YA SatScope attendent toujours des captures réelles et des sources vérifiables.

## 2026-11-18 — Étude de cas YA SatScope et effets de survol
- Agent : Copilot
- Fait : ajouté YA SatScope comme septième projet, avec sa fiche bilingue, les 15 captures authentiques, la contribution d'équipe clairement distinguée et les limites matérielles documentées. Ajouté les interactions de survol des boutons, titres et cartes dans l'identité existante.
- Vérifications : les 7 vignettes projets et les 15 captures YA SatScope chargent; boutons et cartes réagissent en 300 ms, le zoom reste contenu, les titres se soulèvent lettre par lettre avec 50 ms de délai et gardent leur nom accessible en français et en anglais. Le mouvement est neutralisé par `prefers-reduced-motion`; aucun débordement horizontal à 390 px ni erreur navigateur. `node --check js\\main.js` et `git diff --check` réussis.
- Correction : rétabli le soulèvement des cartes après leur apparition au défilement et exclu les flèches décoratives de leur nom accessible.
- À faire : contrôler le rendu sur un téléphone réel. WashMatic reste une étape séparée.

## 2026-11-19 — Curseur, carrousel et étude de cas YA SatScope
- Agent : Copilot
- Fait : réparé l'initialisation du curseur sur les pages internes; le composant reconstruit anneau, point et libellé si une page ne contient que le libellé. Rendu le carrousel glissable à la souris et au tactile, ajouté une indication de navigation et synchronisé la hauteur du cadre avec la diapositive active. Les captures remplissent leur cadre; YA SatScope conserve son ratio 16:10 pour éviter de rogner l'interface.
- Contenu : détaillé les fonctions et la pile technique d'équipe de YA SatScope d'après son README et son guide (suivi orbital, SDR, enregistrement/relecture IQ, projets, rapports, SatDump, SatNOGS, Python, PySide6, Skyfield/SGP4, NumPy/SciPy/PyQtGraph, SQLite). La fiche distingue clairement le travail collectif, la contribution de Junior et son niveau débutant.
- Vérifications : glissement 01→02, navigation au 07, chargement de la capture 1600×1000 dans un cadre 16:10, ouverture de l'étude de cas et présence du curseur testés dans le navigateur visible. La fiche comporte 4 fonctions et 4 groupes d'outils d'équipe; largeur 390 px sans débordement horizontal; aucune erreur navigateur. `node --check js\\main.js` et `git diff --check` réussis.
- Démo enregistrée : `ya-satscope-project-swipe.webm`; script : `ya-satscope-project-swipe.js` (stockés dans le dossier de session).
- À faire : vérifier le glissement sur un téléphone physique. WashMatic reste une étape séparée.

## 2026-11-19 — Compétences, diplôme et lien JeuneAvenir CI
- Agent : Copilot
- Fait : retiré le sous-titre des technologies demandé; ajouté la pile YA SatScope en distinguant les outils du projet d'équipe et le niveau « Notions ». Reformulé le BTS comme obtenu à Pigier Côte d'Ivoire, ajouté le lien public JeuneAvenir CI et décrit honnêtement l'état actuel du site.
- Fait : limité `Ctrl+A`/`Cmd+A` à la sélection dans les champs de texte, zones de texte et éléments éditables.
- À faire : vérifier les deux langues, le comportement clavier, le lien public, l'affichage mobile et la console du navigateur; tester sur un téléphone réel.
