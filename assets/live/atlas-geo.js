// Robinson projection matching the bundled Natural Earth SVG.
const X=[1,.9986,.9954,.99,.9822,.973,.96,.9427,.9216,.8962,.8679,.835,.7986,.7597,.7186,.6732,.6213,.5722,.5322];
const Y=[0,.062,.124,.186,.248,.31,.372,.434,.4958,.5571,.6176,.6769,.7346,.7903,.8435,.8936,.9394,.9761,1];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function project(lon,lat){lat=clamp(lat,-89,89);const t=Math.abs(lat)/5,i=Math.floor(t),a=t-i;return [550+198*.8487*lon*Math.PI/180*(X[i]*(1-a)+X[i+1]*a),292-198*1.3523*(Y[i]*(1-a)+Y[i+1]*a)*Math.sign(lat)];}
export function unproject(x,y){const fraction=Math.abs(y-292)/(198*1.3523);if(fraction>Y[18])return null;let i=0;while(i<17&&Y[i+1]<fraction)i++;const a=(fraction-Y[i])/(Y[i+1]-Y[i]),lat=(i+a)*5*Math.sign(292-y),lon=(x-550)/(198*.8487*(X[i]*(1-a)+X[i+1]*a))*180/Math.PI;return Math.abs(lon)<=180&&Math.abs(lat)<=85?{lat,lon}:null;}
export function worldPoints(){const points=[];for(const lat of [-45,-20,0,20,45,65])for(const lon of [-157.5,-112.5,-67.5,-22.5,22.5,67.5,112.5,157.5])points.push({lat,lon,xy:project(lon,lat)});return points;}
export function viewportPoints(view){if(view.k<1.6)return worldPoints();const points=[];for(let row=0;row<6;row++)for(let col=0;col<8;col++){const p=unproject(((col+.5)/8*1100-view.x)/view.k,((row+.5)/6*560-view.y)/view.k);if(p){p.lat=+p.lat.toFixed(4);p.lon=+p.lon.toFixed(4);p.xy=project(p.lon,p.lat);points.push(p);}}return points;}
export function zoomAt(view,factor,x=550,y=280){const k=clamp(view.k*factor,1,128),ratio=k/view.k;return constrainView({k,x:x-(x-view.x)*ratio,y:y-(y-view.y)*ratio});}
export function constrainView(view){const k=clamp(view.k,1,128);return {k,x:clamp(view.x,1100*(1-k),0),y:clamp(view.y,560*(1-k),0)};}
