// Fonction serveur Vercel : actualités en direct via le flux RSS de Google Actualités.
// GET /api/news?q=<recherche>&lang=fr|en  ->  { items: [{ title, url, source, date }] }
// Sans q : rubrique International. Réponse mise en cache 10 min sur le CDN.

const LOCALE = {
  fr: 'hl=fr&gl=FR&ceid=FR:fr',
  en: 'hl=en-US&gl=US&ceid=US:en',
};

const decode = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/g, '&')
    .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : '';
};

module.exports = async (req, res) => {
  const lang = req.query.lang === 'en' ? 'en' : 'fr';
  const q = req.query.q ? String(req.query.q).slice(0, 300) : '';
  // Sans recherche : rubrique « International » de Google Actualités.
  const url = q
    ? `https://news.google.com/rss/search?q=${encodeURIComponent(q + ' when:2d')}&${LOCALE[lang]}`
    : `https://news.google.com/rss/headlines/section/topic/WORLD?${LOCALE[lang]}`;
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 8000);
    const r = await fetch(url, { signal: ac.signal, headers: { 'User-Agent': 'Mozilla/5.0 (InfoVisa.lu news widget)' } });
    clearTimeout(t);
    if (!r.ok) throw new Error('upstream ' + r.status);
    const xml = await r.text();
    const items = [];
    const seen = new Set();
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const b = m[1];
      const source = tag(b, 'source');
      let title = tag(b, 'title');
      if (source && title.endsWith(' - ' + source)) title = title.slice(0, -(source.length + 3));
      const key = title.toLowerCase().slice(0, 70);
      if (!title || seen.has(key)) continue;
      seen.add(key);
      const date = Date.parse(tag(b, 'pubDate')) || null;
      items.push({ title, url: tag(b, 'link'), source, date });
    }
    items.sort((a, b) => (b.date || 0) - (a.date || 0));
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800');
    res.status(200).json({ items: items.slice(0, 20) });
  } catch (e) {
    res.setHeader('Cache-Control', 's-maxage=60');
    res.status(502).json({ items: [], error: 'news_unavailable' });
  }
};
