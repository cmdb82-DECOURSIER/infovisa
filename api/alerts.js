// Recent headlines from identified publishers' own RSS feeds. This verifies
// provenance, article URL and publication time; it is not automated fact-checking.
const publishers = {
  france24: {name:'France 24',site:'https://www.france24.com/',hosts:['france24.com']},
  rfi: {name:'RFI',site:'https://www.rfi.fr/',hosts:['rfi.fr']},
  lemonde: {name:'Le Monde',site:'https://www.lemonde.fr/',hosts:['lemonde.fr']},
  bbc: {name:'BBC News',site:'https://www.bbc.com/news',hosts:['bbc.com','bbc.co.uk']},
  dw: {name:'DW',site:'https://www.dw.com/',hosts:['dw.com']},
  elpais: {name:'El País',site:'https://elpais.com/',hosts:['elpais.com']},
};
const feeds = {
  fr:[['france24','https://www.france24.com/fr/rss'],['rfi','https://www.rfi.fr/fr/rss'],['lemonde','https://www.lemonde.fr/international/rss_full.xml']],
  en:[['france24','https://www.france24.com/en/rss']],
  de:[['dw','https://rss.dw.com/rdf/rss-de-all']],
  es:[['france24','https://www.france24.com/es/rss'],['dw','https://rss.dw.com/rdf/rss-sp-all'],['elpais','https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada']],
  pt:[['rfi','https://www.rfi.fr/pt/rss']],
};
const international=[['bbc','https://feeds.bbci.co.uk/news/world/rss.xml'],['dw','https://rss.dw.com/rdf/rss-en-world']];
const matchesHost=(host,allowed)=>allowed.some(base=>host===base||host.endsWith('.'+base));
const decode=s=>s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]*>/g,'').replace(/&(?:amp|lt|gt|quot|apos);|&#(?:x[\da-f]+|\d+);/gi,entity=>{
  const named={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'"};
  if(named[entity])return named[entity];const n=entity[2].toLowerCase()==='x'?parseInt(entity.slice(3,-1),16):parseInt(entity.slice(2,-1),10);return Number.isInteger(n)&&n>0&&n<=0x10ffff?String.fromCodePoint(n):'';
}).trim();
const tag=(s,name)=>{const m=s.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+name+'>','i'));return m?decode(m[1]):'';};
function parseFeed(xml,id,now){
  const publisher=publishers[id],items=[];
  for(const match of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)){
    const block=match[1],title=tag(block,'title').replace(/<[^>]*>/g,'').slice(0,600),published=Date.parse(tag(block,'pubDate')||tag(block,'dc:date'));
    if(!title||!Number.isFinite(published)||published>now||now-published>3600000)continue;
    let url;try{url=new URL(tag(block,'link'));if(url.protocol!=='https:'||url.username||url.password||!matchesHost(url.hostname,publisher.hosts))continue;}catch{continue;}
    items.push({title,url:url.href,source:publisher.name,sourceId:id,sourceUrl:publisher.site,publishedAt:new Date(published).toISOString(),verifiedAt:new Date(now).toISOString(),verification:'publisher-feed'});
  }
  return items;
}
module.exports=async(req,res)=>{
  if(req.method&&req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'method_not_allowed'});}
  const lang=Object.hasOwn(feeds,req.query?.lang)?req.query.lang:'fr',selected=[...feeds[lang],...international];
  const results=await Promise.allSettled(selected.map(async([id,url])=>{
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6500);
    try{
      const response=await fetch(url,{signal:controller.signal,headers:{'User-Agent':'InfoVisa/1.0 (+https://www.infovisa.lu)','Accept':'application/rss+xml, application/xml, text/xml'}});
      // A feed redirected to a different host cannot establish provenance.
      if(!response.ok||new URL(response.url||url).hostname!==new URL(url).hostname)throw Error('feed_unavailable');
      const xml=await response.text();if(xml.length>1500000||!/<(?:rss|rdf:RDF)\b/i.test(xml))throw Error('invalid_feed');
      return parseFeed(xml,id,Date.now());
    }finally{clearTimeout(timer);}
  }));
  const sourceStatus=results.map((r,i)=>({source:publishers[selected[i][0]].name,available:r.status==='fulfilled',recentItems:r.status==='fulfilled'?r.value.length:0}));
  if(results.every(r=>r.status==='rejected')){res.setHeader('Cache-Control','s-maxage=15');return res.status(502).json({items:[],error:'alerts_unavailable',checkedAt:new Date().toISOString(),sourceStatus});}
  const seen=new Set(),items=results.flatMap(r=>r.status==='fulfilled'?r.value:[]).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).filter(item=>{const key=item.url.split('#')[0];if(seen.has(key))return false;seen.add(key);return true;}).slice(0,80);
  res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=60');
  return res.status(200).json({items,checkedAt:new Date().toISOString(),windowMinutes:60,sourceStatus});
};
