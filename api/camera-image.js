/* Fixed public image origins; never accepts an arbitrary upstream URL. */
function upstream(q){
 if(q.provider==='cita'&&/^\d{1,6}$/.test(q.id||''))return 'https://www.cita.lu/info_trafic/cameras/images/cccam_'+q.id+'.jpg';
 if(q.provider==='caltrans'&&/^\/data\/d(?:[1-9]|1[0-2])\/cctv\/image\/[\w-]+\/[\w-]+\.jpg$/i.test(q.path||''))return 'https://cwwp2.dot.ca.gov'+q.path;
 if(q.provider==='singapore'&&/^\/api\/traffic-images\/\d{4}\/\d{2}\/[a-f\d-]+\.jpg$/i.test(q.path||''))return 'https://images.data.gov.sg'+q.path;
 return null;
}
async function handler(req,res){
 if(req.method&&req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
 const url=upstream(req.query||{});if(!url)return res.status(400).json({error:'invalid_camera'});
 try{const r=await fetch(url,{signal:AbortSignal.timeout(7000),redirect:'error'});let type=r.headers.get('content-type')?.split(';')[0];if(!r.ok||!(['image/jpeg','image/png'].includes(type)||(req.query.provider==='singapore'&&type==='application/octet-stream')))throw Error('image_unavailable');
 const reader=r.body.getReader(),chunks=[];let size=0;while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>3000000){await reader.cancel();throw Error('image_too_large');}chunks.push(Buffer.from(value));}
 const bytes=Buffer.concat(chunks);if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)type='image/jpeg';else if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))type='image/png';else throw Error('invalid_image');res.setHeader('Content-Type',type);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','public, max-age=0, s-maxage=30, stale-while-revalidate=30');const modified=r.headers.get('last-modified');if(modified)res.setHeader('Last-Modified',modified);return res.status(200).send(bytes);
 }catch{return res.status(502).json({error:'image_unavailable'});}
}
module.exports=handler;module.exports._test={upstream};
