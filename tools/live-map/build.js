const fs = require('fs');
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

const REG = { Africa: "Afrique", Americas: "Amériques", Asia: "Asie", Europe: "Europe", Oceania: "Océanie", Antarctic: "Antarctique" };
const SUB = { "Western Europe": "Europe de l'Ouest", "Eastern Europe": "Europe de l'Est", "Northern Europe": "Europe du Nord", "Southern Europe": "Europe du Sud", "Southeast Europe": "Europe du Sud-Est", "Central Europe": "Europe centrale", "Western Asia": "Asie de l'Ouest", "Southern Asia": "Asie du Sud", "South-Eastern Asia": "Asie du Sud-Est", "Eastern Asia": "Asie de l'Est", "Central Asia": "Asie centrale", "Northern Africa": "Afrique du Nord", "Western Africa": "Afrique de l'Ouest", "Eastern Africa": "Afrique de l'Est", "Middle Africa": "Afrique centrale", "Southern Africa": "Afrique australe", "North America": "Amérique du Nord", "South America": "Amérique du Sud", "Central America": "Amérique centrale", "Caribbean": "Caraïbes", "Australia and New Zealand": "Australie et Nouvelle-Zélande", "Melanesia": "Mélanésie", "Micronesia": "Micronésie", "Polynesia": "Polynésie" };
const countries = wc.map(c => {
  const cur = Object.entries(c.currencies || {})[0];
  const idd = c.idd && c.idd.root ? c.idd.root + (c.idd.suffixes && c.idd.suffixes.length === 1 ? c.idd.suffixes[0] : '') : '';
  return { n: c.ccn3 || '', a3: c.cca3, a2: c.cca2, fr: (c.translations.fra && c.translations.fra.common) || c.name.common, en: c.name.common, cap: (c.capital || [])[0] || '', reg: REG[c.region] || c.region || '', sub: SUB[c.subregion] || '', cur: cur ? `${cur[0]}${cur[1].symbol ? ' (' + cur[1].symbol + ')' : ''}` : '', idd, ll: (c.latlng || [0, 0]).map(x => Math.round(x * 100) / 100) };
});
const ids = new Set(countries.map(c => c.n));
const noMatch = topo.objects.countries.geometries.filter(g => !ids.has(g.id)).map(g => g.properties.name);
console.log('map features without country record:', noMatch);

const safe = s => s.split('</script').join('<\\/script');
let html = fs.readFileSync('template.html', 'utf8');
const rep = (k, v) => { if (!html.includes(k)) throw new Error('missing ' + k); html = html.split(k).join(v); };
rep('/*__D3__*/', safe(fs.readFileSync('node_modules/d3/dist/d3.min.js', 'utf8')));
rep('/*__TOPOJSON__*/', safe(fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js', 'utf8')));
rep('/*__TOPO__*/', safe(JSON.stringify(topo)));
rep('/*__COUNTRIES__*/', safe(JSON.stringify(countries)));
rep('/*__RISK__*/', JSON.stringify(risk));
rep('/*__REASONS__*/', JSON.stringify(reasons));
rep('/*__RISKDATE__*/', '2026-11-13');
fs.mkdirSync('out', { recursive: true });
fs.writeFileSync('out/infovisa-live.html', html);
console.log('written', (html.length / 1024).toFixed(0) + ' KB');
