const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const messages=require('../markets-i18n.js');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('CRO is fetched outside the top list, searchable by Crypto.com and saved as a favourite',async()=>{
 const dom=new JSDOM('<html lang="fr"><body><nav id="vtabs"><button data-v="world"></button><button data-v="mkt" data-market-view="crypto"></button><button data-v="mkt" data-market-view="stocks"></button></nav><div id="vw"></div><div id="vm" hidden></div></body></html>',{url:'https://infovisa.test/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,calls=[];w.scrollTo=()=>{};w.IntersectionObserver=class{observe(){}disconnect(){}};w.WebSocket=class{};w.HTMLElement.prototype.scrollIntoView=()=>{};
 const coin=(id,name,symbol)=>({id,name,symbol,image:'https://coin-images.coingecko.com/test.png',market_cap_rank:id==='bitcoin'?1:99,current_price:1,market_cap:10,total_volume:2,high_24h:1,low_24h:1,ath:1,ath_change_percentage:0,circulating_supply:10,sparkline_in_7d:{price:[1,2]}});
 w.fetch=async input=>{const u=new URL(input);calls.push(u);let data={};if(u.pathname.endsWith('/coins/markets'))data=u.searchParams.has('ids')?[coin('crypto-com-chain','Cronos','cro')]:[coin('bitcoin','Bitcoin','btc')];else if(u.pathname.includes('/market_chart'))data={prices:[[1,1],[2,2]],total_volumes:[]};else if(u.pathname.endsWith('/latest'))data={rates:{USD:1,EUR:1}};else if(u.hostname.includes('frankfurter'))data={rates:{}};return new Response(JSON.stringify(data));};
 try{w.eval(fs.readFileSync(new URL('../markets.js',`file://${__filename}`),'utf8').replace('/*__MK__*/',JSON.stringify(messages.fr)));w.document.querySelector('[data-v="mkt"]').click();for(let n=0;n<6;n++)await tick();
  assert.ok(calls.some(u=>u.searchParams.get('ids')==='crypto-com-chain'));assert.equal(w.document.querySelectorAll('tr[data-id="crypto-com-chain"]').length,1);
  const input=w.document.querySelector('#mkq');input.value='crypto.com';input.dispatchEvent(new w.Event('input'));assert.equal(w.document.querySelectorAll('#mktb tr[data-id]').length,1);assert.match(w.document.querySelector('#mktb').textContent,/Cronos/);
  w.document.querySelector('[data-f="crypto-com-chain"]').click();assert.deepEqual(JSON.parse(w.localStorage.getItem('iv_fav_v1')),['crypto-com-chain']);
  w.document.querySelector('#mkcro').click();assert.equal(w.document.querySelector('#mkq').value,'CRO');assert.match(w.document.querySelector('#mktb').textContent,/Cronos/);
  w.document.querySelector('[data-market-view="stocks"]').click();assert.equal(w.document.querySelector('.mktable').hidden,true);assert.equal(w.document.querySelector('#mkfx').closest('.card').hidden,false);assert.equal(w.document.querySelector('[data-w="cheat"]'),null);assert.equal(w.location.hash,'#stocks');
  w.document.querySelector('[data-market-view="crypto"]').click();assert.equal(w.document.querySelector('.mktable').hidden,false);assert.equal(w.document.querySelector('#mkfx').closest('.card').hidden,true);assert.ok(w.document.querySelector('[data-w="cheat"]'));assert.deepEqual(JSON.parse(w.localStorage.getItem('iv_fav_v1')),['crypto-com-chain']);
  w.document.documentElement.dataset.theme='light';w.document.querySelector('[data-w="chart"]').click();const lightWidget=JSON.parse(w.document.querySelector('#mkw script').textContent);assert.equal(lightWidget.theme,'light');
  w.document.documentElement.dataset.theme='dark';w.document.dispatchEvent(new w.CustomEvent('infovisa:theme-change',{detail:{theme:'dark'}}));const darkWidget=JSON.parse(w.document.querySelector('#mkw script').textContent);assert.equal(darkWidget.theme,'dark');assert.equal(darkWidget.symbol,lightWidget.symbol);assert.deepEqual(JSON.parse(w.localStorage.getItem('iv_fav_v1')),['crypto-com-chain']);
 }finally{dom.window.close();}
});
