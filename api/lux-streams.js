/* Resolve the public streams actually published on the official ACL webcam page.
 * Playback stays direct from RTL; this endpoint never copies or proxies video. */
const SOURCE='https://www.acl.lu/fr/mobilite/informations-trafic/webcams/';
const ROADS={a1:'A1 · Luxembourg — Trèves',a3:'A3 · Luxembourg — Metz',a4:'A4 · Luxembourg — Esch',a6:'A6 · Luxembourg — Arlon',a7:'A7 · Luxembourg — Ettelbrück',a13:'A13 · Pétange — Schengen'};
function parse(html){
 const text=html.replace(/\\u002F/gi,'/').replace(/&amp;/g,'&');const urls=[...new Set(text.match(/https:\/\/[^"\s<>]+\.m3u8/g)||[])];const streams=[];
 for(const url of urls){let id,name,credit,kind;const road=url.match(/^https:\/\/live-edge\.rtl\.lu\/cita\/cita_(a1|a3|a4|a6|a7|a13)\/playlist\.m3u8$/);if(road){id=road[1];name=ROADS[id];credit='CITA · RTL · ACL';kind='route';}else if(/^https:\/\/stream\.rtl\.lu\/data\/live\/aclwebcams\/aclcamhh1\.stream\/(?:chunklist_w\d+|playlist)\.m3u8$/.test(url)){id='pont-rouge';name='Pont rouge · Kirchberg';credit='ACL · RTL';kind='bridge';}else continue;if(!streams.some(s=>s.id===id))streams.push({id,name,credit,kind,url,sourceUrl:SOURCE});}
 return streams.sort((a,b)=>a.id==='pont-rouge'?-1:b.id==='pont-rouge'?1:Object.keys(ROADS).indexOf(a.id)-Object.keys(ROADS).indexOf(b.id));
}
let cached;
async function handler(req,res){
 if(req.method&&req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'method_not_allowed'});}
 res.setHeader('X-Content-Type-Options','nosniff');
 try{if(!cached||Date.now()-cached.time>300000){const r=await fetch(SOURCE,{signal:AbortSignal.timeout(7000),redirect:'error'});if(!r.ok)throw Error();const text=await r.text();if(text.length>2000000)throw Error();const streams=parse(text);if(!streams.length)throw Error();cached={time:Date.now(),streams};}res.setHeader('Cache-Control','public, max-age=0, s-maxage=300, stale-while-revalidate=60');return res.status(200).json({streams:cached.streams,sourceUrl:SOURCE,catalogUpdatedAt:new Date(cached.time).toISOString()});}
 catch{res.setHeader('Cache-Control','no-store');return res.status(502).json({error:'lux_streams_unavailable',sourceUrl:SOURCE});}
}
module.exports=handler;module.exports._test={parse,SOURCE};
