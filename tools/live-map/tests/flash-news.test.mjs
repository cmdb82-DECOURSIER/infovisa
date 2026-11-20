import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import fs from 'node:fs/promises';
import {mountMapNews} from '../design/map-news.js';
import {mountFlashNews} from '../design/flash-news.js';
const tick=()=>new Promise(setImmediate);
const countries=[{iso:'FRA',name:'France'},{iso:'USA',name:'États-Unis'}];
const article=(title,minutes=1)=>({title,url:'https://www.france24.com/fr/'+minutes,source:'France 24',sourceId:'france24',sourceUrl:'https://www.france24.com/',verification:'publisher-feed',publishedAt:new Date(Date.now()-minutes*60000).toISOString(),verifiedAt:new Date().toISOString()});
test('carousel follows the same recent publisher reports as map points, keeps focus, and removes expired or failed reports',async()=>{
 const dom=new JSDOM('<html lang="fr"><body><section id="map-news-carousel"></section><div id="map-alert-status"></div><script id="world-news-data" type="application/json">'+JSON.stringify({countries})+'</script></body></html>',{url:'https://infovisa.test/',pretendToBeVisual:true});
 const originalFetch=globalThis.fetch;globalThis.document=dom.window.document;globalThis.CustomEvent=dom.window.CustomEvent;
 let payload={checkedAt:new Date().toISOString(),items:[article('France : décision récente',1),article('URGENT : France annonce <script>bad()</script>',5),article('EN DIRECT : États-Unis, une déclaration',3)],sourceStatus:[{source:'France 24',available:true}]};
 globalThis.fetch=async()=>new Response(JSON.stringify(payload));let markers=[];document.addEventListener('infovisa:news-markers',e=>markers=e.detail);
 const api=mountMapNews(()=>{});
 try{await tick();const cards=[...document.querySelectorAll('.iv-flash-card')];assert.equal(cards.length,3);assert.equal(cards[0].dataset.kind,'breaking');assert.equal(cards[1].dataset.kind,'live');assert.equal(cards[2].dataset.kind,'recent');assert.equal(document.querySelectorAll('.iv-flash-card script').length,0);assert.equal(markers.find(m=>m.iso==='FRA').kind,'breaking');assert.equal(markers.find(m=>m.iso==='USA').kind,'live');assert.equal(document.querySelectorAll('time[datetime]').length,3);assert.match(cards[0].textContent,/France 24/);assert.match(cards[0].querySelector('.iv-flash-location').textContent,/France/);
  const link=cards[0].querySelector('h3 a');link.focus();await api.refresh();assert.equal(document.querySelector('.iv-flash-card'),cards[0]);assert.equal(document.activeElement,link);
  payload={...payload,items:[...payload.items,article('France : une information supplémentaire',2)]};await api.refresh();assert.equal(document.activeElement.href,link.href,'A new title does not lose the reader’s focused article');
  payload={...payload,items:payload.items.map(a=>({...a,publishedAt:new Date(Date.now()-3700000).toISOString()}))};await api.refresh();assert.equal(document.querySelectorAll('.iv-flash-card').length,0);assert.equal(markers.length,0);assert.match(document.querySelector('.iv-flash-empty').textContent,/Aucun titre/);assert.equal(document.activeElement.id,'flash-track');
  globalThis.fetch=async()=>{throw Error('offline');};await api.refresh();assert.equal(document.querySelectorAll('.iv-flash-card').length,0);assert.equal(document.querySelector('[data-flash-connection]').hidden,false);assert.match(document.querySelector('.iv-flash-empty').textContent,/indisponible/);
 }finally{api.destroy();globalThis.fetch=originalFetch;dom.window.close();}
});
test('carousel supports previous/next, keyboard navigation and reduced motion in all five page languages',()=>{
 for(const lang of ['fr','en','de','es','pt']){const dom=new JSDOM(`<html lang="${lang}"><body><section></section></body></html>`,{url:'https://infovisa.test/',pretendToBeVisual:true}),root=dom.window.document.querySelector('section'),api=mountFlashNews(root);try{
  api.update({items:[{...article('France : test'),kind:'recent',countryIsos:['FRA']}],countries,loaded:true,failed:false,checkedAt:new Date().toISOString()});assert.doesNotMatch(root.textContent,/undefined/);
  const track=root.querySelector('.iv-flash-track'),left=root.querySelector('[data-flash-step="-1"]'),right=root.querySelector('[data-flash-step="1"]');Object.defineProperty(track,'clientWidth',{value:320});Object.defineProperty(track,'scrollWidth',{value:960});let moved;track.scrollBy=options=>moved=options;track.scrollTo=options=>moved=options;dom.window.matchMedia=()=>({matches:true});track.dispatchEvent(new dom.window.Event('scroll'));assert.equal(left.disabled,true);assert.equal(right.disabled,false);right.click();assert.equal(moved.behavior,'auto');assert.ok(moved.left>0);track.scrollLeft=640;track.dispatchEvent(new dom.window.Event('scroll'));assert.equal(left.disabled,false);assert.equal(right.disabled,true);left.click();assert.ok(moved.left<0);track.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Home',bubbles:true}));assert.equal(moved.left,0);track.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'End',bubbles:true}));assert.equal(moved.left,960);
 }finally{api.destroy();dom.window.close();}}
});
test('world layout places latest news directly beneath a full-width map and country details open on demand',async()=>{
 const source=await fs.readFile(new URL('../template.html',import.meta.url),'utf8'),dom=new JSDOM(source),doc=dom.window.document;
 try{assert.equal(doc.querySelector('main').className,'world-main');assert.equal(doc.querySelector('main>aside'),null);assert.equal(doc.querySelector('.world-map-card').nextElementSibling.id,'map-news-carousel');assert.equal(doc.querySelector('#panel').closest('dialog').id,'country-dialog');assert.doesNotMatch(source,/function overview\(/);assert.match(source,/if\(!countryDialog.open\)countryDialog.showModal\(\)/);
  const fn=source.slice(source.indexOf('function newsPinAppearance('),source.indexOf('function newsPinTransform(')),appearance=new Function(fn+';return newsPinAppearance;')();assert.ok(appearance('breaking').core>appearance('live').core);assert.ok(appearance('live').core>appearance('recent').core);assert.ok(appearance('breaking').halo<=22,'Urgent halo fits within the 44 px hit target');assert.equal(appearance('breaking').symbol,'!');assert.equal(appearance('recent').symbol,'');
 }finally{dom.window.close();}
});
