import {mountFlashNews} from './flash-news.js';
import {getMapAlerts} from './news-alerts.js';
import {esc,labels,date} from './portal-utils.js';
const rows={
 title:['Alertes info','News alerts','Nachrichtenmeldungen','Alertas de noticias','Alertas de notícias'],
 recent:['Publié dans la dernière heure','Published in the last hour','In der letzten Stunde veröffentlicht','Publicado en la última hora','Publicado na última hora'],
 breaking:['Urgent · signalé par le média','Breaking · identified by source','Eilmeldung · vom Medium gekennzeichnet','Urgente · indicado por el medio','Urgente · indicado pela fonte'],
 live:['En direct · signalé par le média','Live · identified by source','Live · vom Medium gekennzeichnet','En directo · indicado por el medio','Em direto · indicado pela fonte'],
 note:['Source, lien et date contrôlés dans le flux du média ; les faits ne sont pas confirmés automatiquement. Les points indiquent le centre du pays associé aux lieux cités dans le titre, pas le lieu exact de l’événement.','Source, link and date checked against the publisher’s feed; facts are not automatically confirmed. Dots mark the centre of the country associated with places named in the headline, not the precise event location.','Quelle, Link und Datum anhand des Medienfeeds geprüft; keine automatische Bestätigung der Fakten. Punkte markieren das Zentrum eines im Titel genannten Landes, nicht den genauen Ereignisort.','Fuente, enlace y fecha comprobados en el canal del medio; los hechos no se confirman automáticamente. Los puntos marcan el centro de un país citado en el titular, no el lugar exacto.','Fonte, ligação e data verificadas no feed do meio; os factos não são confirmados automaticamente. Os pontos indicam o centro de um país citado no título, não o local exato.'],
 read:['Lire l’article','Read article','Artikel lesen','Leer artículo','Ler artigo'],
 loading:['Contrôle des flux des médias…','Checking publishers’ feeds…','Medienfeeds werden geprüft…','Comprobando los canales de los medios…','A verificar os feeds dos meios…'],
 empty:['Aucune alerte récente localisable pour le moment.','No recent alert can currently be located.','Derzeit keine aktuelle Meldung lokalisierbar.','No hay alertas recientes localizables por ahora.','Sem alertas recentes localizáveis neste momento.'],
 unavailable:['Alertes indisponibles · nouvelle tentative automatique','Alerts unavailable · automatic retry','Meldungen nicht verfügbar · automatischer Neuversuch','Alertas no disponibles · reintento automático','Alertas indisponíveis · nova tentativa automática'],
 checked:['Contrôle des sources','Source check','Quellenprüfung','Control de fuentes','Verificação das fontes'],
 country:['pays signalé','country marked','Land markiert','país señalado','país assinalado'],
 countries:['pays signalés','countries marked','Länder markiert','países señalados','países assinalados'],
 window:['dernière heure · actualisation chaque minute','last hour · refreshed every minute','letzte Stunde · Aktualisierung jede Minute','última hora · actualización cada minuto','última hora · atualização a cada minuto'],
 all:['Voir les alertes et les sources','View alerts and sources','Meldungen und Quellen ansehen','Ver alertas y fuentes','Ver alertas e fontes'],
 hidden:['Points masqués','Dots hidden','Punkte ausgeblendet','Puntos ocultos','Pontos ocultos'],
 sources:['Flux consultés','Feeds checked','Geprüfte Feeds','Canales consultados','Feeds consultados'],
 ok:['Disponible','Available','Verfügbar','Disponible','Disponível'],
 failed:['Indisponible','Unavailable','Nicht verfügbar','No disponible','Indisponível'],
 unlocated:['Sans pays identifié dans le titre','No country identified in headline','Kein Land im Titel identifiziert','Sin país identificado en el titular','Sem país identificado no título'],
};
export function mountMapNews(open){
 const {lang,t}=labels(rows),status=document.querySelector('#map-alert-status'),layerControls=document.querySelector('#layers');
 const carousel=mountFlashNews(document.querySelector('#map-news-carousel'));
 let payload=null,items=[],groups=new Map(),busy=false,failed=false,controller,alive=true,countries=[],openView=null,dialogSignature="";
 try{countries=JSON.parse(document.querySelector('#world-news-data')?.textContent||'{}').countries||[];}catch{}
 const onCountries=e=>{countries=e.detail.countries||countries;update();};
 function renderStatus(){
  if(!status)return;
  const checked=payload?.checkedAt&&Number.isFinite(Date.parse(payload.checkedAt))?date(payload.checkedAt,lang):'',hidden=document.querySelector('[data-map-layer="news"]')?.getAttribute('aria-pressed')==='false';
  if(!status.querySelector('[data-alerts-open]'))status.innerHTML=`<p></p><button type="button" data-alerts-open>${t('all')} ↗</button>`;
  status.querySelector('p').innerHTML=`${failed?t('unavailable'):!payload?t('loading'):groups.size?`<b>${groups.size}</b> ${t(groups.size===1?'country':'countries')} · ${t('window')}`:t('empty')}${hidden?' · '+t('hidden'):''}${checked?`<small>${t('checked')} · ${esc(checked)}</small>`:''}`;
 }
 function update(){
  items=getMapAlerts(payload,countries);groups=new Map();
  for(const item of items)for(const iso of item.countryIsos){if(!groups.has(iso))groups.set(iso,[]);groups.get(iso).push(item);}
  const rank={breaking:0,live:1,recent:2};
  const markers=[...groups].map(([iso,list])=>{list.sort((a,b)=>rank[a.kind]-rank[b.kind]||Date.parse(b.publishedAt)-Date.parse(a.publishedAt));const c=countries.find(c=>c.iso===iso),top=list[0];return {iso,kind:top.kind,label:(c?.name||iso)+' · '+t(top.kind)+' · '+top.source+' · '+date(top.publishedAt,lang)+' · '+top.title};});
  document.dispatchEvent(new CustomEvent('infovisa:news-markers',{detail:markers}));carousel.update({items,countries,checkedAt:payload?.checkedAt,failed,loaded:!!payload});renderStatus();syncDialog();
 }
 function selectedItems(iso){return iso?groups.get(iso)||[]:items;}
 function itemsSignature(list){return JSON.stringify({unavailable:!list.length&&failed,articles:list.slice(0,30).map(a=>[a.url,a.title,a.publishedAt,a.source,a.sourceUrl,a.kind,a.countryIsos.length])});}
 function articleMarkup(selected){
  if(!selected.length)return `<p class="iv-map-news-note">${failed?t('unavailable'):t('empty')}</p>`;
  return selected.slice(0,30).map(a=>`<article class="iv-map-news-item"><small>${t(a.kind)} · ${esc(date(a.publishedAt,lang))}</small><h3>${esc(a.title)}</h3><p><a class="iv-alert-source" href="${esc(a.sourceUrl)}" target="_blank" rel="noopener">${esc(a.source)} ↗</a>${!a.countryIsos.length?' · '+t('unlocated'):''}</p><a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${t('read')} ↗</a></article>`).join('');
 }
 function sourcesMarkup(){return (payload?.sourceStatus||[]).map(s=>`<li>${esc(s.source)} · ${s.available?t('ok'):t('failed')}</li>`).join('');}
 function checkedText(){return payload?.checkedAt&&Number.isFinite(Date.parse(payload.checkedAt))?t('checked')+' · '+date(payload.checkedAt,lang):'';}
 function dialogMarkup(iso){
  const country=countries.find(c=>c.iso===iso);
  return `<div class="iv-map-alert-dialog" data-i18n-skip><p class="iv-eyebrow">${t('title')} · ${t('recent')}</p><h2 tabindex="-1">${esc(country?.name||t('title'))}</h2><p class="iv-map-news-note">${t('note')}</p><p class="iv-map-news-note" data-alert-connection role="status" ${failed?'':'hidden'}>${t('unavailable')}</p><div data-alert-items>${articleMarkup(selectedItems(iso))}</div><details class="iv-alert-sources"><summary>${t('sources')}</summary><ul data-alert-source-list>${sourcesMarkup()}</ul><p data-alert-checked>${esc(checkedText())}</p></details></div>`;
 }
 function syncDialog(){
  const root=document.querySelector('dialog[open] .iv-map-alert-dialog');if(!openView||!root)return;
  const selected=selectedItems(openView.iso),signature=itemsSignature(selected),list=root.querySelector('[data-alert-items]');
  if(signature!==dialogSignature){
   const active=document.activeElement,hadFocus=list.contains(active),url=active?.closest('a')?.href,dialog=root.closest('dialog'),scroll=dialog.scrollTop;
   list.innerHTML=articleMarkup(selected);dialogSignature=signature;
   if(hadFocus){const next=[...list.querySelectorAll('a')].find(a=>a.href===url);(next||root.querySelector('h2')).focus({preventScroll:true});}
   dialog.scrollTop=scroll;
  }
  root.querySelector('[data-alert-connection]').hidden=!failed;
  const sources=root.querySelector('[data-alert-source-list]'),sourceHTML=sourcesMarkup();if(sources.innerHTML!==sourceHTML)sources.innerHTML=sourceHTML;
  root.querySelector('[data-alert-checked]').textContent=checkedText();
 }
 function show(iso){update();openView={iso};dialogSignature=itemsSignature(selectedItems(iso));open(dialogMarkup(iso));}
 async function refresh(){if(busy||!alive)return;busy=true;controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);try{const r=await fetch('/api/alerts?lang='+lang,{signal:controller.signal});if(!r.ok)throw Error('alerts_unavailable');const data=await r.json();if(!Array.isArray(data.items)||!Array.isArray(data.sourceStatus))throw Error('invalid_alerts');if(!alive)return;payload=data;failed=false;}catch{if(!alive)return;failed=true;}finally{clearTimeout(timeout);busy=false;if(alive)update();}}
 const onOpen=e=>show(e.detail),onAll=e=>{if(e.target.closest('[data-alerts-open]'))show();},onToggle=()=>queueMicrotask(renderStatus),onVisible=()=>{if(!document.hidden){update();refresh();}};
 document.addEventListener('infovisa:world-news',onCountries);document.addEventListener('infovisa:news-open',onOpen);document.addEventListener('visibilitychange',onVisible);status?.addEventListener('click',onAll);layerControls?.addEventListener('click',onToggle);
 update();refresh();const timer=setInterval(()=>{update();if(!document.hidden)refresh();},60000);
 return {refresh,destroy(){carousel.destroy();alive=false;controller?.abort();clearInterval(timer);document.removeEventListener('infovisa:world-news',onCountries);document.removeEventListener('infovisa:news-open',onOpen);document.removeEventListener('visibilitychange',onVisible);status?.removeEventListener('click',onAll);layerControls?.removeEventListener('click',onToggle);}};
}
