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
