// Windy Webcams v3. The API key stays server-side; never put it in static assets.
const ENDPOINT = 'https://api.windy.com/webcams/api/v3/webcams';
const LANGUAGES = new Set(['fr', 'en', 'de', 'es', 'pt']);
function number(value, min, max) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}
function windyURL(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !u.username && !u.password &&
      (u.hostname === 'windy.com' || u.hostname.endsWith('.windy.com')) ? u.href : null;
  } catch { return null; }
}
function distance(a, b, c, d) {
  const rad = Math.PI / 180, x = Math.sin((c-a)*rad/2)**2 + Math.cos(a*rad)*Math.cos(c*rad)*Math.sin((d-b)*rad/2)**2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(x)));
}
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({error:'method_not_allowed'}); }
  const lat = number(req.query?.lat, -85, 85), lon = number(req.query?.lon, -180, 180);
  const radius = number(req.query?.radius ?? '25', 1, 100), lang = LANGUAGES.has(req.query?.lang) ? req.query.lang : 'fr';
  if (lat === null || lon === null || radius === null) return res.status(400).json({error:'invalid_location'});
  const key = process.env.WINDY_WEBCAMS_API_KEY;
  if (!key) return res.status(503).json({error:'webcams_not_configured'});
  const url = new URL(ENDPOINT);
  url.search = new URLSearchParams({nearby:`${lat},${lon},${radius}`,limit:'24',include:'images,location,player,urls',lang}).toString();
  try {
    const upstream = await fetch(url, {headers:{'x-windy-api-key':key},signal:AbortSignal.timeout(10000),redirect:'error'});
    if (!upstream.ok) { console.warn('webcams: provider status',upstream.status); return res.status(upstream.status===429?429:502).json({error:upstream.status===429?'webcams_rate_limited':'webcams_unavailable'}); }
    const data = await upstream.json();
    if (!Array.isArray(data.webcams)) throw Error('Invalid webcam response');
    const cameras = data.webcams.filter(c=>c.status==='active').flatMap(c=>{
      const a = c.location?.latitude, b = c.location?.longitude;
      if (!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a)>90||Math.abs(b)>180) return [];
      const km = distance(lat,lon,a,b), pageUrl = windyURL(c.urls?.detail);
      if (km>radius || !pageUrl) return [];
      const live = windyURL(c.player?.live), day = windyURL(c.player?.day);
      const sizes = c.images?.sizes || {}, current = c.images?.current || {};
      // Keep native image size: Windy forbids enlarging its preview images.
      const size = ['preview','thumbnail','icon'].find(s=>windyURL(current[s]) && Number.isFinite(sizes[s]?.width));
      return [{id:String(c.webcamId),name:String(c.title||c.location?.city||'Webcam'),lat:a,lon:b,distanceKm:Math.round(km*10)/10,
        city:String(c.location?.city||''),country:String(c.location?.country||''),pageUrl,
        imageUrl:size?windyURL(current[size]):null,imageWidth:size?Math.min(800,sizes[size].width):null,
        playerUrl:live||day,kind:live?'live':'timelapse',updatedAt:c.lastUpdatedOn||null}];
    }).sort((a,b)=>a.distanceKm-b.distanceKm).slice(0,12);
    // Expiring image URLs must never be served from an hour-old cache.
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=120');
    return res.status(200).json({provider:'Windy.com',radiusKm:radius,cameras,fetchedAt:new Date().toISOString()});
  } catch { return res.status(502).json({error:'webcams_unavailable'}); }
};
