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
