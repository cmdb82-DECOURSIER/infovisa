import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import * as d3 from 'd3';
test('news markers retain a 44 CSS-pixel target on mobile, desktop and after map zoom',async()=>{
 const source=await fs.readFile(new URL('../template.html',import.meta.url),'utf8'),functions=source.slice(source.indexOf('function newsPinTransform('),source.indexOf('function rescale(){'));
 const dom=new JSDOM('<svg><g id="news"><g class="news-marker"><circle class="news-marker-hit" r="22"/></g></g></svg>',{runScripts:'outside-only'}),w=dom.window,svg=w.document.querySelector('svg'),pin=w.document.querySelector('.news-marker');let width=320,height=500/3;
 svg.getBoundingClientRect=()=>({width,height});const news=d3.select(w.document.querySelector('#news'));d3.select(pin).datum({x:500,y:200});Object.assign(w,{W:960,H:500,K:1,newsPixelRatio:1,svg:d3.select(svg),gNews:news,gWind:d3.select(w.document.createElementNS('http://www.w3.org/2000/svg','g'))});
 try{w.eval(functions+'\nwindow.measurePins=measureNewsPins;window.scalePins=rescaleNewsPins;');
  for(const [size,zoom] of [[320,1],[320,4],[960,4],[833,1]]){width=size;height=size*500/960;w.K=zoom;w.measurePins();const scale=Number(pin.getAttribute('transform').match(/scale\(([^)]+)/)[1]),physical=44*scale*zoom*size/960;assert.ok(Math.abs(physical-44)<1e-9);}
  assert.match(source,/new ResizeObserver\(measureNewsPins\)/);
 }finally{dom.window.close();}
});
