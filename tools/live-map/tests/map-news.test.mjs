import {test} from 'node:test';import assert from 'node:assert/strict';import {getRecentNews} from '../design/news-alerts.js';
test('country markers include recent reports and reserve urgency for explicit source labels',()=>{const now=Date.parse('2026-11-18T12:00:00Z'),countries=[{iso:'FRA',name:'France',names:['Paris']},{iso:'USA',name:'United States'}],item=(title,hours)=>({title,publishedAt:new Date(now-hours*3600000).toISOString()});const reports=getRecentNews([item('France: a new local report',1),item('EN DIRECT: United States election',2),item('URGENT: France issues a statement',1),item('France: an old story',25),{title:'France: undated report'},item('Unlocated headline',1)],countries,{now});assert.equal(reports.length,3);assert.equal(reports[0].kind,'recent');assert.equal(reports[1].kind,'live');assert.equal(reports[2].kind,'breaking');assert.deepEqual(reports[1].countryIsos,['USA']);});

import {getMapAlerts} from '../design/news-alerts.js';
import {mountMapNews} from '../design/map-news.js';
import {JSDOM} from 'jsdom';
test('map alerts reject undated, expired, future and unverified reports and never infer urgency from the subject',()=>{
 const now=Date.parse('2026-11-19T08:00:00Z'),countries=[{iso:'FRA',name:'France'}],item={title:'France: un événement important',url:'https://www.france24.com/fr/1',source:'France 24',sourceId:'france24',sourceUrl:'https://www.france24.com/',verification:'publisher-feed',publishedAt:new Date(now-60000).toISOString(),verifiedAt:new Date(now).toISOString()};
 const items=[item,{...item,title:'URGENT: France annonce une décision'},{...item,publishedAt:new Date(now-3600001).toISOString()},{...item,publishedAt:new Date(now+1000).toISOString()},{...item,publishedAt:null},{...item,verification:null},{...item,url:'javascript:alert(1)'}];
 const alerts=getMapAlerts({checkedAt:new Date(now).toISOString(),items},countries,{now});assert.equal(alerts.length,2);assert.equal(alerts[0].kind,'recent');assert.equal(alerts[1].kind,'breaking');assert.deepEqual(alerts[0].countryIsos,['FRA']);assert.equal(getMapAlerts({checkedAt:new Date(now-300001).toISOString(),items},countries,{now}).length,0);
});
test('clicking a news marker opens its dated source article; refreshing removes expired map points',async()=>{
 const now=Date.now(),countries=[{iso:'FRA',name:'France'}],item={title:'URGENT: France annonce <script>bad()</script>',url:'https://www.france24.com/fr/123',source:'France 24',sourceId:'france24',sourceUrl:'https://www.france24.com/',verification:'publisher-feed',publishedAt:new Date(now-60000).toISOString(),verifiedAt:new Date(now).toISOString()};
 let payload={checkedAt:new Date(now).toISOString(),items:[item],sourceStatus:[{source:'France 24',available:true}]};
 const dom=new JSDOM('<html lang="fr"><body><div id="layers"><button data-map-layer="news" aria-pressed="true"></button></div><div id="map-alert-status"></div><script id="world-news-data" type="application/json">'+JSON.stringify({countries})+'</script><div id="modal"></div></body></html>'),originalFetch=globalThis.fetch;
 globalThis.document=dom.window.document;globalThis.CustomEvent=dom.window.CustomEvent;globalThis.fetch=async url=>{assert.equal(url,'/api/alerts?lang=fr');return new Response(JSON.stringify(payload));};let markers=[];document.addEventListener('infovisa:news-markers',e=>markers=e.detail);
 const api=mountMapNews(html=>document.querySelector('#modal').innerHTML=html);
 try{await new Promise(setImmediate);assert.equal(markers.length,1);assert.match(markers[0].label,/France 24/);document.dispatchEvent(new CustomEvent('infovisa:news-open',{detail:'FRA'}));assert.match(document.querySelector('#modal').textContent,/Source, lien et date contrôlés/);assert.equal(document.querySelector('#modal script'),null);assert.equal(document.querySelector('.iv-map-news-item>a').href,item.url);
  const toggle=document.querySelector('[data-map-layer="news"]');toggle.setAttribute('aria-pressed','false');toggle.click();await new Promise(setImmediate);assert.match(document.querySelector('#map-alert-status').textContent,/Points masqués/);
  payload={...payload,items:[{...item,publishedAt:new Date(now-3700000).toISOString()}]};await api.refresh();assert.equal(markers.length,0);assert.match(document.querySelector('#map-alert-status').textContent,/Aucune alerte/);
 }finally{api.destroy();globalThis.fetch=originalFetch;dom.window.close();}
});
