import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {mountWeather} from '../design/weather.js';
test('weather panel accepts pointer input; layers, playback and pause work across forecast hours',async()=>{
 const template=await fs.readFile(new URL('../template.html',import.meta.url),'utf8'),styles=[...template.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
 const dom=new JSDOM(`<html><head><style>${styles}</style></head><body><svg id="map"><text class="wx">10°</text></svg><section id="weather-extra"></section></body></html>`,{pretendToBeVisual:true,url:'https://infovisa.test/'});
 for(const key of ['window','document','MutationObserver','AbortController','AbortSignal'])globalThis[key]=dom.window[key];
 globalThis.matchMedia=()=>({matches:false});globalThis.devicePixelRatio=1;
 globalThis.ResizeObserver=class{constructor(cb){this.cb=cb;}observe(){this.cb();}disconnect(){}};
 globalThis.IntersectionObserver=class{constructor(cb){this.cb=cb;}observe(){this.cb([{isIntersecting:true}]);}disconnect(){}};
 const frames=new Map();let fid=0;globalThis.requestAnimationFrame=cb=>{frames.set(++fid,cb);return fid;};globalThis.cancelAnimationFrame=id=>frames.delete(id);
 dom.window.HTMLElement.prototype.getClientRects=function(){return [{}];};
 const ctx=new Proxy({},{get:(t,k)=>t[k]||(()=>{}),set:(t,k,v)=>(t[k]=v,true)});dom.window.HTMLCanvasElement.prototype.getContext=()=>ctx;
 const time=['2026-11-18T00:00','2026-11-18T01:00','2026-11-18T02:00','2026-11-18T03:00'];
 globalThis.fetch=async input=>{const u=new URL(input,'https://infovisa.test');if(u.pathname.endsWith('.svg'))return new Response('<svg></svg>');const names=(u.searchParams.get('hourly')||'').split(','),hourly={time,...Object.fromEntries(names.map(n=>[n,time.map(()=>n.startsWith('wind_direction')?90:n==='weather_code'?0:20)]))};const entry={hourly,current:{time:time[0],weather_code:0,temperature_2m:15,apparent_temperature:14,wind_direction_10m:90,wind_speed_10m:15,wind_gusts_10m:22,relative_humidity_2m:50,cloud_cover:20,surface_pressure:1015},daily:{time:['2026-11-18'],weather_code:[0],temperature_2m_max:[20],temperature_2m_min:[10],precipitation_probability_max:[0],precipitation_sum:[0],wind_speed_10m_max:[20],wind_gusts_10m_max:[30]},timezone:'UTC'};return new Response(JSON.stringify(u.searchParams.get('latitude').includes(',')?Array.from({length:48},()=>entry):entry));};
 const root=document.querySelector('#weather-extra'),api=await mountWeather(root);
 try{
  // Regression: the original .wx SVG rule inherited pointer-events:none into this panel.
  assert.equal(dom.window.getComputedStyle(root.querySelector('[data-wx-layer]')).pointerEvents,'auto');assert.equal(dom.window.getComputedStyle(document.querySelector('#map .wx')).pointerEvents,'none');
  for(const [layer,label] of [['gust','RAFALES À 10 M'],['temperature','TEMPÉRATURE'],['rain','PLUIE'],['cloud','NUAGES'],['pressure','PRESSION']]){root.querySelector(`[data-wx-layer="${layer}"]`).click();assert.equal(root.querySelector('.wx-map-metric').textContent,label);assert.equal(root.querySelector(`[data-wx-layer="${layer}"]`).getAttribute('aria-pressed'),'true');}
  const play=root.querySelector('.wx-play');play.click();assert.equal(play.getAttribute('aria-pressed'),'true');
  let previous=0;for(let n=0;n<14;n++){const queued=[...frames.values()];frames.clear();queued.forEach(cb=>cb(1000+n*200));const position=Number(root.querySelector('.wx-timeline input').value);assert.ok(position>=previous,'Playback must not reset at an hour boundary');previous=position;}assert.ok(previous>1,'Playback crosses into the next forecast hour');
  play.click();assert.equal(play.getAttribute('aria-pressed'),'false');const paused=Number(root.querySelector('.wx-timeline input').value);for(const cb of [...frames.values()])cb(4000);assert.equal(Number(root.querySelector('.wx-timeline input').value),paused);
 }finally{api.destroy();dom.window.close();}
});
