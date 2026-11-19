import {initI18n} from './i18n.js?v=38e79a2b77fe';
import {mountUAP} from './uap.js?v=38e79a2b77fe';
import {mountMapNews} from './map-news.js?v=38e79a2b77fe';
const q=s=>document.querySelector(s);let weather,marine,official,webcams,local,health;
const dialog=q('#official-dialog');function show(html){q('#official-content').innerHTML=html;dialog.showModal();}
mountMapNews(show);
q('.official-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.querySelectorAll('video').forEach(v=>v.pause()));
initI18n({selector:null}).catch(()=>{});
mountUAP({viewport:q('#mapwrap'),pins:document.createElement('div'),project:()=>[0,0],openDialog:show}).then(api=>official=api).catch(()=>{});
document.addEventListener('infovisa:official-case',e=>official?.show(e.detail));
function hideExtras(){q('#weather-extra').hidden=true;q('#marine-extra').hidden=true;for(const mode of ['webcams','local','health'])q('#'+mode+'-extra').hidden=true;}
q('#vtabs').addEventListener('click',e=>{if(e.target.closest('[data-v]')){hideExtras();document.querySelectorAll('[data-extra]').forEach(b=>{b.classList.remove('on');b.setAttribute('aria-pressed','false');});}});
document.querySelectorAll('[data-extra]').forEach(b=>b.addEventListener('click',async()=>{const mode=b.dataset.extra;if(mode==='uap'){official?.show();return;}q('[data-v=world]').click();hideExtras();document.querySelectorAll('#vtabs button').forEach(n=>{n.classList.toggle('on',n===b);n.setAttribute('aria-pressed',String(n===b));});if(mode==='media'){q('#media-anchor').scrollIntoView({behavior:'smooth'});return;}q('#vw').hidden=true;q('#vm').hidden=true;const root=q('#'+mode+'-extra');root.hidden=false;window.scrollTo(0,0);if(mode==='weather'&&!weather){weather=true;try{const m=await import('./weather.js?v=38e79a2b77fe');await m.mountWeather(root);}catch{weather=false;}}if(mode==='marine'&&!marine){marine=true;try{const m=await import('./marine.js?v=38e79a2b77fe');await m.mountMarine(root);}catch{marine=false;}}if(mode==='webcams'&&!webcams){webcams=true;try{const m=await import('./webcam-world.js?v=38e79a2b77fe');m.mountWebcamWorld(root);}catch{webcams=false;}}if(mode==='local'&&!local){local=true;try{const m=await import('./local-world.js?v=38e79a2b77fe');await m.mountLocalWorld(root);}catch{local=false;}}if(mode==='health'&&!health){health=true;try{const m=await import('./health.js?v=38e79a2b77fe');m.mountHealth(root);}catch{health=false;}}window.scrollTo(0,0);}));
if(location.hash==='#marches'){location.hash='markets';}
