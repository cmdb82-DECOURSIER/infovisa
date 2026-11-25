const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
function audit(site=path.resolve(__dirname,'../..')){
 const base='https://www.infovisa.lu',xml=new JSDOM(fs.readFileSync(path.join(site,'sitemap.xml'),'utf8'),{contentType:'text/xml'}).window.document,urls=[...xml.querySelectorAll('loc')].map(n=>n.textContent),redirects=JSON.parse(fs.readFileSync(path.join(site,'vercel.json'),'utf8')).redirects,issues=[],pages=[],titles=new Set();
 function localFile(p){return path.join(site,p,p.endsWith('/')?'index.html':'');}
 function target(p){for(let i=0;i<4;i++){const r=redirects.find(r=>r.source===p);if(!r)return p;p=r.destination;}return p;}
 for(const url of urls){const pathname=new URL(url).pathname,file=localFile(pathname),bad=message=>issues.push({url,message});if(!fs.existsSync(file)){bad('Missing sitemap page');continue;}const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url}),d=dom.window.document,title=d.title,description=d.querySelector('meta[name="description"]')?.content,live=pathname==='/'||/\/live\/$/.test(pathname);
 if(!title||titles.has(title))bad('Missing or duplicate title');titles.add(title);if(!description)bad('Missing description');if(d.querySelectorAll('h1').length!==1)bad('Expected one h1');if(d.querySelectorAll('link[rel="canonical"]').length!==1||d.querySelector('link[rel="canonical"]')?.href!==url)bad('Canonical mismatch');if(target(pathname)!==pathname)bad('Sitemap lists a redirected page');if(/noindex/i.test(d.querySelector('meta[name="robots"]')?.content||''))bad('Unexpected noindex');
 const alternates=[...d.querySelectorAll('link[rel="alternate"][hreflang]')];for(const lang of ['fr','en','de','es','pt','x-default'])if(!alternates.some(a=>a.hreflang===lang))bad('Missing hreflang '+lang);for(const a of alternates)if(!urls.includes(a.href))bad('Hreflang absent from sitemap: '+a.href);
 let schemas=[];for(const n of d.querySelectorAll('script[type="application/ld+json"]')){try{const parsed=JSON.parse(n.textContent);schemas.push(...(parsed['@graph']||[parsed]));}catch{bad('Invalid JSON-LD');}}if(!schemas.length)bad('Missing structured data');
 for(const a of d.querySelectorAll('a[href]')){let u;try{u=new URL(a.getAttribute('href'),url);}catch{continue;}if(u.origin!==base)continue;const p=target(u.pathname);if(!fs.existsSync(localFile(p)))bad('Broken internal link: '+u.pathname);}
 if(!d.querySelector('script[src*="ca-pub-5985516088824403"]'))bad('AdSense missing');if(!d.querySelector('script[data-cbid="ab3c5cb8-e765-471e-9a39-bb8651feca3e"][data-blockingmode="auto"]'))bad('Cookiebot missing');
 if(live){if(d.querySelectorAll('.iv-explore-grid article').length!==11)bad('Missing server-rendered topic descriptions');if(!schemas.some(s=>s['@type']==='WebApplication'&&s.applicationCategory==='ReferenceApplication'))bad('Live app schema is outdated');}
 pages.push({url,title,description,language:d.documentElement.lang,live,topics:live?d.querySelectorAll('[data-live-route]').length:0});dom.window.close();
 }
 return {date:'2026-11-25',pageCount:pages.length,issues,pages};
}
module.exports={audit};if(require.main===module){const report=audit();console.log(JSON.stringify(report,null,2));if(report.issues.length)process.exitCode=1;}
