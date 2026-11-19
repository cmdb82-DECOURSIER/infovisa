import {mountPublicCameras} from './public-cameras.js?v=c4982c9082c6';
import {isLuxembourgPlace} from './lux-live.js?v=c4982c9082c6';
/* Nearby webcams: licensed Windy players plus geographically matched source links. */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rows={
 title:['Webcams autour de','Webcams near','Webcams bei','Webcams cerca de','Webcams perto de'],
 eyebrow:['LE RIVAGE EN IMAGES','A VIEW OF THE SHORE','BLICK AUF DIE KÜSTE','LA COSTA EN IMÁGENES','A COSTA EM IMAGENS'],
 intro:['Les caméras suivent la destination sélectionnée.','Cameras follow your selected destination.','Die Kameras folgen Ihrem ausgewählten Reiseziel.','Las cámaras siguen el destino seleccionado.','As câmaras acompanham o destino selecionado.'],
 radius:['Rayon de recherche','Search radius','Suchradius','Radio de búsqueda','Raio de pesquisa'],
 refresh:['Actualiser les webcams','Refresh webcams','Webcams aktualisieren','Actualizar cámaras','Atualizar webcams'],
 loading:['Recherche des webcams à proximité…','Finding nearby webcams…','Webcams in der Nähe werden gesucht…','Buscando cámaras cercanas…','A procurar webcams próximas…'],
 count:['caméra(s) à proximité','nearby camera(s)','Kamera(s) in der Nähe','cámara(s) cercana(s)','câmara(s) próxima(s)'],
 empty:['Aucune caméra disponible dans ce rayon. Essayez un rayon plus large.','No cameras available within this radius. Try a wider search.','Keine Kamera in diesem Umkreis verfügbar. Erweitern Sie den Suchradius.','No hay cámaras disponibles en este radio. Amplíe la búsqueda.','Não há câmaras disponíveis neste raio. Experimente uma área maior.'],
 unavailable:['Le catalogue Windy est momentanément indisponible. Les liens locaux restent accessibles ci-dessous.','The Windy catalogue is temporarily unavailable. Local source links remain available below.','Der Windy-Katalog ist vorübergehend nicht verfügbar. Lokale Quellen finden Sie unten.','El catálogo Windy no está disponible temporalmente. Los enlaces locales siguen disponibles abajo.','O catálogo Windy está temporariamente indisponível. As ligações locais continuam disponíveis abaixo.'],
 retry:['Réessayer','Retry','Erneut versuchen','Reintentar','Tentar novamente'],
 view:['Voir la webcam','View webcam','Webcam ansehen','Ver cámara','Ver webcam'],
 live:['Vidéo en direct','Live video','Live-Video','Vídeo en directo','Vídeo em direto'],
 timelapse:['Images actualisées · timelapse','Updated images · timelapse','Aktualisierte Bilder · Zeitraffer','Imágenes actualizadas · secuencia','Imagens atualizadas · sequência'],
 unknown:['Image disponible chez le fournisseur','Image available at source','Bild beim Anbieter verfügbar','Imagen disponible en la fuente','Imagem disponível na fonte'],
 captured:['Dernière image','Latest image','Letztes Bild','Última imagen','Última imagem'],
 source:['Ouvrir chez Windy','Open on Windy','Auf Windy öffnen','Abrir en Windy','Abrir no Windy'],
 provided:['Webcams fournies par','Webcams provided by','Webcams bereitgestellt von','Cámaras proporcionadas por','Webcams fornecidas por'],
 add:['Ajouter une webcam','Add a webcam','Webcam hinzufügen','Añadir una cámara','Adicionar uma webcam'],
 rights:['Images et lecteurs utilisés selon les conditions du fournisseur, avec attribution.','Images and players used under the provider’s terms, with attribution.','Bilder und Player gemäß den Bedingungen des Anbieters mit Quellenangabe.','Imágenes y reproductores utilizados según las condiciones del proveedor, con atribución.','Imagens e leitores utilizados segundo as condições do fornecedor, com atribuição.'],
 local:['Autres webcams locales','More local webcams','Weitere lokale Webcams','Otras cámaras locales','Outras webcams locais'],
 external:['Consulter la webcam à la source','View webcam at source','Webcam beim Anbieter ansehen','Consultar la cámara en la fuente','Consultar a webcam na fonte'],
 externalNote:['Consultation sur le site du fournisseur.','View on the provider’s website.','Ansicht auf der Website des Anbieters.','Consulta en el sitio del proveedor.','Consulta no sítio do fornecedor.'],
 close:['Fermer la webcam','Close webcam','Webcam schließen','Cerrar cámara','Fechar webcam'],
 consent:['Pour afficher le lecteur ici, autorisez les cookies médias dans vos préférences. Vous pouvez aussi ouvrir la webcam chez le fournisseur.','To show the player here, allow media cookies in your preferences. You can also open the webcam on the provider’s website.','Erlauben Sie Medien-Cookies in Ihren Einstellungen, um den Player hier anzuzeigen. Sie können die Webcam auch beim Anbieter öffnen.','Para mostrar el reproductor aquí, permita las cookies de medios en sus preferencias. También puede abrir la cámara en el sitio del proveedor.','Para apresentar o leitor aqui, autorize os cookies de multimédia nas suas preferências. Pode também abrir a webcam no fornecedor.'],
 preferences:['Gérer mes préférences cookies','Manage cookie preferences','Cookie-Einstellungen verwalten','Gestionar preferencias de cookies','Gerir preferências de cookies'],
 playerNote:['Le mode timelapse montre des captures successives ; il ne s’agit pas d’une vidéo continue en direct.','Timelapse shows successive snapshots, rather than continuous live video.','Der Zeitraffer zeigt aufeinanderfolgende Aufnahmen statt eines durchgehenden Live-Videos.','La secuencia muestra capturas sucesivas, no un vídeo continuo en directo.','A sequência mostra capturas sucessivas, não um vídeo contínuo em direto.'],
 mosaic:['Mosaïque','Mosaic','Mosaik','Mosaico','Mosaico'],
 compare:['Comparer les caméras','Compare cameras','Kameras vergleichen','Comparar cámaras','Comparar câmaras'],
 select:['Ajouter à la mosaïque','Add to mosaic','Zum Mosaik hinzufügen','Añadir al mosaico','Adicionar ao mosaico'],
 selected:['Dans la mosaïque','In mosaic','Im Mosaik','En el mosaico','No mosaico'],
 clear:['Vider la sélection','Clear selection','Auswahl leeren','Vaciar selección','Limpar seleção'],
 directory:['Explorer la carte des webcams','Explore the webcam map','Webcam-Karte erkunden','Explorar el mapa de cámaras','Explorar o mapa de webcams']
};
const safe=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}};
const windy=value=>{const url=safe(value);if(!url)return null;const host=new URL(url).hostname;return host==='windy.com'||host.endsWith('.windy.com')?url:null;};
function km(a,b,c,d){const r=Math.PI/180,x=Math.sin((c-a)*r/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin((d-b)*r/2)**2;return 12742*Math.asin(Math.min(1,Math.sqrt(x)));}
let instance=0;
export function mountWebcams(root){
 const headingId='km-webcam-title-'+(++instance);root.setAttribute('aria-labelledby',headingId);
 const locale=['fr','en','de','es','pt'].includes(document.documentElement.lang)?document.documentElement.lang:'fr',i=['fr','en','de','es','pt'].indexOf(locale),t=key=>rows[key][i];
 let place=null,radius=25,alive=true,sequence=0,controller,catalog=[],cameras=[],pending=null,lastLoaded=0,selected=[];
 const events=new AbortController(),$=s=>root.querySelector(s),fmt=n=>n.toLocaleString(locale,{maximumFractionDigits:1});
 root.dataset.i18nSkip='';
 root.innerHTML=`<div class="km-section-heading"><div><p class="km-eyebrow">${t('eyebrow')}</p><h2 id="${headingId}">${t('title')} <span data-camera-place></span></h2><p>${t('intro')}</p></div><div class="km-webcam-tools"><label>${t('radius')}<select data-camera-radius>${[10,25,50,100].map(n=>`<option value="${n}" ${n===radius?'selected':''}>${n} km</option>`).join('')}</select></label><button type="button" data-camera-refresh>${t('refresh')} ↻</button></div></div><p data-camera-status role="status"></p><div class="km-mosaic-tools"><button type="button" data-camera-mosaic disabled>▦ ${t('mosaic')} · <span data-camera-count>0/4</span></button><button type="button" data-camera-clear hidden>${t('clear')}</button></div><div class="km-nearby-cameras"></div><div class="km-camera-viewer" hidden></div><div data-camera-local></div><div class="km-webcam-attribution"><p>${t('provided')} <a href="https://www.windy.com/" target="_blank" rel="noopener">Windy.com</a> · <a href="https://www.windy.com/webcams/add" target="_blank" rel="noopener">${t('add')}</a></p><p>${t('rights')} <a href="https://api.windy.com/webcams/terms" target="_blank" rel="noopener">Windy ↗</a></p><a data-camera-directory target="_blank" rel="noopener">${t('directory')} ↗</a></div>`;
 const oldContent=root.innerHTML;root.innerHTML='<section data-public-cameras></section><details class="iv-windy-optional"><summary>Windy · '+t('local')+'</summary>'+oldContent+'</details>';const publicPanel=mountPublicCameras($('[data-public-cameras]'));root.insertBefore($('[data-camera-local]'),root.querySelector('details'));
 const catalogPromise=fetch('/assets/live/assets/webcams.json').then(r=>r.ok?r.json():Promise.reject()).then(j=>{if(alive){catalog=j.cameras||[];renderLocal();}}).catch(()=>{});
 function renderLocal(){if(!place)return;if(isLuxembourgPlace(place)){$('[data-camera-local]').replaceChildren();return;}const list=catalog.filter(c=>Number.isFinite(c.lat)&&Number.isFinite(c.lon)&&km(place.lat,place.lon,c.lat,c.lon)<=radius&&safe(c.pageUrl));$('[data-camera-local]').innerHTML=list.length?`<h3>${t('local')}</h3><div class="km-local-cameras">${list.map(c=>`<a class="km-local-camera" href="${esc(safe(c.pageUrl))}" target="_blank" rel="noopener"><span>◉</span><div><strong>${esc(c.name)}</strong><small>${esc(c.provider)} · ${fmt(km(place.lat,place.lon,c.lat,c.lon))} km</small><p>${t('externalNote')}</p><b>${t('external')} ↗</b></div></a>`).join('')}</div>`:'';}
 function closePlayer(){pending=null;$('.km-camera-viewer').replaceChildren();$('.km-camera-viewer').hidden=true;}
 function render(){
  $('[data-camera-count]').textContent=selected.length+'/4';$('[data-camera-mosaic]').disabled=!selected.length;$('[data-camera-clear]').hidden=!selected.length;
  $('.km-nearby-cameras').innerHTML=cameras.length?cameras.map(c=>{const image=windy(c.imageUrl),page=windy(c.pageUrl),date=new Date(c.updatedAt),dateText=c.updatedAt&&Number.isFinite(date.getTime())?date.toLocaleString(locale,{dateStyle:'short',timeStyle:'short'}):'';return `<article class="km-nearby-camera"><a class="km-windy-image" href="${esc(page)}" target="_blank" rel="noopener">${image?`<img src="${esc(image)}" alt="${esc(c.name)}" loading="lazy" style="max-width:${Number(c.imageWidth)||200}px" data-camera-preview>`:`<span>${t('unknown')} ↗</span>`}<span class="km-camera-kind">${t(c.kind==='live'?'live':'timelapse')}</span></a><div><h3>${esc(c.name)}</h3><p>${esc([c.city,c.country].filter(Boolean).join(' · '))} · ${fmt(c.distanceKm)} km</p>${dateText?`<small>${t('captured')} · ${esc(dateText)}</small>`:''}<div class="km-camera-actions">${windy(c.playerUrl)?`<button type="button" class="km-camera-select" data-camera-select="${esc(c.id)}" aria-pressed="${selected.some(s=>s.id===c.id)}" ${selected.length>=4&&!selected.some(s=>s.id===c.id)?'disabled':''}>${selected.some(s=>s.id===c.id)?'✓ '+t('selected'):'+ '+t('select')}</button>`:''}${windy(c.playerUrl)?`<button type="button" data-camera-play="${esc(c.id)}">▶ ${t('view')}</button>`:''}<a href="${esc(page)}" target="_blank" rel="noopener">Windy ↗</a></div></div></article>`;}).join(''):`<div class="km-camera-empty"><h3>${t('empty')}</h3></div>`;
 }
 function showMany(list){
  pending=list.filter(c=>windy(c.playerUrl)).slice(0,4);if(!pending.length)return;
  const box=$('.km-camera-viewer');box.hidden=false;box.innerHTML=`<div class="km-camera-viewer-heading"><h3>${pending.length===1?esc(pending[0].name):t('compare')}</h3><button type="button" data-camera-close aria-label="${t('close')}">×</button></div>`;
  if(window.Cookiebot?.consent?.marketing===true){
   const grid=document.createElement('div');grid.className='km-mosaic-grid'+(pending.length===1?' is-single':'');
   for(const c of pending){const tile=document.createElement('article'),frame=document.createElement('iframe');frame.src=windy(c.playerUrl);frame.title=c.name;frame.allow='fullscreen';frame.setAttribute('allowfullscreen','');frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups allow-presentation');frame.referrerPolicy='strict-origin-when-cross-origin';tile.append(frame);tile.insertAdjacentHTML('beforeend',`<p>${esc(c.name)} · ${t(c.kind==='live'?'live':'timelapse')}</p><a href="${esc(windy(c.pageUrl))}" target="_blank" rel="noopener">${t('source')} ↗</a>`);grid.append(tile);}box.append(grid);
   if(pending.some(c=>c.kind!=='live'))box.insertAdjacentHTML('beforeend',`<p>${t('playerNote')}</p>`);
  }else box.insertAdjacentHTML('beforeend',`<p>${t('consent')}</p>${window.Cookiebot?.renew?`<button type="button" data-camera-consent>${t('preferences')}</button>`:''}${pending.map(c=>`<p><a href="${esc(windy(c.pageUrl))}" target="_blank" rel="noopener">${esc(c.name)} · ${t('source')} ↗</a></p>`).join('')}`);
 }
 function show(c){showMany([c]);}
 async function load(){
  if(!place||!alive||isLuxembourgPlace(place)||!$('.iv-windy-optional').open)return;const seq=++sequence;controller?.abort();controller=new AbortController();cameras=[];closePlayer();$('[data-camera-place]').textContent=place.name;$('[data-camera-status]').textContent=t('loading');$('.km-nearby-cameras').innerHTML='';$('[data-camera-directory]').href=`https://www.windy.com/webcams?${place.lat.toFixed(3)},${place.lon.toFixed(3)},11`;renderLocal();
  try{const params=new URLSearchParams({lat:String(place.lat),lon:String(place.lon),radius:String(radius),lang:locale});const r=await fetch('/api/webcams?'+params,{signal:controller.signal});if(!r.ok)throw Error('unavailable');const j=await r.json();if(!alive||seq!==sequence)return;if(!Array.isArray(j.cameras))throw Error('invalid');lastLoaded=Date.now();cameras=j.cameras.filter(c=>windy(c.pageUrl)&&Number.isFinite(c.distanceKm)&&c.distanceKm<=radius);$('[data-camera-status]').textContent=`${cameras.length} ${t('count')} · ${radius} km`;render();}
  catch(e){if(!alive||seq!==sequence||e.name==='AbortError')return;$('[data-camera-status]').textContent=t('unavailable');$('.km-nearby-cameras').innerHTML=`<button type="button" class="km-camera-retry" data-camera-refresh>${t('retry')} ↻</button>`;}
 }
 root.addEventListener('change',e=>{if(e.target.matches('[data-camera-radius]')){radius=Number(e.target.value);load();}},{signal:events.signal});
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-camera-refresh'))load();if(b.hasAttribute('data-camera-clear')){selected=[];closePlayer();render();}if(b.hasAttribute('data-camera-mosaic'))showMany(selected);if(b.dataset.cameraSelect){const c=cameras.find(c=>c.id===b.dataset.cameraSelect);if(c){if(selected.some(s=>s.id===c.id))selected=selected.filter(s=>s.id!==c.id);else if(selected.length<4)selected.push({...c});render();}}if(b.hasAttribute('data-camera-close'))closePlayer();if(b.hasAttribute('data-camera-consent'))window.Cookiebot?.renew();if(b.dataset.cameraPlay){const c=cameras.find(c=>c.id===b.dataset.cameraPlay);if(c)show(c);}},{signal:events.signal});
 root.addEventListener('error',e=>{if(e.target.matches?.('[data-camera-preview]')){const text=document.createElement('span');text.textContent=t('unknown')+' ↗';e.target.replaceWith(text);}},{capture:true,signal:events.signal});
 window.addEventListener('CookiebotOnAccept',()=>{if(pending&&window.Cookiebot?.consent?.marketing===true)showMany(pending);},{signal:events.signal});
 window.addEventListener('CookiebotOnDecline',closePlayer,{signal:events.signal});
 $('.iv-windy-optional').addEventListener('toggle',()=>{if($('.iv-windy-optional').open)load();else{sequence++;controller?.abort();closePlayer();}},{signal:events.signal});
 const refreshIfStale=()=>{if(alive&&place&&!pending&&!document.hidden&&!root.closest('[hidden]')&&Date.now()-lastLoaded>240000)load();};
 const refreshTimer=setInterval(refreshIfStale,300000);
 window.addEventListener('visibilitychange',refreshIfStale,{signal:events.signal});
 const visibilityRoot=root.closest('.iv-extra')||root;
 const visibilityObserver=new MutationObserver(()=>{if(visibilityRoot.hidden)closePlayer();else refreshIfStale();});visibilityObserver.observe(visibilityRoot,{attributes:true,attributeFilter:['hidden']});
 return {select(next){place={...next};const lux=isLuxembourgPlace(next);const optional=$('.iv-windy-optional');optional.hidden=lux;if(lux){sequence++;controller?.abort();closePlayer();optional.open=false;$('.km-nearby-cameras').replaceChildren();$('[data-camera-local]').replaceChildren();selected=[];}renderLocal();publicPanel.select(next);load();},destroy(){publicPanel.destroy();alive=false;clearInterval(refreshTimer);visibilityObserver.disconnect();controller?.abort();events.abort();closePlayer();},ready:catalogPromise};
}
