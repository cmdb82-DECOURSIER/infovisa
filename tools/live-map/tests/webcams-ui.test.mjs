import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {mountWebcams} from '../design/webcams.js';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('camera lookup follows coordinates, rejects stale city responses and respects media consent',async()=>{
 const dom=new JSDOM('<html lang="en"><body><section id="cameras"></section></body></html>',{url:'https://infovisa.test/',pretendToBeVisual:true});for(const key of ['window','document','AbortController','AbortSignal','MutationObserver'])globalThis[key]=dom.window[key];
 const calls=[];globalThis.fetch=(input)=>{const url=new URL(input,'https://infovisa.test');if(url.pathname.endsWith('webcams.json'))return Promise.resolve(new Response(JSON.stringify({cameras:[{id:'tarifa',name:'Tarifa local camera',lat:36,lon:-5.64,pageUrl:'https://operator.test/tarifa',provider:'Tourism office'}]})));return new Promise(resolve=>calls.push({url,resolve}));};
 const root=document.querySelector('#cameras'),panel=mountWebcams(root),camera=(id,name)=>({id,name,pageUrl:'https://www.windy.com/webcams/'+id,imageUrl:'https://images-webcams.windy.com/'+id+'.jpg',imageWidth:200,playerUrl:'https://webcams.windy.com/webcams/public/embed/player/'+id+'/day',distanceKm:1,kind:'timelapse'});
 try{
  panel.select({name:'Tarifa',lat:36,lon:-5.64});await tick();assert.match(root.querySelector('[data-camera-local]').textContent,/Tarifa local camera/);
  panel.select({name:'Lisbon',lat:38.72,lon:-9.14});assert.equal(calls[1].url.searchParams.get('lat'),'38.72');assert.equal(root.querySelector('[data-camera-local]').textContent,'');
  calls[1].resolve(new Response(JSON.stringify({cameras:[camera('2','Lisbon waterfront')]})));await tick();
  calls[0].resolve(new Response(JSON.stringify({cameras:[camera('1','Old Tarifa response')]})));await tick();assert.match(root.textContent,/Lisbon waterfront/);assert.doesNotMatch(root.textContent,/Old Tarifa response/);
  root.querySelector('[data-camera-play]').click();assert.equal(root.querySelector('iframe'),null,'Third-party player must wait for consent');assert.match(root.querySelector('.km-camera-viewer').textContent,/allow media cookies/);
  window.Cookiebot={consent:{marketing:true}};window.dispatchEvent(new dom.window.Event('CookiebotOnAccept'));assert.match(root.querySelector('iframe').src,/\/2\/day/);
  root.querySelector('[data-camera-select]').click();assert.equal(root.querySelector('[data-camera-count]').textContent,'1/4');panel.select({name:'Tarifa',lat:36,lon:-5.64});calls[2].resolve(new Response(JSON.stringify({cameras:[camera('3','Tarifa shore')]})));await tick();root.querySelector('[data-camera-select]').click();root.querySelector('[data-camera-mosaic]').click();assert.equal(root.querySelectorAll('iframe').length,2);assert.equal(root.querySelector('[data-camera-count]').textContent,'2/4');
  root.querySelector('[data-camera-close]').click();assert.equal(root.querySelector('iframe'),null);
  const select=root.querySelector('[data-camera-radius]');select.value='50';select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));assert.equal(calls[3].url.searchParams.get('radius'),'50');
  calls[3].resolve(new Response(JSON.stringify({cameras:[]})));await tick();assert.match(root.textContent,/No cameras available within this radius/);
 }finally{panel.destroy();dom.window.close();}
});
