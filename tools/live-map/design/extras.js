import {initI18n} from './i18n.js';
import {mountUAP} from './uap.js';
import {mountMapNews} from './map-news.js';
const q=s=>document.querySelector(s);let weather,marine,official,webcams,local,health,traffic;
const dialog=q('#official-dialog');function show(html){q('#official-content').innerHTML=html;dialog.showModal();}
mountMapNews(show);
q('.official-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.querySelectorAll('video').forEach(v=>v.pause()));
initI18n({selector:null}).catch(()=>{});
mountUAP({viewport:q('#mapwrap'),pins:document.createElement('div'),project:()=>[0,0],openDialog:show}).then(api=>official=api).catch(()=>{});
document.addEventListener('infovisa:official-case',e=>official?.show(e.detail));
function hideExtras(){q('#weather-extra').hidden=true;q('#marine-extra').hidden=true;for(const mode of ['webcams','local','health','traffic'])q('#'+mode+'-extra').hidden=true;}
q('#vtabs').addEventListener('click',e=>{if(e.target.closest('[data-v]')){hideExtras();document.querySelectorAll('[data-extra]').forEach(b=>{b.classList.remove('on');b.setAttribute('aria-pressed','false');});}});
document.querySelectorAll('[data-extra]').forEach(b=>b.addEventListener('click',async()=>{const mode=b.dataset.extra;if(mode==='uap'){official?.show();return;}q('[data-v=world]').click();hideExtras();document.querySelectorAll('#vtabs button').forEach(n=>{n.classList.toggle('on',n===b);n.setAttribute('aria-pressed',String(n===b));});if(mode==='media'){q('#media-anchor').scrollIntoView({behavior:'smooth'});return;}q('#vw').hidden=true;q('#vm').hidden=true;const root=q('#'+mode+'-extra');root.hidden=false;window.scrollTo(0,0);if(mode==='weather'&&!weather){weather=true;try{const m=await import('./weather.js');await m.mountWeather(root);}catch{weather=false;}}if(mode==='marine'&&!marine){marine=true;try{const m=await import('./marine.js');await m.mountMarine(root);}catch{marine=false;}}if(mode==='webcams'&&!webcams){webcams=true;try{const m=await import('./webcam-world.js');m.mountWebcamWorld(root);}catch{webcams=false;}}if(mode==='traffic'&&!traffic){traffic=true;try{const m=await import('./traffic-world.js');await m.mountTrafficWorld(root);}catch{traffic=false;}}if(mode==='local'&&!local){local=true;try{const m=await import('./local-world.js');await m.mountLocalWorld(root);}catch{local=false;}}if(mode==='health'&&!health){health=true;try{const m=await import('./health.js');m.mountHealth(root);}catch{health=false;}}window.scrollTo(0,0);}));
if(location.hash==='#marches'){location.hash='markets';}
