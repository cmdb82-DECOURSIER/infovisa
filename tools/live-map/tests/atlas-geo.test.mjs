import {test} from 'node:test';
import assert from 'node:assert/strict';
import {project,unproject,worldPoints,viewportPoints,zoomAt} from '../design/atlas-geo.js';
import {createSpatialWeights,projectField,sampleField} from '../design/weather-flow.js';
test('atlas zoom preserves its anchor and fetches denser geographic samples in the visible region',()=>{
 for(const [lon,lat] of [[6.1319,49.6116],[-122.4,37.8],[139.7,35.7],[151.2,-33.9]]){const p=unproject(...project(lon,lat));assert.ok(Math.abs(p.lat-lat)<1e-8);assert.ok(Math.abs(p.lon-lon)<1e-8);}
 const anchor=project(6.1319,49.6116),view=zoomAt({k:1,x:0,y:0},32,...anchor),points=viewportPoints(view);
 assert.equal(worldPoints().length,48);assert.equal(points.length,48);
 assert.ok(Math.max(...points.map(p=>p.lon))-Math.min(...points.map(p=>p.lon))<20);
 assert.ok(Math.max(...points.map(p=>p.lat))-Math.min(...points.map(p=>p.lat))<10);
 for(const p of points){assert.ok(p.xy[0]*view.k+view.x>=-1);assert.ok(p.xy[0]*view.k+view.x<=1101);}
 assert.equal(zoomAt(view,100).k,128);assert.equal(zoomAt(view,.0001).k,1);
 const weights=createSpatialWeights(points,{x0:-view.x/view.k,y0:-view.y/view.k,width:1100/view.k,height:560/view.k});
 const field=projectField(weights,points.map(()=>({u:10,v:5,value:21})));
 const s=sampleField([field],0,(anchor[0]-view.x)/view.k,(anchor[1]-view.y)/view.k);
 assert.ok(Math.abs(s.value-21)<.001);assert.ok(Math.abs(s.u-10)<.001);
});
