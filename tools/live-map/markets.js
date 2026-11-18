(function(){
"use strict";
var MK=/*__MK__*/;
var LG=(document.documentElement.lang||"fr").slice(0,2);
var LOC={fr:"fr-FR",en:"en-GB",de:"de-DE",es:"es-ES",pt:"pt-PT"}[LG]||"fr-FR";
var CUR=["EUR","USD","GBP","CHF","JPY","CAD","AUD","CNY","BRL","INR"];
var CG="https://api.coingecko.com/api/v3",FR="https://api.frankfurter.dev/v1";
var root=document.getElementById("vm"),vw=document.getElementById("vw"),tabs=document.getElementById("vtabs");
if(!root||!vw||!tabs)return;
function gv(k){try{return localStorage.getItem(k)}catch(e){return null}}
function sv(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function $(s,r){return (r||root).querySelector(s)}
function $$(s,r){return [].slice.call((r||root).querySelectorAll(s))}
var st={marketView:"crypto",cur:CUR.indexOf(gv("iv_cur"))>=0?gv("iv_cur"):"EUR",coin:gv("iv_coin")||"bitcoin",days:7,mode:"line",coins:[],rEUR:null,sort:"market_cap_rank",dir:1,q:"",favOnly:false,fav:[],pf:[],inited:false,fxSeries:null,fxPair:null,timer:null};
try{st.fav=JSON.parse(gv("iv_fav_v1")||"[]")}catch(e){}
try{st.pf=JSON.parse(gv("iv_pf_v1")||"[]")}catch(e){}
if(!Array.isArray(st.fav))st.fav=[];if(!Array.isArray(st.pf))st.pf=[];

/* ---------- formatting ---------- */
function money(v,c){c=c||st.cur;if(v==null||isNaN(v))return "—";var a=Math.abs(v),mn=2,mx=2;if(a>=1000){mn=0;mx=0}else if(a>=1){mn=2;mx=2}else if(a>=.01){mn=4;mx=4}else{mn=6;mx=8}
try{return new Intl.NumberFormat(LOC,{style:"currency",currency:c,minimumFractionDigits:mn,maximumFractionDigits:mx}).format(v)}catch(e){return v.toFixed(2)+" "+c}}
function cpt(v,c){if(v==null||isNaN(v))return "—";try{return new Intl.NumberFormat(LOC,{style:c?"currency":"decimal",currency:c||undefined,notation:"compact",maximumFractionDigits:2}).format(v)}catch(e){return String(Math.round(v))}}
function nf(v,d){if(v==null||isNaN(v))return "—";return new Intl.NumberFormat(LOC,{maximumFractionDigits:d==null?4:d}).format(v)}
function pc(v){if(v==null||isNaN(v))return '<span class="mu">—</span>';return '<span class="'+(v>=0?"up":"dn")+'">'+(v>=0?"▲ ":"▼ ")+Math.abs(v).toFixed(2)+"%</span>"}
function fdate(t,long){var d=new Date(t);return long?d.toLocaleString(LOC,{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):d.toLocaleDateString(LOC,{day:"2-digit",month:"short"})}
function hhmm(){return new Date().toLocaleTimeString(LOC,{hour:"2-digit",minute:"2-digit",second:"2-digit"})}

/* ---------- fetch with cache ---------- */
function clean(){try{Object.keys(localStorage).forEach(function(k){if(k.indexOf("iv_c_")===0)localStorage.removeItem(k)})}catch(e){}}
function J(url,ttl){var k="iv_c_"+url,now=Date.now(),c=null;try{c=JSON.parse(localStorage.getItem(k)||"null")}catch(e){}
if(c&&now-c.t<ttl*1000)return Promise.resolve(c.d);
function go(n){return fetch(url).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).catch(function(e){if(n>=2)throw e;return new Promise(function(ok){setTimeout(ok,7000*(n+1))}).then(function(){return go(n+1)})})}
return go(0).then(function(d){try{localStorage.setItem(k,JSON.stringify({t:now,d:d}))}catch(e){clean()}return d}).catch(function(e){if(c)return c.d;throw e})}
function err(box){box.innerHTML='<div class="mkerr">'+esc(MK.err)+"</div>"}

/* ---------- skeleton ---------- */
function cursel(id){return '<select id="'+id+'">'+CUR.map(function(c){return '<option value="'+c+'"'+(c===st.cur?" selected":"")+">"+c+"</option>"}).join("")+"</select>"}
function build(){
root.innerHTML=
'<div class="mkhead"><h2 class="mkt">'+esc(MK.title)+' <small>'+esc(MK.note)+'</small></h2><div class="mkctl"><label>'+esc(MK.cur)+' '+cursel("mcur")+'</label><span class="mkst" id="mkst"></span></div></div>'+
'<div class="mkticker" id="mktick" aria-label="live"></div>'+
'<div class="mkgrid4" id="mkstats"></div>'+
'<div class="mkmain"><section class="card mkchart"><div id="mkch"></div></section><aside class="mkside"><section class="card"><h3>'+esc(MK.movers)+'</h3><div id="mkmov" class="pad"></div></section><section class="card"><h3>'+esc(MK.conv)+'</h3><div id="mkconv" class="pad"></div></section></aside></div>'+
'<section class="card mktable"><div class="mktools"><h3>'+esc(MK.top)+'</h3><button type="button" id="mkcro" class="mkb">CRO · Crypto.com</button><input type="search" id="mkq" placeholder="'+esc(MK.search)+'" aria-label="'+esc(MK.search)+'"><button type="button" id="mkfav" class="mkb">★ '+esc(MK.watch)+'</button></div><div class="mkscroll"><table class="mkt2"><thead id="mkth"></thead><tbody id="mktb"><tr><td colspan="10" class="mkerr">'+esc(MK.load)+'</td></tr></tbody></table></div></section>'+
'<div class="mkcols"><section class="card"><h3>'+esc(MK.fx)+'</h3><div id="mkfx" class="pad"></div></section><section class="card"><h3>'+esc(MK.port)+'</h3><div id="mkpf" class="pad"></div></section></div>'+
'<div class="mkcols"><section class="card"><h3>'+esc(MK.calc)+'</h3><div id="mkcalc" class="pad"></div></section><section class="card"><h3>'+esc(MK.risk)+'</h3><div id="mkrisk" class="pad"></div></section></div>'+
'<section class="card mkpro"><h3>'+esc(MK.pro)+' <small>'+esc(MK.wnote)+'</small></h3><div class="mkwt" id="mkwt"></div><div class="mkw" id="mkw"></div></section>'+
'<p class="mkdisc">'+esc(MK.disc)+'</p><p class="mkdisc">'+esc(MK.src)+'</p>';
$("#mcur").onchange=function(){st.cur=this.value;sv("iv_cur",st.cur);refreshAll(true)};
$("#mkcro").onclick=function(){st.q="cro";$("#mkq").value="CRO";st.favOnly=false;$("#mkfav").classList.remove("on");renderTable()};
$("#mkq").oninput=function(){st.q=this.value.toLowerCase();renderTable()};
$("#mkfav").onclick=function(){st.favOnly=!st.favOnly;this.classList.toggle("on",st.favOnly);renderTable()};
buildConv();buildCalc();buildRisk();renderPf();applyMarketView();
}

/* Separate asset classes while retaining the original engines and saved preferences. */
function applyMarketView(){
 var stocks=st.marketView==="stocks";
 ["#mktick","#mkstats",".mkmain",".mktable"].forEach(function(id){var e=$(id);if(e)e.hidden=stocks});
 var fx=$("#mkfx"),pf=$("#mkpf");if(fx)fx.closest(".card").hidden=!stocks;if(pf)pf.closest(".card").hidden=stocks;
 var primary=fx&&fx.closest(".mkcols");if(primary)primary.classList.add("mk-split-primary");
 var title=$(".mkhead .mkt");if(title)title.innerHTML=esc(stocks?MK.stocksTitle:MK.cryptoTitle)+' <small>'+esc(stocks?MK.stocksNote:MK.cryptoNote)+'</small>';
 buildWidgetTabs();
}

/* ---------- global stats + fear & greed ---------- */
function gauge(v){var a=Math.PI*(1-v/100),cx=60,cy=58,r=46,x=cx+r*Math.cos(a),y=cy-r*Math.sin(a);var col=v<25?"#d63b4b":v<45?"#e07a2f":v<55?"#d9b63a":v<75?"#7fcf6b":"#2f8f6b";
return '<svg viewBox="0 0 120 70" class="gg"><path d="M14 58 A46 46 0 0 1 106 58" fill="none" stroke="#223044" stroke-width="10" stroke-linecap="round"/><path d="M14 58 A46 46 0 0 1 '+x.toFixed(1)+" "+y.toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="10" stroke-linecap="round"/><text x="60" y="56" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">'+v+"</text></svg>"}
function loadStats(){
var box=$("#mkstats");
Promise.all([J(CG+"/global",120).catch(function(){return null}),J("https://api.alternative.me/fng/?limit=30",1800).catch(function(){return null})]).then(function(r){
var g=r[0]&&r[0].data,f=r[1]&&r[1].data&&r[1].data[0],h="";
var c=st.cur.toLowerCase();
if(g){h+='<div class="card mks"><span>'+esc(MK.gmc)+'</span><b>'+cpt(g.total_market_cap[c],st.cur)+'</b>'+pc(g.market_cap_change_percentage_24h_usd)+'</div><div class="card mks"><span>'+esc(MK.gvol)+'</span><b>'+cpt(g.total_volume[c],st.cur)+'</b></div><div class="card mks"><span>'+esc(MK.gbtc)+'</span><b>'+g.market_cap_percentage.btc.toFixed(1)+'%</b><i>ETH '+g.market_cap_percentage.eth.toFixed(1)+'%</i></div>'}
if(f){var v=+f.value,k=v<25?0:v<45?1:v<55?2:v<75?3:4;h+='<div class="card mks fng"><span>'+esc(MK.fng)+'</span>'+gauge(v)+'<b class="fl">'+esc(MK.fngL[k])+"</b></div>"}
box.innerHTML=h||'<div class="mkerr">'+esc(MK.err)+"</div>"})}

/* ---------- coins ---------- */
function spark(a,up){if(!a||!a.length)return "";var w=100,h=30,mn=Math.min.apply(null,a),mx=Math.max.apply(null,a),n=a.length,s=[];for(var i=0;i<n;i+=Math.ceil(n/60)){s.push((i/(n-1)*w).toFixed(1)+","+(h-(a[i]-mn)/(mx-mn||1)*h).toFixed(1))}
return '<svg viewBox="0 0 100 30" class="sp"><polyline points="'+s.join(" ")+'" fill="none" stroke="'+(up?"#2f8f6b":"#d63b4b")+'" stroke-width="1.6"/></svg>'}
function loadCoins(){
var currency=st.cur;
return J(CG+"/coins/markets?vs_currency="+currency.toLowerCase()+"&order=market_cap_desc&per_page=60&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d",60).then(function(a){
var coins=Array.isArray(a)?a:[];
if(coins.some(function(c){return c.id==="crypto-com-chain"}))return coins;
return J(CG+"/coins/markets?vs_currency="+currency.toLowerCase()+"&ids=crypto-com-chain&sparkline=true&price_change_percentage=1h%2C24h%2C7d",60).then(function(cro){return coins.concat(Array.isArray(cro)?cro:[])}).catch(function(){return coins});
}).then(function(a){
if(st.cur!==currency)return;st.coins=a;$("#mkst").textContent=MK.live+" · "+hhmm();renderTable();renderMovers();fillConv();renderPf();if(!st.coins.some(function(c){return c.id===st.coin}))st.coin=st.coins[0]&&st.coins[0].id;drawHead()}).catch(function(){var tb=$("#mktb");if(tb&&!st.coins.length)tb.innerHTML='<tr><td colspan="10" class="mkerr">'+esc(MK.err)+"</td></tr>"})}
var COLS=[["market_cap_rank","#"],["name",MK.coin],["current_price",MK.price],["price_change_percentage_1h_in_currency","1h"],["price_change_percentage_24h_in_currency","24h"],["price_change_percentage_7d_in_currency","7d"],["market_cap",MK.mcap],["total_volume",MK.vol],["",MK.chart7]];
function renderTable(){
var th=$("#mkth");if(!th)return;
th.innerHTML="<tr><th></th>"+COLS.map(function(c){return '<th data-k="'+c[0]+'"'+(c[0]===st.sort?' class="on"':"")+">"+esc(c[1])+(c[0]===st.sort?(st.dir>0?" ↑":" ↓"):"")+"</th>"}).join("")+"</tr>";
$$("th[data-k]",th).forEach(function(t){t.onclick=function(){var k=t.getAttribute("data-k");if(!k)return;if(st.sort===k)st.dir*=-1;else{st.sort=k;st.dir=(k==="market_cap_rank"||k==="name")?1:-1}renderTable()}});
var a=st.coins.slice();
if(st.q)a=a.filter(function(c){return (c.name+" "+c.symbol+(c.id==="crypto-com-chain"?" crypto.com crypto com":"")).toLowerCase().indexOf(st.q)>=0});
if(st.favOnly)a=a.filter(function(c){return st.fav.indexOf(c.id)>=0});
a.sort(function(x,y){var k=st.sort,u=x[k],v=y[k];if(k==="name"){return st.dir*String(u).localeCompare(String(v))}return st.dir*((u==null?-1e18:u)-(v==null?-1e18:v))});
$("#mktb").innerHTML=a.length?a.map(function(c){var f=st.fav.indexOf(c.id)>=0,up=(c.price_change_percentage_7d_in_currency||0)>=0;
return '<tr data-id="'+c.id+'"'+(c.id===st.coin?' class="on"':"")+'><td><button type="button" class="star'+(f?" on":"")+'" data-f="'+c.id+'" aria-label="★">'+(f?"★":"☆")+'</button></td><td class="mu">'+c.market_cap_rank+'</td><td class="nm"><img src="'+esc(c.image)+'" width="20" height="20" alt="" loading="lazy"> <b>'+esc(c.name)+'</b> <i>'+esc(c.symbol.toUpperCase())+"</i></td><td>"+money(c.current_price)+"</td><td>"+pc(c.price_change_percentage_1h_in_currency)+"</td><td>"+pc(c.price_change_percentage_24h_in_currency)+"</td><td>"+pc(c.price_change_percentage_7d_in_currency)+"</td><td>"+cpt(c.market_cap,st.cur)+"</td><td>"+cpt(c.total_volume,st.cur)+"</td><td>"+spark(c.sparkline_in_7d&&c.sparkline_in_7d.price,up)+"</td></tr>"}).join(""):'<tr><td colspan="10" class="mkerr">'+esc(MK.none)+"</td></tr>";
$$("#mktb tr[data-id]").forEach(function(r){r.onclick=function(e){var f=e.target.getAttribute&&e.target.getAttribute("data-f");if(f){var i=st.fav.indexOf(f);if(i>=0)st.fav.splice(i,1);else st.fav.push(f);sv("iv_fav_v1",JSON.stringify(st.fav));renderTable();return}st.coin=r.getAttribute("data-id");sv("iv_coin",st.coin);renderTable();drawHead();$("#mkch").scrollIntoView({behavior:"smooth",block:"nearest"})}})}
function renderMovers(){
var a=st.coins.filter(function(c){return c.price_change_percentage_24h_in_currency!=null}).slice().sort(function(x,y){return y.price_change_percentage_24h_in_currency-x.price_change_percentage_24h_in_currency});
function row(c){return '<li data-id="'+c.id+'"><img src="'+esc(c.image)+'" width="18" height="18" alt=""> <b>'+esc(c.symbol.toUpperCase())+'</b><span>'+money(c.current_price)+"</span>"+pc(c.price_change_percentage_24h_in_currency)+"</li>"}
$("#mkmov").innerHTML='<h4 class="up">▲ '+esc(MK.gain)+"</h4><ul>"+a.slice(0,5).map(row).join("")+'</ul><h4 class="dn">▼ '+esc(MK.loss)+"</h4><ul>"+a.slice(-5).reverse().map(row).join("")+"</ul>";
$$("#mkmov li").forEach(function(l){l.onclick=function(){st.coin=l.getAttribute("data-id");sv("iv_coin",st.coin);renderTable();drawHead()}})}

/* ---------- big chart ---------- */
var DAYS=[[1,"d1"],[7,"d7"],[30,"d30"],[90,"d90"],[365,"y1"]];
function drawHead(){
var c=st.coins.filter(function(x){return x.id===st.coin})[0],box=$("#mkch");if(!box)return;if(!c){box.innerHTML='<div class="mkerr">'+esc(MK.load)+"</div>";return}
box.innerHTML='<div class="chh"><div class="chn"><img src="'+esc(c.image)+'" width="34" height="34" alt=""><div><h3>'+esc(c.name)+' <i>'+esc(c.symbol.toUpperCase())+'</i></h3><span class="mu">#'+c.market_cap_rank+'</span></div></div><div class="chp"><b>'+money(c.current_price)+"</b>"+pc(c.price_change_percentage_24h_in_currency)+'</div><div class="chc"><div class="seg">'+DAYS.map(function(d){return '<button type="button" data-d="'+d[0]+'"'+(d[0]===st.days?' class="on"':"")+">"+esc(MK[d[1]])+"</button>"}).join("")+'</div><div class="seg"><button type="button" data-m="line"'+(st.mode==="line"?' class="on"':"")+">"+esc(MK.line)+'</button><button type="button" data-m="candle"'+(st.mode==="candle"?' class="on"':"")+">"+esc(MK.candles)+'</button></div></div></div><div id="mkcv" class="cv"></div><div class="chs">'+
stat(MK.high24,money(c.high_24h))+stat(MK.low24,money(c.low_24h))+stat(MK.ath,money(c.ath)+" "+pc(c.ath_change_percentage))+stat(MK.mcap,cpt(c.market_cap,st.cur))+stat(MK.vol,cpt(c.total_volume,st.cur))+stat(MK.supply,cpt(c.circulating_supply)+" "+esc(c.symbol.toUpperCase()))+"</div>";
$$("[data-d]",box).forEach(function(b){b.onclick=function(){st.days=+b.getAttribute("data-d");drawHead()}});
$$("[data-m]",box).forEach(function(b){b.onclick=function(){st.mode=b.getAttribute("data-m");drawHead()}});
loadSeries(c)}
function stat(k,v){return '<div><span>'+esc(k)+"</span><b>"+v+"</b></div>"}
var cvTok=0;
function loadSeries(c){
var my=++cvTok,box=$("#mkcv");box.innerHTML='<div class="mkerr">'+esc(MK.load)+"</div>";
var u=st.mode==="line"?CG+"/coins/"+c.id+"/market_chart?vs_currency="+st.cur.toLowerCase()+"&days="+st.days:CG+"/coins/"+c.id+"/ohlc?vs_currency="+st.cur.toLowerCase()+"&days="+st.days;
J(u,st.days===1?120:600).then(function(d){if(my!==cvTok)return;var s=st.mode==="line"?d.prices:d;if(!s||!s.length)throw 0;lineChart(box,s,st.mode,st.days)}).catch(function(){if(my===cvTok)err(box)})}
function lineChart(box,s,mode,days,fmt){
box.innerHTML="";var W=box.clientWidth||640,H=box.classList.contains("sm")?240:380,m={t:14,r:70,b:26,l:10},cd=mode==="candle";
var svg=d3.select(box).append("svg").attr("viewBox","0 0 "+W+" "+H).attr("width","100%").attr("height",H).style("display","block");
var x=d3.scaleTime().domain(d3.extent(s,function(d){return d[0]})).range([m.l,W-m.r]);
var lo=d3.min(s,function(d){return cd?d[3]:d[1]}),hi=d3.max(s,function(d){return cd?d[2]:d[1]}),pad=(hi-lo)*.08||hi*.01;
var y=d3.scaleLinear().domain([lo-pad,hi+pad]).range([H-m.b,m.t]);
var up=cd?s[s.length-1][4]>=s[0][1]:s[s.length-1][1]>=s[0][1],col=up?"#2f8f6b":"#d63b4b";
var yt=y.ticks(6),ff=fmt||function(v){return money(v)};
svg.append("g").selectAll("line").data(yt).enter().append("line").attr("x1",m.l).attr("x2",W-m.r).attr("y1",y).attr("y2",y).attr("stroke","#1c2a3b");
svg.append("g").selectAll("text").data(yt).enter().append("text").attr("x",W-m.r+6).attr("y",function(d){return y(d)+4}).attr("fill","#8b9bb0").attr("font-size",11).text(function(d){return ff(d)});
var xt=x.ticks(6);svg.append("g").selectAll("text").data(xt).enter().append("text").attr("x",x).attr("y",H-8).attr("text-anchor","middle").attr("fill","#5d6c80").attr("font-size",11).text(function(d){return days<=2?d.toLocaleTimeString(LOC,{hour:"2-digit",minute:"2-digit"}):fdate(d)});
if(!cd){var id="g"+Math.random().toString(36).slice(2,7);var df=svg.append("defs").append("linearGradient").attr("id",id).attr("x1",0).attr("x2",0).attr("y1",0).attr("y2",1);df.append("stop").attr("offset","0%").attr("stop-color",col).attr("stop-opacity",.35);df.append("stop").attr("offset","100%").attr("stop-color",col).attr("stop-opacity",0);
svg.append("path").datum(s).attr("fill","url(#"+id+")").attr("d",d3.area().x(function(d){return x(d[0])}).y0(H-m.b).y1(function(d){return y(d[1])}));
svg.append("path").datum(s).attr("fill","none").attr("stroke",col).attr("stroke-width",1.8).attr("d",d3.line().x(function(d){return x(d[0])}).y(function(d){return y(d[1])}))}
else{var bw=Math.max(1.5,(W-m.l-m.r)/s.length*.65);var g=svg.append("g");s.forEach(function(d){var c=d[4]>=d[1]?"#2f8f6b":"#d63b4b",cx=x(d[0]);g.append("line").attr("x1",cx).attr("x2",cx).attr("y1",y(d[2])).attr("y2",y(d[3])).attr("stroke",c);g.append("rect").attr("x",cx-bw/2).attr("y",y(Math.max(d[1],d[4]))).attr("width",bw).attr("height",Math.max(1,Math.abs(y(d[1])-y(d[4])))).attr("fill",c)})}
var cross=svg.append("g").style("display","none");cross.append("line").attr("y1",m.t).attr("y2",H-m.b).attr("stroke","#4cc2ff").attr("stroke-dasharray","3 3");var dot=cross.append("circle").attr("r",4).attr("fill","#4cc2ff");
var tip=d3.select(box).append("div").attr("class","cvtip").style("display","none");
var bis=d3.bisector(function(d){return d[0]}).left;
svg.append("rect").attr("x",m.l).attr("y",m.t).attr("width",W-m.l-m.r).attr("height",H-m.t-m.b).attr("fill","transparent").on("mousemove touchmove",function(ev){var p=d3.pointer(ev,this),t=x.invert(p[0]),i=Math.min(s.length-1,Math.max(0,bis(s,t))),d=s[i],v=cd?d[4]:d[1];cross.style("display",null);cross.select("line").attr("x1",x(d[0])).attr("x2",x(d[0]));dot.attr("cx",x(d[0])).attr("cy",y(v));
tip.style("display","block").style("left",Math.min(W-170,Math.max(0,x(d[0])-70))+"px").html("<b>"+fdate(d[0],true)+"</b><br>"+(cd?"O "+ff(d[1])+"<br>H "+ff(d[2])+"<br>L "+ff(d[3])+"<br>C "+ff(d[4]):ff(v)))}).on("mouseleave touchend",function(){cross.style("display","none");tip.style("display","none")})}

/* ---------- fx ---------- */
function loadFx(){
var others=CUR.filter(function(c){return c!==st.cur}),d0=new Date(Date.now()-75*864e5).toISOString().slice(0,10);
J(FR+"/"+d0+"..?base="+st.cur+"&symbols="+others.join(","),1800).then(function(d){st.fxSeries=d.rates;renderFx()}).catch(function(){err($("#mkfx"))});
J(FR+"/latest?base=EUR&symbols="+CUR.filter(function(c){return c!=="EUR"}).join(","),1800).then(function(d){st.rEUR=d.rates;st.rEUR.EUR=1;fillConv();renderPf();calcConv()}).catch(function(){})}
function renderFx(){
var box=$("#mkfx");if(!st.fxSeries){return}var dates=Object.keys(st.fxSeries).sort(),others=CUR.filter(function(c){return c!==st.cur});if(!st.fxPair||st.fxPair===st.cur)st.fxPair=others[0];
box.innerHTML='<table class="mkt2 fxt"><thead><tr><th>'+esc(MK.pair)+"</th><th>"+esc(MK.rate)+"</th><th>24h</th><th>30j</th><th>"+esc(MK.chart7)+"</th></tr></thead><tbody>"+others.map(function(c){var a=dates.map(function(dt){return st.fxSeries[dt][c]}),l=a[a.length-1],p=a[a.length-2],m=a[Math.max(0,a.length-22)];
return '<tr data-p="'+c+'"'+(c===st.fxPair?' class="on"':"")+"><td><b>"+st.cur+"/"+c+"</b></td><td>"+nf(l,l<10?4:2)+"</td><td>"+pc((l/p-1)*100)+"</td><td>"+pc((l/m-1)*100)+"</td><td>"+spark(a.slice(-30),l>=m)+"</td></tr>"}).join("")+'</tbody></table><div id="mkfxc" class="cv sm"></div><p class="mkn">'+esc(MK.fxn)+"</p>";
$$("tr[data-p]",box).forEach(function(r){r.onclick=function(){st.fxPair=r.getAttribute("data-p");renderFx()}});
var s=dates.map(function(dt){return [new Date(dt).getTime(),st.fxSeries[dt][st.fxPair]]});lineChart($("#mkfxc"),s,"line",60,function(v){return nf(v,v<10?4:2)})}

/* ---------- converter ---------- */
function unit(code){ /* value of 1 code in st.cur */
if(CUR.indexOf(code)>=0){if(!st.rEUR)return null;return st.rEUR[st.cur]/st.rEUR[code]}
var c=st.coins.filter(function(x){return x.id===code})[0];return c?c.current_price:null}
function opts(sel){return '<optgroup label="'+esc(MK.fiat)+'">'+CUR.map(function(c){return '<option value="'+c+'"'+(c===sel?" selected":"")+">"+c+"</option>"}).join("")+'</optgroup><optgroup label="Crypto">'+st.coins.slice(0,40).map(function(c){return '<option value="'+c.id+'"'+(c.id===sel?" selected":"")+">"+esc(c.symbol.toUpperCase())+" — "+esc(c.name)+"</option>"}).join("")+"</optgroup>"}
function buildConv(){$("#mkconv").innerHTML='<div class="cvr"><input type="number" id="cva" value="1" min="0" step="any" aria-label="'+esc(MK.amount)+'"><select id="cvf"></select></div><div class="cvr"><button type="button" id="cvs" class="mkb" aria-label="swap">⇅</button></div><div class="cvr"><output id="cvo" class="cvo">—</output><select id="cvt"></select></div>';fillConv();["cva","cvf","cvt"].forEach(function(i){$("#"+i).oninput=calcConv;$("#"+i).onchange=calcConv});$("#cvs").onclick=function(){var f=$("#cvf").value,t=$("#cvt").value;$("#cvf").value=t;$("#cvt").value=f;calcConv()}}
function fillConv(){var f=$("#cvf"),t=$("#cvt");if(!f)return;var fv=f.value||"bitcoin",tv=t.value||st.cur;if(!st.coins.length&&!fv)return;f.innerHTML=opts(fv);t.innerHTML=opts(tv);f.value=fv;t.value=tv;calcConv()}
function calcConv(){var f=$("#cvf").value,t=$("#cvt").value,a=parseFloat($("#cva").value),u=unit(f),w=unit(t),o=$("#cvo");if(isNaN(a)||!u||!w){o.textContent="—";return}var v=a*u/w;o.textContent=nf(v,v<1?8:v<1000?4:2)}

/* ---------- portfolio ---------- */
function fxu(from){if(from===st.cur)return 1;if(!st.rEUR)return null;return st.rEUR[st.cur]/st.rEUR[from]}
function renderPf(){
var box=$("#mkpf");if(!box)return;
var rows="",tv=0,tc=0;
st.pf.forEach(function(p,i){var c=st.coins.filter(function(x){return x.id===p.id})[0],k=fxu(p.cur);if(!c||k==null)return;var val=p.qty*c.current_price,cost=p.qty*p.cost*k,pl=val-cost;tv+=val;tc+=cost;rows+='<tr><td><img src="'+esc(c.image)+'" width="18" height="18" alt=""> <b>'+esc(c.symbol.toUpperCase())+"</b></td><td>"+nf(p.qty,6)+"</td><td>"+money(val)+'</td><td class="'+(pl>=0?"up":"dn")+'">'+(pl>=0?"+":"")+money(pl)+"<br><small>"+(cost?((pl/cost)*100).toFixed(1):"0")+'%</small></td><td><button type="button" class="star" data-rm="'+i+'" aria-label="'+esc(MK.remove)+'">✕</button></td></tr>'});
var coinOpt=st.coins.slice(0,40).map(function(c){return '<option value="'+c.id+'">'+esc(c.symbol.toUpperCase())+" — "+esc(c.name)+"</option>"}).join("");
box.innerHTML='<div class="pff"><select id="pfc">'+coinOpt+'</select><input type="number" id="pfq" min="0" step="any" placeholder="'+esc(MK.qty)+'"><input type="number" id="pfp" min="0" step="any" placeholder="'+esc(MK.buyp)+" ("+st.cur+')"><button type="button" id="pfa" class="mkb on">+ '+esc(MK.add)+"</button></div>"+
(rows?'<table class="mkt2"><thead><tr><th>'+esc(MK.coin)+"</th><th>"+esc(MK.qty)+"</th><th>"+esc(MK.value)+"</th><th>"+esc(MK.pnl)+"</th><th></th></tr></thead><tbody>"+rows+'</tbody></table><div class="pft">'+esc(MK.total)+" : <b>"+money(tv)+'</b> · <span class="'+(tv-tc>=0?"up":"dn")+'">'+(tv-tc>=0?"+":"")+money(tv-tc)+" ("+(tc?((tv-tc)/tc*100).toFixed(1):"0")+"%)</span></div>":'<p class="mkn">'+esc(MK.empty)+"</p>");
$("#pfa").onclick=function(){var q=parseFloat($("#pfq").value),p=parseFloat($("#pfp").value);if(!(q>0)||!(p>=0))return;st.pf.push({id:$("#pfc").value,qty:q,cost:p,cur:st.cur});sv("iv_pf_v1",JSON.stringify(st.pf));renderPf()};
$$("[data-rm]",box).forEach(function(b){b.onclick=function(){st.pf.splice(+b.getAttribute("data-rm"),1);sv("iv_pf_v1",JSON.stringify(st.pf));renderPf()}})}

/* ---------- calculators ---------- */
function field(id,l,v){return '<label class="fld"><span>'+esc(l)+'</span><input type="number" id="'+id+'" step="any" value="'+(v==null?"":v)+'"></label>'}
function buildCalc(){$("#mkcalc").innerHTML='<div class="fg">'+field("kb",MK.buy,"")+field("ks",MK.sell,"")+field("kq",MK.qty,1)+field("kf",MK.fees,0.1)+'</div><div class="ko" id="kout">—</div>';["kb","ks","kq","kf"].forEach(function(i){$("#"+i).oninput=calc})}
function calc(){var b=+$("#kb").value,s=+$("#ks").value,q=+$("#kq").value,f=+$("#kf").value/100,o=$("#kout");if(!(b>0&&s>0&&q>0)){o.textContent="—";return}var cost=b*q*(1+f),rev=s*q*(1-f),p=rev-cost;o.innerHTML=esc(MK.profit)+' : <b class="'+(p>=0?"up":"dn")+'">'+(p>=0?"+":"")+nf(p,2)+"</b> · ROI <b class=\""+(p>=0?"up":"dn")+'">'+(p/cost*100).toFixed(2)+"%</b><br><small>"+esc(MK.fees.replace(/\s*\(%\)/,""))+" : "+nf(b*q*f+s*q*f,2)+"</small>"}
function buildRisk(){$("#mkrisk").innerHTML='<div class="fg">'+field("ra",MK.acct,10000)+field("rp",MK.riskp,1)+field("re",MK.entry,"")+field("rs",MK.stop,"")+'</div><div class="ko" id="rout">—</div>';["ra","rp","re","rs"].forEach(function(i){$("#"+i).oninput=riskc})}
function riskc(){var a=+$("#ra").value,p=+$("#rp").value/100,e=+$("#re").value,s=+$("#rs").value,o=$("#rout");if(!(a>0&&p>0&&e>0&&s>0&&e!==s)){o.textContent="—";return}var risk=a*p,d=Math.abs(e-s),q=risk/d;o.innerHTML=esc(MK.size)+' : <b>'+nf(q,6)+"</b> ("+nf(q*e,2)+")<br><small>"+esc(MK.riskamt)+" : "+nf(risk,2)+" · "+esc(MK.dist)+" : "+(d/e*100).toFixed(2)+"%</small>"}

/* ---------- TradingView widgets ---------- */
var TVL={fr:"fr",en:"en",de:"de_DE",es:"es",pt:"br"}[LG]||"en";
var WT=[["chart","w_chart"],["overview","w_over"],["heat","w_heat"],["hot","w_hot"],["cheat","w_crypto"],["fxr","w_fx"],["cal","w_cal"]];
function tv(box,type,cfg,h){box.innerHTML="";box.style.height=h+"px";var c=document.createElement("div");c.className="tradingview-widget-container";c.style.cssText="height:100%;width:100%";var w=document.createElement("div");w.className="tradingview-widget-container__widget";w.style.cssText="height:100%;width:100%";c.appendChild(w);var s=document.createElement("script");s.src="https://s3.tradingview.com/external-embedding/embed-widget-"+type+".js";s.async=true;s.text=JSON.stringify(cfg);c.appendChild(s);box.appendChild(c)}
function widget(k){var box=$("#mkw"),L=TVL,base={colorTheme:"dark",isTransparent:true,locale:L,width:"100%",height:"100%"};
if(k==="chart")tv(box,"advanced-chart",{autosize:true,symbol:st.marketView==="stocks"?"NASDAQ:AAPL":"BITSTAMP:BTCUSD",interval:"D",timezone:"Europe/Luxembourg",theme:"dark",style:"1",locale:L,allow_symbol_change:true,calendar:false,hide_side_toolbar:false,details:true,hotlist:true,support_host:"https://www.tradingview.com"},620);
if(k==="overview")tv(box,"market-overview",Object.assign({},base,{dateRange:"12M",showChart:true,showSymbolLogo:true,showFloatingTooltip:true,tabs:[{title:MK.idx,symbols:[{s:"FOREXCOM:SPXUSD",d:"S&P 500"},{s:"FOREXCOM:NSXUSD",d:"Nasdaq 100"},{s:"FOREXCOM:DJI",d:"Dow Jones"},{s:"INDEX:NKY",d:"Nikkei 225"},{s:"INDEX:DEU40",d:"DAX 40"},{s:"FOREXCOM:UKXGBP",d:"FTSE 100"}]},{title:MK.comm,symbols:[{s:"OANDA:XAUUSD",d:MK.gold},{s:"OANDA:XAGUSD",d:MK.silver},{s:"TVC:USOIL",d:MK.oil},{s:"TVC:UKOIL",d:"Brent"},{s:"CAPITALCOM:NATURALGAS",d:MK.gas}]},{title:"Forex",symbols:[{s:"FX:EURUSD",d:"EUR/USD"},{s:"FX:GBPUSD",d:"GBP/USD"},{s:"FX:USDJPY",d:"USD/JPY"},{s:"FX:USDCHF",d:"USD/CHF"},{s:"FX:EURCHF",d:"EUR/CHF"}]}],height:"100%"}),620);
if(k==="heat")tv(box,"stock-heatmap",Object.assign({},base,{exchanges:[],dataSource:"SPX500",grouping:"sector",blockSize:"market_cap_basic",blockColor:"change",symbolUrl:"",hasTopBar:true,isDataSetEnabled:true,isZoomEnabled:true,hasSymbolTooltip:true,isMonoSize:false}),620);
if(k==="hot")tv(box,"hotlists",Object.assign({},base,{dateRange:"12M",exchange:"US",showChart:true,largeChartUrl:"",showSymbolLogo:true,showFloatingTooltip:false}),620);
if(k==="cheat")tv(box,"crypto-coins-heatmap",Object.assign({},base,{dataSource:"Crypto",blockSize:"market_cap_calc",blockColor:"change",symbolUrl:"",hasTopBar:true,isDataSetEnabled:true,isZoomEnabled:true,hasSymbolTooltip:true,isMonoSize:false}),620);
if(k==="fxr")tv(box,"forex-cross-rates",Object.assign({},base,{currencies:["EUR","USD","JPY","GBP","CHF","AUD","CAD","CNY"]}),460);
if(k==="cal")tv(box,"events",Object.assign({},base,{importanceFilter:"-1,0,1",countryFilter:"us,eu,gb,fr,de,jp,cn"}),620);
box.insertAdjacentHTML("beforeend",'<div class="tvc2"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">TradingView</a></div>')}
var widgetObserver;
function buildWidgetTabs(){
 if(widgetObserver)widgetObserver.disconnect();
 var list=WT.filter(function(w){return st.marketView==="stocks"?w[0]!=="cheat":["chart","cheat"].indexOf(w[0])>=0}),first=st.marketView==="stocks"?"overview":"chart",b=$("#mkwt");
 b.innerHTML=list.map(function(w){return '<button type="button" data-w="'+w[0]+'"'+(w[0]===first?' class="on"':"")+">"+esc(MK[w[1]])+"</button>"}).join("");
 $$("button",b).forEach(function(x){x.onclick=function(){$$("button",b).forEach(function(y){y.classList.remove("on")});x.classList.add("on");widget(x.getAttribute("data-w"))}});
 var done=false;function go(){if(done)return;done=true;widget(first)}
 if("IntersectionObserver" in window){widgetObserver=new IntersectionObserver(function(e){if(e[0].isIntersecting){widgetObserver.disconnect();go()}},{rootMargin:"200px"});widgetObserver.observe($("#mkw"))}else go();
}

/* ---------- live ticker (Binance websocket) ---------- */
var TK=[["btcusdt","BTC"],["ethusdt","ETH"],["solusdt","SOL"],["bnbusdt","BNB"],["xrpusdt","XRP"],["dogeusdt","DOGE"],["adausdt","ADA"]],ws=null,tkv={},tkTry=0;
function drawTicker(){var b=$("#mktick");if(!b)return;var u=st.cur==="USD"?1:(st.rEUR?st.rEUR[st.cur]/st.rEUR.USD:null);b.innerHTML=TK.map(function(t){var d=tkv[t[0]];if(!d){var c=st.coins.filter(function(x){return x.symbol.toUpperCase()===t[1]})[0];return '<div class="tk"><b>'+t[1]+"</b><span>"+(c?money(c.current_price):"…")+"</span>"+(c?pc(c.price_change_percentage_24h_in_currency):"")+"</div>"}
var p=d.c*(u||1);return '<div class="tk '+(d.dir||"")+'"><b>'+t[1]+"</b><span>"+(u?money(p):"$"+nf(d.c,2))+"</span>"+pc((d.c/d.o-1)*100)+"</div>"}).join("")}
function openWs(){if(ws||tkTry>2)return;try{ws=new WebSocket("wss://stream.binance.com:9443/stream?streams="+TK.map(function(t){return t[0]+"@miniTicker"}).join("/"))}catch(e){tkTry=9;return}
var last=0;ws.onmessage=function(m){try{var d=JSON.parse(m.data).data,k=d.s.toLowerCase(),c=+d.c,o=+d.o,p=tkv[k];tkv[k]={c:c,o:o,dir:p?(c>p.c?"u":c<p.c?"d":""):""}}catch(e){return}var n=Date.now();if(n-last>900){last=n;drawTicker()}};
ws.onclose=function(){ws=null;tkTry++;if(root.hidden===false)setTimeout(openWs,4000)};ws.onerror=function(){try{ws.close()}catch(e){}}}
function closeWs(){if(ws){var w=ws;ws=null;tkTry=0;try{w.onclose=null;w.close()}catch(e){}}}

/* ---------- orchestration ---------- */
function refreshAll(full){if(st.marketView==="crypto"){loadStats();loadCoins().then(function(){drawTicker()});}if(full){loadFx();var q=$("#pfp");if(q)q.placeholder=MK.buyp+" ("+st.cur+")"}}
function init(){if(st.inited)return;st.inited=true;build();refreshAll(true);drawTicker()}
function show(v,push,marketView){
 var m=v==="mkt",next=marketView==="stocks"?"stocks":"crypto",changed=st.marketView!==next;if(m)st.marketView=next;
 vw.hidden=m;root.hidden=!m;
 $$("button[data-v]",tabs).forEach(function(b){var on=b.getAttribute("data-v")===v&&(!m||(b.dataset.marketView||"crypto")===st.marketView);b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});
 if(push!==false){try{history.replaceState(null,"",m?(st.marketView==="stocks"?"#stocks":"#markets"):location.pathname+location.search)}catch(e){}}
 clearInterval(st.timer);
 if(m){var wasInited=st.inited;init();if(wasInited&&changed){applyMarketView();refreshAll(true)}if(st.marketView==="crypto"){openWs();st.timer=setInterval(function(){if(!document.hidden)loadCoins().then(function(){drawTicker()})},60000)}else closeWs();}
 else{closeWs();try{if(typeof rescale==="function")rescale()}catch(e){}}
 window.scrollTo(0,0)}
$$("button[data-v]",tabs).forEach(function(b){b.onclick=function(){show(b.getAttribute("data-v"),true,b.dataset.marketView)}});
window.addEventListener("hashchange",function(){show(["#markets","#stocks"].indexOf(location.hash)>=0?"mkt":"world",false,location.hash==="#stocks"?"stocks":"crypto")});
if(["#markets","#stocks"].indexOf(location.hash)>=0)setTimeout(function(){show("mkt",false,location.hash==="#stocks"?"stocks":"crypto")},60);
})();
