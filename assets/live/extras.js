import {initI18n} from './i18n.js';
import {mountUAP} from './uap.js';
const q=s=>document.querySelector(s);let weather,marine,official;
const dialog=q('#official-dialog');function show(html){q('#official-content').innerHTML=html;dialog.showModal();}
q('.official-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.querySelectorAll('video').forEach(v=>v.pause()));
initI18n({selector:null}).catch(()=>{});
mountUAP({viewport:q('#mapwrap'),pins:document.createElement('div'),project:()=>[0,0],openDialog:show}).then(api=>official=api).catch(()=>{});
document.addEventListener('infovisa:official-case',e=>official?.show(e.detail));
function hideExtras(){q('#weather-extra').hidden=true;q('#marine-extra').hidden=true;}
q('#vtabs').addEventListener('click',e=>{if(e.target.closest('[data-v]'))hideExtras();});
document.querySelectorAll('[data-extra]').forEach(b=>b.addEventListener('click',async()=>{const mode=b.dataset.extra;if(mode==='uap'){official?.show();return;}q('[data-v=world]').click();hideExtras();if(mode==='media'){q('#media-anchor').scrollIntoView({behavior:'smooth'});return;}q('#vw').hidden=true;q('#vm').hidden=true;const root=q('#'+mode+'-extra');root.hidden=false;if(mode==='weather'&&!weather){weather=true;try{const m=await import('./weather.js');await m.mountWeather(root);}catch{weather=false;}}if(mode==='marine'&&!marine){marine=true;try{const m=await import('./marine.js');await m.mountMarine(root);}catch{marine=false;}}window.scrollTo(0,0);}));
if(location.hash==='#marches'){location.hash='markets';}
