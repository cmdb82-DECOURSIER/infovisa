# Carte « InfoVisa Live »

Pages générées, à ne pas éditer à la main :
`/index.html` (FR), `/en/live/`, `/de/live/`, `/es/live/`, `/pt/live/`.

1. Dans un dossier de travail : `npm i d3 topojson-client world-atlas world-countries`
2. Y copier `template.html`, `build.js` et `i18n.js`, puis `node build.js`
3. Copier le contenu de `out/` à la racine du site (`out/index.html` → `/index.html`, `out/en/live/index.html` → `/en/live/index.html`, etc.)

Tous les textes sont dans `i18n.js` (une entrée par langue). Les niveaux de risque (`L2`, `L3`, `L4`)
et leurs motifs (`RTXT`) sont un instantané daté (`RISKDATE` dans `build.js`), à mettre à jour depuis
les avis officiels avant chaque régénération. Séismes (USGS), événements naturels (NASA EONET),
météo (Open-Meteo) et actualités (fonction `/api/news`, Google Actualités) sont chargés en direct.

## Design InfoVisa (branche aperçu)
Le modèle conserve les moteurs carte, Radio Browser, HLS et marchés existants, leurs clés de stockage, les URL et les balises SEO. L’habillage Nuit/Or est dans `design/theme.css`. Les vues météo, océan et les dossiers PAN officiels sont dans `design/` ; les dossiers PAN sont des archives datées, hors temps réel. Les ressources utilisent des chemins absolus compatibles avec les cinq routes Live.

Reconstruction reproductible :
```
cd tools/live-map
npm install
node build.js
node publish-generated.js
```
La dernière commande copie uniquement le contenu généré `out/` à la racine. Elle n’efface pas les guides ni la configuration du site. Les captures et validations de l’aperçu précèdent toute fusion dans main.

## Webcams des destinations

`api/webcams.js` recherche les caméras Windy actives autour des coordonnées de la destination (rayon de 10, 25, 50 ou 100 km). Ajouter `WINDY_WEBCAMS_API_KEY` comme variable **Secret** du projet Vercel infovisa, pour Preview et Production. Ne jamais l’inclure dans les fichiers HTML/JS publics ni dans Git. Après ajout, un nouveau déploiement est nécessaire. Le fournisseur : https://api.windy.com/webcams/docs ; conditions et attribution : https://api.windy.com/webcams/terms .

Les images restent à leur taille native et sont reliées à Windy. Les lecteurs distinguent vidéo live et timelapse et attendent le consentement médias Cookiebot. Les liens locaux du catalogue sont rapprochés géographiquement, y compris après une recherche de ville ; l’image NOAA de San Francisco ne remplace plus les webcams d’une autre destination. Une panne du fournisseur laisse les liens locaux et la carte Windy accessibles. Les URL d’images expirent ; cache serveur limité à 120 s et actualisation du panneau visible après quelques minutes.

Les boutons météo utilisent une règle SVG scoped `#map .wx` : ne pas réintroduire `.wx { pointer-events:none }`, qui bloquait tout le nouveau panneau météo portant cette classe.

Tests : `npm test` dans tools/live-map (API, interactions météo, recherche des caméras et consentement). Les dépendances de test restent locales ; le site déployé est statique avec les fonctions /api existantes et /api/webcams.

## Rubriques du portail

- Monde local : catalogue mondial des pays/territoires généré depuis world-countries, noms localisés avec Intl.DisplayNames, actualités via `/api/news`, météo/heure locale via Open-Meteo ; recherche facultative d’une ville dans le pays sélectionné.
- Webcams live : recherche mondiale Open-Meteo et composant de caméras partagé avec l’océan. Sélection en mémoire de quatre lecteurs pour la mosaïque, y compris en changeant de destination.
- Pandémies & virus : `/api/health` récupère uniquement les titres, dates et liens officiels WHO Disease Outbreak News et ECDC CDTR. Les rapports anciens sont datés et signalés ; aucun statut de pandémie ni total de cas n’est inventé.
- Crypto et Bourse ont des boutons et contenus séparés ; CRO est ajouté par identifiant CoinGecko `crypto-com-chain` si absent des 60 premières lignes. Les favoris existants sont conservés.
- Repères d’actualité : titres de moins de 24 h associés aux pays/villes mentionnés ; seuls les titres explicitement « urgent » ou « en direct » pulsent. Un clic ouvre les articles et leurs sources. Les repères suivent le zoom de la carte.
- Les imports JS et entrées CSS/JS générés portent une empreinte des assets pour éviter qu’un navigateur conserve la version précédente pendant le cache de 24 h.
