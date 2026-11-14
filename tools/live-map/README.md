# Carte « InfoVisa Live » (page d'accueil `/index.html`)

`/index.html` est généré : ne pas l'éditer à la main.

1. Dans un dossier de travail : `npm i d3 topojson-client world-atlas world-countries`
2. Y copier `template.html` et `build.js`, puis `node build.js`
3. Copier `out/infovisa-live.html` vers `/index.html` à la racine du site

Les niveaux de risque (`L2`, `L3`, `L4`) et leurs motifs (`RTXT`) sont un instantané daté
(`RISKDATE` dans `build.js`), à mettre à jour depuis les avis officiels avant chaque régénération.
Séismes (USGS), événements naturels (NASA EONET), météo (Open-Meteo) et actualités (GDELT)
sont chargés en direct par le navigateur.
