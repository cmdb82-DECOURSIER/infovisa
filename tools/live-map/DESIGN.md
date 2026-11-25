# Apparence InfoVisa

Manrope, espacements, composants et signature dorée conservés.

| Rôle | Sombre | Clair |
| --- | --- | --- |
| Fond | #080d12 | #ffffff |
| Surface | #101a22 | #f5f7f8 |
| Texte | #f0f2ee | #152a36 |
| Texte secondaire | #a6b1b7 | #4b606c |
| Bordure | #25333d | #cbd5db |
| Or InfoVisa | #c7ab79 | #856025 |
| Accent météo | #8bd2db | #146575 |

Choix clair/sombre visible dans l’en-tête. Premier affichage selon le thème de l’appareil, préférence explicite mémorisée localement et synchronisée entre les onglets. Application avant le rendu pour éviter un flash sombre. Le fond des cartes météo et des lecteurs vidéo reste adapté aux données et à la vidéo ; les panneaux, textes, commandes et prévisions suivent le thème choisi. Les widgets TradingView reçoivent le thème courant.

## Carte et fil de dernière minute
La carte mondiale occupe toute la largeur. Aucun panneau de risque n’est affiché par défaut ; les détails d’un pays s’ouvrent à la demande dans une fenêtre. Le carrousel de la dernière heure suit immédiatement la carte, avec trois cartes sur ordinateur, deux sur tablette et une avec aperçu de la suivante sur téléphone. Navigation manuelle, clavier et balayage ; aucun défilement automatique pendant la lecture.

Hiérarchie : cyan pour un titre récent, or pour un direct, rouge pour une urgence explicitement signalée par le média. Le point urgent a un cœur deux fois plus grand que le point récent, un halo élargi et un point d’exclamation. La cible tactile reste de 44 px et les dimensions restent constantes au zoom. Pulsation douce désactivée si l’appareil demande de réduire les animations.

## Grille de webcams
Boutons Vue unique / Grille dans Webcams live. Mosaïque de vignettes moyennes, filtre par ville et catalogue complet des vidéos intégrées. Trois colonnes sur grand écran, une sur téléphone ; lecteurs d’au moins 200 px de haut. Toutes les vidéos démarrent muettes. Un clic sur la vignette ou son bouton sélectionne une seule source audio, signalée par une bordure dorée ; Tout couper remet toutes les sources en silence. Les sources sans piste audio restent silencieuses.

Les lecteurs officiels nécessitent le consentement médias. Seules les vignettes visibles sont lues, six au maximum. Arrêt en quittant la grille ou l’onglet ; pause globale et liens vers les diffuseurs. Les images fixes restent dans la vue unique et ne sont pas présentées comme des vidéos.

## Vues de la carte mondiale
Ordre principal : Pays, Séismes, Vent. Sélection exclusive et stable : cliquer à nouveau Pays ne désactive pas cette vue. Les POI d’actualité font partie de Pays et ne nécessitent aucun bouton séparé. Les autres couches PAN, événements naturels et températures restent dans Autres couches.

Les points Pays reprennent les articles disponibles dans les flux éditeurs sur les dernières 24 heures, avec source et date, pour éviter de disparaître dès qu’un titre dépasse une heure. Le carrousel conserve les titres de la dernière heure. Urgent / En direct uniquement selon le média, avec expiration de la mise en avant ; aucune urgence déduite du sujet. Les points sont au centre des pays mentionnés, sans prétendre à une localisation exacte. La légende distingue les trois états.

Vent : flèches et vitesses à 10 m sur les points mondiaux disponibles, prévisions MET Norway horodatées en UTC. Pas d’interpolation ni d’animation ajoutée à cette vue ; le module Météo conserve l’atlas complet. Les flèches sont orientées vers la direction du déplacement de l’air, calculée depuis la provenance météorologique. Les valeurs absentes ne créent pas de flèche.
