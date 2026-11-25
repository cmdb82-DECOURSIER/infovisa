const normalize=value=>String(value||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[’']/g,' ');
const escape=value=>value.replace(/[.*+?^$\x7b\x7d()|[\]\\]/g,'\\$&');
const aliases={
 USA:['etats unis','etats-unis','washington','new york','los angeles'],
 GBR:['royaume uni','royaume-uni','grande bretagne','londres'],
 CHN:['chine','pekin','beijing','shenzhen','shanghai'],
 RUS:['russie','moscou'],UKR:['ukraine','kyiv','kiev'],
 ISR:['israel','tel aviv','tel-aviv'],PSE:['palestine','gaza','cisjordanie'],
 IRN:['iran','teheran'],LBN:['liban','beyrouth'],SYR:['syrie','damas'],
 FRA:['france','paris'],DEU:['allemagne','berlin'],BEL:['belgique','bruxelles'],
 JPN:['japon','tokyo'],KOR:['coree du sud','seoul'],PRK:['coree du nord','pyongyang'],
 COD:['republique democratique du congo','congo kinshasa','congo-kinshasa','rdc'],
 COG:['republique du congo','congo brazzaville','congo-brazzaville'],
 ZAF:['afrique du sud'],CAF:['republique centrafricaine'],SSD:['soudan du sud'],
 ARE:['emirats arabes unis'],SAU:['arabie saoudite'],
 TWN:['taiwan'],CIV:['cote d ivoire'],SWZ:['eswatini'],
 KOS:['kosovo'],TLS:['timor oriental','timor-leste']
};
export function classifyAlert(item,{now=Date.now(),live=true}={}){
 if(!live)return null;
 const published=Date.parse(item.publishedAt||'');
 if(!Number.isFinite(published)||published>now+300000)return null;
 const title=normalize(item.title).replace(/^[\s🔴⚡🚨]+/u,'');
 const explicit=item.alertKind;
 const kind=explicit==='breaking'||/^(?:\[\s*)?(?:urgent|urgente|breaking(?: news)?|derniere minute|ultima hora|eilmeldung|alerte)(?:\s*\])?\s*[:,—–-]/.test(title)?'breaking':
 explicit==='live'||/^(?:\[\s*)?(?:en direct|live(?:blog)?|direct|direto|em direto|en directo)(?:\s*\])?\s*[:,—–-]/.test(title)?'live':null;
 if(!kind||now-published>(kind==='breaking'?3:6)*3600000)return null;
 return kind;
}
export function countriesInHeadline(title,countries){
 let remaining=' '+normalize(title)+' ';
 const available=new Set(countries.map(c=>c.iso)),terms=[];
 for(const c of countries){
  const names=[c.name,...(c.names||[]),...(aliases[c.iso]||[])].filter(Boolean);
  for(const name of names){const term=normalize(name);if(term.length>=3)terms.push({iso:c.iso,term});}
 }
 terms.sort((a,b)=>b.term.length-a.term.length);
 const found=new Set();
 for(const {iso,term} of terms){
  if(!available.has(iso))continue;
  const regex=new RegExp('(^|[^a-z0-9])'+escape(term)+'(?=$|[^a-z0-9])','g');
  if(regex.test(remaining)){found.add(iso);regex.lastIndex=0;remaining=remaining.replace(regex,' ');}
 }
 return [...found];
}
export function getNewsAlerts(items,countries,options={}){
 return items.flatMap(item=>{const kind=classifyAlert(item,options);if(!kind)return [];const mentions=countriesInHeadline(item.title,countries);const countryIsos=mentions.length?mentions:countries.some(c=>c.iso===item.countryIso)?[item.countryIso]:[];return [{...item,kind,countryIsos,locationBasis:mentions.length?'headline':item.countryIso?'national-feed':null}];});
}


export function getRecentNews(items,countries,{now=Date.now()}={}){
 return items.flatMap(item=>{const published=Date.parse(item.publishedAt||'');if(!Number.isFinite(published)||published>now+300000||now-published>86400000)return [];const countryIsos=countriesInHeadline(item.title,countries);if(!countryIsos.length)return [];return [{...item,kind:classifyAlert(item,{now})||'recent',countryIsos}];});
}

// Publisher provenance comes from the dedicated server endpoint, not a headline.
export function getMapAlerts(payload,countries,{now=Date.now(),windowMinutes=60}={}){
 const maxAge=(windowMinutes===1440?1440:60)*60000;
 const checked=Date.parse(payload?.checkedAt||'');
 if(!Number.isFinite(checked)||checked>now+120000||now-checked>300000)return [];
 return (Array.isArray(payload.items)?payload.items:[]).filter(item=>item&&typeof item==='object').flatMap(item=>{
  const published=Date.parse(item.publishedAt||''),verified=Date.parse(item.verifiedAt||'');
  if(item.verification!=='publisher-feed'||!item.sourceId||!item.source||!Number.isFinite(published)||published>now||now-published>maxAge||!Number.isFinite(verified)||verified>now+120000||now-verified>300000)return [];
  try{for(const value of [item.url,item.sourceUrl]){const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)return [];}}catch{return [];}
  return [{...item,kind:classifyAlert(item,{now})||'recent',countryIsos:countriesInHeadline(item.title,countries)}];
 });
}
