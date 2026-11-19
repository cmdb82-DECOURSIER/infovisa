import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {mountWeather} from '../design/weather.js';
import {createSpatialWeights,projectField,sampleField} from '../design/weather-flow.js';

test('local wind interpolation preserves relative distance weights at high zoom',()=>{
 const coords=[[0,0],[20,0],[0,20],[20,20]],samples=[{u:30,v:0,value:30},{u:0,v:30,value:30},{u:-30,v:0,value:30},{u:0,v:-30,value:30}];
 const field=k=>projectField(createSpatialWeights(coords.map(xy=>({xy:xy.map(n=>n/k)})),{width:20/k,height:20/k,cols:21,rows:21,minDistanceSquared:100/(k*k)}),samples);
 const world=sampleField([field(1)],0,2,3),local=sampleField([field(128)],0,2/128,3/128);
 assert.ok(Math.abs(world.u-local.u)<1e-5);assert.ok(Math.abs(world.v-local.v)<1e-5);assert.ok(local.u>10,'Zoom must retain nearby wind variation instead of averaging all four equally');
});

for(const playing of [false,true])test(`zoom rejects stale wind and repaints local arrows while ${playing?'playing':'paused'}`,async()=>{
 const dom=new JSDOM('<html lang="fr"><body><section id="weather"></section></body></html>',{pretendToBeVisual:true,url:'https://infovisa.test/'});
 for(const key of ['window','document','MutationObserver','AbortController','AbortSignal'])globalThis[key]=dom.window[key];
 globalThis.matchMedia=()=>({matches:false});globalThis.devicePixelRatio=1;
 globalThis.ResizeObserver=class{constructor(cb){this.cb=cb;}observe(){this.cb();}disconnect(){}};
 globalThis.IntersectionObserver=class{constructor(cb){this.cb=cb;}observe(target){this.cb([{target,isIntersecting:target.classList.contains('wx-map-shell')}]);}disconnect(){}};
 const frames=new Map();let fid=0,clock=0;globalThis.requestAnimationFrame=cb=>{frames.set(++fid,cb);return fid;};globalThis.cancelAnimationFrame=id=>frames.delete(id);
 const tick=()=>{clock+=200;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(cb=>cb(clock));};
 dom.window.HTMLElement.prototype.getClientRects=function(){return [{}];};
 dom.window.HTMLElement.prototype.getBoundingClientRect=function(){return {width:1100,height:560,top:0,left:0,bottom:560,right:1100};};
 const contexts=new WeakMap();dom.window.HTMLCanvasElement.prototype.getContext=function(){if(!contexts.has(this)){const ctx={paths:[],path:[],clearRect(){this.paths=[];},beginPath(){this.path=[];},moveTo(x,y){this.path.push([x,y]);},lineTo(x,y){this.path.push([x,y]);},stroke(){this.paths.push(this.path);}};contexts.set(this,new Proxy(ctx,{get:(t,k)=>t[k]??(()=>{})}));}return contexts.get(this);};
 const times=['2026-11-19T00:00','2026-11-19T01:00','2026-11-19T02:00','2026-11-19T03:00'],pending=[];
 function response(u,direction){const names=(u.searchParams.get('hourly')||'').split(','),hourly={time:times,...Object.fromEntries(names.map(n=>[n,times.map(()=>n.startsWith('wind_direction')?direction:n==='weather_code'?0:n==='precipitation'?.7:20)]))};const entry={hourly,current:{time:times[0],weather_code:0,temperature_2m:15,wind_direction_10m:90,wind_speed_10m:15},daily:{time:[],weather_code:[]},timezone:'UTC',source:{windHeights:[10]}};return new Response(JSON.stringify(u.searchParams.get('latitude').includes(',')?u.searchParams.get('latitude').split(',').map(()=>entry):entry));}
 globalThis.fetch=async input=>{const u=new URL(input,'https://infovisa.test');if(u.pathname.endsWith('.svg'))return new Response('<svg><g/></svg>');if(u.searchParams.has('forecast_hours')&&Number(u.searchParams.get('latitude').split(',')[0])!==-45)return new Promise(resolve=>pending.push({u,resolve}));return response(u,90);};
 const root=document.querySelector('#weather'),api=await mountWeather(root),map=root.querySelector('.wx-map'),canvas=root.querySelector('.wx-wind'),wind=contexts.get(canvas),range=root.querySelector('.wx-timeline input');
 const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
 try{
  root.querySelector('[data-wx-layer="wind"]').click();
  assert.ok(wind.paths[0][1][0]<wind.paths[0][0][0],'World fixture blows west');
  range.value='1.25';range.dispatchEvent(new dom.window.Event('input'));
  if(playing){root.querySelector('.wx-play').click();tick();tick();}
  const before=Number(range.value);
  root.querySelector('[data-wx-zoom="city"]').click();
  assert.equal(map.getAttribute('aria-busy'),'true');assert.equal(canvas.hidden,true,'Do not display world wind over a new local viewport');assert.equal(root.querySelector('.wx-map-update').hidden,false);
  await new Promise(resolve=>setTimeout(resolve,390));assert.equal(pending.length,1);
  map.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  pending[0].resolve(response(pending[0].u,0));await settle();
  assert.equal(map.getAttribute('aria-busy'),'true','Old response must be invalidated before the next debounce fires');assert.equal(canvas.hidden,true);assert.match(root.querySelector('.wx-grid-status').textContent,/Chargement/);
  tick();assert.equal(Number(range.value),before,'Loading a viewport must not restart or advance the forecast');
  await new Promise(resolve=>setTimeout(resolve,390));assert.equal(pending.length,2);
  pending[1].resolve(response(pending[1].u,180));await settle();tick();
  assert.equal(map.getAttribute('aria-busy'),'false');assert.equal(canvas.hidden,false);assert.equal(root.querySelector('.wx-map-update').hidden,true);assert.match(root.querySelector('.wx-grid-status').textContent,/Grille régionale/);assert.equal(Number(range.value),before);
  if(playing){root.querySelector('.wx-play').click();tick();}
  const arrow=wind.paths.find(p=>p[0]?.[0]===50&&p[0]?.[1]===55);assert.ok(arrow,'Accepted local data repaints arrows');assert.ok(arrow[1][1]<arrow[0][1],'Local fixture blows north');assert.ok(Math.abs(arrow[1][0]-arrow[0][0])<1e-5);
  root.querySelector('[data-wx-zoom="reset"]').click();await settle();tick();
  assert.equal(map.dataset.zoom,'1.00');assert.equal(canvas.hidden,false);assert.match(root.querySelector('.wx-grid-status').textContent,/Grille mondiale/);assert.ok(wind.paths[0][1][0]<wind.paths[0][0][0],'Cached world wind is restored');
 }finally{api.destroy();dom.window.close();}
});
