const fs = require('fs');
const assetHash = require('crypto').createHash('sha256');
function hashAssets(dir){for(const name of fs.readdirSync(dir).sort()){const path=dir+'/'+name;if(fs.statSync(path).isDirectory())hashAssets(path);else assetHash.update(path).update(fs.readFileSync(path));}}
hashAssets('design');
const assetVersion=assetHash.digest('hex').slice(0,12);
const wc = require('world-countries');
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json', 'utf8'));

const L4 = "Afghanistan, Belarus, Burkina Faso, Burma, Central African Republic, Chad, Democratic Republic of the Congo, Gaza, Haiti, Iran, Iraq, Lebanon, Libya, Mali, Niger, North Korea, Russia, Somalia, South Sudan, Sudan, Syria, Uganda, Ukraine, Yemen";
const L3 = "Azerbaijan, Bahrain, Burundi, Colombia, Ethiopia, Guatemala, Guinea-Bissau, Guyana, Honduras, Israel, Jordan, Kenya, Kuwait, Macau, Mauritania, Nicaragua, Nigeria, Oman, Pakistan, Papua New Guinea, Qatar, Rwanda, Saudi Arabia, Trinidad and Tobago, United Arab Emirates, Venezuela, The West Bank";
const L2 = "Albania, Algeria, Angola, Antarctica, Armenia, The Bahamas, Bangladesh, Belgium, Belize, Benin, Bolivia, Bosnia and Herzegovina, Botswana, Brazil, Cambodia, Cameroon, Chile, China, Comoros, Republic of Congo, Costa Rica, Cote d'Ivoire, Cuba, Denmark, Djibouti, Dominican Republic, Ecuador, Egypt, Equatorial Guinea, Eritrea, Eswatini, France, Gabon, The Gambia, Germany, Ghana, Greenland, Grenada, Guinea, Hong Kong, India, Indonesia, Italy, Jamaica, Kosovo, Laos, Lesotho, Liberia, Madagascar, Malawi, Maldives, Mauritius, Mexico, Moldova, Morocco, Mozambique, Namibia, Nepal, Netherlands, New Caledonia, Panama, Peru, Philippines, Saint Lucia, Sao Tome and Principe, Serbia, Sierra Leone, Solomon Islands, South Africa, Spain, Sri Lanka, Sweden, Tajikistan, Tanzania, Timor-Leste, Togo, Tunisia, Turkey, Turks and Caicos Islands, United Kingdom, Uruguay, Zimbabwe";
const ALIAS = { "Burma": "MMR", "Democratic Republic of the Congo": "COD", "Gaza": "PSE", "The West Bank": "PSE", "North Korea": "PRK", "Macau": "MAC", "The Bahamas": "BHS", "Republic of Congo": "COG", "Cote d'Ivoire": "CIV", "The Gambia": "GMB", "Sao Tome and Principe": "STP", "Turkey": "TUR", "Kosovo": "UNK", "Timor-Leste": "TLS", "Eswatini": "SWZ" };
const byName = new Map(wc.map(c => [c.name.common.toLowerCase(), c.cca3]));
const risk = {}; const miss = [];
[[L2, 2], [L3, 3], [L4, 4]].forEach(([s, l]) => s.split(',').map(x => x.trim()).forEach(n => {
  const a3 = ALIAS[n] || byName.get(n.toLowerCase());
  if (!a3) miss.push(n); else risk[a3] = Math.max(risk[a3] || 0, l);
}));
console.log('unresolved:', miss, 'risk entries:', Object.keys(risk).length);


const RTXT = `Afghanistan|U,C,T,D,K,N,H
Belarus|U,D
Burkina Faso|C,K,T,H
Burma|A,U,L,H,M,C
Central African Republic|U,C,K,M,H,T
Chad|C,T,U,H,K,M
Democratic Republic of the Congo|H,C,U,T,K
Gaza|T,U,H
Haiti|C,K,T,U,H
Iran|T,U,K,D
Iraq|T,K,A,C,H
Lebanon|C,T,U,K,M,A
Libya|C,T,H,U,K,M
Mali|C,T,K,U,A,H
Niger|C,U,T,H,K
North Korea|D
Russia|T,U,D
Somalia|C,K,T,U,H,M,P,W
South Sudan|U,C,K,M,H
Sudan|U,C,K,T,M,H
Syria|T,U,K,C,A
Uganda|C,H,T,U
Ukraine|A
Yemen|T,U,C,H,K,M
Azerbaijan|T,A,M
Bahrain|T,A
Burundi|U,C,H
Colombia|C,T,U,K,N
Ethiopia|U,C,K,T,M,I,E
Guatemala|C,T
Guinea-Bissau|U,H,M
Guyana|C
Honduras|C,T,U
Israel|T,U,A
Jordan|T,A
Kenya|H,C,K,T,U,R
Kuwait|A,M,C
Macau|L,X,U
Mauritania|T,C,H
Nicaragua|C,H,D,L,N
Nigeria|C,T,U,K,H
Oman|A,T
Pakistan|A,T,C,K
Papua New Guinea|C,U,P,K,M,H,N
Qatar|A
Rwanda|C,U,H
Saudi Arabia|A,T,E,L
The West Bank|T,U
Trinidad and Tobago|C,H,T
United Arab Emirates|T,A,L
Venezuela|C,K,T,H,N
Albania|C,U
Algeria|T,K
Angola|C,H,U,M
Armenia|A
Bangladesh|U,C,T,K
Belgium|C,T,U
Belize|C
Benin|U,C,T,K
Bolivia|C,U,H
Bosnia and Herzegovina|C,M,T
Botswana|C
Brazil|C,K
Cambodia|C,U,M
Cameroon|C,T,U,H,K,M
Chile|C,U,H
China|D,E,L
Comoros|C,U,H
Costa Rica|C
Cote d'Ivoire|C,T,U,H,P
Cuba|C,U,O,L
Denmark|T
Djibouti|T,B
Dominican Republic|C
Ecuador|C,T,U,K
Egypt|T,C,H,U,L
Equatorial Guinea|C,H,L
Eritrea|D,M
Eswatini|C,U
France|T,U,C
Gabon|U,C,H
Germany|T
Ghana|C,H,L
Greenland|N,S
Grenada|C
Guinea|C,U,H
Hong Kong|L
India|C,T
Indonesia|N,U,T
Italy|T,C
Jamaica|C,H
Kosovo|U,T
Laos|C,U,M
Lesotho|C,H
Liberia|C,U,H
Madagascar|C,U,H
Malawi|C,U
Maldives|T
Mauritius|C
Mexico|C,T,K
Moldova|M,A,C
Morocco|T
Mozambique|T,C,H,U
Namibia|C,H
Nepal|N,H
Netherlands|T,C
New Caledonia|C
Panama|C,U
Peru|C,U,K,T
Philippines|C,T,U,K,N
Republic of Congo|C
Saint Lucia|C,N
Sao Tome and Principe|H
Serbia|C
Sierra Leone|C,U,H
Solomon Islands|H,M,C,U
South Africa|C,T,U,K
Spain|T,U
Sri Lanka|U,T,M
Sweden|T
Tajikistan|T,M
Tanzania|C,T,H,U,L
The Bahamas|C
The Gambia|C,U,H
Timor-Leste|U,C
Togo|C,T,U,K,H
Tunisia|T,C,U
Turkey|T,A,L
Turks and Caicos Islands|C
United Kingdom|T,C
Uruguay|C
Zimbabwe|C,L`;
const reasons = {}; const rmiss = [];
RTXT.split('\n').forEach(l => { const [n, codes] = l.split('|'); const a3 = ALIAS[n] || byName.get(n.toLowerCase()); if (!a3) { rmiss.push(n); return; } const set = new Set([...(reasons[a3] || []), ...codes.split(',')]); reasons[a3] = [...set]; });
const noReason = Object.keys(risk).filter(k => !reasons[k]);
console.log('reasons unresolved:', rmiss, 'risk without reasons:', noReason, 'reasons without risk:', Object.keys(reasons).filter(k => !risk[k]));

const I18N = require('./i18n.js');
const LANGS = Object.keys(I18N);
const TR = { fr: 'fra', de: 'deu', es: 'spa', pt: 'por' };
const REG = {
  fr: { Africa: "Afrique", Americas: "Amériques", Asia: "Asie", Europe: "Europe", Oceania: "Océanie", Antarctic: "Antarctique" },
  de: { Africa: "Afrika", Americas: "Amerika", Asia: "Asien", Europe: "Europa", Oceania: "Ozeanien", Antarctic: "Antarktis" },
  es: { Africa: "África", Americas: "América", Asia: "Asia", Europe: "Europa", Oceania: "Oceanía", Antarctic: "Antártida" },
  pt: { Africa: "África", Americas: "Américas", Asia: "Ásia", Europe: "Europa", Oceania: "Oceânia", Antarctic: "Antártida" },
};
const SUB_FR = { "Western Europe": "Europe de l'Ouest", "Eastern Europe": "Europe de l'Est", "Northern Europe": "Europe du Nord", "Southern Europe": "Europe du Sud", "Southeast Europe": "Europe du Sud-Est", "Central Europe": "Europe centrale", "Western Asia": "Asie de l'Ouest", "Southern Asia": "Asie du Sud", "South-Eastern Asia": "Asie du Sud-Est", "Eastern Asia": "Asie de l'Est", "Central Asia": "Asie centrale", "Northern Africa": "Afrique du Nord", "Western Africa": "Afrique de l'Ouest", "Eastern Africa": "Afrique de l'Est", "Middle Africa": "Afrique centrale", "Southern Africa": "Afrique australe", "North America": "Amérique du Nord", "South America": "Amérique du Sud", "Central America": "Amérique centrale", "Caribbean": "Caraïbes", "Australia and New Zealand": "Australie et Nouvelle-Zélande", "Melanesia": "Mélanésie", "Micronesia": "Micronésie", "Polynesia": "Polynésie" };
// Villes de la couche météo : [nom FR, nom EN, lat, lon]
const CITY = [["Luxembourg","Luxembourg",49.61,6.13],["Paris","Paris",48.86,2.35],["Londres","London",51.51,-0.13],["Madrid","Madrid",40.42,-3.7],["Lisbonne","Lisbon",38.72,-9.14],["Rome","Rome",41.9,12.5],["Berlin","Berlin",52.52,13.4],["Stockholm","Stockholm",59.33,18.07],["Varsovie","Warsaw",52.23,21.01],["Kyiv","Kyiv",50.45,30.52],["Moscou","Moscow",55.75,37.62],["Istanbul","Istanbul",41.01,28.98],["Le Caire","Cairo",30.04,31.24],["Casablanca","Casablanca",33.57,-7.59],["Dakar","Dakar",14.72,-17.47],["Lagos","Lagos",6.52,3.38],["Nairobi","Nairobi",-1.29,36.82],["Kinshasa","Kinshasa",-4.44,15.27],["Johannesburg","Johannesburg",-26.2,28.05],["Riyad","Riyadh",24.71,46.68],["Dubaï","Dubai",25.2,55.27],["Téhéran","Tehran",35.69,51.39],["Karachi","Karachi",24.86,67.0],["Delhi","Delhi",28.61,77.21],["Mumbai","Mumbai",19.08,72.88],["Dacca","Dhaka",23.81,90.41],["Bangkok","Bangkok",13.76,100.5],["Singapour","Singapore",1.35,103.82],["Jakarta","Jakarta",-6.21,106.85],["Hong Kong","Hong Kong",22.32,114.17],["Pékin","Beijing",39.9,116.4],["Séoul","Seoul",37.57,126.98],["Tokyo","Tokyo",35.68,139.69],["Manille","Manila",14.6,120.98],["Sydney","Sydney",-33.87,151.21],["Auckland","Auckland",-36.85,174.76],["Anchorage","Anchorage",61.22,-149.9],["Vancouver","Vancouver",49.28,-123.12],["Los Angeles","Los Angeles",34.05,-118.24],["Mexico","Mexico City",19.43,-99.13],["Chicago","Chicago",41.88,-87.63],["New York","New York",40.71,-74.01],["Miami","Miami",25.76,-80.19],["Montréal","Montreal",45.5,-73.57],["Bogota","Bogotá",4.71,-74.07],["Lima","Lima",-12.05,-77.04],["São Paulo","São Paulo",-23.55,-46.63],["Buenos Aires","Buenos Aires",-34.6,-58.38],["Santiago","Santiago",-33.45,-70.67],["Reykjavik","Reykjavík",64.15,-21.94],["Almaty","Almaty",43.24,76.89],["Addis-Abeba","Addis Ababa",9.03,38.74],["Alger","Algiers",36.75,3.06]];

const countriesFor = lang => wc.map(c => {
  const cur = Object.entries(c.currencies || {})[0];
  const idd = c.idd && c.idd.root ? c.idd.root + (c.idd.suffixes && c.idd.suffixes.length === 1 ? c.idd.suffixes[0] : '') : '';
  const t = TR[lang] && c.translations[TR[lang]];
  return { n: c.ccn3 || '', a3: c.cca3, a2: c.cca2, fr: (t && t.common) || c.name.common, en: c.name.common, cap: (c.capital || [])[0] || '',
    reg: (REG[lang] && REG[lang][c.region]) || c.region || '', sub: lang === 'fr' ? (SUB_FR[c.subregion] || '') : lang === 'en' ? (c.subregion || '') : '',
    cur: cur ? `${cur[0]}${cur[1].symbol ? ' (' + cur[1].symbol + ')' : ''}` : '', idd, ll: (c.latlng || [0, 0]).map(x => Math.round(x * 100) / 100) };
});
const ids = new Set(wc.map(c => c.ccn3));
console.log('map features without country record:', topo.objects.countries.geometries.filter(g => !ids.has(g.id)).map(g => g.properties.name));

const safe = s => s.split('</script').join('<\\/script');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const D3 = safe(fs.readFileSync('node_modules/d3/dist/d3.min.js', 'utf8'));
const TOPOJS = safe(fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js', 'utf8'));
const MKI = require('./markets-i18n.js');
const MKJS = safe(fs.readFileSync('markets.js', 'utf8'));
const TOPOSTR = safe(JSON.stringify(topo));
const RISKDATE = '2026-11-13';
fs.mkdirSync('out', { recursive: true });
fs.cpSync('design','out/assets/live',{recursive:true});
// Version module dependencies as well as entry points: static assets have a one-day browser cache.
for(const name of fs.readdirSync('out/assets/live').filter(n=>n.endsWith('.js'))){
 const path='out/assets/live/'+name;
 const source=fs.readFileSync(path,'utf8').replace(/((?:from\s*|import\()\s*['"])(\.[^'"?\n]*\.js)(?:\?v=[^'"]*)?(['"])/g,(_,prefix,url,quote)=>prefix+url+'?v='+assetVersion+quote);
 fs.writeFileSync(path,source);
}

fs.writeFileSync('out/assets/live/assets/local-countries.json',JSON.stringify(wc.filter(c=>c.cca2).map(c=>({code:c.cca2,name:c.name.common,capital:c.capital?.[0]||c.name.common,lat:(c.capitalInfo?.latlng?.length===2?c.capitalInfo.latlng:c.latlng)[0],lon:(c.capitalInfo?.latlng?.length===2?c.capitalInfo.latlng:c.latlng)[1]}))));


const SEO = {
  fr: { h1: 'InfoVisa Live : le monde en direct', lead: 'Risques par pays, séismes, météo, actualités géopolitiques, radio et TV info — et le guide du visa Schengen.',
    h: 'À propos de la carte InfoVisa Live',
    p1: "InfoVisa Live est une carte du monde mise à jour en continu : niveau de risque de chaque pays (conseils aux voyageurs), séismes M4.5+ des 7 derniers jours (USGS), événements naturels en cours (NASA EONET), météo locale et actualités géopolitiques issues de la presse francophone et internationale. Les pays à éviter et ceux à surveiller sont repérés d'un coup d'œil avant de voyager.",
    p2: "Écoutez les radios d'information en direct (France Info, RFI, RTL Lëtzebuerg, L'Essentiel Radio…) ou regardez les chaînes d'info gratuites (France 24, Euronews, franceinfo, RTL Télé Lëtzebuerg). Besoin d'un visa ? Consultez nos guides indépendants :",
    links: [['Types de visa Schengen','/fr/types-de-visa.html'],['Pays Schengen','/fr/pays-schengen.html'],['ETIAS 2026','/fr/etias.html'],['Frais et coûts','/fr/frais-et-couts.html'],['FAQ visa','/fr/faq.html']] },
  en: { h1: 'InfoVisa Live: the world in real time', lead: 'Country travel risk, earthquakes, weather, geopolitical news, live radio and news TV — plus the Schengen visa guide.',
    h: 'About the InfoVisa Live map',
    p1: 'InfoVisa Live is a continuously updated world map: travel risk level for every country (travel advisories), M4.5+ earthquakes from the last 7 days (USGS), ongoing natural events (NASA EONET), local weather and geopolitical headlines from international press. Spot the countries to avoid and the ones to watch at a glance before you travel.',
    p2: 'Listen to live news radio (BBC World Service, NPR, RFI, Deutschlandfunk…) or watch free news channels (France 24, DW, Euronews). Need a visa? Read our independent guides:',
    links: [['Schengen visa types','/en/visa-types.html'],['Schengen countries','/en/schengen-countries.html'],['ETIAS 2026','/en/etias.html'],['Fees and costs','/en/fees-and-costs.html'],['Visa FAQ','/en/faq.html']] },
  de: { h1: 'InfoVisa Live: die Welt in Echtzeit', lead: 'Reiserisiko pro Land, Erdbeben, Wetter, Geopolitik-News, Live-Radio und Nachrichten-TV — plus der Schengen-Visum-Ratgeber.',
    h: 'Über die InfoVisa-Live-Karte',
    p1: 'InfoVisa Live ist eine laufend aktualisierte Weltkarte: Reiserisiko jedes Landes (Reisehinweise), Erdbeben ab M4,5 der letzten 7 Tage (USGS), aktuelle Naturereignisse (NASA EONET), lokales Wetter und geopolitische Schlagzeilen aus deutsch- und internationalsprachiger Presse. So erkennen Sie vor der Reise auf einen Blick, welche Länder Sie meiden sollten.',
    p2: 'Hören Sie Nachrichtenradio live (Deutschlandfunk, BR24, BBC World Service…) oder sehen Sie kostenlose Nachrichtensender (DW, Euronews, France 24). Visum nötig? Unsere unabhängigen Ratgeber:',
    links: [['Schengen-Visumarten','/de/visa-arten.html'],['Schengen-Länder','/de/schengen-laender.html'],['ETIAS 2026','/de/etias.html'],['Gebühren und Kosten','/de/gebuehren-und-kosten.html'],['Visum-FAQ','/de/faq.html']] },
  es: { h1: 'InfoVisa Live: el mundo en directo', lead: 'Riesgo por país, terremotos, tiempo, noticias geopolíticas, radio y TV de noticias en vivo — y la guía del visado Schengen.',
    h: 'Sobre el mapa InfoVisa Live',
    p1: 'InfoVisa Live es un mapa del mundo actualizado de forma continua: nivel de riesgo de cada país (avisos de viaje), terremotos M4,5+ de los últimos 7 días (USGS), eventos naturales en curso (NASA EONET), tiempo local y titulares geopolíticos de la prensa en español e internacional. Identifica de un vistazo los países que conviene evitar antes de viajar.',
    p2: 'Escucha radios de noticias en directo (RNE, BBC World Service, RFI…) o mira canales de noticias gratuitos (Euronews, France 24, DW). ¿Necesitas un visado? Consulta nuestras guías independientes:',
    links: [['Tipos de visado Schengen','/es/tipos-de-visado.html'],['Países Schengen','/es/paises-schengen.html'],['ETIAS 2026','/es/etias.html'],['Tasas y costes','/es/tasas-y-costes.html'],['FAQ visado','/es/faq.html']] },
  pt: { h1: 'InfoVisa Live: o mundo em direto', lead: 'Risco por país, sismos, meteorologia, notícias geopolíticas, rádio e TV de notícias em direto — e o guia do visto Schengen.',
    h: 'Sobre o mapa InfoVisa Live',
    p1: 'O InfoVisa Live é um mapa-mundo atualizado continuamente: nível de risco de cada país (avisos de viagem), sismos M4,5+ dos últimos 7 dias (USGS), eventos naturais em curso (NASA EONET), meteorologia local e manchetes geopolíticas da imprensa em português e internacional. Veja num relance os países a evitar antes de viajar.',
    p2: 'Ouça rádios de notícias em direto (BBC World Service, RFI, Deutschlandfunk…) ou veja canais de notícias gratuitos (Euronews, France 24, DW). Precisa de um visto? Consulte os nossos guias independentes:',
    links: [['Tipos de visto Schengen','/pt/tipos-de-visto.html'],['Países Schengen','/pt/paises-schengen.html'],['ETIAS 2026','/pt/etias.html'],['Taxas e custos','/pt/taxas-e-custos.html'],['FAQ visto','/pt/faq.html']] }
};

for (const lang of LANGS) {
  const L = I18N[lang];
  let html = fs.readFileSync('template.html', 'utf8');
  const rep = (k, v) => { if (!html.includes(k)) throw new Error('missing ' + k); html = html.split(k).join(v); };
  const hreflang = LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="https://www.infovisa.lu${I18N[l].path}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="https://www.infovisa.lu/">`;
  const langnav = LANGS.map(l => `<a href="${I18N[l].path}" hreflang="${l}" lang="${l}"${l === lang ? ' class="on" aria-current="page"' : ''}>${l.toUpperCase()}</a>`).join('');
  const K = SEO[lang];
  const ldObj = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': 'https://www.infovisa.lu/#org', name: 'InfoVisa.lu', url: 'https://www.infovisa.lu/', logo: 'https://www.infovisa.lu/assets/favicon.svg' },
    { '@type': 'WebSite', '@id': 'https://www.infovisa.lu/#site', url: 'https://www.infovisa.lu/', name: 'InfoVisa.lu', inLanguage: lang, publisher: { '@id': 'https://www.infovisa.lu/#org' } },
    { '@type': 'WebApplication', name: L.title, url: 'https://www.infovisa.lu' + L.path, description: L.desc, inLanguage: lang, applicationCategory: 'TravelApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, publisher: { '@id': 'https://www.infovisa.lu/#org' } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'InfoVisa.lu', item: 'https://www.infovisa.lu/' }, { '@type': 'ListItem', position: 2, name: L.title, item: 'https://www.infovisa.lu' + L.path }] }
  ] };
  const ld = '<script type="application/ld+json">' + JSON.stringify(ldObj).replace(/</g, '\\u003c') + '</script>';
  const seoBlock = '<section class="seo"><div class="card"><h2>' + esc(K.h) + '</h2><div class="pad"><p>' + esc(K.p1) + '</p><p>' + esc(K.p2) + '</p><p class="seol">' + K.links.map(l => '<a href="' + l[1] + '">' + esc(l[0]) + '</a>').join(' · ') + '</p></div></div></section>';
  const designWords={"fr": ["Météo & vents", "Sports nautiques & océan", "Radio & TV", "PAN · archives", "Fermer"], "en": ["Weather & wind", "Water sports & ocean", "Radio & TV", "UAP · archives", "Close"], "de": ["Wetter & Wind", "Wassersport & Ozean", "Radio & TV", "UAP · Archiv", "Schließen"], "es": ["Tiempo y viento", "Deportes acuáticos y océano", "Radio y TV", "FANI · archivo", "Cerrar"], "pt": ["Tempo e vento", "Desportos náuticos e oceano", "Rádio e TV", "FANI · arquivo", "Fechar"]};
  const [designWeather,designMarine,designMedia,designUap,designClose]=designWords[lang];
  const [designCrypto,designStocks,designWebcams,designLocal,designHealth]={fr:['Crypto','Bourse','Webcams live','Monde local','Pandémies & virus'],en:['Crypto','Stocks','Live webcams','Local world','Outbreaks & viruses'],de:['Krypto','Börse','Live-Webcams','Lokal','Ausbrüche & Viren'],es:['Cripto','Bolsa','Cámaras en directo','Mundo local','Brotes y virus'],pt:['Cripto','Bolsa','Webcams ao vivo','Mundo local','Surtos e vírus']}[lang];
  const designTraffic={fr:"TRAFIC mondial",en:"World traffic",de:"Verkehr weltweit",es:"Tráfico mundial",pt:"Trânsito mundial"}[lang];
  const [designLight,designDarkMode]={fr:["Clair","Mode sombre"],en:["Light","Dark mode"],de:["Hell","Dunkler Modus"],es:["Claro","Modo oscuro"],pt:["Claro","Modo escuro"]}[lang];
  const html_tokens = {designLight,designDarkMode,designTraffic,assetVersion,designCrypto,designStocks,designWebcams,designLocal,designHealth, designWeather,designMarine,designMedia,designUap,designClose, mk_tabWorld: esc(MKI[lang].tabWorld), mk_tabMkt: esc(MKI[lang].tabMkt), lang, hreflang, langnav, ld, seoBlock, h1: esc(K.h1), lead: esc(K.lead) };
  html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (k in html_tokens) return html_tokens[k];
    if (!(k in L)) throw new Error(`${lang}: missing key ${k}`);
    return esc(L[k]);
  });
  const S = Object.assign({}, L, { lang });
  delete S.cities;
  rep('/*__APPEARANCE__*/',fs.readFileSync('design/appearance.js','utf8'));
  rep('/*__D3__*/', D3);
  rep('/*__TOPOJSON__*/', TOPOJS);
  rep('/*__MARKETS__*/', MKJS.replace('/*__MK__*/', () => safe(JSON.stringify(MKI[lang]))));
  rep('/*__TOPO__*/', TOPOSTR);
  rep('/*__COUNTRIES__*/', safe(JSON.stringify(countriesFor(lang))));
  rep('/*__RISK__*/', JSON.stringify(risk));
  rep('/*__REASONS__*/', JSON.stringify(reasons));
  rep('/*__S__*/', safe(JSON.stringify(S)));
  rep('/*__CITIES__*/', JSON.stringify(CITY.map(c => [L.cities === 'en' ? c[1] : c[0], c[2], c[3]])));
  rep('/*__RISKDATE__*/', RISKDATE);
  const file = `out${L.path}index.html`;
  fs.mkdirSync(require('path').dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log('written', file, (html.length / 1024).toFixed(0) + ' KB');
}
