import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),handler=require('../../../api/alerts.js');
function response(){return {headers:{},code:200,setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(data){this.data=data;return this;}};}
test('alerts require a recent dated article on the identified publisher domain, even if the feed claims another source',async()=>{
 const original=globalThis.fetch,now=Date.now(),item=(title,url,age=60000,date=true)=>`<item><title>${title}</title><link>${url}</link><source>Untrusted name</source>${date?`<pubDate>${new Date(now-age).toUTCString()}</pubDate>`:''}</item>`;
 globalThis.fetch=async url=>{if(!url.includes('france24'))throw Error('unavailable');return new Response('<rss><channel>'+[
  item('URGENT: France annonce une décision','https://www.france24.com/fr/france/123'),
  item('Old France story','https://www.france24.com/fr/old',3601000),
  item('Future France story','https://www.france24.com/fr/future',-60000),
  item('Undated France story','https://www.france24.com/fr/undated',60000,false),
  item('Fake host','https://france24.com.evil.example/'),
  item('Unsafe scheme','javascript:alert(1)'),
  item('Credentials','https://user:password@www.france24.com/fr/no'),
 ].join('')+'</channel></rss>');};
 try{const res=response();await handler({method:'GET',query:{lang:'fr'}},res);assert.equal(res.code,200);assert.equal(res.data.items.length,1);assert.equal(res.data.items[0].source,'France 24');assert.equal(res.data.items[0].verification,'publisher-feed');assert.ok(res.data.items[0].verifiedAt);assert.ok(res.data.sourceStatus.some(s=>!s.available));assert.equal(res.data.windowMinutes,60);assert.match(res.headers['Cache-Control'],/s-maxage=60/);}finally{globalThis.fetch=original;}
});
test('all failed sources are distinct from a valid feed without recent headlines; unsupported methods never fetch',async()=>{
 const original=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;throw Error('offline');};
 try{let res=response();await handler({method:'POST',query:{}},res);assert.equal(res.code,405);assert.equal(calls,0);res=response();await handler({method:'GET',query:{}},res);assert.equal(res.code,502);assert.equal(res.data.items.length,0);globalThis.fetch=async()=>new Response('<rss><channel/></rss>');res=response();await handler({method:'GET',query:{}},res);assert.equal(res.code,200);assert.equal(res.data.items.length,0);}finally{globalThis.fetch=original;}
});
test('map can request dated reports from the last 24 hours while the default breaking feed stays one hour',async()=>{
 const original=globalThis.fetch,now=Date.now(),entry=(name,hours)=>`<item><title>France ${name}</title><link>https://www.france24.com/fr/${name}</link><pubDate>${new Date(now-hours*3600000).toUTCString()}</pubDate></item>`;
 globalThis.fetch=async url=>{if(!url.includes('france24'))throw Error('unavailable');return new Response('<rss><channel>'+entry('recent',.5)+entry('today',12)+entry('expired',25)+'</channel></rss>');};
 try{let res=response();await handler({method:'GET',query:{lang:'fr',window:'24h'}},res);assert.equal(res.data.windowMinutes,1440);assert.equal(res.data.items.length,2);res=response();await handler({method:'GET',query:{lang:'fr'}},res);assert.equal(res.data.windowMinutes,60);assert.equal(res.data.items.length,1);res=response();await handler({method:'GET',query:{lang:'fr',window:'unbounded'}},res);assert.equal(res.data.windowMinutes,60);assert.equal(res.data.items.length,1);}finally{globalThis.fetch=original;}
});
