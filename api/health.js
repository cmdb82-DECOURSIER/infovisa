// Official publication metadata only: no inferred epidemic status or fabricated case totals.
const WHO='https://www.who.int/api/news/diseaseoutbreaknews?$orderby=PublicationDate%20desc&$top=8&$select=Title,PublicationDate,ItemDefaultUrl';
const ECDC='https://www.ecdc.europa.eu/en/taxonomy/term/1505/feed';
function text(s){return String(s||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]*>/g,'').replace(/&#(x[\da-f]+|\d+);/gi,(_,v)=>{const n=v[0].toLowerCase()==='x'?parseInt(v.slice(1),16):+v;return n>0&&n<=0x10ffff?String.fromCodePoint(n):'';}).replace(/&(amp|lt|gt|quot|apos);/g,(_,v)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[v])).trim().slice(0,250);}
function link(raw,host){try{const u=new URL(raw);return u.protocol==='https:'&&(u.hostname===host||u.hostname.endsWith('.'+host))?u.href:null;}catch{return null;}}
async function get(url){const r=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{'User-Agent':'InfoVisa/1.0 official-health-feed'}});if(!r.ok)throw Error('feed_unavailable');return r;}
async function who(){const j=await (await get(WHO)).json();if(!Array.isArray(j.value))throw Error('invalid_feed');return j.value.map(x=>({source:'WHO',title:text(x.Title),date:x.PublicationDate,url:link('https://www.who.int/emergencies/disease-outbreak-news/item/'+String(x.ItemDefaultUrl||'').replace(/^\//,''),'who.int')}));}
async function ecdc(){const xml=await (await get(ECDC)).text();return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/g)].slice(0,8).map(m=>{const part=name=>m[1].match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>'))?.[1]||'';return {source:'ECDC',title:text(part('title')),url:link(text(part('link')),'ecdc.europa.eu'),date:part('pubDate')};});}
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'method_not_allowed'});}
 const names=['WHO','ECDC'],results=await Promise.allSettled([who(),ecdc()]),sources=results.map((r,i)=>({name:names[i],available:r.status==='fulfilled',url:i?'https://www.ecdc.europa.eu/en/communicable-disease-threats-report-CDTR':'https://www.who.int/emergencies/disease-outbreak-news'}));
 const reports=results.flatMap(r=>r.status==='fulfilled'?r.value:[]).filter(x=>x.title&&x.url&&Number.isFinite(Date.parse(x.date))&&Date.parse(x.date)<=Date.now()+86400000).map(x=>({...x,date:new Date(x.date).toISOString()})).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
 if(!sources.some(s=>s.available))return res.status(503).json({error:'official_feeds_unavailable',reports:[],sources});
 res.setHeader('Cache-Control','public, max-age=0, s-maxage=600');return res.status(200).json({reports,sources,fetchedAt:new Date().toISOString()});
};
