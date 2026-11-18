// Fonction serveur Vercel : actualités mondiales en direct.
// GET /api/news?q=<recherche>&lang=fr|en|de|es|pt  ->  { items: [{ title, url, source, date }] }
// Sans q : à la une internationale. Avec q : articles qui mentionnent la recherche.
//
// Sources interrogées en parallèle (Google Actualités + flux RSS de médias internationaux) :
// si l'une d'elles bloque le serveur, les autres prennent le relais. Cache CDN : 10 min.

const LOCALE = {
  fr: 'hl=fr&gl=FR&ceid=FR:fr',
  en: 'hl=en-GB&gl=GB&ceid=GB:en',
  de: 'hl=de&gl=DE&ceid=DE:de',
  es: 'hl=es&gl=ES&ceid=ES:es',
  pt: 'hl=pt-PT&gl=PT&ceid=PT:pt-150',
};

// Flux de médias par langue : [nom affiché, URL du flux RSS].
const FEEDS = {
  fr: [
    ['France 24', 'https://www.france24.com/fr/rss'],
    ['RFI', 'https://www.rfi.fr/fr/rss'],
    ['Le Monde', 'https://www.lemonde.fr/international/rss_full.xml'],
  ],
  en: [
    ['BBC News', 'https://feeds.bbci.co.uk/news/world/rss.xml'],
    ['Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml'],
    ['France 24', 'https://www.france24.com/en/rss'],
    ['DW', 'https://rss.dw.com/rdf/rss-en-world'],
  ],
  de: [
    ['DW', 'https://rss.dw.com/rdf/rss-de-all'],
  ],
  es: [
    ['France 24', 'https://www.france24.com/es/rss'],
    ['DW', 'https://rss.dw.com/rdf/rss-sp-all'],
    ['El País', 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada'],
  ],
  pt: [
    ['RFI', 'https://www.rfi.fr/pt/rss'],
  ],
};

const UA = 'Mozilla/5.0 (compatible; InfoVisa.lu news widget; +https://www.infovisa.lu)';

const decode = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
    .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : '';
};

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

async function fetchXml(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 7000);
  try {
    const r = await fetch(url, { signal: ac.signal, redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml, */*' } });
    if (!r.ok) throw new Error('upstream ' + r.status);
    return await r.text();
  } finally {
    clearTimeout(t);
  }
}

// Extrait les articles d'un flux RSS (<item>) ou RDF (<item rdf:about>).
function parseItems(xml, fallbackSource) {
  const items = [];
  for (const m of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/g)) {
    const b = m[1];
    const source = tag(b, 'source') || fallbackSource;
    let title = tag(b, 'title');
    if (source && title.endsWith(' - ' + source)) title = title.slice(0, -(source.length + 3));
    let url = tag(b, 'link');
    if (!url) {
      const g = b.match(/<guid[^>]*>([^<]+)<\/guid>/);
      url = g ? decode(g[1]) : '';
    }
    const date = Date.parse(tag(b, 'pubDate') || tag(b, 'dc:date') || tag(b, 'published') || tag(b, 'updated')) || null;
    if (!title || !/^https?:\/\//i.test(url)) continue;
    items.push({ title, url, source, date });
  }
  return items;
}

module.exports = async (req, res) => {
  const lang = Object.prototype.hasOwnProperty.call(LOCALE, req.query.lang) ? req.query.lang : 'fr';
  const q = req.query.q ? String(req.query.q).replace(/["“”]/g, '').trim().slice(0, 300) : '';
  const gnUrl = q
    ? `https://news.google.com/rss/search?q=${encodeURIComponent(q + ' when:2d')}&${LOCALE[lang]}`
    : `https://news.google.com/rss/headlines/section/topic/WORLD?${LOCALE[lang]}`;

  const jobs = [
    fetchXml(gnUrl).then((x) => parseItems(x, 'Google Actualités')),
    ...(FEEDS[lang] || []).map(([name, url]) => fetchXml(url).then((x) => parseItems(x, name))),
  ];
  const results = await Promise.allSettled(jobs);

  const failed = results.filter((r) => r.status === 'rejected').map((r) => String(r.reason && r.reason.message || r.reason));
  if (failed.length) console.warn('news: sources en échec', lang, failed.join(' | '));

  let all = [];
  for (const r of results) if (r.status === 'fulfilled') all = all.concat(r.value);

  // Avec une recherche, les flux de médias (non filtrés) sont réduits aux articles qui la mentionnent.
  if (q) {
    const needle = norm(q);
    const gn = results[0].status === 'fulfilled' ? new Set(results[0].value) : new Set();
    all = all.filter((a) => gn.has(a) || norm(a.title).includes(needle));
  }

  const items = [];
  const seen = new Set();
  const week = Date.now() - 7 * 864e5;
  for (const a of all) {
    if (a.date && a.date < week) continue;
    const key = norm(a.title).replace(/[^a-z0-9]+/g, ' ').slice(0, 60);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    items.push(a);
  }
  items.sort((a, b) => (b.date || 0) - (a.date || 0));

  if (!items.length && failed.length === results.length) {
    res.setHeader('Cache-Control', 's-maxage=60');
    return res.status(502).json({ items: [], error: 'news_unavailable' });
  }
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800');
  res.status(200).json({ items: items.slice(0, 30) });
};
