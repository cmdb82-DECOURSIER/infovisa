import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {JSDOM} from 'jsdom';
import * as d3 from 'd3';
const require=createRequire(import.meta.url),messages=require('../i18n.js');
test('country, earthquake and wind views are exclusive and news POIs always return with Countries',async()=>{
 const source=await fs.readFile(new URL('../template.html',import.meta.url),'utf8'),controls=source.slice(source.indexOf('const LAY={'),source.indexOf('function drawLegend()')),weather=source.slice(source.indexOf('async function loadWeather(){'),source.indexOf('/* ---------- horloge'));
 const dom=new JSDOM('<body><small id="mapnote"></small><div id="layers"></div><div id="legend"></div><div id="map-alert-status"></div><p id="map-wind-status"></p><svg><path class="country"/><g id="pan"><circle/></g><g id="quakes"></g><g id="events"></g><g id="weather"></g><g id="wind"></g><g id="news"><circle/></g></svg></body>',{runScripts:'outside-only'}),w=dom.window;
 const q=s=>w.document.querySelector(s);Object.assign(w,{S:messages.fr,$:q,paths:d3.select(q('.country')),gPAN:d3.select(q('#pan')),gQ:d3.select(q('#quakes')),gE:d3.select(q('#events')),gW:d3.select(q('#weather')),gWind:d3.select(q('#wind')),newsPinTransform:d=>'translate('+d.x+','+d.y+')',showTip(){},hideTip(){},gNews:d3.select(q('#news')),cOf:()=>({}),level:()=>1,LV:{1:{c:'green'}},rescale(){},setSrc(){},hhmm:()=>'',CITIES:[['Available',0,0],['Unavailable',1,1]],proj:p=>p,WMO:()=>['','Clear']});
 w.el=(tag,attrs={},...children)=>{const e=w.document.createElement(tag);for(const[k,v]of Object.entries(attrs))if(k==='text')e.textContent=v;else e.setAttribute(k,v);e.append(...children);return e;};
 w.getJSON=async url=>{assert.match(url,/wind_speed_10m,wind_direction_10m/);return [{current:{temperature_2m:20,weather_code:0,wind_speed_10m:25,wind_direction_10m:90,time:'2026-11-25T07:00'}},{current:{temperature_2m:null}}];};
 try{w.eval(controls+'\n'+weather+'\ndrawLayers();applyLayers();window.loadFixtureWeather=loadWeather;');
  assert.deepEqual([...q('#layers').children].filter(e=>e.tagName==='BUTTON').map(e=>e.textContent),['Pays','Séismes','Vent']);
  assert.equal(q('#news').style.display,'');assert.equal(q('#quakes').style.display,'none');assert.equal(q('#wind').style.display,'none');
  q('[data-map-layer="risk"]').click();assert.equal(q('[data-map-layer="risk"]').getAttribute('aria-pressed'),'true','Countries cannot be switched off accidentally');assert.equal(q('#news').style.display,'');
  q('[data-map-layer="quake"]').click();assert.equal(q('#quakes').style.display,'');assert.equal(q('#news').style.display,'none');assert.equal(q('#map-alert-status').hidden,true);
  q('[data-map-layer="wind"]').click();assert.equal(q('#quakes').style.display,'none');assert.equal(q('#wind').style.display,'');assert.equal(q('#map-wind-status').hidden,false);
  await w.loadFixtureWeather();assert.equal(q('#weather').querySelectorAll('text').length,1);assert.equal(q('#wind').querySelectorAll('.wind-marker').length,1,'Never draw wind arrows for missing data');assert.equal(q('.wind-vector').getAttribute('transform'),'rotate(270)');assert.match(q('#wind title').textContent,/25 km\/h/);
  q('[data-map-layer="risk"]').click();assert.equal(q('#wind').style.display,'none');assert.equal(q('#news').style.display,'');assert.equal(q('#map-alert-status').hidden,false);assert.equal(q('#map-wind-status').hidden,true);
  q('.map-more-layers').open=true;q('[data-map-layer="pan"]').click();assert.equal(q('#pan').style.display,'');assert.equal(q('.map-more-layers').open,true);assert.equal(q('#news').style.display,'');
 }finally{dom.window.close();}
});
