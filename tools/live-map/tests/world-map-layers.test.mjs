import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {JSDOM} from 'jsdom';
import * as d3 from 'd3';
const require=createRequire(import.meta.url),messages=require('../i18n.js');
test('primary map controls keep the requested order and toggle wind, UAP and optional overlays',async()=>{
 const source=await fs.readFile(new URL('../template.html',import.meta.url),'utf8'),controls=source.slice(source.indexOf('const LAY={'),source.indexOf('function drawLegend()')),weather=source.slice(source.indexOf('async function loadWeather(){'),source.indexOf('/* ---------- horloge'));
 const dom=new JSDOM('<body><small id="mapnote"></small><div id="layers"></div><svg><path class="country"/><g id="wind"></g><g id="pan"><circle/></g><g id="quakes"></g><g id="events"></g><g id="weather"></g><g id="news"></g></svg></body>',{runScripts:'outside-only'}),w=dom.window;
 const q=s=>w.document.querySelector(s);Object.assign(w,{S:messages.fr,$:q,paths:d3.select(q('.country')),gWind:d3.select(q('#wind')),gPAN:d3.select(q('#pan')),gQ:d3.select(q('#quakes')),gE:d3.select(q('#events')),gW:d3.select(q('#weather')),gNews:d3.select(q('#news')),cOf:()=>({}),level:()=>1,LV:{1:{c:'green'}},rescale(){},setSrc(){},hhmm:()=>'',CITIES:[['North test',0,0],['Unavailable test',1,1]],proj:p=>p,WMO:()=>['','Clear']});
 w.el=(tag,attrs={},...children)=>{const e=w.document.createElement(tag);for(const[k,v]of Object.entries(attrs))if(k==='text')e.textContent=v;else e.setAttribute(k,v);e.append(...children);return e;};
 w.getJSON=async url=>{assert.match(url,/wind_speed_10m,wind_direction_10m/);return [{current:{temperature_2m:20,weather_code:0,wind_speed_10m:17,wind_direction_10m:0}},{current:{temperature_2m:null,weather_code:null}}];};
 try{w.eval(controls+'\n'+weather+'\ndrawLayers();applyLayers();window.loadFixtureWeather=loadWeather;');
  assert.deepEqual([...q('#layers').children].filter(e=>e.tagName==='BUTTON').map(e=>e.textContent),['Pays','Vent','Séismes','PAN / OVNI']);
  assert.equal(q('#weather').style.display,'none');q('[data-map-layer="pan"]').click();assert.equal(q('#pan').style.display,'none');q('[data-map-layer="pan"]').click();assert.equal(q('#pan').style.display,'');
  await w.loadFixtureWeather();assert.equal(q('#wind').querySelectorAll('.world-wind-point').length,1);assert.equal(q('#wind path').getAttribute('transform'),'rotate(180)');assert.match(q('#wind title').textContent,/17 km\/h/);assert.equal(q('#weather').querySelectorAll('text').length,1);
  q('[data-map-layer="wind"]').click();assert.equal(q('#wind').style.display,'none');q('.map-more-layers').open=true;q('[data-map-layer="wx"]').click();assert.equal(q('#weather').style.display,'');assert.equal(q('#wind').style.display,'none');assert.equal(q('.map-more-layers').open,true);
  q('[data-map-layer="wind"]').click();assert.equal(q('#wind').style.display,'');assert.equal(q('#weather').style.display,'none');assert.match(q('#mapnote').textContent,/10 m · km\/h/);
 }finally{dom.window.close();}
});
