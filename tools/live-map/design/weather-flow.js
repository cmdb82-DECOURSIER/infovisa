/* Pure forecast-field and advection math. No DOM and no per-frame nearest-neighbour search. */
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
export function createSpatialWeights(points,{width=1100,height=560,cols=56,rows=29,neighbors=4}={}){
 const count=Math.min(neighbors,points.length),indices=new Uint16Array(cols*rows*count),weights=new Float32Array(indices.length);
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
  const x=col/(cols-1)*width,y=row/(rows-1)*height,nearest=[];
  for(let i=0;i<points.length;i++){const dx=points[i].xy[0]-x,dy=points[i].xy[1]-y,d=dx*dx+dy*dy;let at=0;while(at<nearest.length&&nearest[at].d<=d)at++;if(at<count){nearest.splice(at,0,{i,d});if(nearest.length>count)nearest.pop();}}
  const offset=(row*cols+col)*count;let total=0;
  nearest.forEach((p,i)=>{indices[offset+i]=p.i;const w=1/Math.max(100,p.d);weights[offset+i]=w;total+=w;});
  for(let i=0;i<count;i++)weights[offset+i]/=total;
 }
 return {width,height,cols,rows,neighbors:count,indices,weights};
}
export function projectField(spatial,samples){
 const size=spatial.cols*spatial.rows,out={spatial,u:new Float32Array(size),v:new Float32Array(size),value:new Float32Array(size)};
 for(let node=0;node<size;node++){
  let wu=0,wv=0,ws=0,u=0,v=0,value=0;
  for(let j=0;j<spatial.neighbors;j++){const offset=node*spatial.neighbors+j,s=samples[spatial.indices[offset]],w=spatial.weights[offset];if(!s)continue;if(Number.isFinite(s.u)){u+=s.u*w;wu+=w;}if(Number.isFinite(s.v)){v+=s.v*w;wv+=w;}if(Number.isFinite(s.value)){value+=s.value*w;ws+=w;}}
  out.u[node]=wu?u/wu:NaN;out.v[node]=wv?v/wv:NaN;out.value[node]=ws?value/ws:NaN;
 }
 return out;
}
function blend(a,b,t){if(!Number.isFinite(a))return b;if(!Number.isFinite(b))return a;return a+(b-a)*t;}
function sampleOne(field,x,y){
 const s=field.spatial,gx=clamp(x/s.width*(s.cols-1),0,s.cols-1),gy=clamp(y/s.height*(s.rows-1),0,s.rows-1),cx=Math.min(s.cols-2,Math.floor(gx)),cy=Math.min(s.rows-2,Math.floor(gy)),ax=gx-cx,ay=gy-cy,i=cy*s.cols+cx;
 const read=arr=>blend(blend(arr[i],arr[i+1],ax),blend(arr[i+s.cols],arr[i+s.cols+1],ax),ay);
 return {u:read(field.u),v:read(field.v),value:read(field.value)};
}
export function sampleField(frames,timePosition,x,y){
 if(!frames.length)return {u:NaN,v:NaN,value:NaN};
 const pos=clamp(timePosition,0,frames.length-1),index=Math.floor(pos),a=sampleOne(frames[index],x,y),b=index+1<frames.length?sampleOne(frames[index+1],x,y):a,t=pos-index;
 return {u:blend(a.u,b.u,t),v:blend(a.v,b.v,t),value:blend(a.value,b.value,t)};
}
export function advanceTimeline(position,elapsedSeconds,maxIndex,secondsPerHour=1){
 const next=clamp(position+Math.max(0,elapsedSeconds)/Math.max(.001,secondsPerHour),0,maxIndex);
 return {position:next,ended:next>=maxIndex};
}
export function advectParticle(p,dt,sampler,timeStart,timeEnd,{speedScale=1,maxStep=1/30}={}){
 if(!(dt>0))return p;const steps=Math.max(1,Math.ceil(dt/maxStep)),step=dt/steps;
 for(let i=0;i<steps;i++){const phase=(i+.5)/steps,time=timeStart+(timeEnd-timeStart)*phase,a=sampler(time,p.x,p.y);if(!Number.isFinite(a.u)||!Number.isFinite(a.v))return p;const mid=sampler(time,p.x+a.u*speedScale*step/2,p.y+a.v*speedScale*step/2);if(!Number.isFinite(mid.u)||!Number.isFinite(mid.v))return p;p.x+=mid.u*speedScale*step;p.y+=mid.v*speedScale*step;}
 return p;
}
function random(seed){let t=seed+0x6D2B79F5;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}
export function recycleParticle(p,bounds={x:20,y:20,width:1060,height:500}){
 p.generation=(p.generation||0)+1;const seed=Math.imul(p.id+1,2654435761)^Math.imul(p.generation,1597334677);
 p.x=bounds.x+random(seed)*bounds.width;p.y=bounds.y+random(seed^0x8da6b343)*bounds.height;p.life=6+random(seed^0xd8163841)*9;p.age=0;return p;
}
export function createParticles(count,bounds={x:20,y:20,width:1060,height:500}){
 return Array.from({length:count},(_,id)=>{const p=recycleParticle({id,generation:0},bounds);p.age=random(Math.imul(id+1,3812015801))*p.life;return p;});
}
