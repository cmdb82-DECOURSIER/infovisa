import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {JSDOM} from 'jsdom';
import * as d3 from 'd3';
const require=createRequire(import.meta.url),messages=require('../i18n.js');
test('primary map controls replace wind with news alerts without removing weather from its module',async()=>{
 const source=await fs.readFile(new URL('../template.html',import.meta.url),'utf8'),controls=source.slice(source.indexOf('const LAY={'),source.indexOf('function drawLegend()')),weather=source.slice(source.indexOf('async function loadWeather(){'),source.indexOf('/* ---------- horloge'));
 const dom=new JSDOM('<body><small id="mapnote"></small><div id="layers"></div><svg><path class="country"/><g id="pan"><circle/></g><g id="quakes"></g><g id="events"></g><g id="weather"></g><g id="news"><circle/></g></svg></body>',{runScripts:'outside-only'}),w=dom.window;
 const q=s=>w.document.querySelector(s);Object.assign(w,{S:messages.fr,$:q,paths:d3.select(q('.country')),gPAN:d3.select(q('#pan')),gQ:d3.select(q('#quakes')),gE:d3.select(q('#events')),gW:d3.select(q('#weather')),gNews:d3.select(q('#news')),cOf:()=>({}),level:()=>1,LV:{1:{c:'green'}},rescale(){},setSrc(){},hhmm:()=>'',CITIES:[['Available',0,0],['Unavailable',1,1]],proj:p=>p,WMO:()=>['','Clear']});
 w.el=(tag,attrs={},...children)=>{const e=w.document.createElement(tag);for(const[k,v]of Object.entries(attrs))if(k==='text')e.textContent=v;else e.setAttribute(k,v);e.append(...children);return e;};
 w.getJSON=async url=>{assert.doesNotMatch(url,/wind_speed|wind_direction/);return [{current:{temperature_2m:20,weather_code:0}},{current:{temperature_2m:null}}];};
 try{w.eval(controls+'\n'+weather+'\ndrawLayers();applyLayers();window.loadFixtureWeather=loadWeather;');
  assert.deepEqual([...q('#layers').children].filter(e=>e.tagName==='BUTTON').map(e=>e.textContent),['Pays','Alertes info','Séismes','PAN / OVNI']);assert.equal(q('[data-map-layer="wind"]'),null);assert.doesNotMatch(source,/gWind/);
  assert.equal(q('#weather').style.display,'none');q('[data-map-layer="pan"]').click();assert.equal(q('#pan').style.display,'none');q('[data-map-layer="pan"]').click();assert.equal(q('#pan').style.display,'');
  q('[data-map-layer="news"]').click();assert.equal(q('#news').style.display,'none');q('[data-map-layer="news"]').click();assert.equal(q('#news').style.display,'');
  await w.loadFixtureWeather();assert.equal(q('#weather').querySelectorAll('text').length,1);
  q('.map-more-layers').open=true;q('[data-map-layer="wx"]').click();assert.equal(q('#weather').style.display,'');assert.equal(q('.map-more-layers').open,true);assert.equal(q('#news').style.display,'');
 }finally{dom.window.close();}
});
