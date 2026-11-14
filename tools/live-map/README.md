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
